// controllers/changePassword.js
const { findUserByPhoneOrEmail, updateUser } = require('../../models/user.model');
const { sendEmail, sendSMS } = require('../../config/smsConfig');
const { logAudit } = require('../../utils/auditLogger');
const bcrypt = require('bcrypt');
const { checkRateLimit } = require('../../utils/rateLimiter');
const {
  PASSWORD_REGEX,
  MAX_RESET_ATTEMPTS,
  MAX_IP_ATTEMPTS
} = require('../../config/constants');

/* ───────────── LOCAL UTILITIES ───────────── */
// Normalize Ethiopian phone numbers
const normalizePhone = (phone) => {
  let p = phone.replace(/\s+/g, '');
  if (p.startsWith('0')) p = '+251' + p.slice(1);
  if (p.startsWith('251')) p = '+' + p;
  return p;
};

// Self-contained hash password
const hashPassword = async (password) => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

// Verify password
const comparePassword = async (password, hash) => bcrypt.compare(password, hash);

/* ───────────────────── CONTROLLER ───────────────────── */
const changePassword = async (req, res) => {
  try {
    const { identifier, old_password, new_password, channel = 'WEB', ipAddress = req.ip } = req.body;

    if (!identifier || !old_password || !new_password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // ───────────── RATE LIMIT ─────────────
    const ipKey = `rl:cp:ip:${ipAddress}`;
    const userKey = `rl:cp:user:${identifier}`;
    const allowed = await checkRateLimit({
      ipKey,
      userKey,
      ipLimit: MAX_IP_ATTEMPTS,
      userLimit: MAX_RESET_ATTEMPTS
    });
    if (!allowed) return res.status(429).json({ error: 'Too many attempts, try again later.' });

    // ───────────── FETCH USER ─────────────
    const user = await findUserByPhoneOrEmail(identifier);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // ───────────── ACCOUNT & CONSENT CHECKS ─────────────
    if (user.account_status === 'Locked') return res.status(403).json({ error: 'Account is locked.' });
    if (user.account_status === 'Pending') return res.status(403).json({ error: 'Account not verified.' });

    if (!user.terms_accepted || !user.privacy_accepted || !user.communication_consent || !user.platform_rules_accepted) {
      return res.status(403).json({ error: 'All platform policies must be accepted before changing password.' });
    }

    // ───────────── VERIFY OLD PASSWORD ─────────────
    const isValidOld = await comparePassword(old_password, user.password_hash);
    if (!isValidOld) {
      return res.status(401).json({ error: 'Old password is incorrect' });
    }

    // ───────────── VALIDATE NEW PASSWORD ─────────────
    if (!PASSWORD_REGEX.test(new_password)) {
      return res.status(400).json({ error: 'Password must contain letters, numbers, and symbols' });
    }

    const newPasswordHash = await hashPassword(new_password);

    // ───────────── UPDATE USER ─────────────
    await updateUser(user.id, {
      password_hash: newPasswordHash,
      last_password_reset_at: new Date()
    });

    // ───────────── NOTIFY USER ─────────────
    const normalizedPhone = user.phone ? normalizePhone(user.phone) : null;
    const method = user.preferred_method && ['EMAIL','SMS'].includes(user.preferred_method)
      ? user.preferred_method
      : 'EMAIL';

    try {
      if (method === 'EMAIL' && user.email) {
        const html = `
          <div style="font-family: Arial, sans-serif; text-align: center; padding: 30px;">
            <h2>Password Change Successful</h2>
            <p>Your password has been changed successfully. You can now <a href="${process.env.FRONTEND_URL}/login">login</a>.</p>
            <p>If you did not perform this, contact support immediately.</p>
          </div>
        `;
        await sendEmail(user.email, 'Password Change Successful', html);
      } else if (method === 'SMS' && normalizedPhone) {
        await sendSMS(normalizedPhone, 'Your password has been changed successfully.');
      }
    } catch (err) {
      console.error('Notification failed:', err.message);
    }

    // ───────────── AUDIT LOG ─────────────
    await logAudit({ userId: user.id, method: 'CHANGE_PASSWORD', status: 'SUCCESS', channel, ipAddress });

    return res.status(200).json({ message: 'Password changed successfully' });

  } catch (err) {
    console.error('Change password error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/* ───────────────────── EXPORT ───────────────────── */
module.exports = { changePassword };

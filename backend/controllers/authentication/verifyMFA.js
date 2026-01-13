// controllers/verifyMFAController.js

/* ───────────────────── IMPORTS ───────────────────── */
const pool = require('../../config/dbConfig');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { logAudit } = require('../../utils/auditLogger');
const { checkRateLimit } = require('../../utils/rateLimiter');
const {
  MAX_VERIFICATION_ATTEMPTS,
  ATTEMPT_RESET_MINUTES
} = require('../../config/constants');

/* ───────────────────── LOCAL UTILITIES ───────────────────── */
const compareHash = async (plain, hash) => bcrypt.compare(plain, hash);

/* ───────────────────── CONTROLLER ───────────────────── */
const verifyMFA = async (req, res) => {
  const client = await pool.connect();

  try {
    const { userId, otp, channel = 'WEB', ipAddress = req.ip } = req.body;

    /* ──────────────── 1. VALIDATE INPUT ──────────────── */
    if (!userId || !otp) {
      return res.status(400).json({ error: 'User ID and OTP are required' });
    }

    /* ──────────────── 2. RATE LIMITING ──────────────── */
    const allowed = await checkRateLimit({
      ipKey: `rl:mfa:ip:${ipAddress}`,
      userKey: `rl:mfa:user:${userId}`,
      ipLimit: 20,
      userLimit: MAX_VERIFICATION_ATTEMPTS
    });

    if (!allowed) {
      return res.status(429).json({
        error: 'Too many verification attempts. Try again later.'
      });
    }

    /* ──────────────── 3. FETCH USER ──────────────── */
    await client.query('BEGIN');

    const result = await client.query(
      `SELECT * FROM users WHERE id=$1 FOR UPDATE`,
      [userId]
    );

    if (!result.rows.length) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    /* ──────────────── 4. ACCOUNT STATE CHECKS ──────────────── */
    if (['Locked', 'Pending'].includes(user.account_status)) {
      await client.query('ROLLBACK');
      return res.status(403).json({
        error: 'Account cannot be verified at this time'
      });
    }

    /* ──────────────── 5. RESET ATTEMPTS IF WINDOW EXPIRED ──────────────── */
    const isWindowExpired =
      !user.attempts_reset_at ||
      new Date(user.attempts_reset_at) <
        new Date(Date.now() - ATTEMPT_RESET_MINUTES * 60 * 1000);

    if (isWindowExpired) {
      await client.query(
        `UPDATE users
         SET verification_attempts=$1, attempts_reset_at=NOW()
         WHERE id=$2`,
        [MAX_VERIFICATION_ATTEMPTS, userId]
      );
      user.verification_attempts = MAX_VERIFICATION_ATTEMPTS;
    }

    if (user.verification_attempts <= 0) {
      await client.query('ROLLBACK');
      return res.status(403).json({
        error: 'Maximum verification attempts reached'
      });
    }

    /* ──────────────── 6. OTP VALIDATION ──────────────── */
    const isExpired =
      !user.verification_expires ||
      new Date(user.verification_expires) < new Date();

    const isValid =
      !isExpired &&
      (await compareHash(otp, user.verification_code_hash));

    if (!isValid) {
      const attemptsRemaining = user.verification_attempts - 1;

      await client.query(
        `UPDATE users SET verification_attempts=$1 WHERE id=$2`,
        [attemptsRemaining, userId]
      );

      await logAudit({
        userId,
        status: 'FAILED',
        method: 'MFA',
        channel,
        ipAddress
      });

      await client.query('COMMIT');

      return res.status(401).json({
        error: 'Invalid or expired OTP',
        attempts_remaining: attemptsRemaining
      });
    }

    /* ──────────────── 7. FINALIZE VERIFICATION ──────────────── */
    await client.query(
      `UPDATE users
       SET account_status='Verified',
           verification_code_hash=NULL,
           verification_attempts=0,
           verification_used_at=NOW()
       WHERE id=$1`,
      [userId]
    );

    await client.query('COMMIT');

    /* ──────────────── 8. ISSUE JWT ──────────────── */
    const authToken = jwt.sign(
      {
        userId: user.id,
        role: user.role,
        mfa_status: 'Verified'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.cookie('auth_token', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000
    });

    await logAudit({
      userId,
      status: 'SUCCESS',
      method: 'MFA',
      channel,
      ipAddress
    });

    /* ──────────────── 9. RESPONSE ──────────────── */
    return res.status(200).json({
      message: 'MFA verification successful',
      authenticated: true,
      next: 'HOME',
      role: user.role
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Verify MFA error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
};

/* ───────────────────── EXPORT ───────────────────── */
module.exports = { verifyMFA };

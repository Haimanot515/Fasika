const pool = require('../../config/dbConfig');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { logAudit } = require('../../utils/auditLogger');
const { checkRateLimit } = require('../../utils/rateLimiter');

const normalizePhone = (phone) => {
  let p = phone.replace(/\s+/g, '');
  if (p.startsWith('0')) p = '+251' + p.slice(1);
  if (p.startsWith('251')) p = '+' + p;
  return p;
};

const loginUser = async (req, res) => {
  const client = await pool.connect();
  try {
    const { identifier, password } = req.body;
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Email or phone and password are required' });
    }

    // 1. Rate Limiting
    const allowed = await checkRateLimit({
      ipKey: `login:ip:${ipAddress}`,
      userKey: `login:user:${identifier}`,
      ipLimit: 20,
      userLimit: 10
    });
    if (!allowed) return res.status(429).json({ error: 'Too many attempts.' });

    const normalizedIdentifier = identifier.includes('@') ? identifier : normalizePhone(identifier);

    // 2. Fetch User
    const { rows } = await client.query(
      `SELECT id, user_id, password_hash, role, account_status FROM users WHERE email = $1 OR phone = $1`,
      [normalizedIdentifier]
    );
    const user = rows[0];

    // 3. Password Check
    const dummyHash = '$2b$12$abcdefghijklmnopqrstuvABCDEFGHIJKLmnopqrstu';
    const hashToCompare = user?.password_hash || dummyHash;
    const isValid = await bcrypt.compare(password, hashToCompare);

    if (!user || !isValid) {
      if (user) await logAudit({ userId: user.id, status: 'FAILED', method: 'LOGIN', ipAddress, userAgent });
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    // 4. Status Check
    if (user.account_status !== 'VERIFIED' && user.account_status !== 'ACTIVE') {
      return res.status(403).json({ error: 'Account not verified. Please verify first.' });
    }

    // 5. Tokens
    const accessToken = jwt.sign(
      { userInternalId: user.id, userId: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    const refreshToken = crypto.randomBytes(64).toString('hex');
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    // 6. Store Session (Matches your schema: user_internal_id)
    await client.query(
      `INSERT INTO user_sessions (user_internal_id, refresh_token_hash, ip_address, user_agent)
       VALUES ($1, $2, $3, $4)`,
      [user.id, refreshTokenHash, ipAddress, userAgent]
    );

    // 7. Cookies
    res.cookie('auth_token', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'None', maxAge: 86400000 });
    res.cookie('refresh_token', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'None'
      ', maxAge: 604800000 });

    await logAudit({ userId: user.id, status: 'SUCCESS', method: 'LOGIN', ipAddress, userAgent });

    return res.status(200).json({
      message: 'Login successful',
      authenticated: true,
      role: user.role,
      user_id: user.user_id 
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
};

module.exports = { loginUser };

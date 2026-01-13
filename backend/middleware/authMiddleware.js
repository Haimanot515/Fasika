const jwt = require('jsonwebtoken');
const pool = require('../config/dbConfig');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token =
      req.cookies?.auth_token ||
      (authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : null);

    if (!token) return res.status(401).json({ error: 'Missing authentication token' });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    // Support both naming conventions used in your Login/Verify/Register scripts
    const internalId = decoded.userInternalId || decoded.numericId;

    if (!internalId) return res.status(401).json({ error: 'Invalid token payload' });

    const { rows } = await pool.query(
      `SELECT id, user_id, role, account_status FROM users WHERE id=$1`,
      [internalId]
    );

    if (!rows.length) return res.status(401).json({ error: 'User not found' });

    const user = rows[0];
    const status = (user.account_status || '').toUpperCase();
    if (status !== 'VERIFIED' && status !== 'ACTIVE') {
      return res.status(403).json({ error: 'Account not verified' });
    }

    // 🏆 UNIVERSAL REQ.USER OBJECT
    req.user = {
      id: user.id,               // Integer ID
      userInternalId: user.id,   // Match Marketplace Controller
      numericId: user.id,        // Match Verify Controller
      user_id: user.user_id,     // String ID (USR-XXXX)
      role: user.role
    };

    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = authenticate;
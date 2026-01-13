// backend/middleware/adminMiddleware.js
const jwt = require('jsonwebtoken');
const pool = require('../config/dbConfig');

/**
 * 🛡️ Admin authentication middleware
 * Standardized to match your Users schema and Universal req.user structure
 */
const adminMiddleware = async (req, res, next) => {
  try {
    /* ───── 1️⃣ GET TOKEN ───── */
    const authHeader = req.headers.authorization;
    const token =
      req.cookies?.auth_token ||
      (authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : null);

    if (!token) {
      return res.status(401).json({ message: 'Missing authentication token' });
    }

    /* ───── 2️⃣ VERIFY TOKEN ───── */
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Support both 'userInternalId' (Login) and 'numericId' (Verify) logic
    const internalId = decoded.userInternalId || decoded.numericId;

    if (!internalId) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    /* ───── 3️⃣ FETCH USER & VERIFY ADMIN ROLE ───── */
    // CORRECTED: Query 'users' table, as 'admins' table does not exist in your schema.
    const { rows } = await pool.query(
      `SELECT id, user_id, role, account_status 
       FROM users 
       WHERE id = $1`,
      [internalId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];

    // Check Role (Standardized to Uppercase)
    if (user.role.toUpperCase() !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    // Check Status (Standardized to Uppercase based on your status logic)
    const status = (user.account_status || '').toUpperCase();
    if (status !== 'VERIFIED' && status !== 'ACTIVE') {
      return res.status(403).json({ message: 'Admin account is not active or verified' });
    }

    /* ───── 4️⃣ ATTACH UNIVERSAL CONTEXT ───── */
    // This matches the req.user structure in your main authenticate middleware
    req.user = {
      id: user.id,              // Numeric Primary Key
      userInternalId: user.id,   // Mapping for consistency
      numericId: user.id,        // Mapping for consistency
      user_id: user.user_id,     // String ID (USR-XXXX)
      role: user.role
    };

    next();

  } catch (err) {
    console.error('Admin middleware error:', err);
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = adminMiddleware;
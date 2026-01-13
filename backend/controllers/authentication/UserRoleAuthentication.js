// controllers/authController.js
const pool = require('../config/dbConfig');
const jwt = require('jsonwebtoken');

const SWITCH_ROLE_SECRET = process.env.SWITCH_ROLE_SECRET || 'supersecret';
const SWITCH_ROLE_COOKIE_NAME = 'activeRoleToken';

// POST /api/auth/switch-role
exports.switchRole = async (req, res) => {
  try {
    const { userId } = req.user; // Comes from verified JWT
    const { newRole } = req.body;

    if (!newRole) {
      return res.status(400).json({ success: false, message: 'New role is required.' });
    }

    // 1️⃣ Fetch user roles from DB
    const userResult = await pool.query(
      'SELECT roles FROM users WHERE user_id = $1',
      [userId]
    );

    if (!userResult.rows.length) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const userRoles = userResult.rows[0].roles;

    // 2️⃣ Check if user has requested role
    if (!userRoles.includes(newRole)) {
      return res.status(403).json({ success: false, message: `Unauthorized to switch to ${newRole}.` });
    }

    // 3️⃣ Update last_active_role in DB
    await pool.query(
      'UPDATE users SET last_active_role = $1, updated_at = NOW() WHERE user_id = $2',
      [newRole, userId]
    );

    // 4️⃣ Issue new HttpOnly cookie with signed JWT for activeRole
    const payload = { userId, activeRole: newRole };
    const token = jwt.sign(payload, SWITCH_ROLE_SECRET, { expiresIn: '7d' });

    res.cookie(SWITCH_ROLE_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // 5️⃣ Respond with role and redirect info for fast-path
    res.json({
      success: true,
      message: `Switched to ${newRole} mode successfully.`,
      activeRole: newRole,
      redirectUrl: getRedirectUrlForRole(newRole)
    });

  } catch (err) {
    console.error('Switch Role Error:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Helper: determines where frontend should redirect
function getRedirectUrlForRole(role) {
  switch (role) {
    case 'farmer':
      return '/farmer/dashboard';
    case 'buyer':
      return '/market';
    case 'admin':
      return '/admin/reports';
    default:
      return '/';
  }
}

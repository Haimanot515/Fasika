// ./controllers/admin/adminController.js
const pool = require('../../config/dbConfig'); // your PostgreSQL connection

// Get all admins
exports.getAllAdmins = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email FROM admins');
    res.json({ success: true, admins: result.rows });
  } catch (err) {
    console.error('getAllAdmins error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get current admin profile
exports.getAdminProfile = async (req, res) => {
  try {
    // req.user is set by adminMiddleware
    res.json({ success: true, admin: req.user });
  } catch (err) {
    console.error('getAdminProfile error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const pool = require('../../config/dbConfig');
const bcrypt = require('bcrypt');

/**
 * ───── 📊 1. Get System-Wide Analytics ─────
 * Fetches accurate counts from the DB for the Amazon-style Metrics Bar
 */
const getUserStats = async (req, res) => {
  try {
    const statsQuery = `
      SELECT 
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE role = 'FARMER') as farmers,
        COUNT(*) FILTER (WHERE role = 'BUYER') as buyers,
        COUNT(*) FILTER (WHERE account_status = 'SUSPENDED') as suspended,
        (SELECT COUNT(*) FROM users_drop_logs) as dropped
      FROM users;
    `;

    const result = await pool.query(statsQuery);
    const data = result.rows[0];
    
    res.status(200).json({
      success: true,
      total: parseInt(data.total_users) || 0,
      farmers: parseInt(data.farmers) || 0,
      buyers: parseInt(data.buyers) || 0,
      suspended: parseInt(data.suspended) || 0,
      deleted: parseInt(data.dropped) || 0
    });
  } catch (err) {
    console.error('getUserStats Error:', err);
    res.status(500).json({ success: false, message: 'Failed to aggregate system metrics' });
  }
};

/**
 * ───── 📋 2. Get All Users (Paginated) ─────
 */
const getAllUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const result = await pool.query(
      `SELECT id, user_id, full_name, email, phone, role, account_status, created_at
       FROM users
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.status(200).json({ success: true, count: result.rowCount, users: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error during fetch' });
  }
};

/**
 * ───── 🔍 3. Get User by ID ─────
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params; 
    const result = await pool.query(
      `SELECT id, user_id, full_name, email, phone, role, account_status, created_at
       FROM users WHERE id = $1`, [id]
    );

    if (!result.rowCount) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * ───── 🛡️ 4. Toggle Status (SUSPEND/ACTIVATE) ─────
 */
const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; 

    const result = await pool.query(
      `UPDATE users SET account_status = $1 WHERE id = $2
       RETURNING id, user_id, account_status`,
      [action.toUpperCase(), id]
    );

    if (!result.rowCount) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Status update failed' });
  }
};

/**
 * ───── 🎭 5. Change Role ─────
 */
const changeUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const result = await pool.query(
      `UPDATE users SET role = $1 WHERE id = $2
       RETURNING id, user_id, role`,
      [role.toUpperCase(), id]
    );

    if (!result.rowCount) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Role update failed' });
  }
};

/**
 * ───── 🔌 6. Session Management ─────
 */
const getUserSessions = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, ip_address, user_agent, created_at FROM user_sessions
       WHERE user_internal_id = $1 ORDER BY created_at DESC`, [req.params.id]
    );
    res.json({ success: true, sessions: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Session fetch failed' });
  }
};

const terminateAllSessions = async (req, res) => {
  try {
    await pool.query(`DELETE FROM user_sessions WHERE user_internal_id = $1`, [req.params.id]);
    res.json({ success: true, message: 'Sessions terminated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Termination failed' });
  }
};

/**
 * ───── 🗑️ 7. DROP User (Permanent Removal) ─────
 * Logs the drop first, then performs the CASCADE deletion
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Record the drop event into logs before deleting the record
    await pool.query(
      `INSERT INTO users_drop_logs (user_id, dropped_at) 
       SELECT user_id, NOW() FROM users WHERE id = $1`, [id]
    );

    const result = await pool.query(`DELETE FROM users WHERE id = $1 RETURNING id`);

    if (!result.rowCount) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true, message: 'DROP sequence complete. Records purged.' });
  } catch (err) {
    console.error('DROP Error:', err);
    res.status(500).json({ success: false, message: 'Critical error during DROP sequence' });
  }
};

module.exports = {
  getUserStats,
  getAllUsers,
  getUserById,
  toggleUserStatus,
  changeUserRole,
  getUserSessions,
  terminateAllSessions,
  deleteUser
};
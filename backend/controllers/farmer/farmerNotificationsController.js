const pool = require('../../config/dbConfig');

/**
 * Get user notifications with optional pagination
 * Frontend can call this to populate notifications list
 */
const getNotifications = async (req, res) => {
  try {
    const userId = req.user?.id; // Authenticated user
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const result = await pool.query(
      `SELECT *
       FROM notifications
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    return res.json({
      success: true,
      message: 'Notifications retrieved successfully',
      count: result.rowCount,
      data: result.rows
    });

  } catch (err) {
    console.error('getNotifications error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { getNotifications };

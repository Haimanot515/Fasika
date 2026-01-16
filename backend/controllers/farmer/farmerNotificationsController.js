const pool = require("../../config/dbConfig"); // Your database connection

// @desc    Get all notifications for the vertical stream
// @route   GET /api/farmer/notifications
// @access  Private (Farmer Only)
exports.getNotifications = async (req, res) => {
  try {
    // We select and order by created_at DESC to show newest alerts at the top of the log
    const result = await pool.query(
      "SELECT id, title, message, type, created_at FROM notifications ORDER BY created_at DESC"
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (err) {
    console.error("Error fetching DROP notifications:", err.message);
    res.status(500).json({
      success: false,
      error: "Server Error: Unable to synchronize with notification registry"
    });
  }
};

// @desc    Mark notification as read (Acknowledge Receipt)
// @route   PUT /api/farmer/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      "UPDATE notifications SET is_read = true WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Notification not found" });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

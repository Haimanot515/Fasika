// routes/weatherEventsRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../config/dbConfig');

/**
 * Fetch weather events for a user
 * - Farmers: only their farms
 * - Buyers: only subscribed farms
 * - Admins: all events
 */
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Get role
    const { rows: userRows } = await pool.query(
      `SELECT role FROM users WHERE user_id=$1`,
      [userId]
    );
    if (!userRows.length) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const role = userRows[0].role;

    let query = '';
    let params = [];

    if (role === 'Admin') {
      // Admin sees all events
      query = `
        SELECT we.*, f.farm_name, c.crop_name
        FROM weather_events we
        LEFT JOIN farms f ON f.farm_id = we.farm_id
        LEFT JOIN crops c ON c.crop_id = we.crop_id
        ORDER BY we.created_at DESC
        LIMIT 100
      `;
    } else if (role === 'Farmer') {
      // Farmer sees only their farms
      query = `
        SELECT we.*, f.farm_name, c.crop_name
        FROM weather_events we
        LEFT JOIN farms f ON f.farm_id = we.farm_id
        LEFT JOIN crops c ON c.crop_id = we.crop_id
        WHERE we.user_id=$1
        ORDER BY we.created_at DESC
        LIMIT 100
      `;
      params = [userId];
    } else if (role === 'Buyer') {
      // Buyer sees only subscribed farms
      // Requires buyer_farm_subscriptions(buyer_id, farm_id)
      query = `
        SELECT we.*, f.farm_name, c.crop_name
        FROM weather_events we
        JOIN buyer_farm_subscriptions bfs
          ON bfs.farm_id = we.farm_id
        LEFT JOIN farms f ON f.farm_id = we.farm_id
        LEFT JOIN crops c ON c.crop_id = we.crop_id
        WHERE bfs.buyer_id=$1
        ORDER BY we.created_at DESC
        LIMIT 100
      `;
      params = [userId];
    } else {
      return res.status(403).json({ success: false, message: 'Unauthorized role' });
    }

    const { rows } = await pool.query(query, params);
    res.json({ success: true, events: rows });
  } catch (err) {
    console.error('weather events route error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

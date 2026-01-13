const pool = require('../../../config/dbConfig');

/**
 * ======================================
 * ADMIN → BUYER ANALYTICS CONTROLLERS
 * ======================================
 * Scope:
 *  - Overview of buyers
 *  - Active / inactive metrics
 *  - Purchase trends
 */

/**
 * 1️⃣ Get overall buyer stats
 */
exports.getBuyerStatsAdmin = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        COUNT(*) AS total_buyers,
        SUM(CASE WHEN last_login_at >= NOW() - INTERVAL '7 days' THEN 1 ELSE 0 END) AS active_last_7_days,
        SUM(CASE WHEN total_orders > 0 THEN 1 ELSE 0 END) AS buyers_with_orders
      FROM buyer_profiles
    `);

    res.json({ stats: rows[0] });
  } catch (err) {
    console.error('getBuyerStatsAdmin error:', err);
    res.status(500).json({ message: 'Failed to fetch buyer stats' });
  }
};

/**
 * 2️⃣ Get top buyers by purchase volume
 */
exports.getTopBuyersAdmin = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const { rows } = await pool.query(
      `
      SELECT b.user_id, b.username, COUNT(o.order_id) AS total_orders, SUM(o.total_amount) AS total_spent
      FROM buyer_profiles b
      LEFT JOIN orders o ON b.user_id = o.buyer_id
      GROUP BY b.user_id
      ORDER BY total_spent DESC
      LIMIT $1
      `,
      [limit]
    );

    res.json({ topBuyers: rows });
  } catch (err) {
    console.error('getTopBuyersAdmin error:', err);
    res.status(500).json({ message: 'Failed to fetch top buyers' });
  }
};

/**
 * 3️⃣ Get buyer activity trends (last 30 days)
 */
exports.getBuyerActivityTrendsAdmin = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `
      SELECT
        DATE(o.created_at) AS day,
        COUNT(DISTINCT o.buyer_id) AS active_buyers,
        COUNT(o.order_id) AS total_orders
      FROM orders o
      WHERE o.created_at >= NOW() - INTERVAL '30 days'
      GROUP BY day
      ORDER BY day ASC
      `
    );

    res.json({ trends: rows });
  } catch (err) {
    console.error('getBuyerActivityTrendsAdmin error:', err);
    res.status(500).json({ message: 'Failed to fetch buyer trends' });
  }
};

/**
 * 4️⃣ Get inactive buyers (no orders in last N days)
 */
exports.getInactiveBuyersAdmin = async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const { rows } = await pool.query(
      `
      SELECT user_id, username, last_login_at
      FROM buyer_profiles
      WHERE user_id NOT IN (
        SELECT DISTINCT buyer_id FROM orders WHERE created_at >= NOW() - INTERVAL '$1 days'
      )
      `,
      [days]
    );

    res.json({ inactiveBuyers: rows });
  } catch (err) {
    console.error('getInactiveBuyersAdmin error:', err);
    res.status(500).json({ message: 'Failed to fetch inactive buyers' });
  }
};

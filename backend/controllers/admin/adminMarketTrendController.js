// controllers/adminMarketTrendController.js
const pool = require('../../config/dbConfig');

/**
 * 1️⃣ Top-selling products
 */
const getTopSellingProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const result = await pool.query(`
      SELECT l.product_name, COUNT(t.transaction_id) AS sales_count, SUM(t.amount) AS total_revenue
      FROM transactions t
      JOIN listings l ON t.listing_id = l.listing_id
      WHERE t.status = 'Completed'
      GROUP BY l.product_name
      ORDER BY sales_count DESC
      LIMIT $1
    `, [limit]);

    res.json({ success: true, products: result.rows });
  } catch (err) {
    console.error('getTopSellingProducts error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * 2️⃣ Sales over time
 */
const getSalesOverTime = async (req, res) => {
  try {
    const { period = 'day', limit = 30 } = req.query; // day, week, month

    let dateTrunc = 'day';
    if (period === 'week') dateTrunc = 'week';
    if (period === 'month') dateTrunc = 'month';

    const result = await pool.query(`
      SELECT DATE_TRUNC('${dateTrunc}', created_at) AS period,
             COUNT(*) AS total_sales,
             SUM(amount) AS total_revenue
      FROM transactions
      WHERE status = 'Completed'
      GROUP BY period
      ORDER BY period DESC
      LIMIT $1
    `, [limit]);

    res.json({ success: true, sales: result.rows });
  } catch (err) {
    console.error('getSalesOverTime error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * 3️⃣ Active farmers
 */
const getTopFarmers = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const result = await pool.query(`
      SELECT farmer_id, COUNT(transaction_id) AS sales_count, SUM(amount) AS total_revenue
      FROM transactions
      WHERE status = 'Completed'
      GROUP BY farmer_id
      ORDER BY sales_count DESC
      LIMIT $1
    `, [limit]);

    res.json({ success: true, farmers: result.rows });
  } catch (err) {
    console.error('getTopFarmers error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getTopSellingProducts,
  getSalesOverTime,
  getTopFarmers
};

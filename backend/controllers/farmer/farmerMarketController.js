// controllers/marketController.js
const pool = require('../../config/dbConfig');
const axios = require('axios');

// =======================
// Market Prices
// =======================

// Crop Prices
exports.getCropPrices = async (req, res) => {
  try {
    const { crop_name, region } = req.query;
    const result = await pool.query(
      'SELECT * FROM market_prices WHERE category=$1 AND region=$2 ORDER BY date DESC',
      ['crop', region]
    );
    res.json({ success: true, prices: result.rows });
  } catch (err) {
    console.error('getCropPrices error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching crop prices' });
  }
};

// Livestock Prices
exports.getLivestockPrices = async (req, res) => {
  try {
    const { species, region } = req.query;
    const result = await pool.query(
      'SELECT * FROM market_prices WHERE category=$1 AND species=$2 AND region=$3 ORDER BY date DESC',
      ['livestock', species, region]
    );
    res.json({ success: true, prices: result.rows });
  } catch (err) {
    console.error('getLivestockPrices error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching livestock prices' });
  }
};

// Demand Trends
exports.getDemandTrends = async (req, res) => {
  try {
    const { product_category, region } = req.query;
    const result = await pool.query(
      'SELECT * FROM demand_trends WHERE category=$1 AND region=$2 ORDER BY season ASC',
      [product_category, region]
    );
    res.json({ success: true, trends: result.rows });
  } catch (err) {
    console.error('getDemandTrends error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching demand trends' });
  }
};

// Market Trends / Multi-Year Analytics
exports.getMarketTrends = async (req, res) => {
  try {
    const { product_category, region } = req.query;
    const result = await pool.query(
      'SELECT * FROM market_trends WHERE category=$1 AND region=$2 ORDER BY year ASC',
      [product_category, region]
    );
    res.json({ success: true, trends: result.rows });
  } catch (err) {
    console.error('getMarketTrends error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching market trends' });
  }
};

// Transactions for Farmer
exports.getTransactions = async (req, res) => {
  try {
    const { farmer_id } = req.user;
    const result = await pool.query(
      'SELECT * FROM transactions WHERE farmer_id=$1 ORDER BY created_at DESC',
      [farmer_id]
    );
    res.json({ success: true, transactions: result.rows });
  } catch (err) {
    console.error('getTransactions error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching transactions' });
  }
};

// Sales Analytics
exports.getSalesAnalytics = async (req, res) => {
  try {
    const { farmer_id } = req.user;
    const result = await pool.query(
      `SELECT category, SUM(quantity) AS total_quantity, SUM(price*quantity) AS total_value
       FROM listings
       WHERE farmer_id=$1 AND status='sold'
       GROUP BY category`,
      [farmer_id]
    );
    res.json({ success: true, analytics: result.rows });
  } catch (err) {
    console.error('getSalesAnalytics error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching sales analytics' });
  }
};

// External Market API (optional, e.g., ECX / Ethiopia market prices)
exports.getMarketPrices = async (req, res) => {
  try {
    const { crop, region } = req.query;
    const response = await axios.get('https://example.com/market', { params: { crop, region } });
    res.json({ crop, region, prices: response.data });
  } catch (err) {
    console.error('getMarketPrices error:', err);
    res.status(500).json({ message: 'Market price unavailable' });
  }
};

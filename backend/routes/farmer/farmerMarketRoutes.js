// routes/marketRoutes.js
const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/authMiddleware');

// =======================
// Controllers
// =======================
const {
  getCropPrices,
  getLivestockPrices,
  getDemandTrends,
  getMarketTrends,
  getTransactions,
  getSalesAnalytics,
  getMarketPrices
} = require('../../controllers/farmer/farmerMarketController');

// =======================
// MARKET DATA ROUTES
// =======================

// Crop Prices (Public)
router.get('/crop-prices', getCropPrices);

// Livestock Prices (Public)
router.get('/livestock-prices', getLivestockPrices);

// Demand Trends (Public)
router.get('/demand-trends', getDemandTrends);

// Market Trends / Multi-Year Analytics (Public)
router.get('/market-trends', getMarketTrends);

// Transactions (Auth required)
router.get('/transactions', authenticate, getTransactions);

// Sales Analytics (Auth required)
router.get('/sales-analytics', authenticate, getSalesAnalytics);

// External Market Prices API (Optional, Public)
router.get('/external-market-prices', getMarketPrices);

module.exports = router;

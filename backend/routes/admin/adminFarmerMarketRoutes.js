// routes/adminMarketTrendRoutes.js
const express = require('express');
const router = express.Router();
const adminMarketTrendController = require('../../controllers/admin/adminMarketTrendController');

// ----------------------------
// Market Trend Endpoints (Admin)
// ----------------------------

// Top-selling products
// GET /api/admin/market-trends/top-products
router.get('/top-products', adminMarketTrendController.getTopSellingProducts);

// Sales over time
// GET /api/admin/market-trends/sales-over-time
router.get('/sales-over-time', adminMarketTrendController.getSalesOverTime);

// Top active farmers
// GET /api/admin/market-trends/top-farmers
router.get('/top-farmers', adminMarketTrendController.getTopFarmers);

module.exports = router;

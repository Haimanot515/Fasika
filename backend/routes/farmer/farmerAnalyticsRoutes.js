const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/authMiddleware');

const {
  getCropAnalytics,
  getLivestockAnalytics,
  getSalesAnalytics,
  getMarketPriceAnalytics,
  getDashboardKPIs,
  getSeasonalTrends
} = require('../../controllers/farmer/farmerAnalyticsController');

// ==========================
// FARMER ANALYTICS ROUTES
// ==========================

// Crop analytics
router.get('/crops', authenticate, getCropAnalytics);

// Livestock analytics
router.get('/livestock', authenticate, getLivestockAnalytics);

// Sales analytics
router.get('/sales', authenticate, getSalesAnalytics);

// Market pricing benchmarking
router.get('/market-prices', authenticate, getMarketPriceAnalytics);

// Dashboard KPIs
router.get('/dashboard-kpis', authenticate, getDashboardKPIs);

// Seasonal & trend analytics (query param: product_name)
router.get('/seasonal-trends', authenticate, getSeasonalTrends);

module.exports = router;

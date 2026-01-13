const express = require('express');
const router = express.Router();

const authenticate = require('../../middleware/authMiddleware');
const authorizeAdmin = require('../../middleware/adminMiddleware');

const {
  getBuyerStatsAdmin,
  getTopBuyersAdmin,
  getBuyerActivityTrendsAdmin,
  getInactiveBuyersAdmin
} = require('../../controllers/admin/buyer/adminBuyerAnalyticsController');

/**
 * ==================================
 * ADMIN → BUYER ANALYTICS
 * Base: /api/admin/buyers/analytics
 * ==================================
 */

// 1️⃣ Overall stats
router.get(
  '/admin/buyers/analytics/stats',
  authenticate,
  authorizeAdmin,
  getBuyerStatsAdmin
);

// 2️⃣ Top buyers by purchase volume
router.get(
  '/admin/buyers/analytics/top-buyers',
  authenticate,
  authorizeAdmin,
  getTopBuyersAdmin
);

// 3️⃣ Buyer activity trends (last 30 days)
router.get(
  '/admin/buyers/analytics/activity-trends',
  authenticate,
  authorizeAdmin,
  getBuyerActivityTrendsAdmin
);

// 4️⃣ Inactive buyers (no orders in last N days)
router.get(
  '/admin/buyers/analytics/inactive',
  authenticate,
  authorizeAdmin,
  getInactiveBuyersAdmin
);

module.exports = router;

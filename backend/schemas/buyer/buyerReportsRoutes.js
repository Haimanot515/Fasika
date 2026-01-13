const express = require('express');
const router = express.Router();

const {
  getBuyerPurchaseHistory,
  getBuyerSpendingSummary,
  getBuyerOrderStatusReport,
  getBuyerTopPurchasedProducts,
  getBuyerSellerInteractionReport,
  getBuyerPurchaseByLocation
} = require('../../controllers/buyer/buyerReportsController');

const authenticate = require('../../middlewares/authMiddleware');

/**
 * ===============================
 * BUYER REPORTS ROUTES
 * ===============================
 * All routes are READ-ONLY
 * Hyphen (-) only, no camelCase, no underscore
 */

router.get(
  '/purchase-history',
  authenticate,
  getBuyerPurchaseHistory
);

router.get(
  '/spending-summary',
  authenticate,
  getBuyerSpendingSummary
);

router.get(
  '/order-status',
  authenticate,
  getBuyerOrderStatusReport
);

router.get(
  '/top-products',
  authenticate,
  getBuyerTopPurchasedProducts
);

router.get(
  '/seller-interactions',
  authenticate,
  getBuyerSellerInteractionReport
);

router.get(
  '/location-summary',
  authenticate,
  getBuyerPurchaseByLocation
);

module.exports = router;

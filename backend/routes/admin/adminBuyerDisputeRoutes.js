const express = require('express');
const router = express.Router();

const authenticate = require('../../middleware/authMiddleware');
const authorizeAdmin = require('../../middleware/adminMiddleware');

const {
  getBuyerDisputesAdmin,
  getBuyerDisputeByIdAdmin,
  resolveDisputeAdmin,
  getOpenDisputesAdmin,
  addAdminCommentToDispute
} = require('../../controllers/admin/buyer/adminBuyerDisputeController');

/**
 * ==================================
 * ADMIN → BUYER DISPUTES
 * Base: /api/admin/buyers
 * ==================================
 */

// List disputes for a specific buyer
router.get('/admin/buyers/:buyerId/disputes', authenticate, authorizeAdmin, getBuyerDisputesAdmin);

// Get a single dispute by ID
router.get('/admin/buyers/disputes/:disputeId', authenticate, authorizeAdmin, getBuyerDisputeByIdAdmin);

// Resolve a dispute
router.patch('/admin/buyers/disputes/:disputeId/resolve', authenticate, authorizeAdmin, resolveDisputeAdmin);

// Add admin comment to a dispute
router.patch('/admin/buyers/disputes/:disputeId/comment', authenticate, authorizeAdmin, addAdminCommentToDispute);

// List all open disputes (admin overview)
router.get('/admin/buyers/disputes/open', authenticate, authorizeAdmin, getOpenDisputesAdmin);

module.exports = router;

const express = require('express');
const router = express.Router();

const authenticate = require('../../middleware/authMiddleware');
const authorizeAdmin = require('../../middleware/adminMiddleware');

const {
  getBuyerPaymentsAdmin,
  getBuyerPaymentByIdAdmin,
  issueRefundAdmin,
  getPendingPaymentsAdmin,
  addAdminNoteToPayment
} = require('../../controllers/admin/buyer/adminBuyerPaymentController');

/**
 * ==================================
 * ADMIN → BUYER PAYMENTS
 * Base: /api/admin/buyers
 * ==================================
 */

// Get all payments for a specific buyer
router.get('/admin/buyers/:buyerId/payments', authenticate, authorizeAdmin, getBuyerPaymentsAdmin);

// Get single payment by ID
router.get('/admin/buyers/payments/:paymentId', authenticate, authorizeAdmin, getBuyerPaymentByIdAdmin);

// Issue refund (admin override)
router.patch('/admin/buyers/payments/:paymentId/refund', authenticate, authorizeAdmin, issueRefundAdmin);

// Get all pending payments (admin overview)
router.get('/admin/buyers/payments/pending', authenticate, authorizeAdmin, getPendingPaymentsAdmin);

// Add admin note to a payment
router.patch('/admin/buyers/payments/:paymentId/note', authenticate, authorizeAdmin, addAdminNoteToPayment);

module.exports = router;

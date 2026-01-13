const express = require('express');
const router = express.Router();

const authenticate = require('../../middleware/authMiddleware');
const authorizeAdmin = require('../../middleware/adminMiddleware');

const {
  getBuyerOrdersAdmin,
  getBuyerOrderByIdAdmin,
  updateBuyerOrderStatusAdmin,
  cancelBuyerOrderAdmin,
  addAdminNoteToOrder,
  getAllActiveOrdersAdmin
} = require('../../controllers/admin/buyer/adminBuyerOrderController');

/**
 * ==================================
 * ADMIN → BUYER ORDERS
 * Base: /api/admin/buyers
 * ==================================
 */

// List all orders for a specific buyer
router.get('/admin/buyers/:buyerId/orders', authenticate, authorizeAdmin, getBuyerOrdersAdmin);

// Get single order by ID
router.get('/admin/buyers/orders/:orderId', authenticate, authorizeAdmin, getBuyerOrderByIdAdmin);

// Update order status (admin override)
router.patch('/admin/buyers/orders/:orderId/status', authenticate, authorizeAdmin, updateBuyerOrderStatusAdmin);

// Cancel order (admin intervention)
router.patch('/admin/buyers/orders/:orderId/cancel', authenticate, authorizeAdmin, cancelBuyerOrderAdmin);

// Add admin note to order
router.patch('/admin/buyers/orders/:orderId/note', authenticate, authorizeAdmin, addAdminNoteToOrder);

// Get all active orders (admin overview)
router.get('/admin/buyers/orders/active', authenticate, authorizeAdmin, getAllActiveOrdersAdmin);

module.exports = router;

const express = require('express');
const router = express.Router();

const authenticate = require('../../middleware/authMiddleware');
const authorizeAdmin = require('../../middleware/adminMiddleware');

const {
  getBuyerProfileAdmin,
  createBuyerProfileAdmin,
  updateBuyerProfileAdmin,
  deleteBuyerProfileAdmin,
  getBuyerPreferencesAdmin,
  resetBuyerPreferencesAdmin,
  updateBuyerProfileImageAdmin
} = require('../../controllers/admin/buyer/adminbuyerProfileControllers');

/**
 * ==================================
 * ADMIN → BUYER PROFILE
 * Base: /api/admin/buyers
 * ==================================
 */

// Get buyer profile
router.get('/admin/buyers/:buyerId/profile', authenticate, authorizeAdmin, getBuyerProfileAdmin);

// Create buyer profile (admin forced)
router.post('/admin/buyers/profile', authenticate, authorizeAdmin, createBuyerProfileAdmin);

// Update buyer profile
router.patch('/admin/buyers/:buyerId/profile', authenticate, authorizeAdmin, updateBuyerProfileAdmin);

// Delete buyer profile
router.delete('/admin/buyers/:buyerId/profile', authenticate, authorizeAdmin, deleteBuyerProfileAdmin);

// Get buyer preferences
router.get('/admin/buyers/:buyerId/preferences', authenticate, authorizeAdmin, getBuyerPreferencesAdmin);

// Reset buyer preferences
router.patch('/admin/buyers/:buyerId/preferences/reset', authenticate, authorizeAdmin, resetBuyerPreferencesAdmin);

// Update buyer profile image
router.patch('/admin/buyers/:buyerId/profile/image', authenticate, authorizeAdmin, updateBuyerProfileImageAdmin);

module.exports = router;

const express = require('express');
const router = express.Router();

const authenticate = require('../../middleware/authMiddleware');
const authorizeAdmin = require('../../middleware/adminMiddleware');

const {
  getAllBuyersAdmin,
  getBuyerByIdAdmin,
  searchBuyersAdmin,
  activateBuyerAdmin,
  suspendBuyerAdmin,
  softDeleteBuyerAdmin,
  deleteBuyerPermanentlyAdmin,
  verifyBuyerAdmin,
  revokeBuyerVerificationAdmin,
  lockBuyerAccountAdmin,
  unlockBuyerAccountAdmin,
  getBuyerActivitySummaryAdmin,
  flagBuyerAdmin,
  removeBuyerFlagAdmin,
  addBuyerAdminNote,
  getBuyerAdminNotes,
  forceLogoutBuyerAdmin,
  getBuyerStatsAdmin,
  exportBuyersAdmin,
  getBuyerRiskScoreAdmin
} = require('../../controllers/admin/buyer/adminBuyerController');

/**
 * ==================================
 * ADMIN → BUYER ACCOUNT MANAGEMENT
 * Base: /api/admin/buyers
 * ==================================
 */

// List & search
router.get('/admin/buyers', authenticate, authorizeAdmin, getAllBuyersAdmin);
router.get('/admin/buyers/search', authenticate, authorizeAdmin, searchBuyersAdmin);
router.get('/admin/buyers/:buyerId', authenticate, authorizeAdmin, getBuyerByIdAdmin);

// Status management
router.patch('/admin/buyers/:buyerId/activate', authenticate, authorizeAdmin, activateBuyerAdmin);
router.patch('/admin/buyers/:buyerId/suspend', authenticate, authorizeAdmin, suspendBuyerAdmin);
router.patch('/admin/buyers/:buyerId/lock', authenticate, authorizeAdmin, lockBuyerAccountAdmin);
router.patch('/admin/buyers/:buyerId/unlock', authenticate, authorizeAdmin, unlockBuyerAccountAdmin);

// Verification
router.patch('/admin/buyers/:buyerId/verify', authenticate, authorizeAdmin, verifyBuyerAdmin);
router.patch('/admin/buyers/:buyerId/revoke-verification', authenticate, authorizeAdmin, revokeBuyerVerificationAdmin);

// Deletion
router.delete('/admin/buyers/:buyerId', authenticate, authorizeAdmin, softDeleteBuyerAdmin);
router.delete('/admin/buyers/:buyerId/permanent', authenticate, authorizeAdmin, deleteBuyerPermanentlyAdmin);

// Flags & notes
router.patch('/admin/buyers/:buyerId/flag', authenticate, authorizeAdmin, flagBuyerAdmin);
router.patch('/admin/buyers/:buyerId/unflag', authenticate, authorizeAdmin, removeBuyerFlagAdmin);
router.post('/admin/buyers/:buyerId/notes', authenticate, authorizeAdmin, addBuyerAdminNote);
router.get('/admin/buyers/:buyerId/notes', authenticate, authorizeAdmin, getBuyerAdminNotes);

// Activity & stats
router.get('/admin/buyers/:buyerId/activity-summary', authenticate, authorizeAdmin, getBuyerActivitySummaryAdmin);
router.get('/admin/buyers/stats', authenticate, authorizeAdmin, getBuyerStatsAdmin);
router.get('/admin/buyers/export', authenticate, authorizeAdmin, exportBuyersAdmin);
router.get('/admin/buyers/:buyerId/risk-score', authenticate, authorizeAdmin, getBuyerRiskScoreAdmin);

// Sessions
router.post('/admin/buyers/:buyerId/force-logout', authenticate, authorizeAdmin, forceLogoutBuyerAdmin);

module.exports = router;

const express = require('express');
const router = express.Router();

// Import controllers
const {
  logFarmerAction,
  getFarmerLogs,
  getFarmerLogsByType
} = require('../../controllers/farmer/farmerLogController');

// Authentication middleware
const authenticate = require('../../middlewares/authMiddleware');

/**
 * ===============================
 * FARMER LOG ROUTES
 * ===============================
 * Hyphen-only endpoints
 * All routes require authentication
 */

// Log a farmer action
router.post('/log-action', authenticate, logFarmerAction);

// Get all logs for the authenticated farmer
router.get('/logs', authenticate, getFarmerLogs);

// Get logs filtered by action type (query param: ?actionType=...)
router.get('/logs-by-type', authenticate, getFarmerLogsByType);

module.exports = router;

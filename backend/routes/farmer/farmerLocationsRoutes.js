const express = require('express');
const router = express.Router();

// Import controller
const {
  getUserLocations,
  setLocationContext,
  addFavriteLocation
} = require('../../controllers/locationController');

// Import authentication middleware
const authenticate = require('../../middlewares/authMiddleware');

/**
 * ===============================
 * LOCATION ROUTES
 * ===============================
 * All routes are protected (authenticated user)
 * Hyphen-only endpoints
 */

// Get all user locations + farms
router.get('/user-locations', authenticate, getUserLocations);

// Set active location context (MANUAL or LIVE_GPS)
router.post('/set-location-context', authenticate, setLocationContext);

// Add favorite location (manual or GPS)
router.post('/add-favorite-location', authenticate, addFavriteLocation);

module.exports = router;

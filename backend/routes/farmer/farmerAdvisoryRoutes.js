const express = require('express');
const router = express.Router();

// Import controller
const {
  getCropAdvisory,
  getAnimalAdvisory,
  getSoilAdvisory,
  getMarketAdvisory,
  getAdvisoryByUrgency,
  getAdvisoryByLocation,
  getSeasonalGuides,
  getPestsAndDiseases
} = require('../../controllers/farmer/farmerAdvisoryController');

// Optional: authentication if advisories are user-specific
const authenticate = require('../../middleware/authMiddleware');

/**
 * ===============================
 * ADVISORY ROUTES
 * ===============================
 * Hyphen-only endpoints
 * Can be public or authenticated depending on your app
 */

// Crop advisory based on crop ID & weather
router.get('/crop-advisory', authenticate, getCropAdvisory);

// Animal advisory
router.get('/animal-advisory', authenticate, getAnimalAdvisory);

// Soil advisory
router.get('/soil-advisory', authenticate, getSoilAdvisory);

// Market advisory
router.get('/market-advisory', authenticate, getMarketAdvisory);

// Advisory filtered by urgency (LOW, MEDIUM, HIGH)
router.get('/advisory-by-urgency', authenticate, getAdvisoryByUrgency);

// Advisory filtered by location (region, zone, woreda)
router.get('/advisory-by-location', authenticate, getAdvisoryByLocation);

// Seasonal crop guides
router.get('/seasonal-guides', authenticate, getSeasonalGuides);

// Pest & disease advisories
router.get('/pests-and-diseases', authenticate, getPestsAndDiseases);

module.exports = router;

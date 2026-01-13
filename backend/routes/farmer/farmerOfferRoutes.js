const express = require('express');
const router = express.Router();

// Import controllers
const {
  createOffer,
  getFarmerOffers,
  getOfferById,
  updateOffer,
  deleteOffer
} = require('../../controllers/farmer/farmerOfferController');

// Import authentication middleware
const authenticate = require('../../middlewares/authMiddleware');

/**
 * ===============================
 * FARMER OFFERS ROUTES
 * ===============================
 * All routes are protected (authenticated farmer)
 * Hyphen-only endpoints
 */

// Create a new offer
router.post('/offers', authenticate, createOffer);

// Get all offers for this farmer
router.get('/offers', authenticate, getFarmerOffers);

// Get single offer by ID
router.get('/offers/:offer-id', authenticate, getOfferById);

// Update an existing offer
router.put('/offers/:offer-id', authenticate, updateOffer);

// Delete an offer
router.delete('/offers/:offer-id', authenticate, deleteOffer);

module.exports = router;

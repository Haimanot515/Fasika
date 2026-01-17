
const express = require('express');
const router = express.Router();
const registryController = require('../../controllers/farmer/farmerProfileController');
const authenticate = require('../../middleware/authenticate'); // Your provided middleware

// This route uses your middleware to ensure we have a valid User ID from the cookie
router.post('/register-onboarding', authenticate, registryController.distributeOnboardingData);

module.exports = router;

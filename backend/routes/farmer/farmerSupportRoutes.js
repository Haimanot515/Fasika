const express = require('express');
const router = express.Router();
// Import the controller we just created
const { getSupportResources } = require('../../controllers/farmer/farmerSupportController');

/**
 * @route   GET /api/farmer/support/resources
 * @desc    Fetch all support hub articles for the general support page
 * @access  Public/Farmer
 */
router.get('/resources', getSupportResources);

module.exports = router;

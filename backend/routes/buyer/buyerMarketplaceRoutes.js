const express = require('express');
const router = express.Router();

const buyerMarketplaceController = require('../../controllers/buyer/buyerMarketplaceController');

// ✅ Must call the exported function
router.get('/public', buyerMarketplaceController.getAllPublicListings);

module.exports = router;

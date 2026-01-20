const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage(); // CRITICAL for Supabase
const upload = multer({ storage });

const { getAllListings, ...others } = require('../../controllers/admin/adminProductListingController');

// Change from '/admin/marketplace/listings' to just '/listings'
// to prevent the fasika-yg5m.onrender.com/api/admin/marketplace/admin/marketplace/... error
router.get('/listings', getAllListings);

module.exports = router;

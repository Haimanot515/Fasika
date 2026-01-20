const express = require('express');
const router = express.Router();
const multer = require('multer');

// 1. Configure Multer for Memory Storage (Required for Supabase buffers)
const storage = multer.memoryStorage();
const upload = multer({ 
    storage, 
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// 2. Import Controller Functions (Names must match your exports exactly)
const { 
    searchFarmers,
    getAllListings, 
    getListingById, 
    adminCreateListing, 
    adminUpdateListing, 
    adminArchiveListing 
} = require('../../controllers/admin/adminProductListingController');

/* =============================================================
   REGISTRY DISCOVERY (The Search Fix)
   ============================================================= */

// This handles the typing/search button in the AdminAddListing component
router.get('/farmers/search', searchFarmers);

/* =============================================================
   REGISTRY READ OPERATIONS
   ============================================================= */

// Fetch all product nodes
router.get('/listings', getAllListings);

// Fetch specific registry node details
router.get('/listings/:listing_id', getListingById);

/* =============================================================
   AUTHORITY WRITE OPERATIONS (CREATE/UPDATE)
   ============================================================= */

// Create new registry node with media processing (DROP terminology)
router.post('/listings', upload.fields([
    { name: 'primary_image', maxCount: 1 },
    { name: 'gallery_images', maxCount: 5 }
]), adminCreateListing);

// Update existing registry node
router.put('/listings/:listing_id', upload.fields([
    { name: 'primary_image', maxCount: 1 }
]), adminUpdateListing);

/* =============================================================
   AUTHORITY ACTION: DROP (ARCHIVE)
   ============================================================= */

// The "DROP" action - Archiving the node
router.patch('/listings/:listing_id/archive', adminArchiveListing);

module.exports = router;

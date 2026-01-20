const express = require('express');
const router = express.Router();
const multer = require('multer');

// 1. Configure Multer for Memory Storage
const storage = multer.memoryStorage();
const upload = multer({ 
    storage, 
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// 2. Import Controller Functions
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

// Path: GET /api/admin/marketplace/farmers/search
// Handles the live farmer search in both Add and Edit views
router.get('/farmers/search', searchFarmers);

/* =============================================================
   REGISTRY READ OPERATIONS
   ============================================================= */

// Fetch all product nodes for the table view
router.get('/listings', getAllListings);

// Fetch specific registry node details for the Edit form
router.get('/listings/:listing_id', getListingById);

/* =============================================================
   AUTHORITY WRITE OPERATIONS (CREATE/UPDATE)
   ============================================================= */

// CREATE NODE (The initial DROP)
router.post('/listings', upload.fields([
    { name: 'primary_image', maxCount: 1 },
    { name: 'gallery_images', maxCount: 5 }
]), adminCreateListing);

// UPDATE NODE (AUTHORITY COMMIT)
// FIXED: Added gallery_images to allow photo updates during editing
router.put('/listings/:listing_id', upload.fields([
    { name: 'primary_image', maxCount: 1 },
    { name: 'gallery_images', maxCount: 5 } 
]), adminUpdateListing);

/* =============================================================
   AUTHORITY ACTION: DROP (ARCHIVE)
   ============================================================= */

// Sets status to 'ARCHIVED' - committed registry removal
router.patch('/listings/:listing_id/archive', adminArchiveListing);

module.exports = router;

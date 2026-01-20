const express = require('express');
const router = express.Router();
const multer = require('multer');

// Memory storage is required so we can pass buffers directly to Supabase
const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const { 
    getAllListings, 
    getListingById, 
    adminCreateListing, 
    adminUpdateListing, 
    adminArchiveListing 
} = require('../../controllers/admin/adminProductListingController');

/* =============================================================
   REGISTRY READ OPERATIONS
   Base Mount Point (likely): /api/admin/marketplace
   ============================================================= */

// Fetch all product nodes (Global or Filtered by sellerId query param)
router.get('/listings', getAllListings);

// Fetch specific registry node details
router.get('/listings/:listing_id', getListingById);

/* =============================================================
   AUTHORITY WRITE OPERATIONS (CREATE/UPDATE)
   ============================================================= */

// Create new registry node with media processing
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

// The "DROP" action - Archiving the node and logging the authority action
router.patch('/listings/:listing_id/archive', adminArchiveListing);

module.exports = router;

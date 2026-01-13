const express = require('express');
const router = express.Router();
const farmerListingController = require('../../controllers/farmer/farmerProductListingController');
const authenticate = require('../../middleware/authMiddleware');
const { uploadMarketplaceFiles } = require('../../middleware/upload');

// Helper to define image fields for Multer/Supabase
const listingFields = [
  { name: 'primary_image', maxCount: 1 },
  { name: 'gallery_images', maxCount: 5 }
];

/* ───── 1. CRUD OPERATIONS ───── */

// Create a new listing
router.post('/', 
  authenticate, 
  uploadMarketplaceFiles(listingFields), 
  farmerListingController.createListing
);

// Get all active/paused listings for the farmer
router.get('/my-listings', 
  authenticate, 
  farmerListingController.getFarmerListings
);

// Get a single listing by ID (Used for Edit Page)
router.get('/item/:listing_id', 
  authenticate, 
  farmerListingController.getFarmerListingById
);

// Update listing details (Full Edit)
router.put('/:listing_id', 
  authenticate, 
  uploadMarketplaceFiles(listingFields), 
  farmerListingController.updateListing
);

/* ───── 2. STATE MANAGEMENT (PATCH) ───── */

// Pause a listing (Hides it from buyers)
router.patch('/:listing_id/pause', 
  authenticate, 
  farmerListingController.pauseListing
);

// Resume a paused listing (Makes it active again)
router.patch('/:listing_id/resume', 
  authenticate, 
  farmerListingController.resumeListing
);

// Archive a listing (Soft delete / Hide from dashboard)
router.patch('/:listing_id/archive', 
  authenticate, 
  farmerListingController.archiveListing
);

// Undo Archive (Restore to active list)
router.patch('/:listing_id/undo-archive', 
  authenticate, 
  farmerListingController.undoArchive
);

/* ───── 3. PERMANENT DELETION ───── */

// Hard Delete from Database
router.delete('/:listing_id', 
  authenticate, 
  farmerListingController.deleteListing
);

module.exports = router;
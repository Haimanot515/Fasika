const express = require('express');
const router = express.Router();
const multer = require('multer');

const authenticate = require('../../middleware/authMiddleware');
const authorizeAdmin = require('../../middleware/adminMiddleware');

const {
  getAllListings,
  getListingById,
  adminCreateListing,
  adminUpdateListing,
  adminPauseListing,
  adminArchiveListing,
  adminUndoArchive,
  boostListing,
  markListingSold
} = require('../../controllers/admin/adminProductListingController');

/**
 * ==============================
 * ADMIN MARKETPLACE LISTING ROUTES
 * ==============================
 * Base example:
 * /api/admin/marketplace/listings
 */

const upload = multer({ dest: 'uploads/' });

/* =========================
   LISTING READ
========================= */

// 1️⃣ Get all listings (filters + pagination)
router.get(
  '/admin/marketplace/listings',
  authenticate,
  authorizeAdmin,
  getAllListings
);

// 2️⃣ Get single listing
router.get(
  '/admin/marketplace/listings/:listing_id',
  authenticate,
  authorizeAdmin,
  getListingById
);

/* =========================
   LISTING CREATE & UPDATE
========================= */

// 3️⃣ Create listing (admin)
router.post(
  '/admin/marketplace/listings',
  authenticate,
  authorizeAdmin,
  upload.fields([
    { name: 'primary_image', maxCount: 1 },
    { name: 'gallery_images', maxCount: 10 },
    { name: 'video', maxCount: 1 },
    { name: 'document_files', maxCount: 5 }
  ]),
  adminCreateListing
);

// 4️⃣ Update listing (admin)
router.put(
  '/admin/marketplace/listings/:listing_id',
  authenticate,
  authorizeAdmin,
  upload.fields([
    { name: 'primary_image', maxCount: 1 },
    { name: 'gallery_images', maxCount: 10 },
    { name: 'video', maxCount: 1 },
    { name: 'document_files', maxCount: 5 }
  ]),
  adminUpdateListing
);

/* =========================
   ADMIN LISTING ACTIONS
========================= */

// 5️⃣ Pause listing
router.patch(
  '/admin/marketplace/listings/:listing_id/pause',
  authenticate,
  authorizeAdmin,
  adminPauseListing
);

// 6️⃣ Archive (suspend) listing
router.patch(
  '/admin/marketplace/listings/:listing_id/archive',
  authenticate,
  authorizeAdmin,
  adminArchiveListing
);

// 7️⃣ Undo archive
router.patch(
  '/admin/marketplace/listings/:listing_id/undo-archive',
  authenticate,
  authorizeAdmin,
  adminUndoArchive
);

// 8️⃣ Boost listing
router.patch(
  '/admin/marketplace/listings/:listing_id/boost',
  authenticate,
  authorizeAdmin,
  boostListing
);

// 9️⃣ Mark listing as sold
router.patch(
  '/admin/marketplace/listings/:listing_id/mark-sold',
  authenticate,
  authorizeAdmin,
  markListingSold
);

module.exports = router;

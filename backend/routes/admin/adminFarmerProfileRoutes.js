const express = require('express');
const router = express.Router();
const multer = require('multer');

const authenticate = require('../../middleware/authMiddleware');
const authorizeAdmin = require('../../middleware/adminMiddleware');

const {
  uploadFarmerProfileImageAdmin,
  createFarmerProfileAdmin,
  getFarmerProfileAdmin,
  updateFarmerProfileAdmin,
  deleteFarmerProfileAdmin
} = require('../../controllers/admin/adminFarmerProfileController');

/**
 * ==============================
 * ADMIN FARMER PROFILE ROUTES
 * ==============================
 * Base path example:
 * /api/admin/farmers/profile
 */

const upload = multer({ storage: multer.memoryStorage() });

/* =========================
   FARMER PROFILE CRUD
========================= */

// 1️⃣ Create farmer profile
router.post(
  '/admin/farmers/profile',
  authenticate,
  authorizeAdmin,
  createFarmerProfileAdmin
);

// 2️⃣ Get farmer profile
router.get(
  '/admin/farmers/profile/:userId',
  authenticate,
  authorizeAdmin,
  getFarmerProfileAdmin
);

// 3️⃣ Update farmer profile
router.put(
  '/admin/farmers/profile/:userId',
  authenticate,
  authorizeAdmin,
  updateFarmerProfileAdmin
);

// 4️⃣ Delete farmer profile
router.delete(
  '/admin/farmers/profile/:userId',
  authenticate,
  authorizeAdmin,
  deleteFarmerProfileAdmin
);

/* =========================
   PROFILE IMAGE UPLOAD
========================= */

// 5️⃣ Upload farmer profile image
router.post(
  '/admin/farmers/profile/:userId/profile-image',
  authenticate,
  authorizeAdmin,
  upload.single('image'),
  uploadFarmerProfileImageAdmin
);

module.exports = router;

const express = require('express');
const router = express.Router();

const authenticate = require('../../middleware/authMiddleware');
const authorizeAdmin = require('../../middleware/adminMiddleware');

const {
  addCropAdmin,
  getCropsAdmin,
  updateCropAdmin,
  deleteCropAdmin
} = require('../../controllers/admin/adminCropController');

/**
 * =========================
 * ADMIN CROP ROUTES
 * =========================
 * Base path example:
 * /api/admin/crops
 */

// 1️⃣ Add crop to a farm
router.post(
  '/admin/farms/:farmId/crops',
  authenticate,
  authorizeAdmin,
  addCropAdmin
);

// 2️⃣ Get all crops for a farm (pagination)
router.get(
  '/admin/farms/:farmId/crops',
  authenticate,
  authorizeAdmin,
  getCropsAdmin
);

// 3️⃣ Update crop
router.put(
  '/admin/crops/:cropId',
  authenticate,
  authorizeAdmin,
  updateCropAdmin
);

// 4️⃣ Delete crop
router.delete(
  '/admin/crops/:cropId',
  authenticate,
  authorizeAdmin,
  deleteCropAdmin
);

module.exports = router;

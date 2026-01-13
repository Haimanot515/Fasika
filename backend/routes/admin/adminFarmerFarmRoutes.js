const express = require('express');
const router = express.Router();

const authenticate = require('../../middleware/authMiddleware');
const authorizeAdmin = require('../../middleware/adminMiddleware');

const {
  getAllFarms,
  getFarmById,
  deleteFarmAdmin,
  getFarmsByFarmer,
  getFarmByFarmer,
  addFarmForFarmer,
  updateFarmByFarmer,
  deleteFarmByFarmer
} = require('../../controllers/admin/adminFarmController');

/**
 * ==============================
 * ADMIN FARM ROUTES
 * ==============================
 * Base path example:
 * /api/admin/farms
 */

/* =========================
   GENERAL ADMIN FARM
========================= */

// 1️⃣ Get all farms (pagination)
router.get(
  '/admin/farms',
  authenticate,
  authorizeAdmin,
  getAllFarms
);

// 2️⃣ Get single farm by id
router.get(
  '/admin/farms/:farmId',
  authenticate,
  authorizeAdmin,
  getFarmById
);

// 3️⃣ Delete any farm
router.delete(
  '/admin/farms/:farmId',
  authenticate,
  authorizeAdmin,
  deleteFarmAdmin
);

/* =========================
   FARMER-SPECIFIC FARM
========================= */

// 4️⃣ Get all farms of a farmer
router.get(
  '/admin/farmers/:farmerId/farms',
  authenticate,
  authorizeAdmin,
  getFarmsByFarmer
);

// 5️⃣ Get a single farm of a farmer
router.get(
  '/admin/farmers/:farmerId/farms/:farmId',
  authenticate,
  authorizeAdmin,
  getFarmByFarmer
);

// 6️⃣ Add farm for a farmer
router.post(
  '/admin/farmers/:farmerId/farms',
  authenticate,
  authorizeAdmin,
  addFarmForFarmer
);

// 7️⃣ Update farm of a farmer
router.put(
  '/admin/farmers/:farmerId/farms/:farmId',
  authenticate,
  authorizeAdmin,
  updateFarmByFarmer
);

// 8️⃣ Delete farm of a farmer
router.delete(
  '/admin/farmers/:farmerId/farms/:farmId',
  authenticate,
  authorizeAdmin,
  deleteFarmByFarmer
);

module.exports = router;

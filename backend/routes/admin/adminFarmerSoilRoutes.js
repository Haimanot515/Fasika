const express = require('express');
const router = express.Router();

const authenticate = require('../../middleware/authMiddleware');
const authorizeAdmin = require('../../middleware/adminMiddleware');

const {
  getAllSoils,
  addSoil,
  updateSoil,
  deleteSoil
} = require('../../controllers/admin/adminFarmerSoilController');

/**
 * ============================
 * ADMIN SOIL RECORDS
 * ============================
 * Base:
 * /api/admin/soils
 */

/* =========================
   READ
========================= */

// 1️⃣ Get all soil records
// Query: farmer-id, land-id
router.get(
  '/admin/soils',
  authenticate,
  authorizeAdmin,
  getAllSoils
);

/* =========================
   CREATE
========================= */

// 2️⃣ Add soil record
router.post(
  '/admin/soils',
  authenticate,
  authorizeAdmin,
  addSoil
);

/* =========================
   UPDATE
========================= */

// 3️⃣ Update soil record
router.put(
  '/admin/soils/:soil-id',
  authenticate,
  authorizeAdmin,
  updateSoil
);

/* =========================
   DELETE
========================= */

// 4️⃣ Delete soil record
router.delete(
  '/admin/soils/:soil-id',
  authenticate,
  authorizeAdmin,
  deleteSoil
);

module.exports = router;

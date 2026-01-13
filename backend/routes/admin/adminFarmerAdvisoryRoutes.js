const express = require('express');
const router = express.Router();

const authenticate = require('../../middleware/authMiddleware');
const authorizeAdmin = require('../../middleware/adminMiddleware');

const {
  getAllAdvisories,
  getAdvisoryById,
  createAdvisory,
  updateAdvisory,
  deleteAdvisory,
  getAdvisoriesByLocation,
  updateAdvisoryUrgency
} = require('../../controllers/admin/adminAdvisoryController');

/**
 * =========================
 * ADMIN ADVISORY ROUTES
 * =========================
 * Base path example:
 * /api/admin/advisories
 */

// 1️⃣ Get all advisories (filters + pagination)
router.get(
  '/admin/advisories',
  authenticate,
  authorizeAdmin,
  getAllAdvisories
);

// 2️⃣ Get advisory by ID
router.get(
  '/admin/advisories/:advisoryId',
  authenticate,
  authorizeAdmin,
  getAdvisoryById
);

// 3️⃣ Create new advisory
router.post(
  '/admin/advisories',
  authenticate,
  authorizeAdmin,
  createAdvisory
);

// 4️⃣ Update advisory (partial / full)
router.put(
  '/admin/advisories/:advisoryId',
  authenticate,
  authorizeAdmin,
  updateAdvisory
);

// 5️⃣ Update advisory urgency only
router.patch(
  '/admin/advisories/:advisoryId/urgency',
  authenticate,
  authorizeAdmin,
  updateAdvisoryUrgency
);

// 6️⃣ Soft delete advisory
router.delete(
  '/admin/advisories/:advisoryId',
  authenticate,
  authorizeAdmin,
  deleteAdvisory
);

// 7️⃣ Get advisories by location hierarchy
router.get(
  '/admin/advisories-by-location',
  authenticate,
  authorizeAdmin,
  getAdvisoriesByLocation
);

module.exports = router;

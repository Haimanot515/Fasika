const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Ensure these middlewares are working correctly
const authenticate = require('../../middleware/authMiddleware');
const authorizeAdmin = require('../../middleware/adminMiddleware');

const {
  searchFarmers,
  getAllFarms,
  deleteAllFarmsGlobal,
  getFarmsByFarmer,
  deleteAllFarmsForFarmer,
  addFarmForFarmer,
  updateFarmAdmin,
  deleteFarmAdmin
} = require('../../controllers/admin/adminFarmController');

// --- 1. SEARCH & DISCOVERY ---
// MOUNTED AT: /api/admin/farmers/search
router.get('/search', authenticate, authorizeAdmin, searchFarmers);

// --- 2. GLOBAL REGISTRY MANAGEMENT ---
// MOUNTED AT: /api/admin/farmers/view-all
router.get('/view-all', authenticate, authorizeAdmin, getAllFarms);

// MOUNTED AT: /api/admin/farmers/drop-all
router.delete('/drop-all', authenticate, authorizeAdmin, deleteAllFarmsGlobal);

// --- 3. FARMER-SPECIFIC MANAGEMENT ---
// MOUNTED AT: /api/admin/farmers/farmer/:farmerId
router.get('/farmer/:farmerId', authenticate, authorizeAdmin, getFarmsByFarmer);

// MOUNTED AT: /api/admin/farmers/farmer/:farmerId/drop-all
router.delete('/farmer/:farmerId/drop-all', authenticate, authorizeAdmin, deleteAllFarmsForFarmer);

// --- 4. INDIVIDUAL LAND NODE ACTIONS ---
router.post(
  '/farmer/:farmerId/add', 
  authenticate, 
  authorizeAdmin, 
  upload.single('land_image'), 
  addFarmForFarmer
);

router.put(
  '/land/:farmId/update', 
  authenticate, 
  authorizeAdmin, 
  upload.single('land_image'), 
  updateFarmAdmin
);

router.delete('/land/:farmId/drop', authenticate, authorizeAdmin, deleteFarmAdmin);

module.exports = router;

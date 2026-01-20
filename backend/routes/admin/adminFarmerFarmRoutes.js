const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const authenticate = require('../../middleware/authMiddleware');
const authorizeAdmin = require('../../middleware/adminMiddleware');

const {
  searchFarmers,           // NEW: Search by letter/email/phone
  getAllFarms,             // View all lands in registry
  deleteAllFarmsGlobal,    // NEW: Drop entire registry
  getFarmsByFarmer,        // View lands for specific farmer
  deleteAllFarmsForFarmer, // NEW: Drop all lands for one farmer
  addFarmForFarmer,        // Add land for a farmer (with image)
  updateFarmAdmin,         // Update specific land
  deleteFarmAdmin          // Delete specific land
} = require('../../controllers/admin/adminFarmController');

/**
 * ==========================================
 * ADMIN AUTHORITY ROUTES (LAND REGISTRY)
 * All routes require Auth & Admin Privileges
 * ==========================================
 */

// --- 1. SEARCH & DISCOVERY ---
// Search for farmers by name/email/phone for the sidebar list
router.get('/farmers/search', authenticate, authorizeAdmin, searchFarmers);

// --- 2. GLOBAL REGISTRY MANAGEMENT ---
// Get every land plot in the system
router.get('/view-all', authenticate, authorizeAdmin, getAllFarms);

// CRITICAL: Drop every single land plot from the database
router.delete('/drop-all', authenticate, authorizeAdmin, deleteAllFarmsGlobal);

// --- 3. FARMER-SPECIFIC MANAGEMENT ---
// Get all lands belonging to one specific farmer (via Email/Phone/UUID)
router.get('/farmer/:farmerId', authenticate, authorizeAdmin, getFarmsByFarmer);

// Drop ALL lands belonging to one specific farmer
router.delete('/farmer/:farmerId/drop-all', authenticate, authorizeAdmin, deleteAllFarmsForFarmer);

// --- 4. INDIVIDUAL LAND NODE ACTIONS ---
// Add a new land plot for a farmer (Includes Multi-part for Image)
router.post(
  '/farmer/:farmerId/add', 
  authenticate, 
  authorizeAdmin, 
  upload.single('land_image'), 
  addFarmForFarmer
);

// Update an existing land plot (Includes Multi-part for Image updates)
router.put(
  '/land/:farmId/update', 
  authenticate, 
  authorizeAdmin, 
  upload.single('land_image'), 
  updateFarmAdmin
);

// Drop a single specific land plot
router.delete('/land/:farmId/drop', authenticate, authorizeAdmin, deleteFarmAdmin);

module.exports = router;

const express = require('express');
const router = express.Router();
const adminFarmerController = require('../controllers/farmers/adminFarmersControllers');
const authenticate = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware'); 

/**
 * 🛡️ AUTHENTICATION LAYER
 * Ensures only authorized Admins can access the Farmer Registry
 */
router.use(authenticate);
router.use(adminMiddleware);

/**
 * ───── 🔍 SYSTEM UTILITIES & SEARCH ─────
 * These must remain at the top to avoid 404 conflicts
 */
// Fixes the "No Records Found" by mapping to the alphabetical search controller
router.get('/search', adminFarmerController.searchFarmers); 

router.get('/verify/:module/:id', adminFarmerController.verifyFarmerRecord);
router.get('/stats/summary', adminFarmerController.getGlobalStats);

/**
 * ───── 🚜 LAND & CROPS ─────
 */
router.get('/land/view', adminFarmerController.landOps.viewAll);
router.post('/land/post', adminFarmerController.landOps.create);
router.patch('/land/update/:id', adminFarmerController.landOps.update);

// Using DROP in schemas/logic as requested
router.delete('/land/drop/:id', adminFarmerController.landOps.drop); 

/**
 * ───── 🧪 SOIL REPORTS ─────
 */
router.get('/soil/view', adminFarmerController.soilOps.viewAll);
router.delete('/soil/drop/:id', adminFarmerController.soilOps.drop); 

/**
 * ───── 🐄 LIVESTOCK ─────
 */
router.get('/livestock/view', adminFarmerController.livestockOps.viewAll);
router.post('/livestock/post', adminFarmerController.livestockOps.create);
router.patch('/livestock/update/:id', adminFarmerController.livestockOps.update);
router.delete('/livestock/drop/:id', adminFarmerController.livestockOps.drop); 

/**
 * ───── 🛒 MARKET ADS ─────
 */
router.get('/market/view', adminFarmerController.marketOps.viewAll);
router.delete('/market/drop/:id', adminFarmerController.marketOps.drop); 

module.exports = router;

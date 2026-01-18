const express = require('express');
const router = express.Router();
const multer = require('multer');
const landCtrl = require('../../controllers/farmer/farmerFarmController'); // Path to your land controller
const authenticate = require('../../middleware/authMiddleware');

// Multer setup for image memory storage (Matches Profile Logic)
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// All paths are managed under the '/land' context in your server.js
// Final URL Example: /api/farmer/farm/land/

// 1. CREATE / DROP: Register new land and assets
router.post('/', authenticate, upload.single('land_image'), landCtrl.registerLand);

// 2. GET: Retrieve basic land registry entries
router.get('/view', authenticate, landCtrl.getMyLandRegistry);

// --- NEW ENHANCED REGISTRY ROUTES ---

// 2.1 GET DETAILED: Fetches plots with nested crop_list and animal_list
router.get('/view-detailed', authenticate, landCtrl.getDetailedLandRegistry);

// 2.2 GET STATS: Fetches total counts of animals, crops, and hectares
router.get('/stats', authenticate, landCtrl.getFarmerRegistryStats);

// ------------------------------------

// 3. UPDATE: Sync changes to an existing land plot
// Note: :id is the specific land plot ID
router.put('/:id', authenticate, upload.single('land_image'), landCtrl.updateLand);

// 4. DELETE: Remove land and associated assets
router.delete('/:id', authenticate, landCtrl.deleteLand);

module.exports = router;

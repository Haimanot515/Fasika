const express = require('express');
const router = express.Router();
const multer = require('multer');
const landCtrl = require('../../controllers/farmer/landController'); // Path to your land controller
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

// 2. GET: Retrieve all land registry entries for the logged-in farmer
router.get('/view', authenticate, landCtrl.getMyLandRegistry);

// 3. UPDATE: Sync changes to an existing land plot
// Note: :id is the specific land plot ID
router.put('/:id', authenticate, upload.single('land_image'), landCtrl.updateLand);

// 4. DELETE: Remove land and associated assets
router.delete('/:id', authenticate, landCtrl.deleteLand);

module.exports = router;

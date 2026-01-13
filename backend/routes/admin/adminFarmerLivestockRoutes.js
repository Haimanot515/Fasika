// backend/routes/admin/adminFarmerLivestockRoutes.js

const express = require('express');
const router = express.Router();
const adminMiddleware = require('../../middleware/adminMiddleware'); // ensure you have this
const adminLivestockController = require('../../controllers/admin/adminFarmerLivestockController');

// ================================
// Admin Livestock Routes
// ================================

// Protect all routes with admin middleware
router.use(adminMiddleware);

// 1️⃣ Get all livestock (optionally filtered by farmer_id or type)
router.get('/', adminLivestockController.getAllLivestock);

// 2️⃣ Get single livestock by ID
router.get('/:id', adminLivestockController.getLivestockById);

// 3️⃣ Add new livestock
router.post('/', adminLivestockController.addLivestock);

// 4️⃣ Update livestock by ID
router.put('/:id', adminLivestockController.updateLivestock);

// 5️⃣ Delete livestock by ID
router.delete('/:id', adminLivestockController.deleteLivestock);

module.exports = router;

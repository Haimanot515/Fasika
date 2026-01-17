const express = require('express');
const router = express.Router();
const multer = require('multer');
const farmerCtrl = require('../../controllers/farmer/farmerProfileController');
const authenticate = require('../../middleware/authMiddleware');

// Multer setup for image memory storage
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } 
});

// CREATE: POST /api/farmers/profile
router.post('/profile', authenticate, upload.single('photo'), farmerCtrl.createFarmerProfile);

// GET: GET /api/farmers/profile
router.get('/profile', authenticate, farmerCtrl.getFarmerProfile);

// UPDATE: PUT /api/farmers/profile
router.put('/profile', authenticate, upload.single('photo'), farmerCtrl.updateFarmerProfile);

module.exports = router;

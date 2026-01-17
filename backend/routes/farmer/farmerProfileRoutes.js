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

// All paths are '/profile' because server.js adds the '/api/farmers' prefix
// Combined, the URL is: https://your-api.com/api/farmers/profile

// CREATE
router.post('/profile', authenticate, upload.single('photo'), farmerCtrl.createFarmerProfile);

// GET
router.get('/profile', authenticate, farmerCtrl.getFarmerProfile);

// UPDATE
router.put('/profile', authenticate, upload.single('photo'), farmerCtrl.updateFarmerProfile);

module.exports = router;

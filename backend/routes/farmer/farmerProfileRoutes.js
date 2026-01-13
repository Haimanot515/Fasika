const express = require('express');
const router = express.Router();
const multer = require('multer');

// Controllers
const {
  createFarmerProfile,
  getFarmerProfile,
  updateFarmerProfile,
  uploadFarmerProfileImage
} = require('../../controllers/farmer/farmerProfileController');

// Middleware
const authenticate = require('../../middleware/authMiddleware');

// Multer setup for profile image (memory storage for Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ==========================
// FARMER PROFILE ROUTES
// ==========================

// Create profile
router.post('/', authenticate, createFarmerProfile);

// Get profile
router.get('/', authenticate, getFarmerProfile);

// Update profile
router.put('/', authenticate, updateFarmerProfile);

// Upload profile image
router.post('/upload-image', authenticate, upload.single('profile_image'), uploadFarmerProfileImage);

module.exports = router;

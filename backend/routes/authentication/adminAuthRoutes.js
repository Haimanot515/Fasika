// ./routes/admin/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminMiddleware = require('../../middleware/adminMiddleware');
const { getAllAdmins, getAdminProfile } = require('../../controllers/admin/adminController');

// ---------------------------
// Protected routes (require admin authentication)
// ---------------------------

// Get all admins
router.get('/all', adminMiddleware, getAllAdmins);

// Get your own admin profile
router.get('/profile', adminMiddleware, getAdminProfile);

module.exports = router; // ✅ export router, not functions

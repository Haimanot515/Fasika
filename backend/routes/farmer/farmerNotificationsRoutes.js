const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/authMiddleware');

const { getNotifications } = require('../../controllers/farmer/farmerNotificationsController');

// =======================
// Notifications
// =======================
router.get('/notifications', authenticate, getNotifications);

module.exports = router;

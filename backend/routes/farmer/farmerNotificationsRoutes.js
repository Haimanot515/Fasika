const express = require("express");
const router = express.Router();
const { 
  getNotifications, 
  markAsRead 
} = require("../../controllers/farmer/farmerNotificationsController"); // <-- FIXED: Added closing quote "

// --- Protective Middleware (Optional) ---
// If you have a middleware to verify the farmer's token, import it here
// const { protect } = require("../../middleware/authMiddleware");

/**
 * @route   GET /api/farmer/notifications
 * @desc    Fetch all vertical log notifications from DROP Registry
 * @access  Private
 */
router.get("/", getNotifications);

/**
 * @route   PUT /api/farmer/notifications/:id/read
 * @desc    Acknowledge a specific notification
 * @access  Private
 */
router.put("/:id/read", markAsRead);

module.exports = router;

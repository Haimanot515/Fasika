const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin/adminUserController');

// Middleware imports
const authenticate = require('../../middleware/AuthMiddleware');
const adminMiddleware = require('../../middleware/adminMiddleware');

/**
 * 🛡️ LAYERED SECURITY CHAIN
 * Layer 1: authenticate -> Verifies JWT and session existence.
 * Layer 2: adminMiddleware -> Verifies 'ADMIN' role and 'ACTIVE' status in the 'users' table.
 */
router.use(authenticate);
router.use(adminMiddleware);

/**
 * ───── SYSTEM ANALYTICS ─────
 */

// 📊 Get Dashboard Metrics (Total Users, Farmers, Buyers, Suspended, Dropped)
// GET /api/admin/users/stats
router.get('/stats', adminController.getUserStats);

/**
 * ───── USER MANAGEMENT ─────
 */

// 1️⃣ Get all users (Paginated)
// GET /api/admin/users?limit=20&offset=0
router.get('/', adminController.getAllUsers);

// 2️⃣ Get specific user details
// GET /api/admin/users/:id
router.get('/:id', adminController.getUserById);

// 3️⃣ Update user account status (ACTIVE, SUSPENDED, etc.)
// PATCH /api/admin/users/:id/status
router.patch('/:id/status', adminController.toggleUserStatus);

// 4️⃣ Update user role (FARMER, BUYER, ADMIN)
// PATCH /api/admin/users/:id/role
router.patch('/:id/role', adminController.changeUserRole);

// 5️⃣ DROP user (Triggers permanent removal/purging logic in DB)
// DELETE /api/admin/users/:id
router.delete('/:id', adminController.deleteUser);


/**
 * ───── SESSION MANAGEMENT ─────
 */

// 6️⃣ Get session/login history for a user
// GET /api/admin/users/:id/sessions
router.get('/:id/sessions', adminController.getUserSessions);

// 7️⃣ Terminate all sessions (Force Logout)
// DELETE /api/admin/users/:id/sessions
router.delete('/:id/sessions', adminController.terminateAllSessions);

module.exports = router;
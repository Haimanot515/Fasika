const express = require('express');
const router = express.Router();

// ==========================================
// 1. IMPORT CONTROLLERS (Corrected Destructuring)
// ==========================================
const { registerUser } = require('../../controllers/authentication/registerUser');
const { loginUser } = require('../../controllers/authentication/loginUser');
const { verifyUser } = require('../../controllers/authentication/verifyUser');
const { resetPassword } = require('../../controllers/authentication/resetPassword');
const { changePassword } = require('../../controllers/authentication/changePassword');
const { forgotPassword } = require('../../controllers/authentication/forgotPassword');
const { verifyMFA } = require('../../controllers/authentication/verifyMFA');
const { refreshToken } = require('../../controllers/authentication/refreshToken');

// Import Logout controllers
const { logoutSingleDevice, terminateOtherSessions } = require('../../controllers/authentication/logout');

// ==========================================
// 2. IMPORT MIDDLEWARE
// ==========================================
const authenticate = require('../../middleware/authMiddleware');

// ==========================================
// 3. AUTH ROUTES
// ==========================================

// 🔓 Public Routes (No token needed)
router.post('/register-user', registerUser);
router.post('/login-user', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/verify-user', verifyUser);

// ♻️ Token Refresh (Must be public because it's called when Access Token expires)
// Changed to GET to match browser "Silent Refresh" standards
router.get('/refresh-token', refreshToken);
router.post('/refresh', refreshToken);

// 🔐 Protected Routes (Require valid Access Token)
router.post('/reset-password', authenticate, resetPassword);
router.post('/change-password', authenticate, changePassword);
router.post('/verify-mfa', authenticate, verifyMFA);

// ==========================================
// 4. LOGOUT & SESSION ROUTES
// ==========================================
router.post('/logout-current-device', authenticate, logoutSingleDevice);
router.post('/terminate-other-sessions', authenticate, terminateOtherSessions);

module.exports = router;

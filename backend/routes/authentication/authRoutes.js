const express = require('express');
const router = express.Router();

// =========================
// IMPORT CONTROLLERS
// =========================

// Authentication
const { registerUser } = require('../../controllers/authentication/registerUser');
const { loginUser } = require('../../controllers/authentication/loginUser');
const { verifyUser } = require('../../controllers/authentication/verifyUser');
const { resetPassword } = require('../../controllers/authentication/resetPassword');
const { changePassword } = require('../../controllers/authentication/changePassword');
const { forgotPassword } = require('../../controllers/authentication/forgotPassword');
const { verifyMFA } = require('../../controllers/authentication/verifyMFA');
const { refreshToken } = require('../../controllers/authentication/refreshToken');

// Logout & sessions
const {
  logoutSingleDevice,
  terminateOtherSessions
} = require('../../controllers/authentication/logout');

// =========================
// IMPORT MIDDLEWARE
// =========================
const authenticate = require('../../middleware/authMiddleware');

// =========================
// AUTH ROUTES
// =========================

// 🔓 Public
router.post('/register-user', registerUser);
router.post('/login-user', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/verify-user', verifyUser); // Public - unverified users need to verify

// 🔐 Protected
router.post('/reset-password', authenticate, resetPassword);
router.post('/change-password', authenticate, changePassword);
router.post('/verify-mfa', authenticate, verifyMFA);
router.post('/refresh-token', authenticate, refreshToken);

// =========================
// LOGOUT & SESSION ROUTES
// =========================

// Logout from current device only
router.post(
  '/logout-current-device',
  authenticate,
  logoutSingleDevice
);

// Terminate all other sessions
router.post(
  '/terminate-other-sessions',
  authenticate,
  terminateOtherSessions
);

module.exports = router;

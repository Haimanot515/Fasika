const express = require('express');
const router = express.Router();

// ... (Imports stay the same)

// =========================
// AUTH ROUTES
// =========================

// 🔓 Public / Semi-Public
router.post('/register-user', registerUser);
router.post('/login-user', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/verify-user', verifyUser); 

// CHANGE: Remove 'authenticate' middleware from refresh-token.
// The refreshToken controller itself handles security by checking the HttpOnly cookie.
router.get('/refresh-token', refreshToken); // Also changed to GET for easier browser handling

// 🔐 Protected (Requires valid Access Token)
router.post('/reset-password', authenticate, resetPassword);
router.post('/change-password', authenticate, changePassword);
router.post('/verify-mfa', authenticate, verifyMFA);

// ... (Logout routes stay the same)

const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/authMiddleware');

const { getKPIs, getFeed } = require('../../controllers/farmer/farmerDashboardController');

// ==========================
// DASHBOARD ROUTES
// ==========================

// Dashboard KPIs
router.get('/kpis', authenticate, getKPIs);

// Personalized feed
router.get('/feed', authenticate, getFeed);

module.exports = router;

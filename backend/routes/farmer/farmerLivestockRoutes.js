const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/authMiddleware');

const {
  addLivestock,
  getLivestock,
  updateLivestock,
  deleteLivestock,
  getLivestockAnalytics
} = require('../../controllers/farmer/farmerLivestockController');

// Livestock CRUD
router.post('/', authenticate, addLivestock);
router.get('/', authenticate, getLivestock);
router.put('/:livestock_id', authenticate, updateLivestock);
router.delete('/:livestock_id', authenticate, deleteLivestock);

// Analytics
router.get('/analytics', authenticate, getLivestockAnalytics);

module.exports = router;

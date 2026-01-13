const express = require('express');
const router = express.Router();

const {
  addCrop,
  getCrops,
  updateCrop,
  deleteCrop,
  addCropImage,
  addCropVideo,
  addCropDocument
} = require('../../controllers/farmer/farmerCropController');

const authenticate = require('../../middleware/authMiddleware');

// 🛡️ Use the updated upload middleware (Multer Memory Storage)
const { upload } = require('../../middleware/upload');

/**
 * Routes
 */

// 1. Get all crops for a farm
router.get('/:farmId/crops', authenticate, getCrops);

// 2. Add a new crop (handles optional initial image)
router.post(
  '/:farmId/crops',
  authenticate,
  upload.single('cropImage'), // Catches file in memory buffer
  addCrop
);

// 3. Update crop details or image
router.put(
  '/crops/:cropId',
  authenticate,
  upload.single('cropImage'),
  updateCrop
);

// 4. Delete a crop
router.delete('/crops/:cropId', authenticate, deleteCrop);

/**
 * Media-Specific Routes
 * Used if the farmer wants to add more files after the crop is created
 */

router.post(
  '/crops/:cropId/image',
  authenticate,
  upload.single('cropImage'),
  addCropImage
);

router.post(
  '/crops/:cropId/video',
  authenticate,
  upload.single('cropVideo'), // Matches the field name from frontend
  addCropVideo
);

router.post(
  '/crops/:cropId/document',
  authenticate,
  upload.single('cropDoc'),
  addCropDocument
);

module.exports = router;
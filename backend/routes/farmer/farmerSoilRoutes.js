const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadImage, uploadVideo, uploadDocument } = require('../../middleware/upload');
const authenticate = require('../../middleware/authMiddleware');

const {
  addSoilRecord,
  updateSoilRecord,
  deleteSoilRecord,
  getSoilRecords
} = require('../../controllers/farmer/farmerSoilController');

// Multer memory storage (optional if using Cloudinary storage in middleware)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper for optional single upload
const optionalSingle = (upload, field) => (req, res, next) => {
  upload.single(field)(req, res, (err) => { if (err && err.code !== 'LIMIT_UNEXPECTED_FILE') return next(err); next(); });
};

// ==========================
// SOIL RECORD ROUTES
// ==========================

// Add soil record with optional media
router.post(
  '/',
  authenticate,
  uploadImage.single('soil_image'),
  optionalSingle(uploadVideo, 'soil_video'),
  uploadDocument.array('soil_documents', 5),
  addSoilRecord
);

// Update soil record with optional media
router.put(
  '/:soilId',
  authenticate,
  uploadImage.single('soil_image'),
  optionalSingle(uploadVideo, 'soil_video'),
  uploadDocument.array('soil_documents', 5),
  updateSoilRecord
);

// Delete soil record
router.delete('/:soilId', authenticate, deleteSoilRecord);

// Get all soil records
router.get('/', authenticate, getSoilRecords);

module.exports = router;

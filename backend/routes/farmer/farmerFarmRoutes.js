const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/authMiddleware');
const farmCtrl = require('../../controllers/farmer/farmerFarmController');

// All routes below this line require a valid JWT token
router.use(authenticate);

// --- 📊 DASHBOARD ---
router.get('/summary', farmCtrl.getFarmSummary);

// --- 🚜 LAND PLOTS ---
router.post('/land', farmCtrl.addLand);            // Create
router.get('/land', farmCtrl.getLand);             // Read All
router.put('/land/:id', farmCtrl.updateLand);       // Update (uses :id)
router.delete('/land/:id', farmCtrl.deleteLand);    // Delete (uses :id)

// --- 🌿 CROPS ---
router.post('/crops', farmCtrl.addCrop);           // Create
router.get('/crops', farmCtrl.getFarmerCrops);     // Read All
router.patch('/crops/:cropId/stage', farmCtrl.updateCropStage); // Update Stage
router.delete('/crops/:cropId', farmCtrl.deleteCrop);           // Delete

// --- 🐄 ANIMALS (LIVESTOCK) ---
router.post('/animals', farmCtrl.addAnimal);        // Create
router.get('/animals', farmCtrl.getAnimals);        // Read All
router.put('/animals/:animalId', farmCtrl.updateAnimal);    // Update
router.delete('/animals/:animalId', farmCtrl.deleteAnimal); // Delete

// 🚨 CRITICAL: This line prevents the "handler must be a function" error
module.exports = router;
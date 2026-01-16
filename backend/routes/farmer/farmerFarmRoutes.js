const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/authMiddleware');
const farmCtrl = require('../../controllers/farmer/farmerFarmController');

// All routes require valid JWT
router.use(authenticate);

// --- 📊 DASHBOARD ---
router.get('/summary', farmCtrl.getFarmSummary);

// --- 🚜 LAND REGISTRY (SMART DROP SYSTEM) ---
router.post('/land', farmCtrl.addLand);            // This now handles land + crops + animals
router.get('/land', farmCtrl.getLand);             
router.put('/land/:id', farmCtrl.updateLand);      
router.delete('/land/:id', farmCtrl.deleteLand);   

/* NOTE: If your frontend still needs separate buttons to add ONLY a crop 
  or ONLY an animal later, you must ensure these functions are defined 
  in farmerFarmController.js. 
  
  Since we consolidated them into addLand for the 'Unlimited' feature, 
  commenting these out will stop the server from crashing.
*/

// --- 🌿 CROPS (If defined in controller) ---
if (farmCtrl.addCrop) {
    router.post('/crops', farmCtrl.addCrop);
    router.get('/crops', farmCtrl.getFarmerCrops);
    router.patch('/crops/:cropId/stage', farmCtrl.updateCropStage);
    router.delete('/crops/:cropId', farmCtrl.deleteCrop);
}

// --- 🐄 ANIMALS (If defined in controller) ---
if (farmCtrl.addAnimal) {
    router.post('/animals', farmCtrl.addAnimal);
    router.get('/animals', farmCtrl.getAnimals);
    router.put('/animals/:animalId', farmCtrl.updateAnimal);
    router.delete('/animals/:animalId', farmCtrl.deleteAnimal);
}

module.exports = router;

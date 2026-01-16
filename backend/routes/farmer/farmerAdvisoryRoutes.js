const express = require("express");
const router = express.Router();
const { getFarmerAdvisory } = require("../../controllers/farmer/farmerAdvisoryController");

// This route will be available at /api/farmer/advisory
router.get("/advisory", getFarmerAdvisory);

module.exports = router;

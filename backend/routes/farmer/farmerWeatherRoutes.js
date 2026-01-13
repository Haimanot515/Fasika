// routes/weatherRoutes.js
const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/authMiddleware'); // optional, use for user-specific forecasts

const {
  getDailyForecast,
  getWeeklyForecast,
  getWeatherTrends,
  getLiveWeather,
  getHourlyWeather,
  getDailyWeather,
  getMonthlyWeather,
  getAnnualWeather
} = require('../../controllers/farmer/farmerWeatherController');

// =======================
// DB-Based Forecasts
// =======================
router.get('/forecast/daily', getDailyForecast);
router.get('/forecast/weekly', getWeeklyForecast);

// =======================
// Weather Trends
// =======================
router.get('/forecast/trends', getWeatherTrends); // ?trendType=temp|rainfall|wind|humidity

// =======================
// Open-Meteo Forecasts
// =======================
router.get('/forecast/live', authenticate, getLiveWeather); // current conditions
router.get('/forecast/hourly', authenticate, getHourlyWeather); // next 48 hours
router.get('/forecast/daily-7', authenticate, getDailyWeather); // next 7 days

// =======================
// Historical / Archive
// =======================
router.get('/forecast/monthly', getMonthlyWeather); // requires latitude, longitude, year
router.get('/forecast/annual', getAnnualWeather); // requires latitude, longitude, year

module.exports = router;

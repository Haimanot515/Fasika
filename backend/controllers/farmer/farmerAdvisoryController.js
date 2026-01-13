const pool = require('../../config/dbConfig');
const axios = require('axios');

/**
 * Crop Advisory based on crop ID and current weather
 */
exports.getCropAdvisory = async (req, res) => {
  try {
    const { cropId, latitude, longitude } = req.query;

    const crop = await pool.query(
      `SELECT crop_name, growth_stage FROM crops WHERE crop_id=$1`,
      [cropId]
    );

    if (!crop.rows.length)
      return res.status(404).json({ message: 'Crop not found' });

    // Get current temperature from Open-Meteo
    const weatherResp = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude,
        longitude,
        hourly: 'temperature_2m',
        timezone: 'auto'
      }
    });

    const temp = weatherResp.data.hourly.temperature_2m[0];

    let advice = 'Weather conditions are favorable';
    if (temp > 32) advice = 'High temperature – irrigate early morning';
    if (temp < 10) advice = 'Cold risk – protect young plants';

    res.json({
      crop: crop.rows[0].crop_name,
      stage: crop.rows[0].growth_stage,
      temperature: temp,
      advisory: advice
    });
  } catch (err) {
    console.error('getCropAdvisory error:', err.response?.data || err.message);
    res.status(500).json({ message: 'Failed to generate advisory' });
  }
};

/**
 * Animal Advisory
 */
exports.getAnimalAdvisory = async (req, res) => {
  try {
    const { species, region } = req.query;
    const result = await pool.query(
      'SELECT * FROM advisories WHERE category=$1 AND region=$2 ORDER BY urgency DESC',
      ['animal', region]
    );
    res.json({ success: true, advisories: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Soil Advisory
 */
exports.getSoilAdvisory = async (req, res) => {
  try {
    const { soil_type, region } = req.query;
    const result = await pool.query(
      'SELECT * FROM advisories WHERE category=$1 AND region=$2 ORDER BY urgency DESC',
      ['soil', region]
    );
    res.json({ success: true, advisories: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Market Advisory
 */
exports.getMarketAdvisory = async (req, res) => {
  try {
    const { product_category, region } = req.query;
    const result = await pool.query(
      'SELECT * FROM advisories WHERE category=$1 AND region=$2 ORDER BY urgency DESC',
      ['market', region]
    );
    res.json({ success: true, advisories: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Advisory by urgency
 */
exports.getAdvisoryByUrgency = async (req, res) => {
  try {
    const { urgency } = req.query; // LOW, MEDIUM, HIGH
    const result = await pool.query(
      'SELECT * FROM advisories WHERE urgency=$1 ORDER BY created_at DESC',
      [urgency]
    );
    res.json({ success: true, advisories: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Location-specific advisories
 */
exports.getAdvisoryByLocation = async (req, res) => {
  try {
    const { region, zone, woreda } = req.query;
    const result = await pool.query(
      'SELECT * FROM advisories WHERE region=$1 AND zone=$2 AND woreda=$3 ORDER BY created_at DESC',
      [region, zone, woreda]
    );
    res.json({ success: true, advisories: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Seasonal crop guides
 */
exports.getSeasonalGuides = async (req, res) => {
  try {
    const { crop_name, season } = req.query;
    const result = await pool.query(
      'SELECT * FROM seasonal_guides WHERE crop_name=$1 AND season=$2',
      [crop_name, season]
    );
    res.json({ success: true, guides: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Pest & disease advisories
 */
exports.getPestsAndDiseases = async (req, res) => {
  try {
    const { crop_name, region } = req.query;
    const result = await pool.query(
      'SELECT * FROM pest_disease_advisories WHERE crop_name=$1 AND region=$2',
      [crop_name, region]
    );
    res.json({ success: true, advisories: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

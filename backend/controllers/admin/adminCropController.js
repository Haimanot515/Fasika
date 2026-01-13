// controllers/adminCropController.js
const pool = require('../../config/dbConfig');
const { v4: uuidv4 } = require('uuid');

/**
 * =========================
 * Admin Crop Management
 * =========================
 */

// Utility: check if farm exists
const checkFarmExists = async (farmId) => {
  const farm = await pool.query(`SELECT 1 FROM farms WHERE farm_id=$1`, [farmId]);
  return farm.rowCount > 0;
};

// Utility: check if crop exists
const checkCropExists = async (cropId) => {
  const crop = await pool.query(`SELECT 1 FROM crops WHERE crop_id=$1`, [cropId]);
  return crop.rowCount > 0;
};

/**
 * 1️⃣ Add crop for a farm
 */
const addCropAdmin = async (req, res) => {
  try {
    const { farmId } = req.params;
    const {
      crop_name, crop_variety, planting_date, expected_harvest_date,
      seed_type, farming_method, drought_sensitivity, heat_sensitivity,
      rainfall_requirement_mm, wind_sensitivity
    } = req.body;

    if (!crop_name || !planting_date)
      return res.status(400).json({ message: 'crop_name and planting_date required' });

    if (!(await checkFarmExists(farmId)))
      return res.status(404).json({ message: 'Farm not found' });

    const cropId = `CROP-${uuidv4()}`;
    const query = `
      INSERT INTO crops (
        crop_id, farm_id, crop_name, crop_variety, planting_date, expected_harvest_date,
        seed_type, farming_method, drought_sensitivity, heat_sensitivity,
        rainfall_requirement_mm, wind_sensitivity, created_at, updated_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,NOW(),NOW())
      RETURNING *
    `;
    const values = [
      cropId, farmId, crop_name, crop_variety || null, planting_date,
      expected_harvest_date || null, seed_type || null, farming_method || null,
      drought_sensitivity || null, heat_sensitivity || null,
      rainfall_requirement_mm || null, wind_sensitivity || false
    ];

    const result = await pool.query(query, values);
    res.status(201).json({ success: true, data: result.rows[0] });

  } catch (err) {
    console.error('addCropAdmin error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * 2️⃣ Get all crops for a farm
 */
const getCropsAdmin = async (req, res) => {
  try {
    const { farmId } = req.params;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    if (!(await checkFarmExists(farmId)))
      return res.status(404).json({ message: 'Farm not found' });

    const crops = await pool.query(
      `SELECT * FROM crops WHERE farm_id=$1 ORDER BY planting_date DESC LIMIT $2 OFFSET $3`,
      [farmId, limit, offset]
    );

    res.json({ success: true, count: crops.rowCount, data: crops.rows });
  } catch (err) {
    console.error('getCropsAdmin error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * 3️⃣ Update crop
 */
const updateCropAdmin = async (req, res) => {
  try {
    const { cropId } = req.params;
    const updates = req.body;

    if (!Object.keys(updates).length) 
      return res.status(400).json({ message: 'No updates provided' });

    if (!(await checkCropExists(cropId)))
      return res.status(404).json({ message: 'Crop not found' });

    const fields = Object.keys(updates).map((key, i) => `${key}=$${i + 1}`);
    const values = [...Object.values(updates), cropId];

    const result = await pool.query(
      `UPDATE crops SET ${fields.join(',')}, updated_at=NOW() WHERE crop_id=$${values.length} RETURNING *`,
      values
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('updateCropAdmin error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * 4️⃣ Delete crop
 */
const deleteCropAdmin = async (req, res) => {
  try {
    const { cropId } = req.params;

    if (!(await checkCropExists(cropId)))
      return res.status(404).json({ message: 'Crop not found' });

    const result = await pool.query(
      `DELETE FROM crops WHERE crop_id=$1 RETURNING *`,
      [cropId]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('deleteCropAdmin error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { addCropAdmin, getCropsAdmin, updateCropAdmin, deleteCropAdmin };

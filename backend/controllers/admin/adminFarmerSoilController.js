// controllers/adminSoilController.js
const pool = require('../../config/dbConfig');
const { v4: uuidv4 } = require('uuid');

/**
 * ==============================
 * Soil Records (Admin)
 * ==============================
 */

/**
 * Get all soil records
 * Optional query: farmer_id, land_id
 */
const getAllSoils = async (req, res) => {
  try {
    const { farmer_id, land_id, limit = 20, offset = 0 } = req.query;

    let conditions = [];
    let values = [];
    let counter = 1;

    if (farmer_id) {
      conditions.push(`farmer_id = $${counter++}`);
      values.push(farmer_id);
    }
    if (land_id) {
      conditions.push(`land_id = $${counter++}`);
      values.push(land_id);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await pool.query(
      `SELECT *
       FROM soils
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${counter} OFFSET $${counter + 1}`,
      [...values, limit, offset]
    );

    res.json({ success: true, count: result.rowCount, soils: result.rows });
  } catch (err) {
    console.error('getAllSoils error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Add a new soil record
 */
const addSoil = async (req, res) => {
  try {
    const { farmer_id, land_id, test_results, type } = req.body;

    if (!farmer_id || !land_id) {
      return res.status(400).json({ success: false, message: 'Farmer and land are required' });
    }

    const result = await pool.query(
      `INSERT INTO soils
       (soil_id, farmer_id, land_id, test_results, type, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,NOW(),NOW())
       RETURNING *`,
      [uuidv4(), farmer_id, land_id, test_results || null, type || null]
    );

    res.status(201).json({ success: true, message: 'Soil record added', soil: result.rows[0] });
  } catch (err) {
    console.error('addSoil error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Update a soil record
 */
const updateSoil = async (req, res) => {
  try {
    const { soilId } = req.params;
    const updates = req.body;

    if (!Object.keys(updates).length) {
      return res.status(400).json({ success: false, message: 'No updates provided' });
    }

    const setClause = [];
    const values = [];
    let counter = 1;

    for (const key in updates) {
      setClause.push(`${key} = $${counter++}`);
      values.push(updates[key]);
    }

    values.push(soilId);

    const result = await pool.query(
      `UPDATE soils
       SET ${setClause.join(', ')}, updated_at = NOW()
       WHERE soil_id = $${counter}
       RETURNING *`,
      values
    );

    if (!result.rowCount) {
      return res.status(404).json({ success: false, message: 'Soil record not found' });
    }

    res.json({ success: true, message: 'Soil record updated', soil: result.rows[0] });
  } catch (err) {
    console.error('updateSoil error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Delete a soil record
 */
const deleteSoil = async (req, res) => {
  try {
    const { soilId } = req.params;

    const result = await pool.query(
      `DELETE FROM soils
       WHERE soil_id = $1
       RETURNING *`,
      [soilId]
    );

    if (!result.rowCount) {
      return res.status(404).json({ success: false, message: 'Soil record not found' });
    }

    res.json({ success: true, message: 'Soil record deleted', soil: result.rows[0] });
  } catch (err) {
    console.error('deleteSoil error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getAllSoils,
  addSoil,
  updateSoil,
  deleteSoil
};

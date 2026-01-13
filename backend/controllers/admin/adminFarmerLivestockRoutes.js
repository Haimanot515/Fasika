// controllers/adminLivestockController.js
const pool = require('../config/dbConfig');
const { v4: uuidv4 } = require('uuid');

/**
 * Admin: Add livestock to any farm
 */
const addLivestockAdmin = async (req, res) => {
  try {
    const { farm_id, type, count } = req.body;
    if (!farm_id || !type || !count) {
      return res.status(400).json({ message: 'farm_id, type, and count are required' });
    }

    const livestock_id = uuidv4();

    // Optional: check if farm exists
    const farmCheck = await pool.query(`SELECT * FROM farms WHERE farm_id=$1`, [farm_id]);
    if (!farmCheck.rowCount) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    await pool.query(
      `INSERT INTO livestock (livestock_id, farm_id, type, count, created_at, updated_at)
       VALUES ($1,$2,$3,$4,NOW(), NOW())`,
      [livestock_id, farm_id, type, count]
    );

    res.status(201).json({ message: 'Livestock added', livestock_id });
  } catch (err) {
    console.error('addLivestockAdmin error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Admin: Get all livestock for any farm
 */
const getLivestockAdmin = async (req, res) => {
  try {
    const { farm_id } = req.query;
    if (!farm_id) {
      return res.status(400).json({ message: 'farm_id is required' });
    }

    const result = await pool.query(
      `SELECT * FROM livestock WHERE farm_id=$1 ORDER BY created_at DESC`,
      [farm_id]
    );

    res.json({ count: result.rowCount, livestock: result.rows });
  } catch (err) {
    console.error('getLivestockAdmin error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Admin: Update livestock
 */
const updateLivestockAdmin = async (req, res) => {
  try {
    const { livestock_id } = req.params;
    const { type, count } = req.body;

    if (!type && count == null) {
      return res.status(400).json({ message: 'At least type or count must be provided' });
    }

    const fields = [];
    const values = [];

    if (type) {
      fields.push(`type=$${fields.length + 1}`);
      values.push(type);
    }
    if (count != null) {
      fields.push(`count=$${fields.length + 1}`);
      values.push(count);
    }

    values.push(livestock_id);

    const result = await pool.query(
      `UPDATE livestock SET ${fields.join(',')}, updated_at=NOW() WHERE livestock_id=$${values.length} RETURNING *`,
      values
    );

    if (!result.rowCount) {
      return res.status(404).json({ message: 'Livestock not found' });
    }

    res.json({ message: 'Livestock updated', livestock: result.rows[0] });
  } catch (err) {
    console.error('updateLivestockAdmin error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Admin: Delete livestock
 */
const deleteLivestockAdmin = async (req, res) => {
  try {
    const { livestock_id } = req.params;

    const result = await pool.query(
      `DELETE FROM livestock WHERE livestock_id=$1 RETURNING *`,
      [livestock_id]
    );

    if (!result.rowCount) {
      return res.status(404).json({ message: 'Livestock not found' });
    }

    res.json({ message: 'Livestock deleted', livestock: result.rows[0] });
  } catch (err) {
    console.error('deleteLivestockAdmin error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  addLivestockAdmin,
  getLivestockAdmin,
  updateLivestockAdmin,
  deleteLivestockAdmin
};

// backend/controllers/admin/adminFarmerLivestockController.js

const pool = require('../../config/dbConfig'); // PostgreSQL connection
const { v4: uuidv4 } = require('uuid');

/**
 * =========================
 * ADMIN → FARMER LIVESTOCK CONTROLLER
 * =========================
 */

// 1️⃣ Get all livestock for all farmers (with optional filters)
exports.getAllLivestock = async (req, res) => {
  try {
    const { farmer_id, livestock_type } = req.query;

    let query = 'SELECT * FROM farmer_livestock';
    const params = [];
    const conditions = [];

    if (farmer_id) {
      conditions.push(`farmer_id = $${params.length + 1}`);
      params.push(farmer_id);
    }

    if (livestock_type) {
      conditions.push(`type = $${params.length + 1}`);
      params.push(livestock_type);
    }

    if (conditions.length) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json({ success: true, livestock: result.rows });
  } catch (err) {
    console.error('getAllLivestock error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 2️⃣ Get a single livestock by ID
exports.getLivestockById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM farmer_livestock WHERE id = $1', [id]);

    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: 'Livestock not found' });
    }

    res.json({ success: true, livestock: result.rows[0] });
  } catch (err) {
    console.error('getLivestockById error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 3️⃣ Add new livestock for a farmer
exports.addLivestock = async (req, res) => {
  try {
    const { farmer_id, type, breed, age, quantity, health_status } = req.body;
    const id = uuidv4();

    const result = await pool.query(
      'INSERT INTO farmer_livestock (id, farmer_id, type, breed, age, quantity, health_status) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [id, farmer_id, type, breed, age, quantity, health_status]
    );

    res.status(201).json({ success: true, livestock: result.rows[0] });
  } catch (err) {
    console.error('addLivestock error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 4️⃣ Update livestock by ID
exports.updateLivestock = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, breed, age, quantity, health_status } = req.body;

    const result = await pool.query(
      `UPDATE farmer_livestock 
       SET type=$1, breed=$2, age=$3, quantity=$4, health_status=$5, updated_at=NOW()
       WHERE id=$6 RETURNING *`,
      [type, breed, age, quantity, health_status, id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: 'Livestock not found' });
    }

    res.json({ success: true, livestock: result.rows[0] });
  } catch (err) {
    console.error('updateLivestock error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 5️⃣ Delete livestock by ID
exports.deleteLivestock = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM farmer_livestock WHERE id=$1 RETURNING *', [id]);

    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: 'Livestock not found' });
    }

    res.json({ success: true, message: 'Livestock deleted successfully' });
  } catch (err) {
    console.error('deleteLivestock error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const pool = require('../../config/dbConfig');
const { v4: uuidv4 } = require('uuid');

/**
 * Add new livestock
 */
const addLivestock = async (req, res) => {
  const { farm_id, type, count, average_weight, productivity } = req.body;
  try {
    const livestock_id = uuidv4();
    await pool.query(
      `INSERT INTO livestock 
       (livestock_id, farm_id, type, count, average_weight, productivity, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,NOW(),NOW())`,
      [livestock_id, farm_id, type, count || 0, average_weight || null, productivity || null]
    );
    res.status(201).json({ success: true, message: 'Livestock added', livestock_id });
  } catch (err) {
    console.error('addLivestock error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get livestock for a farm
 */
const getLivestock = async (req, res) => {
  const { farm_id } = req.query;
  try {
    const result = await pool.query(
      `SELECT * FROM livestock WHERE farm_id=$1 ORDER BY created_at DESC`,
      [farm_id]
    );
    res.json({ success: true, livestock: result.rows });
  } catch (err) {
    console.error('getLivestock error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Update livestock record
 */
const updateLivestock = async (req, res) => {
  const { livestock_id } = req.params;
  const updates = req.body;

  if (!Object.keys(updates).length) {
    return res.status(400).json({ success: false, message: 'No updates provided' });
  }

  try {
    const fields = Object.keys(updates).map((key, i) => `${key}=$${i + 1}`);
    const values = [...Object.values(updates), livestock_id];

    const result = await pool.query(
      `UPDATE livestock SET ${fields.join(',')}, updated_at=NOW() WHERE livestock_id=$${values.length} RETURNING *`,
      values
    );

    if (!result.rowCount)
      return res.status(404).json({ success: false, message: 'Livestock not found' });

    res.json({ success: true, message: 'Livestock updated', data: result.rows[0] });
  } catch (err) {
    console.error('updateLivestock error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Delete livestock record
 */
const deleteLivestock = async (req, res) => {
  const { livestock_id } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM livestock WHERE livestock_id=$1 RETURNING *`,
      [livestock_id]
    );

    if (!result.rowCount)
      return res.status(404).json({ success: false, message: 'Livestock not found' });

    res.json({ success: true, message: 'Livestock deleted', data: result.rows[0] });
  } catch (err) {
    console.error('deleteLivestock error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Livestock analytics (optional)
 */
const getLivestockAnalytics = async (req, res) => {
  const { farm_id } = req.query;
  try {
    const result = await pool.query(
      `SELECT type,
              COUNT(*) AS total_count,
              AVG(average_weight) AS avg_weight,
              AVG(productivity) AS avg_productivity
       FROM livestock
       WHERE farm_id=$1
       GROUP BY type`,
      [farm_id]
    );
    res.json({ success: true, analytics: result.rows });
  } catch (err) {
    console.error('getLivestockAnalytics error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  addLivestock,
  getLivestock,
  updateLivestock,
  deleteLivestock,
  getLivestockAnalytics
};

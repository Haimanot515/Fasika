const pool = require('../../config/dbConfig');
const { v4: uuidv4 } = require('uuid');

/**
 * Add new crop
 */
const addCrop = async (req, res) => {
  try {
    const userId = req.user?.user_id;
    const farmId = req.params.farmId;
    const {
      crop_name, crop_variety, planting_date, expected_harvest_date,
      seed_type, farming_method, drought_sensitivity, heat_sensitivity,
      rainfall_requirement_mm, wind_sensitivity
    } = req.body;

    if (!crop_name || !planting_date)
      return res.status(400).json({ message: 'crop_name and planting_date required' });

    const farmCheck = await pool.query(
      `SELECT * FROM farms WHERE farm_id=$1 AND user_id=$2`,
      [farmId, userId]
    );
    if (!farmCheck.rowCount)
      return res.status(403).json({ message: 'No permission for this farm' });

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
    console.error('addCrop error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get crops for a farm
 */
const getCrops = async (req, res) => {
  const userId = req.user?.user_id;
  const { farmId } = req.params;
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const farmCheck = await pool.query(
      `SELECT * FROM farms WHERE farm_id=$1 AND user_id=$2`,
      [farmId, userId]
    );
    if (!farmCheck.rowCount)
      return res.status(403).json({ message: 'No permission for this farm' });

    const crops = await pool.query(
      `SELECT * FROM crops WHERE farm_id=$1 ORDER BY planting_date DESC LIMIT $2 OFFSET $3`,
      [farmId, limit, offset]
    );

    res.json({ success: true, count: crops.rowCount, data: crops.rows });
  } catch (err) {
    console.error('getCrops error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Update crop info
 */
const updateCrop = async (req, res) => {
  const userId = req.user?.user_id;
  const { cropId } = req.params;
  const updates = req.body;

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  if (!Object.keys(updates).length) return res.status(400).json({ message: 'No updates provided' });

  try {
    const cropCheck = await pool.query(
      `SELECT c.* FROM crops c JOIN farms f ON c.farm_id=f.farm_id WHERE c.crop_id=$1 AND f.user_id=$2`,
      [cropId, userId]
    );
    if (!cropCheck.rowCount)
      return res.status(403).json({ message: 'No permission to update this crop' });

    const fields = Object.keys(updates).map((key, i) => `${key}=$${i + 1}`);
    const values = [...Object.values(updates), cropId];

    const result = await pool.query(
      `UPDATE crops SET ${fields.join(',')}, updated_at=NOW() WHERE crop_id=$${values.length} RETURNING *`,
      values
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('updateCrop error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Delete crop
 */
const deleteCrop = async (req, res) => {
  const userId = req.user?.user_id;
  const { cropId } = req.params;

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const cropCheck = await pool.query(
      `SELECT c.* FROM crops c JOIN farms f ON c.farm_id=f.farm_id WHERE c.crop_id=$1 AND f.user_id=$2`,
      [cropId, userId]
    );
    if (!cropCheck.rowCount)
      return res.status(403).json({ message: 'No permission to delete this crop' });

    const result = await pool.query(`DELETE FROM crops WHERE crop_id=$1 RETURNING *`, [cropId]);
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('deleteCrop error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Upload crop image
 */
const addCropImage = async (req, res) => {
  try {
    const { cropId } = req.params;
    if (!req.file) return res.status(400).json({ message: 'No image uploaded' });

    const imageUrl = req.file.path;

    const result = await pool.query(
      `UPDATE crops SET image_url=$1, updated_at=NOW() WHERE crop_id=$2 RETURNING *`,
      [imageUrl, cropId]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('addCropImage error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Upload crop video
 */
const addCropVideo = async (req, res) => {
  try {
    const { cropId } = req.params;
    if (!req.file) return res.status(400).json({ message: 'No video uploaded' });

    const videoUrl = req.file.path;

    const result = await pool.query(
      `UPDATE crops SET video_url=$1, updated_at=NOW() WHERE crop_id=$2 RETURNING *`,
      [videoUrl, cropId]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('addCropVideo error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Upload crop document
 */
const addCropDocument = async (req, res) => {
  try {
    const { cropId } = req.params;
    if (!req.file) return res.status(400).json({ message: 'No document uploaded' });

    const docUrl = req.file.path;

    const result = await pool.query(
      `UPDATE crops SET document_url=$1, updated_at=NOW() WHERE crop_id=$2 RETURNING *`,
      [docUrl, cropId]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('addCropDocument error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  addCrop,
  getCrops,
  updateCrop,
  deleteCrop,
  addCropImage,
  addCropVideo,
  addCropDocument
};

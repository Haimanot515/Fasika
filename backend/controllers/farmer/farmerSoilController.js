const pool = require('../../config/dbConfig');
const { v4: uuidv4 } = require('uuid');

// Add soil record
exports.addSoilRecord = async (req, res) => {
  try {
    const { farmer_id } = req.user;
    const { land_id, type, test_results, nutrients, irrigation_recommendations } = req.body;

    const soil_id = uuidv4();

    const imageUrl = req.file?.path || null; // if image uploaded via multer
    const videoUrl = req.video?.path || null; // if video uploaded via multer
    const documentUrls = req.documents ? req.documents.map(f => f.path) : null; // array of doc URLs

    await pool.query(
      `INSERT INTO soils 
      (soil_id, farmer_id, land_id, type, test_results, nutrients, irrigation_recommendations, image_url, video_url, document_urls)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [soil_id, farmer_id, land_id, type, test_results, nutrients, irrigation_recommendations, imageUrl, videoUrl, documentUrls]
    );

    res.status(201).json({ success: true, message: 'Soil record added', soil_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update soil record
exports.updateSoilRecord = async (req, res) => {
  try {
    const { soilId } = req.params;
    const { type, test_results, nutrients, irrigation_recommendations } = req.body;

    const imageUrl = req.file?.path || null;
    const videoUrl = req.video?.path || null;
    const documentUrls = req.documents ? req.documents.map(f => f.path) : null;

    const fields = [];
    const values = [];

    if (type) { fields.push('type=$' + (fields.length + 1)); values.push(type); }
    if (test_results) { fields.push('test_results=$' + (fields.length + 1)); values.push(test_results); }
    if (nutrients) { fields.push('nutrients=$' + (fields.length + 1)); values.push(nutrients); }
    if (irrigation_recommendations) { fields.push('irrigation_recommendations=$' + (fields.length + 1)); values.push(irrigation_recommendations); }
    if (imageUrl) { fields.push('image_url=$' + (fields.length + 1)); values.push(imageUrl); }
    if (videoUrl) { fields.push('video_url=$' + (fields.length + 1)); values.push(videoUrl); }
    if (documentUrls) { fields.push('document_urls=$' + (fields.length + 1)); values.push(documentUrls); }

    values.push(soilId);

    const query = `UPDATE soils SET ${fields.join(',')}, updated_at=NOW() WHERE soil_id=$${values.length}`;
    await pool.query(query, values);

    res.json({ success: true, message: 'Soil record updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete soil record
exports.deleteSoilRecord = async (req, res) => {
  try {
    const { soilId } = req.params;
    await pool.query('DELETE FROM soils WHERE soil_id=$1', [soilId]);
    res.json({ success: true, message: 'Soil record deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// View soil records
exports.getSoilRecords = async (req, res) => {
  try {
    const { farmer_id } = req.user;
    const result = await pool.query('SELECT * FROM soils WHERE farmer_id=$1', [farmer_id]);
    res.json({ success: true, soils: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

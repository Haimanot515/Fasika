const pool = require('../../config/dbConfig');

// Get dashboard KPIs
exports.getKPIs = async (req, res) => {
  try {
    const { farmer_id } = req.user;
    const crops = await pool.query('SELECT COUNT(*) AS total_crops FROM crops WHERE farmer_id=$1', [farmer_id]);
    const animals = await pool.query('SELECT COUNT(*) AS total_animals FROM animals WHERE farmer_id=$1', [farmer_id]);
    const lands = await pool.query('SELECT COUNT(*) AS total_lands FROM lands WHERE farmer_id=$1', [farmer_id]);

    res.json({ success: true, kpis: { crops: crops.rows[0].total_crops, animals: animals.rows[0].total_animals, lands: lands.rows[0].total_lands } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get personalized feed (AI-driven)
exports.getFeed = async (req, res) => {
  try {
    const { farmer_id } = req.user;
    const feed = await pool.query('SELECT * FROM feed_items WHERE farmer_id=$1 ORDER BY created_at DESC', [farmer_id]);
    res.json({ success: true, feed: feed.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

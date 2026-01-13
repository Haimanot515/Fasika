const pool = require('../../config/dbConfig');

exports.getAllPublicListings = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT * FROM marketplace_listings
      WHERE status = 'ACTIVE'
      ORDER BY created_at DESC
    `);

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

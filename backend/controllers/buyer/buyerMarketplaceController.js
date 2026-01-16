const pool = require('../../config/dbConfig');

exports.getAllPublicListings = async (req, res) => {
  try {
    // Get page and limit from query parameters (default to page 1, limit 12)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    
    // Calculate the offset (how many rows to DROP from the top of the result set)
    const offset = (page - 1) * limit;

    // Updated query with LIMIT and OFFSET
    const { rows } = await pool.query(`
      SELECT * FROM marketplace_listings
      WHERE status = 'ACTIVE'
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    // Optional: Get total count to help frontend know when to stop
    const countResult = await pool.query("SELECT COUNT(*) FROM marketplace_listings WHERE status = 'ACTIVE'");
    const totalItems = parseInt(countResult.rows[0].count);

    res.status(200).json({
      success: true,
      count: rows.length,
      totalItems: totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
      data: rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

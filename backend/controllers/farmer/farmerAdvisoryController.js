const pool = require("../../config/dbConfig");

const getFarmerAdvisory = async (req, res) => {
  try {
    // We filter by target_role 'FARMER' to keep the board relevant
    const result = await pool.query(
      "SELECT * FROM advisory WHERE target_role = 'FARMER' OR target_role = 'ALL' ORDER BY created_at DESC"
    );

    res.status(200).json({
      success: true,
      count: result.rowCount,
      data: result.rows
    });
  } catch (err) {
    console.error("Advisory Error:", err.message);
    res.status(500).json({ success: false, message: "Database Error" });
  }
};

module.exports = { getFarmerAdvisory };

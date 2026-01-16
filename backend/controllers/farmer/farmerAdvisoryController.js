const pool = require("../config/db");

const getAdvisories = async (req, res) => {
  try {
    // Fetch latest advisories first
    const result = await pool.query(
      "SELECT * FROM advisory ORDER BY created_at DESC"
    );

    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error("Error fetching advisory:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { getAdvisories };

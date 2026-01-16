const pool = require("../../config/dbConfig"); // Correct path to your dbConfig

const getFarmerAdvisory = async (req, res) => {
  try {
    // 1. Check for 'farmer' (lowercase) to match your users.role
    // 2. We use 'all' as a fallback so general news shows up too
    const result = await pool.query(
      "SELECT * FROM advisory WHERE target_role = 'farmer' OR target_role = 'all' ORDER BY created_at DESC"
    );

    console.log(`Fetched ${result.rowCount} advisories for farmers`);

    // This structure fits your React frontend setAdvices(data.data) perfectly
    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error("🔥 Error in getFarmerAdvisory:", err.message);
    res.status(500).json({ 
      success: false, 
      message: "Database error while fetching advisory" 
    });
  }
};

module.exports = { getFarmerAdvisory };

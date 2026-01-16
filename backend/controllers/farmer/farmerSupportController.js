const pool = require("../../config/dbConfig");

// GET all support resources from the DROP Registry
const getSupportResources = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM support_resources ORDER BY created_at DESC"
        );

        // Nested in .data to match your frontend: res.data.data
        res.status(200).json({
            success: true,
            data: result.rows
        });
    } catch (err) {
        console.error("🔥 Error in getSupportResources:", err.message);
        res.status(500).json({ 
            success: false, 
            message: "Database error while fetching support hub data" 
        });
    }
};

module.exports = { getSupportResources };

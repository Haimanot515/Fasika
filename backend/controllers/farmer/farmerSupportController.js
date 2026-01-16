const pool = require("../../config/dbConfig");

const createSupportTicket = async (req, res) => {
  // farmer_id should ideally come from req.user.id (set by your auth middleware)
  // If you haven't set up req.user yet, you can pass it in the body for testing
  const { subject, issue_type, description, farmer_id } = req.body;
  const userId = req.user ? req.user.id : farmer_id; 

  if (!userId) {
    return res.status(400).json({ success: false, message: "Farmer ID is required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO support_tickets (farmer_id, subject, issue_type, description) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, subject, issue_type, description]
    );

    res.status(201).json({
      success: true,
      message: "Support ticket linked to your account successfully!",
      data: result.rows[0]
    });
  } catch (err) {
    console.error("🔥 Support Ticket Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Database error: Ensure the farmer_id exists in the users table."
    });
  }
};

module.exports = { createSupportTicket };

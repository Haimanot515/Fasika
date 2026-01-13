const pool = require('../../config/dbConfig');
const { v4: uuidv4 } = require('uuid');

/**
 * 1️⃣ Log a farmer action
 */
const logFarmerAction = async (req, res) => {
  try {
    const farmerId = req.user.id;
    const { actionType, actionDetails } = req.body;

    const logId = uuidv4();

    await pool.query(
      `
      INSERT INTO farmer_logs
      (log_id, farmer_id, action_type, action_details, created_at)
      VALUES ($1,$2,$3,$4,NOW())
      `,
      [logId, farmerId, actionType, actionDetails]
    );

    res.status(201).json({ success: true, message: 'Action logged', logId });
  } catch (err) {
    console.error('logFarmerAction error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

/**
 * 2️⃣ Get all logs for a farmer
 */
const getFarmerLogs = async (req, res) => {
  try {
    const farmerId = req.user.id;

    const { rows } = await pool.query(
      `SELECT * FROM farmer_logs WHERE farmer_id=$1 ORDER BY created_at DESC`,
      [farmerId]
    );

    res.json({ success: true, logs: rows });
  } catch (err) {
    console.error('getFarmerLogs error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

/**
 * 3️⃣ Get logs filtered by action type (optional)
 */
const getFarmerLogsByType = async (req, res) => {
  try {
    const farmerId = req.user.id;
    const { actionType } = req.query;

    const { rows } = await pool.query(
      `
      SELECT * FROM farmer_logs
      WHERE farmer_id=$1 AND action_type=$2
      ORDER BY created_at DESC
      `,
      [farmerId, actionType]
    );

    res.json({ success: true, logs: rows });
  } catch (err) {
    console.error('getFarmerLogsByType error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

module.exports = {
  logFarmerAction,
  getFarmerLogs,
  getFarmerLogsByType
};

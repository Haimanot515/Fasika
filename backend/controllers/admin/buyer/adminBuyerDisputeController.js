const pool = require('../../../config/dbConfig');

/**
 * ======================================
 * ADMIN → BUYER DISPUTE CONTROLLERS
 * ======================================
 * Scope:
 *  - Viewing buyer disputes
 *  - Resolving disputes
 *  - Admin intervention
 */

/**
 * 1️⃣ Get all disputes for a buyer
 */
exports.getBuyerDisputesAdmin = async (req, res) => {
  try {
    const { buyerId } = req.params;

    const { rows } = await pool.query(
      `SELECT * FROM buyer_disputes
       WHERE user_id=$1
       ORDER BY created_at DESC`,
      [buyerId]
    );

    res.json({ count: rows.length, disputes: rows });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch disputes' });
  }
};

/**
 * 2️⃣ Get single dispute by ID
 */
exports.getBuyerDisputeByIdAdmin = async (req, res) => {
  try {
    const { disputeId } = req.params;

    const { rows } = await pool.query(
      `SELECT * FROM buyer_disputes WHERE dispute_id=$1`,
      [disputeId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'Dispute not found' });
    }

    res.json({ dispute: rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch dispute' });
  }
};

/**
 * 3️⃣ Resolve a dispute (admin override)
 */
exports.resolveDisputeAdmin = async (req, res) => {
  try {
    const { disputeId } = req.params;
    const { resolution, notes } = req.body;

    if (!resolution) {
      return res.status(400).json({ message: 'Resolution is required' });
    }

    const { rowCount } = await pool.query(
      `
      UPDATE buyer_disputes
      SET status='Resolved', resolution=$1, admin_notes=$2, updated_at=NOW()
      WHERE dispute_id=$3
      `,
      [resolution, notes || null, disputeId]
    );

    if (!rowCount) {
      return res.status(404).json({ message: 'Dispute not found' });
    }

    res.json({ message: 'Dispute resolved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to resolve dispute' });
  }
};

/**
 * 4️⃣ Get all open disputes (admin overview)
 */
exports.getOpenDisputesAdmin = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM buyer_disputes WHERE status='Open' ORDER BY created_at DESC`
    );

    res.json({ count: rows.length, disputes: rows });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch open disputes' });
  }
};

/**
 * 5️⃣ Add admin comment to a dispute
 */
exports.addAdminCommentToDispute = async (req, res) => {
  try {
    const { disputeId } = req.params;
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({ message: 'Comment is required' });
    }

    await pool.query(
      `
      UPDATE buyer_disputes
      SET admin_comments=$1, updated_at=NOW()
      WHERE dispute_id=$2
      `,
      [comment, disputeId]
    );

    res.json({ message: 'Admin comment added to dispute' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add comment' });
  }
};

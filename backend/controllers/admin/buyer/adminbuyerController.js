const pool = require('../../../config/dbConfig');

/**
 * ======================================
 * ADMIN → BUYER ACCOUNT CONTROLLERS
 * ======================================
 * Scope:
 *  - Buyer account lifecycle
 *  - Status, security, risk, admin control
 *  - NO profile / order / payment logic
 */

/**
 * 1️⃣ Get all buyers (pagination + filters)
 */
exports.getAllBuyersAdmin = async (req, res) => {
  try {
    const { status, verified, limit = 20, offset = 0 } = req.query;

    const { rows } = await pool.query(
      `
      SELECT id, phone, email, status, is_verified, created_at
      FROM users
      WHERE role = 'buyer'
        AND ($1::text IS NULL OR status = $1)
        AND ($2::boolean IS NULL OR is_verified = $2)
      ORDER BY created_at DESC
      LIMIT $3 OFFSET $4
      `,
      [status || null, verified ?? null, limit, offset]
    );

    res.json({ buyers: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch buyers' });
  }
};

/**
 * 2️⃣ Get buyer by ID
 */
exports.getBuyerByIdAdmin = async (req, res) => {
  try {
    const { buyerId } = req.params;

    const { rows } = await pool.query(
      `SELECT * FROM users WHERE id=$1 AND role='buyer'`,
      [buyerId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'Buyer not found' });
    }

    res.json({ buyer: rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch buyer' });
  }
};

/**
 * 3️⃣ Search buyers
 */
exports.searchBuyersAdmin = async (req, res) => {
  try {
    const { q } = req.query;

    const { rows } = await pool.query(
      `
      SELECT id, phone, email, status
      FROM users
      WHERE role='buyer'
        AND (phone ILIKE $1 OR email ILIKE $1)
      `,
      [`%${q}%`]
    );

    res.json({ buyers: rows });
  } catch (err) {
    res.status(500).json({ message: 'Search failed' });
  }
};

/**
 * 4️⃣ Activate buyer
 */
exports.activateBuyerAdmin = async (req, res) => {
  try {
    const { buyerId } = req.params;

    await pool.query(
      `UPDATE users SET status='active' WHERE id=$1 AND role='buyer'`,
      [buyerId]
    );

    res.json({ message: 'Buyer activated' });
  } catch (err) {
    res.status(500).json({ message: 'Activation failed' });
  }
};

/**
 * 5️⃣ Suspend buyer
 */
exports.suspendBuyerAdmin = async (req, res) => {
  try {
    const { buyerId } = req.params;

    await pool.query(
      `UPDATE users SET status='suspended' WHERE id=$1 AND role='buyer'`,
      [buyerId]
    );

    res.json({ message: 'Buyer suspended' });
  } catch (err) {
    res.status(500).json({ message: 'Suspension failed' });
  }
};

/**
 * 6️⃣ Soft delete buyer
 */
exports.softDeleteBuyerAdmin = async (req, res) => {
  try {
    const { buyerId } = req.params;

    await pool.query(
      `UPDATE users SET status='deleted', deleted_at=NOW()
       WHERE id=$1 AND role='buyer'`,
      [buyerId]
    );

    res.json({ message: 'Buyer soft-deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
};

/**
 * 7️⃣ Permanent delete buyer
 */
exports.deleteBuyerPermanentlyAdmin = async (req, res) => {
  try {
    const { buyerId } = req.params;

    await pool.query(
      `DELETE FROM users WHERE id=$1 AND role='buyer'`,
      [buyerId]
    );

    res.json({ message: 'Buyer permanently deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Permanent delete failed' });
  }
};

/**
 * 8️⃣ Verify buyer
 */
exports.verifyBuyerAdmin = async (req, res) => {
  try {
    const { buyerId } = req.params;

    await pool.query(
      `UPDATE users SET is_verified=true WHERE id=$1 AND role='buyer'`,
      [buyerId]
    );

    res.json({ message: 'Buyer verified' });
  } catch (err) {
    res.status(500).json({ message: 'Verification failed' });
  }
};

/**
 * 9️⃣ Revoke buyer verification
 */
exports.revokeBuyerVerificationAdmin = async (req, res) => {
  try {
    const { buyerId } = req.params;

    await pool.query(
      `UPDATE users SET is_verified=false WHERE id=$1 AND role='buyer'`,
      [buyerId]
    );

    res.json({ message: 'Verification revoked' });
  } catch (err) {
    res.status(500).json({ message: 'Revoke failed' });
  }
};

/**
 * 🔟 Lock buyer account
 */
exports.lockBuyerAccountAdmin = async (req, res) => {
  try {
    const { buyerId } = req.params;

    await pool.query(
      `UPDATE users SET is_locked=true WHERE id=$1 AND role='buyer'`,
      [buyerId]
    );

    res.json({ message: 'Buyer account locked' });
  } catch (err) {
    res.status(500).json({ message: 'Lock failed' });
  }
};

/**
 * 1️⃣1️⃣ Unlock buyer account
 */
exports.unlockBuyerAccountAdmin = async (req, res) => {
  try {
    const { buyerId } = req.params;

    await pool.query(
      `UPDATE users SET is_locked=false WHERE id=$1 AND role='buyer'`,
      [buyerId]
    );

    res.json({ message: 'Buyer account unlocked' });
  } catch (err) {
    res.status(500).json({ message: 'Unlock failed' });
  }
};

/**
 * 1️⃣2️⃣ Buyer activity summary
 */
exports.getBuyerActivitySummaryAdmin = async (req, res) => {
  try {
    const { buyerId } = req.params;

    const { rows } = await pool.query(
      `
      SELECT
        (SELECT COUNT(*) FROM orders WHERE buyer_id=$1) AS total_orders,
        (SELECT COUNT(*) FROM disputes WHERE buyer_id=$1) AS disputes,
        (SELECT COUNT(*) FROM payments WHERE buyer_id=$1) AS payments
      `,
      [buyerId]
    );

    res.json({ summary: rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load activity' });
  }
};

/**
 * 1️⃣3️⃣ Flag buyer
 */
exports.flagBuyerAdmin = async (req, res) => {
  try {
    const { buyerId } = req.params;
    const { reason } = req.body;

    await pool.query(
      `UPDATE users SET is_flagged=true, flag_reason=$1 WHERE id=$2`,
      [reason, buyerId]
    );

    res.json({ message: 'Buyer flagged' });
  } catch (err) {
    res.status(500).json({ message: 'Flag failed' });
  }
};

/**
 * 1️⃣4️⃣ Remove buyer flag
 */
exports.removeBuyerFlagAdmin = async (req, res) => {
  try {
    const { buyerId } = req.params;

    await pool.query(
      `UPDATE users SET is_flagged=false, flag_reason=NULL WHERE id=$1`,
      [buyerId]
    );

    res.json({ message: 'Buyer flag removed' });
  } catch (err) {
    res.status(500).json({ message: 'Unflag failed' });
  }
};

/**
 * 1️⃣5️⃣ Add admin note
 */
exports.addBuyerAdminNote = async (req, res) => {
  try {
    const { buyerId } = req.params;
    const { note } = req.body;

    await pool.query(
      `
      INSERT INTO admin_notes (entity_type, entity_id, note)
      VALUES ('buyer', $1, $2)
      `,
      [buyerId, note]
    );

    res.json({ message: 'Admin note added' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add note' });
  }
};

/**
 * 1️⃣6️⃣ Get admin notes
 */
exports.getBuyerAdminNotes = async (req, res) => {
  try {
    const { buyerId } = req.params;

    const { rows } = await pool.query(
      `SELECT * FROM admin_notes WHERE entity_type='buyer' AND entity_id=$1`,
      [buyerId]
    );

    res.json({ notes: rows });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load notes' });
  }
};

/**
 * 1️⃣7️⃣ Force logout buyer
 */
exports.forceLogoutBuyerAdmin = async (req, res) => {
  try {
    const { buyerId } = req.params;

    await pool.query(
      `DELETE FROM user_sessions WHERE user_id=$1`,
      [buyerId]
    );

    res.json({ message: 'Buyer logged out from all sessions' });
  } catch (err) {
    res.status(500).json({ message: 'Logout failed' });
  }
};

/**
 * 1️⃣8️⃣ Buyer stats
 */
exports.getBuyerStatsAdmin = async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `
      SELECT
        COUNT(*) FILTER (WHERE status='active') AS active,
        COUNT(*) FILTER (WHERE status='suspended') AS suspended,
        COUNT(*) AS total
      FROM users WHERE role='buyer'
      `
    );

    res.json({ stats: rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Stats failed' });
  }
};

/**
 * 1️⃣9️⃣ Export buyers
 */
exports.exportBuyersAdmin = async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT phone, email, status FROM users WHERE role='buyer'`
    );

    res.json({ data: rows });
  } catch (err) {
    res.status(500).json({ message: 'Export failed' });
  }
};

/**
 * 2️⃣0️⃣ Buyer risk score
 */
exports.getBuyerRiskScoreAdmin = async (req, res) => {
  try {
    const { buyerId } = req.params;

    const { rows } = await pool.query(
      `
      SELECT
        (SELECT COUNT(*) FROM disputes WHERE buyer_id=$1) * 3 +
        (SELECT COUNT(*) FROM refunds WHERE buyer_id=$1) * 2 AS risk_score
      `,
      [buyerId]
    );

    res.json({ risk_score: rows[0].risk_score });
  } catch (err) {
    res.status(500).json({ message: 'Risk score failed' });
  }
};

const pool = require('../../../config/dbConfig');

/**
 * ======================================
 * ADMIN → BUYER PAYMENT CONTROLLERS
 * ======================================
 * Scope:
 *  - Viewing buyer transactions
 *  - Issuing refunds
 *  - Admin verification
 */

/**
 * 1️⃣ Get all payments for a buyer
 */
exports.getBuyerPaymentsAdmin = async (req, res) => {
  try {
    const { buyerId } = req.params;

    const { rows } = await pool.query(
      `SELECT * FROM buyer_payments
       WHERE user_id=$1
       ORDER BY created_at DESC`,
      [buyerId]
    );

    res.json({ count: rows.length, payments: rows });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch payments' });
  }
};

/**
 * 2️⃣ Get single payment by ID
 */
exports.getBuyerPaymentByIdAdmin = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const { rows } = await pool.query(
      `SELECT * FROM buyer_payments WHERE payment_id=$1`,
      [paymentId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json({ payment: rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch payment' });
  }
};

/**
 * 3️⃣ Issue refund (admin override)
 */
exports.issueRefundAdmin = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { reason, amount } = req.body;

    if (!reason || !amount) {
      return res.status(400).json({ message: 'Reason and amount are required' });
    }

    const { rowCount } = await pool.query(
      `
      UPDATE buyer_payments
      SET status='Refunded', refund_amount=$1, refund_reason=$2, updated_at=NOW()
      WHERE payment_id=$3
      `,
      [amount, reason, paymentId]
    );

    if (!rowCount) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json({ message: 'Refund issued successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to issue refund' });
  }
};

/**
 * 4️⃣ Get all pending payments (admin overview)
 */
exports.getPendingPaymentsAdmin = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM buyer_payments WHERE status='Pending' ORDER BY created_at DESC`
    );

    res.json({ count: rows.length, payments: rows });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch pending payments' });
  }
};

/**
 * 5️⃣ Add admin note to payment
 */
exports.addAdminNoteToPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { note } = req.body;

    if (!note) {
      return res.status(400).json({ message: 'Note is required' });
    }

    await pool.query(
      `
      UPDATE buyer_payments
      SET admin_note=$1, updated_at=NOW()
      WHERE payment_id=$2
      `,
      [note, paymentId]
    );

    res.json({ message: 'Admin note added to payment' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add note' });
  }
};

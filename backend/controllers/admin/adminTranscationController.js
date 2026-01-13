// controllers/adminTransactionController.js
const pool = require('../config/dbConfig');

/**
 * =========================
 *  Market Transactions & Payments (Admin)
 * =========================
 */

/**
 * 1️⃣ Get all transactions
 * Optional filters: status, farmerId, buyerId, date range
 */
const getAllTransactions = async (req, res) => {
  try {
    const { status, farmerId, buyerId, startDate, endDate, limit = 20, offset = 0 } = req.query;

    let query = `SELECT * FROM transactions WHERE 1=1`;
    const params = [];
    let idx = 1;

    if (status) {
      query += ` AND status = $${idx++}`;
      params.push(status);
    }
    if (farmerId) {
      query += ` AND farmer_id = $${idx++}`;
      params.push(farmerId);
    }
    if (buyerId) {
      query += ` AND buyer_id = $${idx++}`;
      params.push(buyerId);
    }
    if (startDate) {
      query += ` AND created_at >= $${idx++}`;
      params.push(startDate);
    }
    if (endDate) {
      query += ` AND created_at <= $${idx++}`;
      params.push(endDate);
    }

    query += ` ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    res.json({ success: true, count: result.rowCount, transactions: result.rows });
  } catch (err) {
    console.error('getAllTransactions error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * 2️⃣ Get single transaction by ID
 */
const getTransactionById = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const result = await pool.query(
      `SELECT * FROM transactions WHERE transaction_id = $1`,
      [transactionId]
    );

    if (!result.rowCount) return res.status(404).json({ success: false, message: 'Transaction not found' });

    res.json({ success: true, transaction: result.rows[0] });
  } catch (err) {
    console.error('getTransactionById error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * 3️⃣ Update transaction status (Pending, Completed, Failed, Cancelled)
 */
const updateTransactionStatus = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['Pending', 'Completed', 'Failed', 'Cancelled'];
    if (!allowedStatuses.includes(status)) return res.status(400).json({ message: 'Invalid status' });

    const result = await pool.query(
      `UPDATE transactions
       SET status = $1, updated_at = NOW()
       WHERE transaction_id = $2
       RETURNING transaction_id, status, amount, farmer_id, buyer_id`,
      [status, transactionId]
    );

    if (!result.rowCount) return res.status(404).json({ success: false, message: 'Transaction not found' });

    res.json({ success: true, message: 'Transaction status updated', transaction: result.rows[0] });
  } catch (err) {
    console.error('updateTransactionStatus error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * 4️⃣ Refund transaction
 */
const refundTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { reason } = req.body;

    const result = await pool.query(
      `UPDATE transactions
       SET status = 'Refunded', refund_reason = $1, refunded_at = NOW()
       WHERE transaction_id = $2
       RETURNING transaction_id, status, amount, farmer_id, buyer_id`,
      [reason, transactionId]
    );

    if (!result.rowCount) return res.status(404).json({ success: false, message: 'Transaction not found' });

    res.json({ success: true, message: 'Transaction refunded', transaction: result.rows[0] });
  } catch (err) {
    console.error('refundTransaction error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * 5️⃣ Bulk mark transactions as completed
 */
const bulkCompleteTransactions = async (req, res) => {
  try {
    const { transactionIds } = req.body;
    if (!Array.isArray(transactionIds) || !transactionIds.length)
      return res.status(400).json({ message: 'transactionIds array required' });

    const result = await pool.query(
      `UPDATE transactions
       SET status = 'Completed', updated_at = NOW()
       WHERE transaction_id = ANY($1::uuid[])
       RETURNING transaction_id, status, amount`,
      [transactionIds]
    );

    res.json({ success: true, message: 'Transactions completed successfully', transactions: result.rows });
  } catch (err) {
    console.error('bulkCompleteTransactions error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * 6️⃣ Get transaction history per farmer
 */
const getFarmerTransactions = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const result = await pool.query(
      `SELECT * FROM transactions
       WHERE farmer_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [farmerId, limit, offset]
    );

    res.json({ success: true, count: result.rowCount, transactions: result.rows });
  } catch (err) {
    console.error('getFarmerTransactions error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * 7️⃣ Get transaction history per buyer
 */
const getBuyerTransactions = async (req, res) => {
  try {
    const { buyerId } = req.params;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const result = await pool.query(
      `SELECT * FROM transactions
       WHERE buyer_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [buyerId, limit, offset]
    );

    res.json({ success: true, count: result.rowCount, transactions: result.rows });
  } catch (err) {
    console.error('getBuyerTransactions error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * 8️⃣ Delete transaction (soft delete)
 */
const deleteTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const result = await pool.query(
      `UPDATE transactions
       SET status = 'Archived', deleted_at = NOW()
       WHERE transaction_id = $1
       RETURNING transaction_id, status, amount`,
      [transactionId]
    );

    if (!result.rowCount) return res.status(404).json({ success: false, message: 'Transaction not found' });

    res.json({ success: true, message: 'Transaction archived', transaction: result.rows[0] });
  } catch (err) {
    console.error('deleteTransaction error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getAllTransactions,
  getTransactionById,
  updateTransactionStatus,
  refundTransaction,
  bulkCompleteTransactions,
  getFarmerTransactions,
  getBuyerTransactions,
  deleteTransaction
};

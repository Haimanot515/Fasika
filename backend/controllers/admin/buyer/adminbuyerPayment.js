const pool = require('../../../config/dbConfig');

/**
 * ======================================
 * ADMIN → BUYER PAYMENTS CONTROLLERS
 * ======================================
 * Scope:
 *  - Wallet balances
 *  - Transactions
 *  - Refunds
 */

/**
 * 1️⃣ Get wallet balance for a specific buyer
 */
exports.getBuyerWalletAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    const { rows } = await pool.query(
      `SELECT user_id, wallet_balance FROM buyer_wallets WHERE user_id=$1`,
      [userId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'Buyer wallet not found' });
    }

    res.json({ wallet: rows[0] });
  } catch (err) {
    console.error('getBuyerWalletAdmin error:', err);
    res.status(500).json({ message: 'Failed to fetch buyer wallet' });
  }
};

/**
 * 2️⃣ Add or adjust wallet balance for a buyer (admin action)
 */
exports.adjustBuyerWalletAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount, reason } = req.body;

    if (typeof amount !== 'number') {
      return res.status(400).json({ message: 'Amount must be a number' });
    }

    const { rows } = await pool.query(
      `UPDATE buyer_wallets
       SET wallet_balance = wallet_balance + $1,
           updated_at = NOW()
       WHERE user_id=$2
       RETURNING *`,
      [amount, userId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'Buyer wallet not found' });
    }

    // Log transaction
    await pool.query(
      `INSERT INTO buyer_wallet_transactions (transaction_id, buyer_id, amount, reason, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, NOW())`,
      [userId, amount, reason || 'Admin adjustment']
    );

    res.json({ message: 'Wallet adjusted successfully', wallet: rows[0] });
  } catch (err) {
    console.error('adjustBuyerWalletAdmin error:', err);
    res.status(500).json({ message: 'Failed to adjust wallet' });
  }
};

/**
 * 3️⃣ Get buyer transaction history
 */
exports.getBuyerTransactionsAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    const { rows } = await pool.query(
      `SELECT transaction_id, amount, reason, created_at
       FROM buyer_wallet_transactions
       WHERE buyer_id=$1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    res.json({ transactions: rows });
  } catch (err) {
    console.error('getBuyerTransactionsAdmin error:', err);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
};

/**
 * 4️⃣ Process refund for a buyer
 */
exports.processBuyerRefundAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const { orderId, amount, reason } = req.body;

    if (!orderId || typeof amount !== 'number') {
      return res.status(400).json({ message: 'Order ID and amount are required' });
    }

    // Adjust wallet
    const { rows } = await pool.query(
      `UPDATE buyer_wallets
       SET wallet_balance = wallet_balance + $1,
           updated_at = NOW()
       WHERE user_id=$2
       RETURNING *`,
      [amount, userId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'Buyer wallet not found' });
    }

    // Log refund
    await pool.query(
      `INSERT INTO buyer_wallet_transactions (transaction_id, buyer_id, amount, reason, created_at, order_id)
       VALUES (gen_random_uuid(), $1, $2, $3, NOW(), $4)`,
      [userId, amount, reason || 'Admin refund', orderId]
    );

    res.json({ message: 'Refund processed successfully', wallet: rows[0] });
  } catch (err) {
    console.error('processBuyerRefundAdmin error:', err);
    res.status(500).json({ message: 'Failed to process refund' });
  }
};

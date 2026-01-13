const pool = require('../../../config/dbConfig');

/**
 * ======================================
 * ADMIN → BUYER CHAT CONTROLLERS
 * ======================================
 * Scope:
 *  - Viewing buyer messages
 *  - Sending messages
 *  - Moderation / reporting
 */

/**
 * 1️⃣ Get all chats for a buyer
 */
exports.getBuyerChatsAdmin = async (req, res) => {
  try {
    const { buyerId } = req.params;

    const { rows } = await pool.query(
      `SELECT * FROM buyer_chats
       WHERE buyer_id=$1
       ORDER BY last_message_at DESC`,
      [buyerId]
    );

    res.json({ count: rows.length, chats: rows });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch chats' });
  }
};

/**
 * 2️⃣ Get single chat by ID
 */
exports.getBuyerChatByIdAdmin = async (req, res) => {
  try {
    const { chatId } = req.params;

    const { rows } = await pool.query(
      `SELECT * FROM buyer_chats WHERE chat_id=$1`,
      [chatId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json({ chat: rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch chat' });
  }
};

/**
 * 3️⃣ Send message as admin to buyer
 */
exports.sendMessageToBuyerAdmin = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message text is required' });
    }

    const { rows } = await pool.query(
      `
      INSERT INTO buyer_chat_messages (chat_id, sender_role, message)
      VALUES ($1, 'Admin', $2)
      RETURNING *
      `,
      [chatId, message]
    );

    // Update last_message_at
    await pool.query(
      `UPDATE buyer_chats SET last_message_at=NOW() WHERE chat_id=$1`,
      [chatId]
    );

    res.json({ message: 'Message sent successfully', messageData: rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send message' });
  }
};

/**
 * 4️⃣ Delete a buyer chat (admin action)
 */
exports.deleteBuyerChatAdmin = async (req, res) => {
  try {
    const { chatId } = req.params;

    const { rowCount, rows } = await pool.query(
      `DELETE FROM buyer_chats WHERE chat_id=$1 RETURNING *`,
      [chatId]
    );

    if (!rowCount) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json({ message: 'Chat deleted successfully', chat: rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete chat' });
  }
};

/**
 * 5️⃣ Moderate buyer chat (mark inappropriate / flagged)
 */
exports.flagBuyerChatAdmin = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: 'Reason is required' });
    }

    await pool.query(
      `
      UPDATE buyer_chats
      SET flagged=true, flag_reason=$1, updated_at=NOW()
      WHERE chat_id=$2
      `,
      [reason, chatId]
    );

    res.json({ message: 'Chat flagged successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to flag chat' });
  }
};

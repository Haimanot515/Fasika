const pool = require('../../../config/dbConfig');

/**
 * ======================================
 * ADMIN → BUYER ORDER CONTROLLERS
 * ======================================
 * Scope:
 *  - Viewing buyer orders
 *  - Updating order status
 *  - Admin interventions (cancellations, refunds)
 */

/**
 * 1️⃣ Get all orders for a buyer
 */
exports.getBuyerOrdersAdmin = async (req, res) => {
  try {
    const { buyerId } = req.params;

    const { rows } = await pool.query(
      `SELECT * FROM buyer_orders
       WHERE user_id=$1
       ORDER BY created_at DESC`,
      [buyerId]
    );

    res.json({ count: rows.length, orders: rows });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

/**
 * 2️⃣ Get single order by ID
 */
exports.getBuyerOrderByIdAdmin = async (req, res) => {
  try {
    const { orderId } = req.params;

    const { rows } = await pool.query(
      `SELECT * FROM buyer_orders WHERE order_id=$1`,
      [orderId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ order: rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch order' });
  }
};

/**
 * 3️⃣ Update order status (admin override)
 */
exports.updateBuyerOrderStatusAdmin = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const { rowCount } = await pool.query(
      `
      UPDATE buyer_orders
      SET status=$1, updated_at=NOW()
      WHERE order_id=$2
      `,
      [status, orderId]
    );

    if (!rowCount) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order status updated' });
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
};

/**
 * 4️⃣ Cancel order (admin intervention)
 */
exports.cancelBuyerOrderAdmin = async (req, res) => {
  try {
    const { orderId } = req.params;

    const { rowCount } = await pool.query(
      `
      UPDATE buyer_orders
      SET status='Cancelled', updated_at=NOW()
      WHERE order_id=$1
      `,
      [orderId]
    );

    if (!rowCount) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order cancelled by admin' });
  } catch (err) {
    res.status(500).json({ message: 'Cancellation failed' });
  }
};

/**
 * 5️⃣ Assign admin note / intervention
 */
exports.addAdminNoteToOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { note } = req.body;

    if (!note) {
      return res.status(400).json({ message: 'Note is required' });
    }

    await pool.query(
      `
      UPDATE buyer_orders
      SET admin_note=$1, updated_at=NOW()
      WHERE order_id=$2
      `,
      [note, orderId]
    );

    res.json({ message: 'Admin note added to order' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add note' });
  }
};

/**
 * 6️⃣ Get all active orders for all buyers (overview)
 */
exports.getAllActiveOrdersAdmin = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM buyer_orders WHERE status IN ('Pending','Processing','Shipped') ORDER BY created_at DESC`
    );

    res.json({ count: rows.length, orders: rows });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch active orders' });
  }
};

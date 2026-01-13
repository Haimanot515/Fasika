const pool = require('../../../config/dbConfig');

/**
 * ======================================
 * ADMIN → BUYER ADDRESS CONTROLLERS
 * ======================================
 * Scope:
 *  - Delivery addresses
 *  - Pickup locations
 *  - Address verification & override
 */

/**
 * 1️⃣ Get all addresses for a buyer
 */
exports.getBuyerAddressesAdmin = async (req, res) => {
  try {
    const { buyerId } = req.params;

    const { rows } = await pool.query(
      `SELECT * FROM buyer_addresses
       WHERE user_id=$1
       ORDER BY created_at DESC`,
      [buyerId]
    );

    res.json({ count: rows.length, addresses: rows });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch addresses' });
  }
};

/**
 * 2️⃣ Get single address by ID
 */
exports.getBuyerAddressByIdAdmin = async (req, res) => {
  try {
    const { addressId } = req.params;

    const { rows } = await pool.query(
      `SELECT * FROM buyer_addresses WHERE address_id=$1`,
      [addressId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.json({ address: rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch address' });
  }
};

/**
 * 3️⃣ Add address for buyer (admin forced)
 */
exports.createBuyerAddressAdmin = async (req, res) => {
  try {
    const {
      user_id,
      label,
      region,
      zone,
      woreda,
      kebele,
      street,
      latitude,
      longitude,
      is_pickup_location
    } = req.body;

    if (!user_id || !region || !woreda) {
      return res.status(400).json({ message: 'user_id, region, woreda required' });
    }

    const { rows } = await pool.query(
      `
      INSERT INTO buyer_addresses (
        address_id,
        user_id,
        label,
        region,
        zone,
        woreda,
        kebele,
        street,
        latitude,
        longitude,
        is_pickup_location
      )
      VALUES (gen_random_uuid(),$1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *
      `,
      [
        user_id,
        label || null,
        region,
        zone || null,
        woreda,
        kebele || null,
        street || null,
        latitude || null,
        longitude || null,
        is_pickup_location || false
      ]
    );

    res.status(201).json({ address: rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create address' });
  }
};

/**
 * 4️⃣ Update buyer address
 */
exports.updateBuyerAddressAdmin = async (req, res) => {
  try {
    const { addressId } = req.params;
    const updates = req.body;

    if (!Object.keys(updates).length) {
      return res.status(400).json({ message: 'No updates provided' });
    }

    const fields = Object.keys(updates).map(
      (key, i) => `${key}=$${i + 1}`
    );
    const values = [...Object.values(updates), addressId];

    const { rowCount } = await pool.query(
      `
      UPDATE buyer_addresses
      SET ${fields.join(',')}, updated_at=NOW()
      WHERE address_id=$${values.length}
      `,
      values
    );

    if (!rowCount) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.json({ message: 'Address updated' });
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
};

/**
 * 5️⃣ Delete buyer address
 */
exports.deleteBuyerAddressAdmin = async (req, res) => {
  try {
    const { addressId } = req.params;

    const { rowCount } = await pool.query(
      `DELETE FROM buyer_addresses WHERE address_id=$1`,
      [addressId]
    );

    if (!rowCount) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.json({ message: 'Address deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
};

/**
 * 6️⃣ Mark address as verified (admin)
 */
exports.verifyBuyerAddressAdmin = async (req, res) => {
  try {
    const { addressId } = req.params;

    const { rowCount } = await pool.query(
      `
      UPDATE buyer_addresses
      SET is_verified=true, updated_at=NOW()
      WHERE address_id=$1
      `,
      [addressId]
    );

    if (!rowCount) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.json({ message: 'Address verified' });
  } catch (err) {
    res.status(500).json({ message: 'Verification failed' });
  }
};

/**
 * 7️⃣ Unverify address
 */
exports.unverifyBuyerAddressAdmin = async (req, res) => {
  try {
    const { addressId } = req.params;

    await pool.query(
      `
      UPDATE buyer_addresses
      SET is_verified=false, updated_at=NOW()
      WHERE address_id=$1
      `,
      [addressId]
    );

    res.json({ message: 'Address unverified' });
  } catch (err) {
    res.status(500).json({ message: 'Operation failed' });
  }
};

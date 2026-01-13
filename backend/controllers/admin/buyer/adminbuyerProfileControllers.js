const pool = require('../../../config/dbConfig');

/**
 * ======================================
 * ADMIN → BUYER PROFILE CONTROLLERS
 * ======================================
 * Scope:
 *  - Buyer personal profile
 *  - Preferences & settings
 *  - Profile images & metadata
 *  - NO orders / payments
 */

/**
 * 1️⃣ Get buyer profile
 */
exports.getBuyerProfileAdmin = async (req, res) => {
  try {
    const { buyerId } = req.params;

    const { rows } = await pool.query(
      `SELECT * FROM buyer_profiles WHERE user_id=$1`,
      [buyerId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'Buyer profile not found' });
    }

    res.json({ profile: rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch buyer profile' });
  }
};

/**
 * 2️⃣ Create buyer profile (admin forced)
 */
exports.createBuyerProfileAdmin = async (req, res) => {
  try {
    const {
      user_id,
      username,
      profile_image_url,
      preferred_language,
      notification_preferences
    } = req.body;

    if (!user_id || !username) {
      return res.status(400).json({ message: 'user_id and username required' });
    }

    const { rows } = await pool.query(
      `
      INSERT INTO buyer_profiles (
        buyer_profile_id,
        user_id,
        username,
        profile_image_url,
        preferred_language,
        notification_preferences
      )
      VALUES (gen_random_uuid(), $1,$2,$3,$4,$5)
      RETURNING *
      `,
      [
        user_id,
        username,
        profile_image_url || null,
        preferred_language || 'am',
        notification_preferences || {}
      ]
    );

    res.status(201).json({ profile: rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ message: 'Buyer profile already exists' });
    }
    res.status(500).json({ message: 'Failed to create profile' });
  }
};

/**
 * 3️⃣ Update buyer profile
 */
exports.updateBuyerProfileAdmin = async (req, res) => {
  try {
    const { buyerId } = req.params;
    const updates = req.body;

    if (!Object.keys(updates).length) {
      return res.status(400).json({ message: 'No updates provided' });
    }

    const fields = Object.keys(updates).map(
      (key, i) => `${key}=$${i + 1}`
    );
    const values = [...Object.values(updates), buyerId];

    const { rowCount } = await pool.query(
      `
      UPDATE buyer_profiles
      SET ${fields.join(',')}, updated_at=NOW()
      WHERE user_id=$${values.length}
      `,
      values
    );

    if (!rowCount) {
      return res.status(404).json({ message: 'Buyer profile not found' });
    }

    res.json({ message: 'Buyer profile updated' });
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
};

/**
 * 4️⃣ Delete buyer profile
 */
exports.deleteBuyerProfileAdmin = async (req, res) => {
  try {
    const { buyerId } = req.params;

    const { rowCount } = await pool.query(
      `DELETE FROM buyer_profiles WHERE user_id=$1`,
      [buyerId]
    );

    if (!rowCount) {
      return res.status(404).json({ message: 'Buyer profile not found' });
    }

    res.json({ message: 'Buyer profile deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
};

/**
 * 5️⃣ Get buyer preferences
 */
exports.getBuyerPreferencesAdmin = async (req, res) => {
  try {
    const { buyerId } = req.params;

    const { rows } = await pool.query(
      `
      SELECT preferred_language, notification_preferences
      FROM buyer_profiles
      WHERE user_id=$1
      `,
      [buyerId]
    );

    res.json({ preferences: rows[0] || {} });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load preferences' });
  }
};

/**
 * 6️⃣ Reset buyer preferences
 */
exports.resetBuyerPreferencesAdmin = async (req, res) => {
  try {
    const { buyerId } = req.params;

    await pool.query(
      `
      UPDATE buyer_profiles
      SET
        preferred_language='am',
        notification_preferences='{}',
        updated_at=NOW()
      WHERE user_id=$1
      `,
      [buyerId]
    );

    res.json({ message: 'Buyer preferences reset' });
  } catch (err) {
    res.status(500).json({ message: 'Reset failed' });
  }
};

/**
 * 7️⃣ Upload buyer profile image (admin override)
 */
exports.updateBuyerProfileImageAdmin = async (req, res) => {
  try {
    const { buyerId } = req.params;
    const { image_url } = req.body;

    if (!image_url) {
      return res.status(400).json({ message: 'image_url required' });
    }

    const { rowCount } = await pool.query(
      `
      UPDATE buyer_profiles
      SET profile_image_url=$1, updated_at=NOW()
      WHERE user_id=$2
      `,
      [image_url, buyerId]
    );

    if (!rowCount) {
      return res.status(404).json({ message: 'Buyer profile not found' });
    }

    res.json({ message: 'Profile image updated' });
  } catch (err) {
    res.status(500).json({ message: 'Image update failed' });
  }
};

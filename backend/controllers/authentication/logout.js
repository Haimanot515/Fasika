// controllers/logout.js
const pool = require('../../config/dbConfig');
const crypto = require('crypto');

/**
 * Logout from current device (single session)
 */
const logoutSingleDevice = async (req, res) => {
  const client = await pool.connect();
  try {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      return res.status(400).json({ error: 'No refresh token found' });
    }

    const refreshTokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    await client.query(
      `UPDATE user_sessions
       SET is_revoked = true
       WHERE refresh_token_hash = $1`,
      [refreshTokenHash]
    );

    res.clearCookie('refresh_token');

    return res.json({ message: 'Logged out from this device' });
  } catch (err) {
    console.error('Logout error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
};

/**
 * Terminate all other sessions (keep current device active)
 */
const terminateOtherSessions = async (req, res) => {
  const client = await pool.connect();
  try {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      return res.status(400).json({ error: 'No refresh token found' });
    }

    const refreshTokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    // ✅ INTERNAL USER ID (INTEGER)
    const userInternalId = req.user.numeric_id;

    await client.query(
      `UPDATE user_sessions
       SET is_revoked = true
       WHERE user_id = $1
         AND refresh_token_hash <> $2`,
      [userInternalId, refreshTokenHash]
    );

    return res.json({ message: 'Terminated all other sessions' });
  } catch (err) {
    console.error('Terminate others error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
};

module.exports = {
  logoutSingleDevice,
  terminateOtherSessions
};

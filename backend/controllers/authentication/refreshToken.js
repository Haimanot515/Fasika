// controllers/refreshToken.js
const pool = require('../../config/dbConfig');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

/**
 * Refresh access token using refresh token
 */
const refreshToken = async (req, res) => {
  const client = await pool.connect();

  try {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token missing' });
    }

    // Hash incoming refresh token
    const refreshTokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    /* ──────────────── 1. FIND SESSION ──────────────── */
    const sessionResult = await client.query(
      `SELECT s.*, u.role, u.account_status
       FROM user_sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.refresh_token_hash = $1
         AND s.is_revoked = false
         AND s.expires_at > NOW()`,
      [refreshTokenHash]
    );

    if (!sessionResult.rows.length) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    const session = sessionResult.rows[0];

    if (session.account_status !== 'Verified') {
      return res.status(403).json({ error: 'Account not verified' });
    }

    /* ──────────────── 2. ROTATE REFRESH TOKEN ──────────────── */
    const newRefreshToken = crypto.randomBytes(64).toString('hex');
    const newRefreshTokenHash = crypto
      .createHash('sha256')
      .update(newRefreshToken)
      .digest('hex');

    await client.query(
      `UPDATE user_sessions
       SET refresh_token_hash = $1,
           last_used_at = NOW()
       WHERE id = $2`,
      [newRefreshTokenHash, session.id]
    );

    /* ──────────────── 3. ISSUE NEW ACCESS TOKEN ──────────────── */
    const accessToken = jwt.sign(
      {
        userId: session.user_id,
        role: session.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    /* ──────────────── 4. SET COOKIE ──────────────── */
    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.json({
      message: 'Token refreshed',
      accessToken
    });

  } catch (err) {
    console.error('Refresh token error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
};

module.exports = { refreshToken };

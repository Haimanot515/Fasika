const pool = require('../../config/dbConfig');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const refreshToken = async (req, res) => {
  const client = await pool.connect();

  try {
    const { refresh_token } = req.cookies; // Matches loginUser cookie name

    if (!refresh_token) {
      return res.status(401).json({ authenticated: false, error: 'Session expired' });
    }

    const refreshTokenHash = crypto.createHash('sha256').update(refresh_token).digest('hex');

    /* 1. FIND SESSION (Updated to match your schema) */
    const sessionResult = await client.query(
      `SELECT s.id as session_id, s.user_internal_id, u.user_id, u.role, u.account_status
       FROM user_sessions s
       JOIN users u ON u.id = s.user_internal_id
       WHERE s.refresh_token_hash = $1
         AND s.revoked = false`,
      [refreshTokenHash]
    );

    const session = sessionResult.rows[0];

    if (!session) {
      return res.status(401).json({ authenticated: false, error: 'Invalid session' });
    }

    // Matches your login status logic
    if (session.account_status !== 'VERIFIED' && session.account_status !== 'ACTIVE') {
      return res.status(403).json({ error: 'Account not active' });
    }

    /* 2. ISSUE NEW ACCESS TOKEN */
    const accessToken = jwt.sign(
      { 
        userInternalId: session.user_internal_id, 
        userId: session.user_id, 
        role: session.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' } // Match login expiry
    );

    /* 3. SET THE NEW ACCESS COOKIE */
    /* 3. SET THE NEW ACCESS COOKIE (Updated for Render/Production) */
    res.cookie('auth_token', accessToken, {
      httpOnly: true,
      secure: true,        // Always true for HTTPS on Render
      sameSite: 'None',    // Required for cross-site cookie sharing
      maxAge: 86400000     // 24 hours
    });

    return res.status(200).json({
      authenticated: true,
      role: session.role,
      user_id: session.user_id
    });

  } catch (err) {
    console.error('Refresh token error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
};

module.exports = { refreshToken };

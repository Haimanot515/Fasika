const pool = require('../../config/dbConfig');
const jwt = require('jsonwebtoken');

const verifyUser = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) return res.status(400).json({ error: 'Verification token missing' });

    // 1️⃣ Decode verification JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ error: 'Verification link expired or invalid' });
    }

    // 2️⃣ Lookup user by numeric internal ID (from registration token)
    const { rows } = await pool.query(
      `SELECT id, user_id, role, account_status 
       FROM users 
       WHERE id = $1`,
      [decoded.numericId] 
    );

    if (!rows.length) return res.status(404).json({ error: 'User not found' });

    const user = rows[0];

    // 3️⃣ Check if already verified (Using 'VERIFIED' to match your schema/login check)
    if (user.account_status === 'VERIFIED' || user.account_status === 'ACTIVE') {
      return res.status(200).json({ message: 'Account already verified', role: user.role });
    }

    // 4️⃣ Update account status in DB
    await pool.query(
      `UPDATE users 
       SET account_status='VERIFIED', -- Standardized to all caps
           verification_code_hash=NULL, 
           verification_attempts=0, 
           verification_used_at=NOW() 
       WHERE id=$1`,
      [user.id]
    );

    // 5️⃣ Issue auth JWT (Matches Login structure exactly)
    const authToken = jwt.sign(
      {
        userInternalId: user.id,   // Universal Standard
        userId: user.user_id,      // String ID (e.g., USR-101)
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 6️⃣ Set auth cookie (Matches Cookie login logic)
    res.cookie('auth_token', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    /* Optional: If you want to log the user in fully here, 
       you should also generate a refresh_token and insert it 
       into user_sessions as we did in loginUser.js.
    */

    // 7️⃣ Respond success
    return res.status(200).json({
      message: 'Account verified successfully',
      authenticated: true,
      role: user.role,
      user_id: user.user_id, // Standardized property name
      next: 'HOME'
    });

  } catch (err) {
    console.error('Verify user error:', err.stack);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { verifyUser };
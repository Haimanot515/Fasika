const pool = require('../../config/dbConfig');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.resetPassword = async (req, res) => {
  const client = await pool.connect();

  try {
    // 1️⃣ Destructure only what is sent from your React frontend
    const { token, new_password } = req.body;

    console.log("🔄 Processing password reset request...");

    // 2️⃣ Check for required fields
    if (!token || !new_password) {
      return res.status(400).json({ 
        error: 'Missing required fields: token and new password are required.' 
      });
    }

    // 3️⃣ Verify the JWT Token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Token verified for user numeric ID:", decoded.numericId);
    } catch (err) {
      console.error("❌ JWT Verification Error:", err.message);
      return res.status(401).json({ error: 'Reset link is invalid or has expired.' });
    }

    // 4️⃣ Find the user and verify they have an active reset session
    // We check that the token in the DB matches the token being used
    const userResult = await client.query(
      `SELECT id, verification_code_hash FROM users 
       WHERE id = $1 AND verification_expires > NOW()`,
      [decoded.numericId]
    );

    const user = userResult.rows[0];

    if (!user || user.verification_code_hash !== token) {
      return res.status(400).json({ 
        error: 'Reset link has already been used or is no longer valid.' 
      });
    }

    // 5️⃣ Update the password
    await client.query('BEGIN');

    // Using 12 salt rounds to match your registerUser logic
    const password_hash = await bcrypt.hash(new_password, 12);

    await client.query(
      `UPDATE users SET 
        password_hash = $1, 
        verification_code_hash = NULL, 
        verification_expires = NULL 
       WHERE id = $2`,
      [password_hash, user.id]
    );

    await client.query('COMMIT');
    console.log("✅ Password updated successfully for ID:", user.id);

    return res.status(200).json({ 
      message: 'Password updated successfully! You can now log in.' 
    });

  } catch (err) {
    if (client) await client.query('ROLLBACK');
    console.error('🔥 CRITICAL RESET ERROR:', err.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    // Release client back to the pool
    client.release();
  }
};
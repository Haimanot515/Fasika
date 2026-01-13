const { v4: uuidv4 } = require('uuid');
const pool = require('../../config/dbConfig');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { sendEmail, sendSMS } = require('../../config/smsConfig');

const OTP_EXPIRY_MINUTES = 15; // Or import from constants

const createOTP = () => {
  const token = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  return { token, hash };
};

exports.forgotPassword = async (req, res) => {
  const client = await pool.connect();

  try {
    const { identifier } = req.body;
    if (!identifier) return res.status(400).json({ error: 'Missing identifier' });

    // 1️⃣ Detect type
    const isEmail = identifier.includes('@');
    let normalized = identifier.trim();

    if (!isEmail) {
      // Normalize phone like registration
      normalized = normalized.replace(/\s+/g, '');
      if (normalized.startsWith('0')) normalized = '+251' + normalized.slice(1);
    }

    await client.query('BEGIN');

    // 2️⃣ Find user
    const userResult = await client.query(
      `SELECT id, user_id, email, phone FROM users 
       WHERE email = $1 OR phone = $1 OR user_id = $1 
       LIMIT 1`,
      [normalized]
    );

    const user = userResult.rows[0];

    if (!user) {
      await client.query('COMMIT');
      return res.status(200).json({ message: 'If account exists, instructions were sent.' });
    }

    let verificationToken;
    let verificationHash;
    let verificationExpires;

    // 3️⃣ Generate JWT for email or OTP for phone
    if (isEmail) {
      verificationToken = jwt.sign(
        { email: user.email, numericId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      verificationHash = verificationToken;
      verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
    } else {
      const { token, hash } = createOTP();
      verificationToken = token;
      verificationHash = hash;
      verificationExpires = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
    }

    // 4️⃣ Store in DB
    await client.query(
      `UPDATE users SET 
        verification_code_hash = $1, 
        verification_expires = $2
       WHERE id = $3`,
      [verificationHash, verificationExpires, user.id]
    );

    await client.query('COMMIT');

    // 5️⃣ Send email link or SMS OTP
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5175';

    try {
      if (isEmail) {
        const resetLink = `${frontendUrl}/reset-password?token=${verificationToken}`;
        await sendEmail(
          user.email,
          'Reset Your Password',
          `<p>Click here to reset your password:</p><a href="${resetLink}">${resetLink}</a>`
        );
        console.log(`✅ Email sent to ${user.email}`);
      } else {
        await sendSMS(
          user.phone,
          `Your Fasikas password reset OTP is: ${verificationToken}`
        );
        console.log(`✅ SMS OTP sent to ${user.phone}`);
      }
    } catch (deliveryErr) {
      console.error('Notification error:', deliveryErr.message);
      return res.status(500).json({ error: 'Failed to send reset instructions' });
    }

    return res.status(200).json({ message: 'Success', user_id: user.user_id });

  } catch (err) {
    if (client) await client.query('ROLLBACK');
    console.error('🔥 Forgot Password Error:', err.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};

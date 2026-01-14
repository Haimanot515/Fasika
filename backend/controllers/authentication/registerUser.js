const { v4: uuidv4 } = require('uuid');
const pool = require('../../config/dbConfig');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../../config/smsConfig');

exports.registerUser = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      full_name, phone, email, password, role,
      region, zone, woreda, kebele,
      preferred_method, terms_accepted, privacy_accepted,
      platform_rules_accepted, communication_consent
    } = req.body;

    // Validation
    if (!full_name || !phone || !password || !role || !region || !preferred_method) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const normalizedPhone = phone.replace(/\s+/g, '').startsWith('0') 
      ? '+251' + phone.replace(/\s+/g, '').slice(1) 
      : phone.replace(/\s+/g, '');

    await client.query('BEGIN');

    const exists = await client.query(
      `SELECT 1 FROM users WHERE phone = $1 OR email = $2`,
      [normalizedPhone, email || null]
    );

    if (exists.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'Phone or Email already registered' });
    }

    const password_hash = await bcrypt.hash(password, 12);
    
    // 1️⃣ Insert User
    const insertUser = await client.query(
      `INSERT INTO users (
        user_id, full_name, phone, email, password_hash, role,
        account_status, region, zone, woreda, kebele,
        verification_method, verification_attempts,
        terms_accepted, privacy_accepted, platform_rules_accepted,
        communication_consent, general_consented_at,
        consent_ip, consent_user_agent
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,NOW(),$18,$19)
      RETURNING id, user_id`,
      [
        `USR-${uuidv4().substring(0, 8).toUpperCase()}`,
        full_name, normalizedPhone, email || null, password_hash, role,
        'PENDING', region, zone, woreda, kebele,
        preferred_method, 0,
        terms_accepted || false, privacy_accepted || false,
        platform_rules_accepted || false, communication_consent || false,
        req.ip, req.headers['user-agent']
      ]
    );

    const userInternalId = insertUser.rows[0].id;

    // 2️⃣ Generate Token
    const verificationToken = jwt.sign(
      { email, numericId: userInternalId }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    await client.query(
      `UPDATE users SET verification_code_hash = $1, verification_expires = NOW() + INTERVAL '24 hours' WHERE id = $2`,
      [verificationToken, userInternalId]
    );

    await client.query('COMMIT');

    // 3️⃣ Send Verification Link (after commit)
    try {
      // FIX: Normalize to handle 'email', 'Email', or 'EMAIL'
      const method = preferred_method?.toUpperCase();

      if (method === 'EMAIL') {
        if (!email) {
            console.error('❌ Email sending skipped: email address is null');
        } else {
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5175';
            const verificationLink = `${frontendUrl}/verify-email?token=${verificationToken}`;

            await sendEmail(
              email, 
              'Verify Your Account', 
              `<p>Click to verify: <a href="${verificationLink}">${verificationLink}</a></p>`
            );
            
            console.log(`✅ Success! Sent link to ${email}: ${verificationLink}`);
        }
      }
    } catch (e) {
      // FIX: Log the full error so we can see Resend's API response
      console.error('📧 Email Error Details:', e);
    }

    // 4️⃣ SUCCESS RESPONSE
    return res.status(201).json({
      message: 'Success',
      user_id: insertUser.rows[0].user_id
    });

  } catch (err) {
    if (client) await client.query('ROLLBACK');
    console.error('🔥 Register Error:', err.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};

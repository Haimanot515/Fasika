const { v4: uuidv4 } = require('uuid');
const pool = require('../../config/dbConfig');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../../config/smsConfig');
const axios = require('axios'); // Added axios for captcha verification

exports.registerUser = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      full_name, phone, email, password, role,
      region, zone, woreda, kebele,
      preferred_method, terms_accepted, privacy_accepted,
      platform_rules_accepted, communication_consent,
      captchaToken // Received from frontend
    } = req.body;

    // --- RECAPTCHA VERIFICATION START ---
    if (!captchaToken) {
      return res.status(400).json({ error: 'Please complete the security check.' });
    }

    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${captchaToken}`;
    const recaptchaRes = await axios.post(verifyUrl);

    if (!recaptchaRes.data.success) {
      return res.status(400).json({ error: 'Security check failed. Please try again.' });
    }
    // --- RECAPTCHA VERIFICATION END ---

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
      const method = preferred_method?.toUpperCase();

      if (method === 'EMAIL') {
        if (!email) {
          console.error('❌ Email sending skipped: email address is null');
        } else {
          const frontendUrl = process.env.FRONTEND_URL || 'https://fasika-frontend.onrender.com';
          const verificationLink = `${frontendUrl}/verify-email?token=${verificationToken}`;

          const heroImageUrl = 'https://images.unsplash.com/photo-1579603833075-f933441a7b8e?auto=format&fit=crop&w=1200&q=80';

          const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { margin: 0; padding: 0; width: 100% !important; background-color: #020617; font-family: 'Inter', Helvetica, sans-serif; }
                .email-wrapper { background-color: #020617; padding: 40px 20px; }
                .content-box { max-width: 600px; margin: 0 auto; background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; }
                .header-accent { background: linear-gradient(90deg, #064e3b 0%, #10b981 100%); height: 8px; width: 100%; }
                .inner-padding { padding: 40px; }
                .logo-text { color: #10b981; font-size: 22px; font-weight: 800; letter-spacing: 5px; text-align: center; margin-bottom: 25px; }
                .hero-image { width: 100%; height: auto; border-radius: 12px; margin-bottom: 30px; display: block; border: 1px solid #334155; }
                .hero-title { color: #f8fafc; font-size: 28px; font-weight: 800; text-align: center; margin-bottom: 15px; }
                .description { color: #94a3b8; font-size: 15px; line-height: 1.6; text-align: center; margin-bottom: 35px; }
                
                .aau-credit { 
                  background: rgba(16, 185, 129, 0.1); 
                  border: 1px solid rgba(16, 185, 129, 0.2);
                  padding: 20px; 
                  border-radius: 12px; 
                  margin-bottom: 35px; 
                  text-align: center;
                }
                .aau-text { color: #10b981; font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin: 0; }

                .btn-elite { background-color: #10b981; color: #020617 !important; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 15px; display: inline-block; }
                .footer { padding: 30px; text-align: center; color: #475569; font-size: 11px; border-top: 1px solid #1e293b; }
              </style>
            </head>
            <body>
              <div class="email-wrapper">
                <div class="content-box">
                  <div class="header-accent"></div>
                  <div class="inner-padding">
                    <div class="logo-text">🌿 FASIKA</div>
                    
                    <img class="hero-image" src="${heroImageUrl}" alt="Fasika Hub" />

                    <div class="aau-credit">
                      <p class="aau-text"> DEVELOPED BY ADDIS ABABA UNIVERSITY SOFTWARE ENGINEERING STUDENTS</p>
                      <p style="color: #64748b; font-size: 12px; margin-top: 8px; font-weight: 500;">Solving societal problems through technological innovation.</p>
                    </div>

                    <h1 class="hero-title">Verify Your Node</h1>
                    <p class="description">
                      <span style="color: #10b981; font-weight: bold;">Dear ${full_name}</span>,<br/><br/>
                      welcome to the official Fasika Farmers Connect. Your account is ready for activation. Please use the button below to verify your secure access.
                    </p>

                    <div style="text-align: center;">
                      <a href="${verificationLink}" class="btn-elite">ACTIVATE ACCOUNT</a>
                    </div>
                  </div>
                  <div class="footer">
                    FASIKA HUB // ADDIS ABABA UNIVERSITY // 2026

                    Empowering Ethiopian Agriculture through Software Excellence.
                  </div>
                </div>
              </div>
            </body>
            </html>
          `;

          await sendEmail(email, '🔒 Account Verification: Fasika Farmer Conect x AAU', htmlContent);
          console.log(`✅ Success! Verification email with AAU credits sent to ${email}`);
        }
      }
    } catch (e) {
      console.error('📧 Email Error:', e);
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

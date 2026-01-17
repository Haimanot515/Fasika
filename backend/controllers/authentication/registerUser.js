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
   // 3️⃣ Elite Transactional Email with Image (Admin: Haimanot)
try {
  const method = preferred_method?.toUpperCase();

  if (method === 'EMAIL') {
    if (!email) {
      console.error('❌ Email sending skipped: email address is null');
    } else {
      const frontendUrl = process.env.FRONTEND_URL || 'https://fasika-frontend.onrender.com';
      const verificationLink = `${frontendUrl}/verify-email?token=${verificationToken}`;

      // Placeholder image URL - REPLACE WITH YOUR OWN HOSTED IMAGE IF PREFERRED
      const heroImageUrl = 'https://images.unsplash.com/photo-1579603833075-f933441a7b8e?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Fasika Account</title>
          <style>
            /* Reset for Email Clients */
            body { margin: 0; padding: 0; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; background-color: #020617; font-family: 'Inter', -apple-system, sans-serif; }
            img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; display: block; max-width: 100%; } /* Added display: block and max-width */
            table { border-collapse: collapse !important; }
            
            /* Extra-Level Styles */
            .email-wrapper { background-color: #020617; padding: 40px 20px; }
            .content-box { max-width: 600px; margin: 0 auto; background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
            .header-accent { background: linear-gradient(90deg, #064e3b 0%, #10b981 100%); height: 6px; width: 100%; }
            .inner-padding { padding: 48px; }
            .logo-text { color: #10b981; font-size: 24px; font-weight: 800; letter-spacing: 6px; text-transform: uppercase; margin-bottom: 32px; text-align: center; }
            .hero-title { color: #f8fafc; font-size: 32px; font-weight: 800; text-align: center; letter-spacing: -1px; margin-bottom: 16px; line-height: 1.2; }
            .description { color: #94a3b8; font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 40px; }
            
            /* CTA Button */
            .cta-container { text-align: center; margin-bottom: 40px; }
            .btn-elite { background-color: #10b981; color: #020617 !important; padding: 18px 42px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; display: inline-block; transition: transform 0.2s ease; }
            
            /* Image specific styles */
            .hero-image-container { text-align: center; margin-bottom: 40px; }
            .hero-image { width: 100%; height: auto; border-radius: 8px; display: block; }
            
            /* Security Section */
            .security-notice { background-color: #1e293b; padding: 24px; border-radius: 12px; margin-top: 10px; }
            .security-text { color: #64748b; font-size: 13px; line-height: 1.5; margin: 0; }
            
            .footer { padding: 32px; text-align: center; color: #475569; font-size: 12px; letter-spacing: 1px; }
            .highlight { color: #10b981; text-decoration: none; }

            /* Responsive adjustments */
            @media only screen and (max-width: 620px) {
              .inner-padding { padding: 24px; }
              .hero-title { font-size: 26px; }
              .logo-text { font-size: 20px; letter-spacing: 4px; }
              .btn-elite { padding: 14px 30px; font-size: 15px; }
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="content-box">
              <div class="header-accent"></div>
              <div class="inner-padding">
                <div class="logo-text">🌿 FASIKA</div>
                
                <div class="hero-image-container">
                    <img class="hero-image" src="${heroImageUrl}" alt="Fasika Agricultural Dashboard Overview" />
                </div>

                <h1 class="hero-title">Identity Verification</h1>
                <p class="description">
                  Haimanot, a new account has been initiated on the Fasika Farmers Connect platform. To secure the agricultural telemetry node, please authorize this email address.
                </p>
                <div class="cta-container">
                  <a href="${verificationLink}" class="btn-elite">Activate Node</a>
                </div>
                <div class="security-notice">
                  <p class="security-text">
                    <strong>Security Alert:</strong> This link expires in 24 hours. If you did not request this, please ignore this email or contact the Fasika Security Team.
                  </p>
                </div>
              </div>
              <div class="footer">
                CORE PROTOCOL v2.0 // ADDIS ABABA // 2026<br>
                <a href="${frontendUrl}" class="highlight">Go to Dashboard</a>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      await sendEmail(
        email, 
        '🔒 Action Required: Verify Your Fasika Node', 
        htmlContent
      );
      
      console.log(`🚀 ELITE WITH IMAGE: Verification dispatched for ${email}`);
    }
  }
} catch (e) {
  console.error('📧 [SYSTEM ERROR] Dispatch Failure:', e);
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

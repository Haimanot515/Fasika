const { Resend } = require('resend');
const axios = require('axios');

// Initialize Resend with the API Key you added to Render
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends an email using the Resend API (HTTPS)
 * Bypasses Render's SMTP port restrictions.
 */
async function sendEmail(to, subject, html) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Fasika Admin <onboarding@resend.dev>', // Free tier default
      to: [to],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error('❌ Resend API Error:', error);
      throw error;
    }

    console.log(`[EMAIL] Sent successfully via Resend to ${to}. ID: ${data.id}`);
    return data;
  } catch (err) {
    console.error('🔥 Email Helper Failure:', err.message);
    throw err;
  }
}

/**
 * Sends SMS via your local Phone Gateway
 */
async function sendSMS(phone, message) {
  try {
    // Added 5s timeout to prevent server hanging
    await axios.post('http://<PHONE_IP>:8080/send-sms', { phone, message }, { timeout: 5000 });
    console.log(`[DEV SMS] Sent to ${phone}: ${message}`);
  } catch (err) {
    console.error('Failed to send SMS:', err.message);
  }
}

/**
 * Makes Voice Call via your local Phone Gateway
 */
async function sendVoiceCall(phone, otp) {
  try {
    await axios.post('http://<PHONE_IP>:8080/send-voice', { phone, otp }, { timeout: 5000 });
    console.log(`[DEV VOICE] OTP call to ${phone}: ${otp}`);
  } catch (err) {
    console.error('Failed to make voice call:', err.message);
  }
}

module.exports = { sendSMS, sendVoiceCall, sendEmail };

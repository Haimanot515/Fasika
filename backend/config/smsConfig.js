const { Resend } = require('resend');
const axios = require('axios');

// Check API key
if (!process.env.RESEND_API_KEY) {
  console.error('❌ RESEND_API_KEY is missing');
}

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send email using Resend (works on Render)
 */
async function sendEmail(to, subject, html) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Fasika Admin <onboarding@resend.dev>', // Free tier sender
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error('❌ Resend API Error:', error);
      throw error;
    }

    console.log(`✅ Email sent to ${to}. ID: ${data.id}`);
    return data;
  } catch (err) {
    console.error('🔥 Email sending failed:', err);
    throw err;
  }
}

/**
 * DEV ONLY SMS / Voice (won't work on Render)
 */
async function sendSMS(phone, message) {
  try {
    await axios.post('http://<PHONE_IP>:8080/send-sms', { phone, message }, { timeout: 5000 });
    console.log(`[DEV SMS] Sent to ${phone}`);
  } catch (err) {
    console.error('❌ SMS failed:', err.message);
  }
}

async function sendVoiceCall(phone, otp) {
  try {
    await axios.post('http://<PHONE_IP>:8080/send-voice', { phone, otp }, { timeout: 5000 });
    console.log(`[DEV VOICE] OTP call to ${phone}`);
  } catch (err) {
    console.error('❌ Voice call failed:', err.message);
  }
}

module.exports = { sendEmail, sendSMS, sendVoiceCall };

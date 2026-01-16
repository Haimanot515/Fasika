const Brevo = require('@getbrevo/brevo');
const axios = require('axios');

// 1. Initialize Brevo Client
const apiInstance = new Brevo.TransactionalEmailsApi();
const apiKey = apiInstance.authentications['apiKey'];

// Use the API Key from Render Environment Variables
if (!process.env.BREVO_API_KEY) {
  console.error('❌ BREVO_API_KEY is missing');
}
apiKey.apiKey = process.env.BREVO_API_KEY;

/**
 * Send email using Brevo (No custom domain required)
 */
async function sendEmail(to, subject, html) {
  const sendSmtpEmail = new Brevo.SendSmtpEmail();

  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = html;
  
  // Must be the Gmail/Email you verified in Brevo Dashboard
  sendSmtpEmail.sender = { 
    "name": "Fasika Admin", 
    "email": process.env.EMAIL_FROM 
  };
  
  sendSmtpEmail.to = [{ "email": to }];

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`✅ Email sent to ${to}. MessageID: ${data.messageId}`);
    return data;
  } catch (err) {
    console.error('🔥 Brevo Email sending failed:', err);
    throw err;
  }
}

/**
 * DEV ONLY SMS / Voice (Won't work on Render - local network only)
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

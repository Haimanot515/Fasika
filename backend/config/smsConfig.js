const axios = require('axios');
const nodemailer = require('nodemailer');

async function sendSMS(phone, message) {
  try {
    await axios.post('http://<PHONE_IP>:8080/send-sms', { phone, message });
    console.log(`[DEV SMS] Sent to ${phone}: ${message}`);
  } catch (err) {
    console.error('Failed to send SMS:', err.message);
  }
}

async function sendVoiceCall(phone, otp) {
  try {
    await axios.post('http://<PHONE_IP>:8080/send-voice', { phone, otp });
    console.log(`[DEV VOICE] OTP call to ${phone}: ${otp}`);
  } catch (err) {
    console.error('Failed to make voice call:', err.message);
  }
}

async function sendEmail(to, subject, html) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({ from: process.env.SMTP_USER, to, subject, html });
  console.log(`[EMAIL] Sent to ${to}: ${subject}`);
}

module.exports = { sendSMS, sendVoiceCall, sendEmail };

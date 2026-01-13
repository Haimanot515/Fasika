// utils/notificationSender.js
const nodemailer = require('nodemailer');
const { sendSMSViaSIM } = require('./smsSender'); // GSM module integration
const { sendPushNotification } = require('./pushSender'); // FCM integration
const pool = require('../config/dbConfig');

// Send notification to a user via all preferred channels
const sendNotification = async (userId, message) => {
  try {
    // 1. Get user contact preferences from DB
    const { rows } = await pool.query(
      `SELECT phone_number, email, receive_weather_alerts, alert_channels
       FROM users WHERE user_id=$1`,
      [userId]
    );
    if (!rows.length) return;

    const user = rows[0];
    if (!user.receive_weather_alerts) return;

    const channels = user.alert_channels || ['SMS', 'EMAIL', 'APP'];

    // 2. Send via SMS
    if (channels.includes('SMS') && user.phone_number) {
      await sendSMSViaSIM(user.phone_number, message);
    }

    // 3. Send via Email
    if (channels.includes('EMAIL') && user.email) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      await transporter.sendMail({
        from: `"Fasikas Farmer" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: 'Farm Alert',
        text: message
      });
    }

    // 4. Send via Push Notification
    if (channels.includes('APP')) {
      await sendPushNotification(userId, message);
    }

  } catch (err) {
    console.error('sendNotification error:', err);
  }
};

module.exports = { sendNotification };

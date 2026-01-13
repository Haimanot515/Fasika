// utils/pushSender.js
// Firebase Cloud Messaging integration

const admin = require('firebase-admin');

// Initialize once in your app entrypoint
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require('../config/fcmServiceAccount.json'))
  });
}

// Send push notification to a user
const sendPushNotification = async (userId, message) => {
  try {
    // Lookup FCM token from DB
    const pool = require('../config/dbConfig');
    const { rows } = await pool.query(
      `SELECT fcm_token FROM users WHERE user_id=$1`,
      [userId]
    );
    if (!rows.length || !rows[0].fcm_token) return;

    const token = rows[0].fcm_token;

    const payload = {
      notification: {
        title: 'Farm Alert',
        body: message
      }
    };

    await admin.messaging().sendToDevice(token, payload);
    console.log(`Push notification sent to ${userId}`);
  } catch (err) {
    console.error('sendPushNotification error:', err);
  }
};

module.exports = { sendPushNotification };

// cron/buyerCron.js
const cron = require('node-cron');
const pool = require('../config/dbConfig');
const { sendNotification } = require('../utils/notificationSender');

/**
 * 1️⃣ Fetch buyers & their interests
 */
const getBuyersWithPreferences = async () => {
  const { rows } = await pool.query(`
    SELECT u.user_id, u.full_name, u.email, u.phone
    FROM users u
    WHERE u.role = 'Buyer' AND u.account_status = 'Active'
  `);
  return rows;
};

/**
 * 2️⃣ Fetch alerts relevant to buyer
 *    For simplicity, we check crops/farms they follow
 */
const getBuyerRelevantEvents = async (buyerId) => {
  // Example: buyer follows certain farms or crops
  const { rows } = await pool.query(`
    SELECT we.event_id, we.description, we.event_type, we.severity,
           f.farm_name, c.crop_name
    FROM weather_events we
    JOIN farms f ON f.farm_id = we.farm_id
    JOIN crops c ON c.crop_id = we.crop_id
    -- Example join to buyer subscriptions
    JOIN buyer_subscriptions bs ON bs.farm_id = f.farm_id AND bs.buyer_id = $1
    WHERE we.is_notified = FALSE
      AND we.created_at > NOW() - INTERVAL '24 hours'
  `, [buyerId]);

  return rows;
};

/**
 * 3️⃣ Send notifications to buyer
 */
const notifyBuyer = async (buyer) => {
  const events = await getBuyerRelevantEvents(buyer.user_id);

  for (const event of events) {
    const message = `Alert for ${event.crop_name} at ${event.farm_name}: ${event.description}`;

    // Insert notification record
    await pool.query(`
      INSERT INTO notifications (user_id, farm_id, crop_id, title, message, notification_type, severity)
      VALUES ($1,$2,$3,$4,$5,'WEATHER',$6)
    `, [
      buyer.user_id,
      event.farm_id,
      event.crop_id,
      `Buyer Alert: ${event.event_type}`,
      message,
      event.severity
    ]);

    // Send notification (SMS/EMAIL/APP)
    await sendNotification(buyer.user_id, `Buyer Alert: ${event.event_type}`, message);

    // Mark event as notified for buyer
    await pool.query(`
      UPDATE weather_events
      SET is_notified = TRUE
      WHERE event_id = $1
    `, [event.event_id]);
  }
};

/**
 * 4️⃣ Cron schedule
 */
cron.schedule(
  '*/30 * * * *', // every 30 minutes
  async () => {
    console.log('⏱️ Buyer cron started at', new Date());
    try {
      const buyers = await getBuyersWithPreferences();
      for (const buyer of buyers) {
        await notifyBuyer(buyer);
      }
      console.log('⏱️ Buyer cron completed at', new Date());
    } catch (err) {
      console.error('Buyer cron error:', err.message);
    }
  },
  { timezone: 'Africa/Addis_Ababa' }
);

console.log('✅ Buyer cron scheduled (every 30 minutes)');

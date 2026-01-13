// services/cropWeatherService.js
const pool = require('../config/dbConfig');
const { sendNotification } = require('../utils/notificationSender');

/**
 * Evaluate crop weather conditions for farmers
 * - Reads latest weather_data
 * - Applies crop-specific rules
 * - Saves weather_events
 * - Sends notifications (SMS / Email / Push) to farmers only
 */
exports.evaluateCropWeather = async () => {
  try {
    // 1️⃣ Fetch all active crops with farm info
    const { rows: crops } = await pool.query(`
      SELECT
        c.crop_id,
        c.crop_name,
        c.heat_sensitivity,
        c.drought_sensitivity,
        c.wind_sensitivity,
        c.planting_date,
        f.farm_id,
        f.farm_name,
        f.latitude,
        f.longitude,
        f.user_id
      FROM crops c
      JOIN farms f ON f.farm_id = c.farm_id
      WHERE c.is_active = true
        AND f.latitude IS NOT NULL
        AND f.longitude IS NOT NULL
    `);

    for (const crop of crops) {
      // 2️⃣ Get latest weather for farm
      const weatherRes = await pool.query(
        `SELECT *
         FROM weather_data
         WHERE latitude=$1 AND longitude=$2
         ORDER BY recorded_at DESC
         LIMIT 1`,
        [crop.latitude, crop.longitude]
      );

      if (!weatherRes.rowCount) continue;
      const w = weatherRes.rows[0];

      const events = [];

      // 🌡️ Heat stress
      if (w.temperature >= 30 && crop.heat_sensitivity === 'High') {
        events.push({
          type: 'HEAT_STRESS',
          severity: 'HIGH',
          message: `High temperature (${w.temperature}°C) affecting ${crop.crop_name} at ${crop.farm_name}`
        });
      }

      // ❄️ Cold stress
      if (w.temperature <= 5 && crop.heat_sensitivity !== 'Low') {
        events.push({
          type: 'COLD_STRESS',
          severity: 'HIGH',
          message: `Low temperature (${w.temperature}°C) frost risk for ${crop.crop_name}`
        });
      }

      // 🌧️ Drought
      if (w.rainfall < 10 && crop.drought_sensitivity === 'High') {
        events.push({
          type: 'DROUGHT',
          severity: 'HIGH',
          message: `Low rainfall (${w.rainfall}mm) detected for ${crop.crop_name}`
        });
      }

      // 🌬️ Wind stress
      if (w.wind_speed > 40 && crop.wind_sensitivity === 'High') {
        events.push({
          type: 'WIND_STRESS',
          severity: 'MEDIUM',
          message: `Strong wind (${w.wind_speed}km/h) may damage ${crop.crop_name}`
        });
      }

      // 🌱 Crop age advisory
      if (crop.planting_date) {
        const days = Math.floor(
          (Date.now() - new Date(crop.planting_date)) / (1000 * 60 * 60 * 24)
        );
        if (days >= 60) {
          events.push({
            type: 'CROP_STAGE',
            severity: 'INFO',
            message: `${crop.crop_name} has grown for ${days} days. Monitor maturity.`
          });
        }
      }

      // 3️⃣ Persist events + send notifications
      for (const event of events) {
        // Avoid duplicates in last 12 hours
        const dup = await pool.query(
          `SELECT 1 FROM weather_events
           WHERE crop_id=$1 AND event_type=$2
             AND created_at > NOW() - INTERVAL '12 hours'`,
          [crop.crop_id, event.type]
        );
        if (dup.rowCount) continue;

        // Save weather event
        await pool.query(
          `INSERT INTO weather_events
           (event_id, crop_id, event_type, severity, description, created_at)
           VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())`,
          [crop.crop_id, event.type, event.severity, event.message]
        );

        // Save notification record
        await pool.query(
          `INSERT INTO notifications
           (notification_id, user_id, category, message, is_read, created_at)
           VALUES (gen_random_uuid(), $1, 'WEATHER', $2, false, NOW())`,
          [crop.user_id, event.message]
        );

        // Send notification to farmer
        await sendNotification(crop.user_id, event.message);
      }
    }

    console.log('✅ Crop weather evaluation for farmers completed successfully');
  } catch (err) {
    console.error('❌ evaluateCropWeather error:', err);
  }
};

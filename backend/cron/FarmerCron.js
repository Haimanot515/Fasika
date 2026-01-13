// cron/farmerCron.js
const cron = require('node-cron');
const pool = require('../config/dbConfig');
const axios = require('axios');
const { sendNotification } = require('../utils/notificationSender');

/**
 * 1️⃣ Fetch weather for all active farms
 */
const fetchWeatherForFarms = async () => {
  try {
    const { rows: farms } = await pool.query(`
      SELECT farm_id, latitude, longitude, user_id
      FROM farms
      WHERE is_active = TRUE
    `);

    for (const farm of farms) {
      const { latitude, longitude } = farm;

      // Fetch weather from Open-Meteo API
      const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude,
          longitude,
          hourly: 'temperature_2m,relativehumidity_2m,windspeed_10m,precipitation',
          timezone: 'auto'
        }
      });

      const h = response.data.hourly;
      const weather = {
        temperature: h.temperature_2m[0],
        humidity: h.relativehumidity_2m[0],
        rainfall_mm: h.precipitation[0],
        wind_speed_kmh: h.windspeed_10m[0],
        condition: 'N/A'
      };

      // Insert into weather_data
      await pool.query(
        `INSERT INTO weather_data (
          latitude, longitude, temperature, humidity, rainfall, wind_speed, condition
        ) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [
          latitude,
          longitude,
          weather.temperature,
          weather.humidity,
          weather.rainfall_mm,
          weather.wind_speed_kmh,
          weather.condition
        ]
      );
    }

    console.log('✅ Weather data fetched & stored');
  } catch (err) {
    console.error('fetchWeatherForFarms error:', err.message);
  }
};

/**
 * 2️⃣ Evaluate crop weather and create events
 */
const evaluateCropWeather = async () => {
  try {
    const { rows: crops } = await pool.query(`
      SELECT 
        c.crop_id, c.crop_name, c.heat_sensitivity, c.drought_sensitivity, c.wind_sensitivity,
        c.planting_date, f.farm_id, f.farm_name, f.latitude, f.longitude, f.user_id
      FROM crops c
      JOIN farms f ON f.farm_id = c.farm_id
      JOIN users u ON u.user_id = f.user_id
      WHERE c.is_active = TRUE AND u.role = 'Farmer'
    `);

    for (const crop of crops) {
      // Get latest weather for the farm
      const weatherRes = await pool.query(`
        SELECT *
        FROM weather_data
        WHERE latitude = $1 AND longitude = $2
        ORDER BY recorded_at DESC
        LIMIT 1
      `, [crop.latitude, crop.longitude]);

      if (!weatherRes.rowCount) continue;
      const w = weatherRes.rows[0];

      const events = [];

      // Example rules
      if (w.temperature >= 30 && crop.heat_sensitivity === 'High') {
        events.push({
          type: 'HEAT_STRESS',
          severity: 'HIGH',
          message: `High temperature (${w.temperature}°C) affecting ${crop.crop_name} at ${crop.farm_name}`
        });
      }
      if (w.rainfall_mm < 10 && crop.drought_sensitivity === 'High') {
        events.push({
          type: 'DROUGHT',
          severity: 'HIGH',
          message: `Low rainfall (${w.rainfall_mm}mm) detected for ${crop.crop_name}`
        });
      }
      // Add more rules as needed

      // Persist events & send notifications
      for (const event of events) {
        // Avoid duplicates within 12h
        const dup = await pool.query(`
          SELECT 1
          FROM weather_events
          WHERE crop_id=$1 AND event_type=$2 AND created_at > NOW() - INTERVAL '12 hours'
        `, [crop.crop_id, event.type]);

        if (dup.rowCount) continue;

        // Insert event
        await pool.query(`
          INSERT INTO weather_events (
            crop_id, farm_id, user_id, event_type, severity, description,
            temperature, rainfall_mm, humidity, wind_speed_kmh,
            latitude, longitude
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
        `, [
          crop.crop_id,
          crop.farm_id,
          crop.user_id,
          event.type,
          event.severity,
          event.message,
          w.temperature,
          w.rainfall_mm,
          w.humidity,
          w.wind_speed_kmh,
          crop.latitude,
          crop.longitude
        ]);

        // Insert notification
        await pool.query(`
          INSERT INTO notifications (user_id, farm_id, crop_id, title, message, notification_type, severity)
          VALUES ($1,$2,$3,$4,$5,'WEATHER',$6)
        `, [
          crop.user_id,
          crop.farm_id,
          crop.crop_id,
          `Weather Alert: ${event.type}`,
          event.message,
          event.severity
        ]);

        // Send notification to farmer
        await sendNotification(crop.user_id, `Weather Alert: ${event.type}`, event.message);
      }
    }

    console.log('✅ Crop weather evaluation completed');
  } catch (err) {
    console.error('evaluateCropWeather error:', err.message);
  }
};

/**
 * 3️⃣ Cron schedule
 */
cron.schedule(
  '*/30 * * * *', // every 30 minutes
  async () => {
    console.log('⏱️ Farmer cron started at', new Date());
    await fetchWeatherForFarms();
    await evaluateCropWeather();
    console.log('⏱️ Farmer cron completed at', new Date());
  },
  { timezone: 'Africa/Addis_Ababa' }
);

console.log('✅ Farmer cron scheduled (every 30 minutes)');

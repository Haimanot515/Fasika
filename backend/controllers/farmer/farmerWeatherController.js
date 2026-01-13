const axios = require('axios');

// =======================
// Helper: validate lat/lon
// =======================
const validateCoords = (lat, lon) => {
  if (!lat || !lon) return false;
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);
  if (isNaN(latitude) || isNaN(longitude)) return false;
  return { latitude, longitude };
};

// =======================
// Live Weather
// =======================
exports.getLiveWeather = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    const coords = validateCoords(latitude, longitude);
    if (!coords) return res.status(400).json({ message: 'latitude and longitude required' });

    const weatherResp = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: coords.latitude,
        longitude: coords.longitude,
        hourly: 'temperature_2m,humidity_2m,windspeed_10m',
        timezone: 'auto',
      },
    });

    const hourlyData = weatherResp.data.hourly;

    res.json({
      location: { latitude: coords.latitude, longitude: coords.longitude },
      current: {
        temperature: hourlyData.temperature_2m[0],
        humidity: hourlyData.humidity_2m[0],
        wind_speed: hourlyData.windspeed_10m[0],
        condition: 'N/A', // Open-Meteo free plan does not return condition
      },
    });
  } catch (err) {
    console.error('getLiveWeather error:', err.response?.data || err.message);
    res.status(500).json({ message: 'Failed to fetch live weather' });
  }
};

// =======================
// Hourly Weather (Next 48h)
// =======================
exports.getHourlyWeather = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    const coords = validateCoords(latitude, longitude);
    if (!coords) return res.status(400).json({ message: 'latitude and longitude required' });

    const resp = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: coords.latitude,
        longitude: coords.longitude,
        hourly: 'temperature_2m,precipitation',
        timezone: 'auto',
      },
    });

    const hourlyData = resp.data.hourly;
    const hourlyArray = hourlyData.time.slice(0, 48).map((time, i) => ({
      dateTime: time,
      temperature: hourlyData.temperature_2m[i],
      precipitation: hourlyData.precipitation[i],
    }));

    res.json({ location: coords, hourly: hourlyArray });
  } catch (err) {
    console.error('getHourlyWeather error:', err.response?.data || err.message);
    res.status(500).json({ message: 'Hourly forecast failed' });
  }
};

// =======================
// Daily 7-Day Forecast
// =======================
exports.getDailyWeather = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    const coords = validateCoords(latitude, longitude);
    if (!coords) return res.status(400).json({ message: 'latitude and longitude required' });

    const resp = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: coords.latitude,
        longitude: coords.longitude,
        daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum',
        timezone: 'auto',
      },
    });

    const dailyData = resp.data.daily;
    const dailyArray = dailyData.time.map((date, i) => ({
      date,
      maxTemp: dailyData.temperature_2m_max[i],
      minTemp: dailyData.temperature_2m_min[i],
      rainfall: dailyData.precipitation_sum[i],
    }));

    res.json({ location: coords, daily: dailyArray });
  } catch (err) {
    console.error('getDailyWeather error:', err.response?.data || err.message);
    res.status(500).json({ message: 'Daily forecast failed' });
  }
};

// =======================
// Weather Trends (Temp, Rainfall, Wind, Humidity)
// =======================
exports.getWeatherTrends = async (req, res) => {
  try {
    const { latitude, longitude, trendType } = req.query;
    const coords = validateCoords(latitude, longitude);
    if (!coords) return res.status(400).json({ message: 'latitude and longitude required' });

    if (!trendType || !['temp', 'rainfall', 'wind', 'humidity'].includes(trendType)) {
      return res.status(400).json({ message: 'trendType must be one of temp, rainfall, wind, humidity' });
    }

    // Here we could fetch from DB if available, or fallback to Open-Meteo daily
    const resp = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: coords.latitude,
        longitude: coords.longitude,
        daily:
          trendType === 'temp'
            ? 'temperature_2m_max,temperature_2m_min'
            : trendType === 'rainfall'
            ? 'precipitation_sum'
            : trendType === 'humidity'
            ? 'humidity_2m'
            : 'windspeed_10m',
        timezone: 'auto',
      },
    });

    const dailyData = resp.data.daily;
    let trends = [];

    if (trendType === 'temp') {
      trends = dailyData.time.map((date, i) => ({
        date,
        value: ((dailyData.temperature_2m_max[i] + dailyData.temperature_2m_min[i]) / 2).toFixed(2),
      }));
    } else if (trendType === 'rainfall') {
      trends = dailyData.time.map((date, i) => ({
        date,
        value: dailyData.precipitation_sum[i],
      }));
    } else if (trendType === 'humidity') {
      trends = dailyData.time.map((date, i) => ({
        date,
        value: dailyData.humidity_2m[i],
      }));
    } else if (trendType === 'wind') {
      trends = dailyData.time.map((date, i) => ({
        date,
        value: dailyData.windspeed_10m[i],
      }));
    }

    res.json({ location: coords, trends });
  } catch (err) {
    console.error('getWeatherTrends error:', err.response?.data || err.message);
    res.status(500).json({ message: 'Weather trends unavailable' });
  }
};

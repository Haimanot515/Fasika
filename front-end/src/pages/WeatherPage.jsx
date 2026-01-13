import React, { useEffect, useState } from "react";
import axios from "axios";
import "./WeatherPage.css";

const tabs = ["Live", "Hourly", "7-Day", "Trends"];
const trendsOptions = ["temp", "rainfall", "wind", "humidity"];

const WeatherPage = () => {
  const [activeTab, setActiveTab] = useState("Live");
  const [trendType, setTrendType] = useState("temp");
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");

  // 1️⃣ Get GPS location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: parseFloat(position.coords.latitude),
            longitude: parseFloat(position.coords.longitude),
          });
        },
        (err) => {
          console.error(err);
          setError("Please allow location access to see weather.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  }, []);

  // 2️⃣ Fetch weather from Open-Meteo
  useEffect(() => {
    if (!location) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError("");
      try {
        const { latitude, longitude } = location;
        console.log("Fetching weather for coords:", latitude, longitude);

        const url = "https://api.open-meteo.com/v1/forecast";
        let params = { latitude, longitude, timezone: "Africa/Nairobi" };

        // Setup parameters depending on active tab
        if (activeTab === "Live") {
          // Live tab: use current_weather to avoid 400 errors
          params.current_weather = true;
        } else if (activeTab === "Hourly") {
          params.hourly = "temperature_2m,precipitation";
        } else if (activeTab === "7-Day") {
          params.daily = "temperature_2m_max,temperature_2m_min,precipitation_sum";
        } else if (activeTab === "Trends") {
          if (trendType === "temp") params.daily = "temperature_2m_max,temperature_2m_min";
          else if (trendType === "rainfall") params.daily = "precipitation_sum";
          else if (trendType === "humidity") params.hourly = "humidity_2m,time";
          else if (trendType === "wind") params.hourly = "windspeed_10m,time";
        }

        const resp = await axios.get(url, { params });
        const data = resp.data;

        if (!data || Object.keys(data).length === 0) {
          throw new Error("No data returned from API");
        }

        // Transform data for frontend
        if (activeTab === "Live") {
          const current = data.current_weather;
          setWeatherData({
            current: {
              temperature: current?.temperature ?? "N/A",
              wind_speed: current?.windspeed ?? "N/A",
              // humidity is not always provided, fallback to N/A
              humidity: current?.relativehumidity ?? "N/A",
              condition: "N/A",
            },
          });
        } else if (activeTab === "Hourly") {
          const hourlyArray = data.hourly?.time?.map((t, i) => ({
            dateTime: t,
            temperature: data.hourly?.temperature_2m?.[i] ?? "N/A",
            precipitation: data.hourly?.precipitation?.[i] ?? "N/A",
          })) || [];
          setWeatherData({ hourly: hourlyArray });
        } else if (activeTab === "7-Day") {
          const dailyArray = data.daily?.time?.map((date, i) => ({
            date,
            maxTemp: data.daily?.temperature_2m_max?.[i] ?? "N/A",
            minTemp: data.daily?.temperature_2m_min?.[i] ?? "N/A",
            rainfall: data.daily?.precipitation_sum?.[i] ?? "N/A",
          })) || [];
          setWeatherData({ daily: dailyArray });
        } else if (activeTab === "Trends") {
          let trends = [];

          if (trendType === "temp") {
            const time = data.daily?.time || [];
            trends = time.map((d, i) => ({
              date: d,
              value: ((data.daily.temperature_2m_max[i] + data.daily.temperature_2m_min[i]) / 2).toFixed(2),
            }));
          } else if (trendType === "rainfall") {
            const time = data.daily?.time || [];
            trends = time.map((d, i) => ({ date: d, value: data.daily.precipitation_sum[i] }));
          } else if (trendType === "humidity" || trendType === "wind") {
            const hourlyTime = data.hourly?.time || [];
            const hourlyValues = trendType === "humidity" ? data.hourly?.humidity_2m : data.hourly?.windspeed_10m;
            const dailyMap = {};

            hourlyTime.forEach((t, i) => {
              const day = t.split("T")[0];
              if (!dailyMap[day]) dailyMap[day] = [];
              dailyMap[day].push(hourlyValues[i]);
            });

            trends = Object.keys(dailyMap).map((day) => {
              const values = dailyMap[day];
              const avg = values.reduce((a, b) => a + b, 0) / values.length;
              return { date: day, value: avg.toFixed(2) };
            });
          }

          setWeatherData({ trends });
        }
      } catch (err) {
        console.error("Weather fetch error:", err);
        setError("Failed to fetch weather. Check your internet connection and coordinates.");
        setWeatherData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location, activeTab, trendType]);

  // Render tab content
  const renderContent = () => {
    if (!weatherData) return null;

    if (activeTab === "Live") {
      return (
        <div>
          <p><strong>Temperature:</strong> {weatherData.current?.temperature} °C</p>
          <p><strong>Humidity:</strong> {weatherData.current?.humidity} %</p>
          <p><strong>Wind Speed:</strong> {weatherData.current?.wind_speed} m/s</p>
          <p><strong>Condition:</strong> {weatherData.current?.condition}</p>
        </div>
      );
    }

    if (activeTab === "Hourly") {
      return (
        <div className="table-wrapper">
          <table className="weather-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Temp (°C)</th>
                <th>Precipitation (mm)</th>
              </tr>
            </thead>
            <tbody>
              {weatherData.hourly?.map((h, i) => (
                <tr key={i}>
                  <td>{h.dateTime}</td>
                  <td>{h.temperature}</td>
                  <td>{h.precipitation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeTab === "7-Day") {
      return (
        <div className="table-wrapper">
          <table className="weather-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Max Temp</th>
                <th>Min Temp</th>
                <th>Rainfall</th>
              </tr>
            </thead>
            <tbody>
              {weatherData.daily?.map((d, i) => (
                <tr key={i}>
                  <td>{d.date}</td>
                  <td>{d.maxTemp}</td>
                  <td>{d.minTemp}</td>
                  <td>{d.rainfall}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeTab === "Trends") {
      return (
        <div>
          <label>
            Trend Type:{" "}
            <select value={trendType} onChange={(e) => setTrendType(e.target.value)}>
              {trendsOptions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>

          <div className="table-wrapper mt-2">
            <table className="weather-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {weatherData.trends?.map((t, i) => (
                  <tr key={i}>
                    <td>{t.date}</td>
                    <td>{t.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="weather-container">
      <h1 className="weather-title">Weather at Your Location</h1>

      {/* Tabs */}
      <div className="weather-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`weather-tab ${activeTab === tab ? "active" : ""}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Loading / Error / Content */}
      {loading ? (
        <p className="weather-loading">Loading...</p>
      ) : error ? (
        <p className="weather-error">{error}</p>
      ) : (
        renderContent()
      )}
    </div>
  );
};

export default WeatherPage;

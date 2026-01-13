CREATE TABLE weather_forecast (
    id SERIAL PRIMARY KEY,                     -- unique ID for each forecast
    region VARCHAR(100) NOT NULL,             -- region name
    zone VARCHAR(100) NOT NULL,               -- zone name
    woreda VARCHAR(100) NOT NULL,             -- woreda name
    forecast_type VARCHAR(10) NOT NULL,       -- 'daily' or 'weekly'
    date DATE NOT NULL,                        -- date of forecast
    temperature_max NUMERIC(5,2),             -- max temperature
    temperature_min NUMERIC(5,2),             -- min temperature
    rainfall_mm NUMERIC(6,2),                 -- rainfall in mm
    wind_speed NUMERIC(5,2),                  -- wind speed in m/s
    humidity NUMERIC(5,2),                    -- humidity in %
    condition VARCHAR(50)                      -- optional description e.g., 'rainy'
);

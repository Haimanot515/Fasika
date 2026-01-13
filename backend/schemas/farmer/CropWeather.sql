CREATE TABLE crop_weather (
    weather_id VARCHAR(50) PRIMARY KEY,
    crop_id VARCHAR(50) NOT NULL REFERENCES crops(crop_id),
    temperature DECIMAL(5,2),
    rainfall DECIMAL(5,2),
    humidity DECIMAL(5,2),
    alerts JSONB, -- e.g., {"drought": true, "frost": false}
    recorded_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE weather_data (
    weather_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,

    temperature DECIMAL(5,2),
    humidity INTEGER,
    rainfall DECIMAL(6,2),
    wind_speed DECIMAL(5,2),
    condition VARCHAR(50),

    source VARCHAR(20) DEFAULT 'OPENWEATHER',

    recorded_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_weather_location_time
ON weather_data(latitude, longitude, recorded_at DESC);

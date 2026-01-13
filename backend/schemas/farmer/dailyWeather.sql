CREATE TABLE daily_weather (
    weather_id UUID PRIMARY KEY,

    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),

    date DATE NOT NULL,

    temperature_c DECIMAL(4,1),
    rainfall_mm DECIMAL(6,2),
    wind_speed_kmh INT,

    source VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE (latitude, longitude, date)
);

CREATE TABLE weather_snapshots (
    snapshot_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    weather_location_id UUID NOT NULL
        REFERENCES weather_locations(weather_location_id)
        ON DELETE CASCADE,

    snapshot_type VARCHAR(20) CHECK (
        snapshot_type IN ('CURRENT', 'DAILY')
    ) NOT NULL,

    snapshot_date DATE NOT NULL,

    temp_min DECIMAL(5,2),
    temp_max DECIMAL(5,2),
    temp_avg DECIMAL(5,2),

    rainfall_mm DECIMAL(6,2),
    humidity_percent DECIMAL(5,2),

    wind_speed_mps DECIMAL(5,2),
    wind_direction_deg DECIMAL(5,2),

    pressure_hpa DECIMAL(6,2),
    cloud_cover_percent DECIMAL(5,2),

    evapotranspiration_mm DECIMAL(6,2),

    heat_stress_flag BOOLEAN DEFAULT FALSE,
    drought_flag BOOLEAN DEFAULT FALSE,
    heavy_rain_flag BOOLEAN DEFAULT FALSE,

    fetched_at TIMESTAMP DEFAULT NOW(),

    UNIQUE (weather_location_id, snapshot_type, snapshot_date)
);

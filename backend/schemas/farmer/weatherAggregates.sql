CREATE TABLE weather_aggregates (
    aggregate_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    weather_location_id UUID NOT NULL
        REFERENCES weather_locations(weather_location_id)
        ON DELETE CASCADE,

    period_days INT CHECK (period_days IN (7, 14, 30)) NOT NULL,

    avg_temp DECIMAL(5,2),
    total_rainfall_mm DECIMAL(6,2),
    avg_humidity DECIMAL(5,2),
    avg_wind_speed_mps DECIMAL(5,2),

    drought_risk VARCHAR(20) CHECK (
        drought_risk IN ('LOW', 'MEDIUM', 'HIGH')
    ),

    heat_risk VARCHAR(20) CHECK (
        heat_risk IN ('LOW', 'MEDIUM', 'HIGH')
    ),

    calculated_at TIMESTAMP DEFAULT NOW(),

    UNIQUE (weather_location_id, period_days)
);

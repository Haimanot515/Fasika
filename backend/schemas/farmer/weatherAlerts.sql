CREATE TABLE weather_alerts (
    alert_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    weather_location_id UUID NOT NULL
        REFERENCES weather_locations(weather_location_id)
        ON DELETE CASCADE,

    alert_type VARCHAR(50), 
    severity VARCHAR(20) CHECK (
        severity IN ('INFO', 'WARNING', 'CRITICAL')
    ),

    title VARCHAR(150),
    message TEXT NOT NULL,

    valid_from TIMESTAMP NOT NULL,
    valid_to TIMESTAMP,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT NOW()
);

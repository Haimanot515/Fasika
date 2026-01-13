CREATE TABLE weather_fetch_logs (
    fetch_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    weather_location_id UUID
        REFERENCES weather_locations(weather_location_id),

    fetch_type VARCHAR(20) CHECK (
        fetch_type IN ('SCHEDULED', 'ON_DEMAND')
    ),

    provider VARCHAR(50),
    status VARCHAR(20),
    response_time_ms INT,

    fetched_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE weather_events (
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relations
    crop_id UUID NOT NULL REFERENCES crops(crop_id) ON DELETE CASCADE,
    farm_id UUID REFERENCES farms(farm_id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    season_id INT REFERENCES seasons(season_id), -- optional

    -- Event classification
    event_type VARCHAR(50) NOT NULL, -- HEAT_STRESS / COLD_STRESS / DROUGHT / WIND_STRESS / CROP_STAGE
    severity VARCHAR(20) CHECK (severity IN ('INFO', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL')) NOT NULL,

    -- Description for farmer
    description TEXT NOT NULL,

    -- Weather snapshot (store for history)
    temperature NUMERIC(5,2),
    rainfall_mm NUMERIC(6,2),
    humidity NUMERIC(5,2),
    wind_speed_kmh NUMERIC(5,2),

    -- Location snapshot (do NOT rely on joins later)
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),

    -- Notification & status
    is_read BOOLEAN DEFAULT FALSE,
    is_notified BOOLEAN DEFAULT FALSE,
    notification_channel VARCHAR(20), -- SMS | APP | USSD | VOICE

    -- Timing
    detected_at TIMESTAMP DEFAULT NOW(),
    resolved BOOLEAN DEFAULT FALSE,
    event_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE notifications (
    notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    /* =========================
       OWNERSHIP & CONTEXT
       ========================= */
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

    farm_id UUID REFERENCES farms(farm_id) ON DELETE SET NULL,
    crop_id UUID REFERENCES crops(crop_id) ON DELETE SET NULL,
    location_id UUID REFERENCES user_locations(location_id) ON DELETE SET NULL,

    /* =========================
       CONTENT
       ========================= */
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,

    /* =========================
       CLASSIFICATION
       ========================= */
    notification_type VARCHAR(50) NOT NULL,
    -- WEATHER | ADVISORY | SEASON | MARKET | SYSTEM | ADMIN

    severity VARCHAR(20) DEFAULT 'INFO',
    -- INFO | WARNING | CRITICAL

    /* =========================
       TRIGGER & TRACEABILITY
       ========================= */
    trigger_source VARCHAR(50),
    -- RULE_ENGINE | WEATHER_ENGINE | SEASON_ENGINE | ADMIN | MANUAL

    trigger_rule_code VARCHAR(100),
    -- e.g. HIGH_TEMP_LOW_RAIN_MAIZE

    trigger_weather_snapshot JSONB,
    -- stores weather data at trigger time:
    -- { temp, rainfall, wind, humidity }

    trigger_crop_stage VARCHAR(50),
    -- Seedling / Vegetative / Flowering / Maturity

    /* =========================
       DELIVERY & CHANNELS
       ========================= */
    delivery_channels TEXT[] DEFAULT ARRAY['APP'],
    -- APP | SMS | EMAIL | USSD | PUSH

    is_sent BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP,

    /* =========================
       USER INTERACTION
       ========================= */
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,

    is_archived BOOLEAN DEFAULT FALSE,
    archived_at TIMESTAMP,

    user_action VARCHAR(50),
    -- ACKNOWLEDGED | DISMISSED | ACTED

    /* =========================
       SCHEDULING
       ========================= */
    scheduled_for TIMESTAMP,
    -- for future notifications (season start, planting time)

    expires_at TIMESTAMP,
    -- auto-hide after relevance ends

    /* =========================
       SYSTEM & AUDIT
       ========================= */
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE notifications (
    notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(50), -- Crop / Farm / Livestock / Advisory weather marecket system
    severity VARCHAR(20) DEFAULT 'INFO', -- INFO / WARNING / CRITICAL
    is_read BOOLEAN DEFAULT FALSE,
    send_channels VARCHAR(50) DEFAULT 'APP', -- APP / SMS / EMAIL
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_locations (
    location_id UUID PRIMARY KEY,

    user_id UUID NOT NULL
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    -- Administrative location (human-readable)
    country VARCHAR(50) DEFAULT 'Ethiopia',
    region VARCHAR(50) NOT NULL,
    zone VARCHAR(50),
    woreda VARCHAR(50) NOT NULL,
    kebele VARCHAR(50),

    -- GPS & geospatial data (weather engine input)
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6) ,
    altitude_m DECIMAL(8,2),                -- Improves temperature & rainfall models

    -- Location accuracy & source
    gps_accuracy_m DECIMAL(6,2),             -- Accuracy radius in meters
    location_source VARCHAR(30),             -- GPS / NETWORK / MANUAL
    is_verified BOOLEAN DEFAULT FALSE,        -- Admin or system verified

    -- Role of location
    location_type VARCHAR(30) DEFAULT 'USER', -- USER / FARM / MARKET / STORAGE
    is_primary BOOLEAN DEFAULT FALSE,         -- Only one primary per user

    -- Weather & advisory control
    weather_zone_code VARCHAR(50),            -- External weather provider mapping
    agro_ecological_zone VARCHAR(50),         -- AEZ classification

    -- Lifecycle & history
    is_active BOOLEAN DEFAULT TRUE,            -- Soft delete / archive
    valid_from TIMESTAMP DEFAULT NOW(),
    valid_to TIMESTAMP,

    -- System metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT one_primary_location_per_user
        UNIQUE (user_id, is_primary)
);

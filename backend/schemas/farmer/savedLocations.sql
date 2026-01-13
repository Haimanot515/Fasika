CREATE TABLE saved_locations (
    location_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    -- Friendly name chosen by user (Home, Farm, Field A, Addis Office, etc.)
    location_name VARCHAR(50) NOT NULL,

    -- Category helps backend logic (HOME, FARM, REGION, MARKET, OTHER)
    location_type VARCHAR(20) NOT NULL
        CHECK (location_type IN ('HOME', 'FARM', 'REGION', 'MARKET', 'OTHER')),

    -- Optional regional hierarchy (important for Ethiopia)
    region VARCHAR(50),
    zone VARCHAR(50),
    woreda VARCHAR(50),
    kebele VARCHAR(50),

    -- GPS (nullable for USSD/manual locations)
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),

    -- Used to resolve "most recent HOME"
    is_default BOOLEAN DEFAULT FALSE,

    -- Soft delete (important for audit & recovery)
    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

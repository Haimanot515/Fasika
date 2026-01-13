CREATE TABLE farms (
    farm_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL REFERENCES users(user_id),

    -- Basic farm identity
    farm_name VARCHAR(100) NOT NULL,
    description TEXT,

    -- Location (GPS FIRST – critical for weather)
    latitude DECIMAL(10,7) NOT NULL,
    longitude DECIMAL(10,7) NOT NULL,
    altitude_m DECIMAL(6,2),          -- Improves weather accuracy

    -- Administrative location (human-readable)
    region VARCHAR(50) NOT NULL,
    zone VARCHAR(50),
    woreda VARCHAR(50) NOT NULL,
    kebele VARCHAR(50),

    -- Physical farm characteristics
    size_hectares DECIMAL(10,2) NOT NULL,
    soil_type VARCHAR(50),            -- Clay / Sandy / Loam
    soil_ph DECIMAL(4,2),             -- Optional future use
    soil_fertility_level VARCHAR(20), -- Low / Medium / High

    -- Water & irrigation
    irrigation_type VARCHAR(50),      -- Rain-fed / Irrigated / Mixed
    water_source VARCHAR(50),          -- River / Well / Rain / Borehole
    has_water_storage BOOLEAN DEFAULT FALSE,

    -- Climate & risk metadata
    flood_risk_level VARCHAR(20),      -- Low / Medium / High
    drought_risk_level VARCHAR(20),    -- Low / Medium / High
    erosion_risk BOOLEAN DEFAULT FALSE,

    -- Farm operational status
    is_active BOOLEAN DEFAULT TRUE,
    is_primary BOOLEAN DEFAULT FALSE,  -- Farmer’s main farm
    visibility BOOLEAN DEFAULT TRUE,   -- Public for buyers or not

    -- System & audit fields
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

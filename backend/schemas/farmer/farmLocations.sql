-- ==========================================
-- Table: farm_locations
-- Description: Stores historical or alternate locations for farms
-- ==========================================
CREATE TABLE farm_locations (
    id SERIAL PRIMARY KEY,                        -- Internal unique ID
    farm_id UUID REFERENCES farms(farm_id) ON DELETE CASCADE,  
    -- Links to the farm

    latitude NUMERIC(9,6),                        -- Optional GPS/manual coordinate
    longitude NUMERIC(9,6),                       -- Optional GPS/manual coordinate
    region VARCHAR(50),                            -- Dropdown region
    zone VARCHAR(50),
    woreda VARCHAR(50),
    kebele VARCHAR(50),
    location_method VARCHAR(10),                  -- 'REGION', 'GPS', 'MANUAL', 'HISTORY', 'RADIUS'

    radius_meters INT DEFAULT 0,                  -- Optional radius for distance-based farms
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

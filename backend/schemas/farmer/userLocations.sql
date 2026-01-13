CREATE TABLE user_locations (
    location_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    location_name VARCHAR(100),
    location_type VARCHAR(50), -- HOME / FARM / OTHER
    region VARCHAR(50) NOT NULL,
    zone VARCHAR(50),
    woreda VARCHAR(50) NOT NULL,
    kebele VARCHAR(50),
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    altitude_m DECIMAL(6,2),
    is_primary BOOLEAN DEFAULT TRUE,
    created_from VARCHAR(20) DEFAULT 'MANUAL', -- GPS / MANUAL
    created_at TIMESTAMP DEFAULT NOW()
);

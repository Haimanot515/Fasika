CREATE TABLE user_locations (
    location_id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,

    location_name VARCHAR(100),  -- "Home Village", "Arada", "Temporary Work"
    location_type VARCHAR(30),   -- HOME | VILLAGE | TEMPORARY | CUSTOM

    region VARCHAR(50) NOT NULL,
    zone VARCHAR(50),
    woreda VARCHAR(50),
    kebele VARCHAR(50),

    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    altitude_m DECIMAL(6,2),

    is_primary BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,

    created_from VARCHAR(20) DEFAULT 'GPS', -- GPS | MANUAL
    created_at TIMESTAMP DEFAULT NOW()
);

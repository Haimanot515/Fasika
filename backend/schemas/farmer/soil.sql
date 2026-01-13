CREATE TABLE soils (
    soil_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID NOT NULL,
    land_id UUID NOT NULL,
    test_results TEXT,           -- Stores soil test results, can be JSON or plain text
    type VARCHAR(100),           -- e.g., "loamy", "sandy", "clay"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optional indexes for faster queries
CREATE INDEX idx_soils_farmer_id ON soils(farmer_id);
CREATE INDEX idx_soils_land_id ON soils(land_id);
CREATE INDEX idx_soils_created_at ON soils(created_at DESC);

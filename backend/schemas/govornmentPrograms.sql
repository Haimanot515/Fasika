CREATE TABLE gov_programs (
    program_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    eligibility TEXT,
    region VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_programs_region ON gov_programs(region);
CREATE INDEX idx_programs_created_at ON gov_programs(created_at DESC);

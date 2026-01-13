CREATE TABLE advisories (
    advisory_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,                  -- Advisory title
    advisory_type VARCHAR(50) NOT NULL,          -- 'crop', 'animal', 'soil', 'market', etc.
    content TEXT NOT NULL,                        -- Advisory content/details
    urgency VARCHAR(10) NOT NULL,                -- 'LOW', 'MEDIUM', 'HIGH'
    region VARCHAR(100),                          -- Region name (optional)
    zone VARCHAR(100),                            -- Zone name (optional)
    woreda VARCHAR(100),                          -- Woreda name (optional)
    kebele VARCHAR(100),                          -- Kebele name (optional)
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITHOUT TIME ZONE          -- For soft delete
);

CREATE TABLE region_zone_woreda (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

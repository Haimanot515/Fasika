CREATE TABLE extension_officers (
    officer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    region VARCHAR(100),
    zone VARCHAR(100),
    woreda VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_officers_region ON extension_officers(region);
CREATE INDEX idx_officers_zone ON extension_officers(zone);
CREATE INDEX idx_officers_woreda ON extension_officers(woreda);

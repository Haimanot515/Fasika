CREATE TABLE buyer_addresses (
    address_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID NOT NULL,
    label VARCHAR(50),              -- Home, Warehouse, Office
    region VARCHAR(50),
    zone VARCHAR(50),
    woreda VARCHAR(50),
    kebele VARCHAR(50),
    street TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

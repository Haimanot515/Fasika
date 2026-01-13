CREATE TABLE products (
    product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE, -- can be farmer
    farm_id UUID REFERENCES farms(farm_id), -- optional, for traceability
    crop_id UUID REFERENCES crops(crop_id), -- optional, link to crop
    product_name VARCHAR(100) NOT NULL,
    description TEXT,
    quantity DECIMAL(10,2),        -- kg, tons, etc.
    price_per_unit DECIMAL(10,2),
    currency VARCHAR(10) DEFAULT 'ETB',
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

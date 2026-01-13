CREATE TABLE market_info (
    market_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(product_id),
    region VARCHAR(50),
    zone VARCHAR(50),
    average_price DECIMAL(10,2),
    min_price DECIMAL(10,2),
    max_price DECIMAL(10,2),
    currency VARCHAR(10) DEFAULT 'ETB',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Market Data Table
CREATE TABLE market_data (
    market_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Link to product
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,

    -- Location info
    region VARCHAR(50),    -- e.g., Oromia, Amhara
    zone VARCHAR(50),      -- sub-region / zone
    woreda VARCHAR(50),    -- optional fine-grained location

    -- Price stats
    avg_price NUMERIC(10,2),
    min_price NUMERIC(10,2),
    max_price NUMERIC(10,2),
    currency VARCHAR(10) DEFAULT 'ETB',

    -- Stock and quality
    stock INT DEFAULT 0,
    freshness_grade VARCHAR(20), -- e.g., Fresh, 1 day, 3 days

    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE market_data IS
'Stores market-level product pricing, stock, freshness, and regional info, fully Ethiopia-localized.';

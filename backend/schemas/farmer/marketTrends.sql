CREATE TABLE market_trends (
    trend_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_name VARCHAR(100),
    region VARCHAR(50),
    average_price NUMERIC,
    unit VARCHAR(20),
    recorded_at TIMESTAMP DEFAULT NOW()
);

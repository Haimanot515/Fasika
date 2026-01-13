CREATE TABLE risk_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50),          -- Delay, Low Stock, Logistic
    region VARCHAR(50),
    message TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

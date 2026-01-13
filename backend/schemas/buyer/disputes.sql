CREATE TABLE disputes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id),
    user_id UUID REFERENCES users(id),
    type VARCHAR(50),         -- Delay, Damaged, Missing, Payment Issue
    description TEXT,
    evidence TEXT[],           -- array of media URLs
    status VARCHAR(20) DEFAULT 'OPEN', -- OPEN, RESOLVED
    resolution TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE buyer_activity_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID,
    action VARCHAR(100),      -- LOGIN, CHECKOUT, PAYMENT, REVIEW
    metadata JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

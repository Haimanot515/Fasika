CREATE TABLE audit_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    method VARCHAR(50),  -- e.g., WEATHER, MANUAL, SYSTEM
    created_at TIMESTAMP DEFAULT NOW()
);

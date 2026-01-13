CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    refresh_token_hash TEXT NOT NULL UNIQUE,
    ip_address VARCHAR(50),
    user_agent TEXT,
    device_name VARCHAR(100),           -- Optional friendly name
    alert_sent BOOLEAN DEFAULT FALSE,   -- Prevent multiple new device notifications
    is_revoked BOOLEAN DEFAULT FALSE,   -- Revoked when user logs out or admin terminates
    last_used_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP                -- Optional auto-expire refresh tokens
);

-- Indexes for performance
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_last_used_at ON user_sessions(last_used_at);

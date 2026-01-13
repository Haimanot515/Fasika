CREATE TABLE user_consents (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    consent_type consent_type_enum NOT NULL,
    accepted BOOLEAN NOT NULL,
    ip_address VARCHAR(64),
    user_agent TEXT,
    accepted_at TIMESTAMP DEFAULT NOW()
);

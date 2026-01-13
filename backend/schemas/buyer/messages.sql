CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id),
    message TEXT,
    media TEXT[],      -- array of URLs
    created_at TIMESTAMP DEFAULT NOW()
);

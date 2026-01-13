CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),       -- Buyer
    participant_id UUID REFERENCES users(id),-- Seller/Admin
    last_message TEXT,
    updated_at TIMESTAMP DEFAULT NOW()
);


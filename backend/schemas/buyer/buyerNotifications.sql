-- Unified Buyer Notifications Table
CREATE TABLE buyer_notifications (
    notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Link to buyer_profiles (not generic users)
    buyer_id UUID NOT NULL REFERENCES buyer_profiles(buyer_profile_id) ON DELETE CASCADE,

    -- Notification content
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,

    -- Classification
    category VARCHAR(50),           -- Product / Market / Order / General
    severity VARCHAR(20) DEFAULT 'INFO', -- INFO / WARNING / CRITICAL
    send_channels VARCHAR(50) DEFAULT 'APP', -- APP / SMS / EMAIL

    -- Status
    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE buyer_notifications IS 
'Stores notifications specifically for buyers, linked to buyer_profiles, with category, severity, channels, and read status.';

-- Optional: Generic Notifications Table for all users (buyers + farmers + admins)
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50),       -- Order, Price Alert, System, Freshness, Dispute
    message TEXT,
    link TEXT,              -- deep link to product/order/dispute
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE notifications IS 
'Generic notification table for all users, can include buyers, farmers, and admins.';

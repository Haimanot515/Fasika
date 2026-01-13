CREATE TABLE order_timelines (
    timeline_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(order_id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL,       -- PENDING, SHIPPED, DELIVERED
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

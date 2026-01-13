CREATE TABLE order_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(50),        -- Packed, Shipped, Out for Delivery, Delivered
    location VARCHAR(100),
    timestamp TIMESTAMP DEFAULT NOW()
);

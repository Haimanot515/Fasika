CREATE TABLE orders (
    order_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- unique order ID
    buyer_id UUID NOT NULL REFERENCES users(user_id),     -- who placed the order
    total_amount NUMERIC(10,2) NOT NULL,                 -- total order amount
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',       -- PENDING, PAID, SHIPPED, CANCELLED
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),       -- when order was placed
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()        -- last update timestamp
);

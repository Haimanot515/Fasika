CREATE TABLE escrow_accounts (
    escrow_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(order_id),
    buyer_id UUID,
    seller_id UUID,
    amount NUMERIC(15,2),
    status VARCHAR(30),          -- HELD / RELEASED / REFUNDED
    released_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

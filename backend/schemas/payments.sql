CREATE TABLE payments (
    payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(order_id),
    buyer_id UUID NOT NULL,
    amount NUMERIC(15,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'ETB',
    payment_method VARCHAR(30),       -- TELEBIRR / CBE / CHAPA / CASH
    payment_status VARCHAR(30),       -- Pending / Success / Failed
    transaction_reference VARCHAR(100),
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE transactions (
    transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Parties involved
    farmer_id UUID NOT NULL,
    buyer_id UUID NOT NULL,

    -- Transaction details
    amount NUMERIC(12,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'ETB',
    payment_method VARCHAR(50), -- e.g., mobile money, bank, cash
    product_category VARCHAR(100),
    product_id UUID, -- optional link to product listing if needed

    -- Status and timestamps
    status VARCHAR(20) NOT NULL DEFAULT 'Pending', -- Pending, Completed, Failed, Cancelled, Refunded, Archived
    refund_reason TEXT,
    refunded_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE, -- soft-delete timestamp

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for faster querying
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_farmer ON transactions(farmer_id);
CREATE INDEX idx_transactions_buyer ON transactions(buyer_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);

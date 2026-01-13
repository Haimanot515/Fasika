CREATE TABLE buyer_search_history (
    search_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID,
    search_term TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

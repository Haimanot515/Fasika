-- Buyer Favorites / Watchlist Table
CREATE TABLE buyer_favorites (
    favorite_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Link to buyer_profiles
    buyer_id UUID NOT NULL REFERENCES buyer_profiles(buyer_profile_id) ON DELETE CASCADE,

    -- Product being tracked
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,

    -- Optional: Track seller if needed
    seller_id UUID REFERENCES users(id) ON DELETE SET NULL,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE buyer_favorites IS 
'Stores buyer-specific favorite products or watchlist items, optionally tracking the seller, linked to buyer_profiles and products.';

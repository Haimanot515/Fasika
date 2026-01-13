CREATE TABLE buyer_interests (
  interest_id UUID PRIMARY KEY,
  buyer_profile_id UUID REFERENCES buyer_profiles(buyer_profile_id) ON DELETE CASCADE,
  product_name VARCHAR(50) NOT NULL,
  quantity_needed DECIMAL(10,2),
  preferred_unit VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

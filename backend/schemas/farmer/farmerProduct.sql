CREATE TABLE farmer_products (
    product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID REFERENCES farmer_profiles(farmer_profile_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    quantity INT NOT NULL,
    unit VARCHAR(20),
    price_per_unit NUMERIC(12,2) NOT NULL,
    description TEXT,
    images TEXT[], -- array of image URLs
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

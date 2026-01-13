CREATE TABLE sales (
  sale_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES farmer_products(product_id) ON DELETE CASCADE,
  quantity INT NOT NULL,
  buyer_id UUID REFERENCES users(user_id),
  sale_date TIMESTAMP DEFAULT NOW()
);

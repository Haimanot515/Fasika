CREATE TABLE livestock (
    livestock_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50),           -- Cattle / Sheep / Goat / Chicken
    breed VARCHAR(50),
    count INT DEFAULT 0,
    age_months INT,
    health_status VARCHAR(50),  -- Healthy / Sick
    description TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

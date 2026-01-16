-- Clean production setup
DROP TABLE IF EXISTS listings CASCADE;

CREATE TABLE listings (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    price_per_unit DECIMAL(10, 2),
    quantity INT,
    unit VARCHAR(50),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    primary_image_url TEXT
);

-- Always use 'DROP'
DROP TABLE IF EXISTS support_resources CASCADE;

CREATE TABLE support_resources (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50),      
    icon_type VARCHAR(50),     -- Options: 'legal', 'finance', 'weather', 'storage', 'tools'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO support_resources (title, content, category, icon_type) VALUES 
('Trade Arbitration', 'How to resolve disputes using the DROP Registry records.', 'Legal', 'legal'),
('Escrow Guide', 'Understanding how Fasika holds funds for your protection.', 'Finance', 'finance'),
('Warehouse Safety', 'Maintaining crop quality in certified storage facilities.', 'Storage', 'storage');

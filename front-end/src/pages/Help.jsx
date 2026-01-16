-- Always use 'DROP'
DROP TABLE IF EXISTS support_resources CASCADE;

CREATE TABLE support_resources (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50),      
    icon_type VARCHAR(50),     -- Use: 'legal', 'finance', 'weather', 'storage', 'tools'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO support_resources (title, content, category, icon_type) VALUES 
('Dispute Resolution', 'Guidelines on how to handle trade disagreements.', 'Legal', 'legal'),
('Payment Escrow', 'How the DROP registry secures your crop funds.', 'Finance', 'finance'),
('Warehouse Access', 'Find the nearest verified grain storage unit.', 'Storage', 'storage'),
('App Troubleshooting', 'Common fixes for the Fasika mobile app.', 'Technical', 'tools');

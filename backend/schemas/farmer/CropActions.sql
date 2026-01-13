CREATE TABLE crop_actions (
    action_id VARCHAR(50) PRIMARY KEY,
    crop_id VARCHAR(50) NOT NULL REFERENCES crops(crop_id),
    action_type VARCHAR(50), -- Irrigation, Fertilization, Pest Control, Harvest
    description TEXT,
    scheduled_date TIMESTAMP,
    status VARCHAR(20) DEFAULT 'Pending', -- Pending, Completed, Overdue
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

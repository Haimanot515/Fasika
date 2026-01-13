CREATE TABLE alerts (
    alert_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL REFERENCES users(user_id),
    farm_id VARCHAR(50) REFERENCES farms(farm_id),
    crop_id VARCHAR(50) REFERENCES crops(crop_id),
    alert_type VARCHAR(50), -- Weather, Action, Growth Stage
    message TEXT NOT NULL,
    alert_date TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'Unread' -- Unread, Read
);

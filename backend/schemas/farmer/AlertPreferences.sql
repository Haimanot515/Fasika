CREATE TABLE alert_preferences (
  preference_id UUID PRIMARY KEY,
  user_id UUID UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
  alert_channels TEXT[] NOT NULL, -- SMS, APP, EMAIL
  weather_alerts BOOLEAN DEFAULT TRUE,
  market_alerts BOOLEAN DEFAULT TRUE,
  advisory_alerts BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE farmer_location_context (
  context_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Owner of the active location context
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

  -- Active context type
  -- HOME | MANUAL | LIVE_GPS | FARM | EVENT
  context_type VARCHAR(20) NOT NULL DEFAULT 'HOME',

  -- Used when context_type = FARM
  farm_id UUID REFERENCES farms(farm_id) ON DELETE SET NULL,

  -- Used when context_type = MANUAL
  location_id UUID REFERENCES user_locations(location_id) ON DELETE SET NULL,

  -- Used when context_type = EVENT (weather alert, advisory, disaster)
  event_location_id UUID NULL,

  -- True only when LIVE_GPS is active
  is_live_gps BOOLEAN DEFAULT false,

  -- Last time the context was updated
  last_updated TIMESTAMP DEFAULT NOW(),

  -- Enforce only one active context per user
  CONSTRAINT unique_user_location_context UNIQUE (user_id)
);

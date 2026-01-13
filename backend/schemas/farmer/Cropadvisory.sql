CREATE TABLE advisories (
    advisory_id SERIAL PRIMARY KEY,

    crop_category       VARCHAR(50),
    event_type          VARCHAR(50),
    season_id           INT REFERENCES seasons(season_id),

    title               VARCHAR(100),
    advice              TEXT NOT NULL,

    urgency             VARCHAR(20),

    region              VARCHAR(50),   -- Optional, can target specific zones
    recommended_action  TEXT,

    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW()
);

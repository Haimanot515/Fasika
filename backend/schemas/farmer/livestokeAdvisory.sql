CREATE TABLE animal_advisories (
    advisory_id        SERIAL PRIMARY KEY,

    species_category   VARCHAR(50) NOT NULL,   -- e.g. 'Cattle', 'Goats', 'Sheep', 'Poultry'
    event_type         VARCHAR(50),            -- e.g. 'Disease Outbreak', 'Feed Shortage', 'Market Alert'
    season_id          INT REFERENCES seasons(season_id),

    title              VARCHAR(100) NOT NULL,  -- Short headline for the advisory
    advice             TEXT NOT NULL,          -- Detailed guidance for farmers

    urgency            VARCHAR(20) CHECK (urgency IN ('LOW','MEDIUM','HIGH')),

    region             VARCHAR(50),            -- Optional: target specific region
    zone               VARCHAR(50),            -- Optional: target specific zone
    woreda             VARCHAR(50),            -- Optional: target specific woreda
    kebele             VARCHAR(50),            -- Optional: target specific kebele

    recommended_action TEXT,                   -- Practical steps for farmers

    created_at         TIMESTAMP DEFAULT NOW(),
    updated_at         TIMESTAMP DEFAULT NOW()
);

CREATE TABLE market_advisories (
    advisory_id        SERIAL PRIMARY KEY,

    commodity_category VARCHAR(50) NOT NULL,   -- e.g. 'Maize', 'Wheat', 'Coffee', 'Livestock'
    event_type         VARCHAR(50),            -- e.g. 'Price Alert', 'Buyer Demand', 'Export Update'
    season_id          INT REFERENCES seasons(season_id),

    title              VARCHAR(100) NOT NULL,  -- Short headline for the advisory
    advice             TEXT NOT NULL,          -- Detailed market guidance

    urgency            VARCHAR(20) CHECK (urgency IN ('LOW','MEDIUM','HIGH')),

    region             VARCHAR(50),            -- Optional: target specific region
    zone               VARCHAR(50),            -- Optional: target specific zone
    woreda             VARCHAR(50),            -- Optional: target specific woreda
    kebele             VARCHAR(50),            -- Optional: target specific kebele

    recommended_action TEXT,                   -- Practical steps for farmers/traders

    created_at         TIMESTAMP DEFAULT NOW(),
    updated_at         TIMESTAMP DEFAULT NOW()
);

CREATE TABLE crops (
    crop_id VARCHAR(50) PRIMARY KEY,
    farm_id VARCHAR(50) NOT NULL REFERENCES farms(farm_id),

    -- Crop identity
    crop_name VARCHAR(50) NOT NULL,       -- Teff, Maize, Wheat
    crop_variety VARCHAR(50),             -- e.g. Quncho, BH-660
    description TEXT,

    -- Planting & lifecycle
    planting_date DATE NOT NULL,
    expected_harvest_date DATE,
    actual_harvest_date DATE,

    growth_stage VARCHAR(50),              -- Seedling / Vegetative / Flowering / Maturity
    days_after_planting INT,               -- Auto-calculated or updated daily

    -- Seed & farming method
    seed_type VARCHAR(50),                 -- Local / Hybrid / Improved
    farming_method VARCHAR(50),            -- Traditional / Modern / Mixed

    -- Environmental sensitivity (RULE ENGINE INPUT)
    drought_sensitivity VARCHAR(20),       -- Low / Medium / High
    heat_sensitivity VARCHAR(20),
    rainfall_requirement_mm INT,           -- Avg needed rainfall
    wind_sensitivity BOOLEAN DEFAULT FALSE,

    -- Crop health & productivity
    expected_yield_kg DECIMAL(10,2),
    actual_yield_kg DECIMAL(10,2),
    quality_grade VARCHAR(20),             -- A / B / C

    -- Market & e-commerce readiness
    is_for_sale BOOLEAN DEFAULT FALSE,
    base_price_per_kg DECIMAL(10,2),
    currency VARCHAR(10) DEFAULT 'ETB',

    -- Operational status
    is_active BOOLEAN DEFAULT TRUE,         -- Finished crops stay inactive
    season VARCHAR(20),                     -- Belg / Meher / Off-season

    -- System & audit
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE seasons (
    season_id SERIAL PRIMARY KEY,

    season_name VARCHAR(20) UNIQUE NOT NULL, -- Belg, Meher, Bega
    start_month INT NOT NULL,
    end_month INT NOT NULL
);

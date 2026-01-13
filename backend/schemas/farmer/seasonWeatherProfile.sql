CREATE TABLE season_weather_profiles (
    profile_id SERIAL PRIMARY KEY,

    season_id INT REFERENCES seasons(season_id),

    min_temp_c DECIMAL(4,1),
    max_temp_c DECIMAL(4,1),

    min_rainfall_mm INT,
    max_rainfall_mm INT,

    avg_wind_kmh INT
);

CREATE TABLE weather_trends (
    id SERIAL PRIMARY KEY,                     -- unique ID for each trend record
    region VARCHAR(100) NOT NULL,             -- region name
    zone VARCHAR(100) NOT NULL,               -- zone name
    woreda VARCHAR(100) NOT NULL,             -- woreda name
    type VARCHAR(20) NOT NULL,                -- 'temp', 'rainfall', 'wind', 'humidity'
    date DATE NOT NULL,                        -- date of the measurement
    value NUMERIC(6,2)                         -- value of the trend measurement
);

CREATE TABLE location (
    id SERIAL PRIMARY KEY,
    cityName VARCHAR(255) NOT NULL,
    cityCode INTEGER NOT NULL,
    streetName VARCHAR(255) NOT NULL,
    buildingNumber INTEGER NOT NULL,
    buildingEntarence VARCHAR(50),
    floor INTEGER,
    apartment INTEGER,
    latitude DECIMAL(10, 6),
    longitude DECIMAL(10, 6),
    userId INTEGER NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

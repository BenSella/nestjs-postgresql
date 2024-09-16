CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    cityLocation VARCHAR(255),
    latitude DECIMAL(10, 6),
    longitude DECIMAL(10, 6)
);

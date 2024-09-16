CREATE TABLE service_providers (
    id SERIAL PRIMARY KEY,
    service_type VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    phone_number VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
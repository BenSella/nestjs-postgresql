CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    appointment_date TIMESTAMP NOT NULL,
    appointment_time TIME DEFAULT '00:00:00',
    user_id INTEGER NOT NULL,
    service_provider_id INTEGER NOT NULL,
    customer_id INTEGER NOT NULL,
    meeting_type VARCHAR(50) NOT NULL,
    phone_number VARCHAR(255),
    video_link VARCHAR(255),
    physical_location VARCHAR(255),
    doctor_notes VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (service_provider_id) REFERENCES service_providers(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

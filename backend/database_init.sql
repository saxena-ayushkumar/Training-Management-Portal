-- Create database
CREATE DATABASE IF NOT EXISTS trainer_app_db;
USE trainer_app_db;

-- Create users table (will be auto-created by JPA, but this shows the structure)
-- CREATE TABLE users (
--     id BIGINT AUTO_INCREMENT PRIMARY KEY,
--     name VARCHAR(255) NOT NULL,
--     email VARCHAR(255) NOT NULL UNIQUE,
--     password VARCHAR(255) NOT NULL,
--     role VARCHAR(50) NOT NULL,
--     emp_id VARCHAR(50) UNIQUE,
--     trainer_emp_id VARCHAR(50),
--     status VARCHAR(50) NOT NULL DEFAULT 'pending'
-- );

-- Insert sample trainer (password: trainer123)
INSERT INTO users (name, email, password, role, emp_id, status) 
VALUES ('John Smith', 'trainer@example.com', 'trainer123', 'trainer', 'TR001', 'approved')
ON DUPLICATE KEY UPDATE name=name;
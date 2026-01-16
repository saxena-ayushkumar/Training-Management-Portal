-- Training Management Portal Database Setup
-- This script verifies the database and shows the structure

-- Use the database
USE trainer_app_db;

-- Show all tables
SHOW TABLES;

-- Show users table structure
DESCRIBE users;

-- Show all users
SELECT id, name, email, role, emp_id, trainer_emp_id, batch_name, status 
FROM users;

-- Show pending trainees
SELECT id, name, email, emp_id, trainer_emp_id, status 
FROM users 
WHERE role = 'trainee' AND status = 'pending';

-- Show approved trainees
SELECT id, name, email, emp_id, trainer_emp_id, batch_name, status 
FROM users 
WHERE role = 'trainee' AND status = 'approved';

-- Show all trainers
SELECT id, name, email, emp_id, status 
FROM users 
WHERE role = 'trainer';

-- Clear all data from database tables
-- Run this script to reset the database for testing

-- Delete batch trainee assignments first (foreign key constraint)
DELETE FROM batch_trainee;

-- Delete batches
DELETE FROM batch;

-- Delete users
DELETE FROM user;

-- Reset auto increment counters
ALTER TABLE user AUTO_INCREMENT = 1;
ALTER TABLE batch AUTO_INCREMENT = 1;
ALTER TABLE batch_trainee AUTO_INCREMENT = 1;

-- Verify tables are empty
SELECT 'Users' as table_name, COUNT(*) as count FROM user
UNION ALL
SELECT 'Batches' as table_name, COUNT(*) as count FROM batch
UNION ALL
SELECT 'Batch Trainees' as table_name, COUNT(*) as count FROM batch_trainee;
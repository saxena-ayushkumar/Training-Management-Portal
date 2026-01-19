-- Sample data for testing Trainee Management
-- Run this after the application creates the tables

-- Insert sample batches
INSERT INTO batches (name, description, trainer_emp_id) VALUES 
('React Fundamentals', 'Basic React concepts and components', 'TR001'),
('Advanced JavaScript', 'ES6+ features and advanced concepts', 'TR001'),
('Full Stack Development', 'Complete web development stack', 'TR001');

-- Insert sample trainer (if not exists)
INSERT IGNORE INTO users (name, email, password, role, emp_id, status) VALUES 
('John Trainer', 'trainer@example.com', 'Test@123', 'trainer', 'TR001', 'approved');

-- Insert sample approved trainees
INSERT INTO users (name, email, password, role, emp_id, trainer_emp_id, batch_name, status) VALUES 
('Alice Johnson', 'alice.johnson@example.com', 'Test@123', 'trainee', 'TN001', 'TR001', 'React Fundamentals', 'approved'),
('Bob Smith', 'bob.smith@example.com', 'Test@123', 'trainee', 'TN002', 'TR001', 'React Fundamentals', 'approved'),
('Carol Davis', 'carol.davis@example.com', 'Test@123', 'trainee', 'TN003', 'TR001', 'Advanced JavaScript', 'approved'),
('David Wilson', 'david.wilson@example.com', 'Test@123', 'trainee', 'TN004', 'TR001', 'Full Stack Development', 'approved');

-- Insert sample pending trainees
INSERT INTO users (name, email, password, role, emp_id, trainer_emp_id, status) VALUES 
('Emma Brown', 'emma.brown@example.com', 'Test@123', 'trainee', 'TN005', 'TR001', 'pending'),
('Frank Miller', 'frank.miller@example.com', 'Test@123', 'trainee', 'TN006', 'TR001', 'pending');
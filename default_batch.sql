-- Insert default batch for all trainers
INSERT INTO batches (name, description, trainer_emp_id) VALUES 
('React JS Fundamentals', 'Basic React concepts and components', 'TR001')
ON DUPLICATE KEY UPDATE name=name;
# Trainee Management Testing Guide

## Prerequisites
1. Start MySQL server
2. Start backend: `cd backend && mvn spring-boot:run`
3. Start frontend: `npm start`

## Test Scenario 1: Default Batch Creation
1. Login as trainer (trainer@example.com / Test@123)
2. Go to Trainee Management tab
3. Verify "React JS Fundamentals" batch is displayed by default

## Test Scenario 2: Create New Batch
1. In Trainee Management tab, click "Create Batch"
2. Enter:
   - Name: "Advanced JavaScript"
   - Description: "ES6+ features and advanced concepts"
3. Click "Create Batch"
4. Verify new batch appears in the batches grid

## Test Scenario 3: Trainee Signup and Approval
1. Logout and register new trainee:
   - Name: Test Trainee
   - Email: test.trainee@example.com
   - Password: Test@123
   - Employee ID: TN100
   - Trainer Employee ID: TR001
2. Login as trainer
3. Click notification bell
4. Verify trainee request appears
5. Select batch from dropdown (should show both "React JS Fundamentals" and "Advanced JavaScript")
6. Click "Approve"
7. Verify trainee appears in trainee details table below batches

## Test Scenario 4: Batch Trainee Count
1. After approving trainee, verify batch shows correct trainee count
2. Create another trainee and approve to different batch
3. Verify both batches show correct counts

## Expected Results:
- ✅ Default "React JS Fundamentals" batch appears
- ✅ New batches can be created and appear immediately
- ✅ Batch dropdown in approval shows all trainer's batches
- ✅ Approved trainees appear in trainee details table
- ✅ Batch cards show correct trainee counts
- ✅ All data persists in database

## Database Verification:
```sql
-- Check batches
SELECT * FROM batches WHERE trainer_emp_id = 'TR001';

-- Check approved trainees
SELECT name, email, emp_id, batch_name, status FROM users 
WHERE role = 'trainee' AND trainer_emp_id = 'TR001' AND status = 'approved';

-- Check trainee counts per batch
SELECT batch_name, COUNT(*) as trainee_count 
FROM users 
WHERE role = 'trainee' AND status = 'approved' AND trainer_emp_id = 'TR001'
GROUP BY batch_name;
```
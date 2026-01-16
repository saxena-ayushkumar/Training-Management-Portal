# Testing Guide - Training Management Portal

## Prerequisites
1. MySQL Server running on localhost:3306
2. Database `trainer_app_db` created
3. Backend running on http://localhost:8080
4. Frontend running on http://localhost:3000

## Test Scenario 1: Trainer Registration and Login

### Step 1: Register a Trainer
1. Open http://localhost:3000
2. Click on "Trainer" card
3. Click "Sign Up" tab
4. Fill in the form:
   - Name: John Trainer
   - Email: trainer@example.com
   - Password: Test@123
   - Confirm Password: Test@123
   - Employee ID: TR001
5. Click "Sign Up as trainer"
6. You should be automatically logged in and redirected to Trainer Dashboard

### Step 2: Verify Trainer in Database
Run this SQL query:
```sql
SELECT * FROM users WHERE role = 'trainer' AND emp_id = 'TR001';
```
Expected: Status should be 'approved'

## Test Scenario 2: Trainee Registration (Pending Approval)

### Step 1: Register a Trainee
1. Logout from trainer account (if logged in)
2. Go to http://localhost:3000
3. Click on "Trainee" card
4. Click "Sign Up" tab
5. Fill in the form:
   - Name: Alice Trainee
   - Email: alice@example.com
   - Password: Test@123
   - Confirm Password: Test@123
   - Employee ID: TN001
   - Trainer Employee ID: TR001
6. Click "Sign Up as trainee"
7. You should see alert: "Registration request submitted! Please wait for trainer approval before logging in."

### Step 2: Verify Trainee in Database
Run this SQL query:
```sql
SELECT * FROM users WHERE role = 'trainee' AND emp_id = 'TN001';
```
Expected: Status should be 'pending'

### Step 3: Try to Login as Trainee (Should Fail)
1. Click "Login" tab
2. Enter:
   - Email: alice@example.com
   - Password: Test@123
3. Click "Login as trainee"
4. Expected Error: "Your account is pending approval from trainer"

## Test Scenario 3: Trainer Approves Trainee

### Step 1: Login as Trainer
1. Go to http://localhost:3000
2. Click "Trainer" card
3. Login with:
   - Email: trainer@example.com
   - Password: Test@123

### Step 2: View Pending Requests
1. Click the Bell icon (notification) in the header
2. You should see "Pending Requests (1)"
3. You should see Alice Trainee's request with:
   - Name: Alice Trainee
   - Email: alice@example.com
   - Type: New Trainee Registration

### Step 3: Approve Trainee
1. In the dropdown "Assign to Batch", select a batch (e.g., "React.js Fundamentals")
2. Click "✓ Approve" button
3. You should see alert: "Trainee approved successfully!"
4. The request should disappear from the list

### Step 4: Verify in Database
Run this SQL query:
```sql
SELECT * FROM users WHERE role = 'trainee' AND emp_id = 'TN001';
```
Expected: Status should be 'approved' and batch_name should be set

## Test Scenario 4: Trainee Login After Approval

### Step 1: Logout and Login as Trainee
1. Logout from trainer account
2. Go to http://localhost:3000
3. Click "Trainee" card
4. Login with:
   - Email: alice@example.com
   - Password: Test@123
5. Click "Login as trainee"
6. You should be successfully logged in and redirected to Trainee Dashboard

## Test Scenario 5: Trainer Rejects Trainee

### Step 1: Register Another Trainee
1. Logout and go to http://localhost:3000
2. Click "Trainee" card, then "Sign Up"
3. Fill in:
   - Name: Bob Trainee
   - Email: bob@example.com
   - Password: Test@123
   - Confirm Password: Test@123
   - Employee ID: TN002
   - Trainer Employee ID: TR001
4. Click "Sign Up as trainee"

### Step 2: Login as Trainer and Reject
1. Login as trainer (trainer@example.com)
2. Click Bell icon
3. You should see Bob Trainee's request
4. Click "✗ Decline" button
5. You should see alert: "Trainee request declined"

### Step 3: Verify in Database
Run this SQL query:
```sql
SELECT * FROM users WHERE emp_id = 'TN002';
```
Expected: No records found (trainee should be deleted)

## Test Scenario 6: Invalid Trainer Employee ID

### Step 1: Register with Invalid Trainer ID
1. Go to http://localhost:3000
2. Click "Trainee" card, then "Sign Up"
3. Fill in:
   - Name: Charlie Trainee
   - Email: charlie@example.com
   - Password: Test@123
   - Confirm Password: Test@123
   - Employee ID: TN003
   - Trainer Employee ID: INVALID123
4. Click "Sign Up as trainee"
5. Expected Error: "Signup failed: Invalid Trainer Employee ID"

## Test Scenario 7: Duplicate Email/Employee ID

### Step 1: Try to Register with Existing Email
1. Try to register a new user with email: alice@example.com
2. Expected Error: "Signup failed: Email already exists"

### Step 2: Try to Register with Existing Employee ID
1. Try to register a new user with Employee ID: TN001
2. Expected Error: "Signup failed: Employee ID already exists"

## API Testing with Postman/cURL

### Test Login API
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"trainer@example.com\",\"password\":\"Test@123\"}"
```

### Test Signup API (Trainer)
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test Trainer\",\"email\":\"test@example.com\",\"password\":\"Test@123\",\"role\":\"trainer\",\"empId\":\"TR002\"}"
```

### Test Get Pending Trainees
```bash
curl -X GET "http://localhost:8080/api/trainer/pending-trainees?trainerEmpId=TR001"
```

### Test Approve Trainee
```bash
curl -X POST "http://localhost:8080/api/trainer/approve-trainee/1?batchName=React%20Fundamentals"
```

### Test Reject Trainee
```bash
curl -X DELETE http://localhost:8080/api/trainer/reject-trainee/2
```

## Common Issues and Solutions

### Issue 1: Backend not starting
- Check if MySQL is running
- Verify database credentials in application.properties
- Check if port 8080 is available

### Issue 2: Frontend not connecting to backend
- Verify backend is running on http://localhost:8080
- Check browser console for CORS errors
- Verify CORS configuration in backend

### Issue 3: Database connection error
- Verify MySQL credentials
- Check if database `trainer_app_db` exists
- Verify MySQL is running on port 3306

### Issue 4: Trainee not appearing in pending requests
- Verify trainee used correct trainer employee ID
- Check database to confirm trainee record exists
- Verify trainer is logged in with correct employee ID

## Success Criteria

✅ Trainer can register and login immediately
✅ Trainee can register but cannot login until approved
✅ Trainer can see pending trainee requests
✅ Trainer can approve trainee with batch assignment
✅ Trainer can reject trainee (removes from database)
✅ Approved trainee can login successfully
✅ Invalid trainer employee ID is rejected
✅ Duplicate email/employee ID is rejected
✅ All data is persisted in MySQL database

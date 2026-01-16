# Troubleshooting Guide

## Common Issues and Solutions

### 1. Backend Won't Start

#### Error: "Access denied for user 'root'@'localhost'"
**Solution:**
- Verify MySQL password in `backend/src/main/resources/application.properties`
- Test MySQL connection:
```bash
mysql -u root -p
# Enter password when prompted
```

#### Error: "Unknown database 'trainer_app_db'"
**Solution:**
```sql
mysql -u root -p
CREATE DATABASE trainer_app_db;
```

#### Error: "Port 8080 already in use"
**Solution (Windows):**
```bash
netstat -ano | findstr :8080
taskkill /PID <PID_NUMBER> /F
```

#### Error: "Could not find or load main class"
**Solution:**
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### 2. Frontend Won't Start

#### Error: "Port 3000 already in use"
**Solution:**
- Kill the process or use different port:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Or set different port
set PORT=3001 && npm start
```

#### Error: "Module not found"
**Solution:**
```bash
npm install
npm start
```

### 3. Connection Issues

#### Error: "Network Error" or "Failed to fetch"
**Checklist:**
- [ ] Backend running on http://localhost:8080
- [ ] Frontend running on http://localhost:3000
- [ ] Check browser console for errors
- [ ] Verify CORS configuration

**Test Backend:**
```bash
curl http://localhost:8080/api/auth/login
```

#### Error: "CORS policy blocked"
**Solution:**
- Verify `CorsConfig.java` exists in backend
- Check allowed origins include http://localhost:3000
- Restart backend server

### 4. Login/Signup Issues

#### Error: "Email already exists"
**Solution:**
- Use different email
- Or delete from database:
```sql
DELETE FROM users WHERE email = 'your@email.com';
```

#### Error: "Invalid Trainer Employee ID"
**Solution:**
- Verify trainer exists:
```sql
SELECT * FROM users WHERE role='trainer' AND emp_id='TR001';
```
- Register trainer first if not exists

#### Error: "Your account is pending approval"
**Solution:**
- This is expected for trainees
- Login as trainer and approve the trainee
- Then try trainee login again

### 5. Approval Issues

#### Pending trainees not showing
**Checklist:**
- [ ] Trainee used correct trainer employee ID
- [ ] Trainer logged in with correct account
- [ ] Check database:
```sql
SELECT * FROM users WHERE role='trainee' AND status='pending';
```

#### Approval not working
**Solution:**
- Check browser console for errors
- Verify backend logs
- Test API directly:
```bash
curl -X POST "http://localhost:8080/api/trainer/approve-trainee/1?batchName=TestBatch"
```

### 6. Database Issues

#### Error: "Table 'users' doesn't exist"
**Solution:**
- Hibernate should auto-create tables
- Verify `spring.jpa.hibernate.ddl-auto=update` in application.properties
- Or create manually:
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    emp_id VARCHAR(50) UNIQUE,
    trainer_emp_id VARCHAR(50),
    batch_name VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'pending'
);
```

#### Data not persisting
**Solution:**
- Check backend logs for errors
- Verify database connection
- Test with SQL:
```sql
SELECT * FROM users;
```

### 7. Maven Issues

#### Error: "mvn command not found"
**Solution:**
- Install Maven
- Add to PATH
- Or use Maven wrapper:
```bash
./mvnw spring-boot:run  # Linux/Mac
mvnw.cmd spring-boot:run  # Windows
```

#### Error: "Failed to resolve dependencies"
**Solution:**
```bash
mvn clean
mvn install -U
```

### 8. MySQL Issues

#### MySQL not running
**Solution (Windows):**
```bash
# Start MySQL service
net start MySQL80

# Or use MySQL Workbench/XAMPP
```

#### Can't connect to MySQL
**Solution:**
- Check MySQL is running on port 3306
- Verify credentials
- Check firewall settings

### 9. Browser Issues

#### Blank page after login
**Solution:**
- Check browser console for errors
- Clear browser cache
- Try incognito mode
- Verify user data in localStorage:
```javascript
// In browser console
localStorage.getItem('user')
```

#### Notification bell not showing count
**Solution:**
- Check if pending trainees exist in database
- Verify API call in Network tab
- Check console for errors

### 10. Development Issues

#### Changes not reflecting
**Solution:**
- **Backend:** Restart Spring Boot application
- **Frontend:** Clear cache and refresh (Ctrl+Shift+R)
- Check if correct file is being edited

#### Hot reload not working
**Solution:**
- Restart development server
- Check for syntax errors
- Verify file is saved

## Debugging Tips

### Backend Debugging
1. Check application logs in terminal
2. Add debug logging:
```java
System.out.println("Debug: " + variable);
```
3. Use Spring Boot Actuator
4. Check MySQL logs

### Frontend Debugging
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for API calls
4. Use React DevTools extension
5. Add console.log statements

### Database Debugging
```sql
-- Check all data
SELECT * FROM users;

-- Check specific user
SELECT * FROM users WHERE email='test@example.com';

-- Check pending trainees
SELECT * FROM users WHERE status='pending';

-- Check by trainer
SELECT * FROM users WHERE trainer_emp_id='TR001';

-- Clear all data (CAUTION!)
TRUNCATE TABLE users;
```

## Getting Help

### Check Logs
1. **Backend logs:** Terminal running Spring Boot
2. **Frontend logs:** Browser console (F12)
3. **MySQL logs:** MySQL error log file

### Verify Configuration
1. `application.properties` - Database settings
2. `package.json` - Dependencies
3. `pom.xml` - Maven dependencies

### Test APIs
Use Postman or cURL to test endpoints independently

### Database State
Always verify database state when debugging:
```sql
SELECT id, name, email, role, emp_id, trainer_emp_id, batch_name, status FROM users;
```

## Still Having Issues?

1. Check all files are saved
2. Restart both servers
3. Clear browser cache
4. Check MySQL is running
5. Verify all dependencies installed
6. Review error messages carefully
7. Check the TESTING_GUIDE.md for expected behavior
8. Verify against IMPLEMENTATION_CHECKLIST.md

## Quick Reset

If everything is broken, try this:

```bash
# Stop all servers (Ctrl+C)

# Backend
cd backend
mvn clean install
mvn spring-boot:run

# Frontend (new terminal)
npm install
npm start

# Database (if needed)
mysql -u root -p
DROP DATABASE trainer_app_db;
CREATE DATABASE trainer_app_db;
```

Then test with fresh data following TESTING_GUIDE.md

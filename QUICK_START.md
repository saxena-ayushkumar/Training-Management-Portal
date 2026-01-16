# Quick Start Guide

## 🚀 Start the Application

### Option 1: Automated Start (Windows)
```bash
# Double-click or run:
start-all.bat
```

### Option 2: Manual Start

#### Terminal 1 - Backend
```bash
cd backend
mvn spring-boot:run
```

#### Terminal 2 - Frontend
```bash
npm start
```

## 📋 Prerequisites Checklist

- [ ] MySQL Server running
- [ ] Database `trainer_app_db` created
- [ ] Java 17 installed
- [ ] Node.js installed
- [ ] Maven installed

## 🔑 Quick Test

### 1. Register Trainer
- Go to http://localhost:3000
- Click "Trainer" → "Sign Up"
- Fill form with Employee ID: `TR001`
- Login automatically after signup

### 2. Register Trainee
- Logout → Click "Trainee" → "Sign Up"
- Use Trainer Employee ID: `TR001`
- See "Wait for approval" message

### 3. Approve Trainee
- Login as Trainer
- Click Bell icon
- Select batch → Click "Approve"

### 4. Trainee Login
- Logout → Login as Trainee
- Access dashboard

## 🔧 Troubleshooting

### Backend won't start?
```bash
# Check MySQL is running
# Verify database exists:
mysql -u root -p
USE trainer_app_db;
```

### Frontend won't connect?
- Verify backend is running on port 8080
- Check browser console for errors

### Port already in use?
```bash
# Kill process on port 8080 (Windows)
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

## 📊 Database Quick Check

```sql
-- See all users
SELECT * FROM users;

-- See pending trainees
SELECT * FROM users WHERE role='trainee' AND status='pending';
```

## 🌐 URLs

- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- API Base: http://localhost:8080/api

## 📞 Support

Check these files for detailed help:
- `README_SETUP.md` - Full setup instructions
- `TESTING_GUIDE.md` - Testing scenarios
- `INTEGRATION_SUMMARY.md` - Technical details

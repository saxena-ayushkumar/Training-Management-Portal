# Training Management System - Setup Guide

## Quick Start

### Prerequisites
- Java 17+
- Node.js 14+
- MySQL 8.0+

### Database Setup
1. Start MySQL service:
   ```cmd
   net start MySQL80
   ```

2. Create database:
   ```sql
   CREATE DATABASE trainer_app_db;
   ```

### Backend Setup
1. Navigate to backend directory:
   ```cmd
   cd backend
   ```

2. Run the application:
   ```cmd
   mvnw.cmd spring-boot:run
   ```
   Backend starts on http://localhost:8080

### Frontend Setup
1. Install dependencies:
   ```cmd
   npm install
   ```

2. Start the application:
   ```cmd
   npm start
   ```
   Frontend starts on http://localhost:3000

## Default Credentials
- **Trainer**: trainer@example.com / trainer123 (Employee ID: TR001)

## Troubleshooting

### Backend Issues
- Ensure MySQL is running with password: `26th@FEB`
- Check if port 8080 is available
- Verify Java 17+ is installed

### Frontend Issues
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

## Project Structure
```
trainer-trainee-app/
├── backend/           # Spring Boot backend
├── src/components/    # React components
├── public/           # Static files
└── README.md         # Main documentation
```

## Features
- Role-based authentication (Trainer/Trainee)
- Assignment management
- Batch organization
- Real-time updates
- Responsive design
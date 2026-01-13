# Backend Setup Instructions

## Prerequisites
- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+
- MySQL Workbench (optional)

## Database Setup

1. **Start MySQL Server**
   - Ensure MySQL is running on localhost:3306
   - Username: root
   - Password: your-password

2. **Create Database**
   ```sql
   CREATE DATABASE IF NOT EXISTS trainer_app_db;
   ```

3. **Run Initial Data Script (Optional)**
   ```bash
   mysql -u root -pyour-password < database_init.sql
   ```

## Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   mvn clean install
   ```

3. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

   The backend will start on http://localhost:8080

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/pending-trainees` - Get pending trainee requests (Trainer only)
- `POST /api/auth/approve-trainee/{id}` - Approve trainee (Trainer only)
- `DELETE /api/auth/reject-trainee/{id}` - Reject trainee (Trainer only)

### Request/Response Format

#### Signup Request
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "trainer", // or "trainee"
  "trainerEmpId": "TR001" // Required for trainees only
}
```

#### Login Request
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Response Format
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "trainer",
    "empId": "TR001",
    "status": "approved"
  }
}
```

## Frontend Integration

1. **Start React App**
   ```bash
   npm start
   ```

2. **Test the Integration**
   - Frontend runs on http://localhost:3000
   - Backend runs on http://localhost:8080
   - CORS is configured to allow frontend requests

## Default Trainer Account
- Email: trainer@example.com
- Password: trainer123
- Employee ID: TR001

## Workflow

1. **Trainer Registration**: Trainers can register directly and are auto-approved
2. **Trainee Registration**: Trainees must provide a valid trainer employee ID and wait for approval
3. **Trainee Approval**: Trainers can view pending requests and approve/reject trainees
4. **Login**: Only approved users can login to the system

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check MySQL is running
   - Verify credentials in application.properties
   - Ensure database exists

2. **Port Already in Use**
   ```bash
   # Kill process on port 8080
   netstat -ano | findstr :8080
   taskkill /PID <PID> /F
   ```

3. **CORS Issues**
   - Ensure frontend is running on http://localhost:3000
   - Check CORS configuration in CorsConfig.java

4. **Maven Build Issues**
   ```bash
   mvn clean
   mvn compile
   mvn spring-boot:run
   ```

## Database Schema

The application will automatically create the following table:

```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    emp_id VARCHAR(50) UNIQUE,
    trainer_emp_id VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'pending'
);
```

## Next Steps

After successful setup, you can:
1. Register as a trainer
2. Register trainees with your trainer employee ID
3. Approve trainee requests from the trainer dashboard
4. Test the complete authentication flow
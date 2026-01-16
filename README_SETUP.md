# Training Management Portal

A full-stack training management system for trainers and trainees built with React and Spring Boot.

## Features

- **Trainer Module**
  - Signup and auto-approval
  - View and manage pending trainee requests
  - Approve/Reject trainee registrations
  - Assign trainees to batches
  - Course management
  - Session scheduling
  - Leave management

- **Trainee Module**
  - Signup with trainer employee ID
  - Wait for trainer approval before login
  - Access courses and materials
  - Submit assignments
  - Request leave

## Prerequisites

- Node.js (v14 or higher)
- Java 17
- MySQL Server
- Maven

## Database Setup

1. Start MySQL server
2. Create database:
```sql
CREATE DATABASE trainer_app_db;
```

## Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Build the project:
```bash
mvn clean install
```

3. Run the application:
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

## Frontend Setup

1. Navigate to project root directory

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## Usage Flow

### Trainer Registration
1. Go to landing page
2. Select "Trainer" role
3. Fill in: Name, Email, Password, Confirm Password, Employee ID
4. Click "Sign Up as trainer"
5. Trainer is auto-approved and can login immediately

### Trainee Registration
1. Go to landing page
2. Select "Trainee" role
3. Fill in: Name, Email, Password, Confirm Password, Employee ID, Trainer Employee ID
4. Click "Sign Up as trainee"
5. Wait for trainer approval notification

### Trainer Approval Process
1. Trainer logs in
2. Click notification bell icon
3. View pending trainee requests
4. Select a batch for the trainee
5. Click "Approve" or "Decline"

### Trainee Login
1. After trainer approval, trainee can login
2. Access dashboard with courses and materials

## Technology Stack

### Frontend
- React.js
- React Router
- Lucide React Icons
- Context API for state management

### Backend
- Spring Boot 3.2.0
- Spring Data JPA
- MySQL Database
- Maven

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login

### Trainer Operations
- `GET /api/trainer/pending-trainees?trainerEmpId={id}` - Get pending trainees
- `POST /api/trainer/approve-trainee/{id}?batchName={name}` - Approve trainee
- `DELETE /api/trainer/reject-trainee/{id}` - Reject trainee

## Project Structure

```
Training-Management-Portal/
├── backend/
│   └── src/
│       └── main/
│           ├── java/com/trainer/app/
│           │   ├── config/
│           │   ├── controller/
│           │   ├── dto/
│           │   ├── model/
│           │   ├── repository/
│           │   └── service/
│           └── resources/
│               └── application.properties
├── src/
│   ├── components/
│   │   ├── Homepage.js
│   │   ├── LandingPage.js
│   │   ├── TrainerDashboard.js
│   │   └── TraineeDashboard.js
│   ├── context/
│   │   └── AppContext.js
│   └── App.js
└── package.json
```

## Notes

- Trainers are automatically approved upon registration
- Trainees require trainer approval before they can login
- Each trainee must provide their trainer's employee ID during registration
- Trainers can only see trainee requests associated with their employee ID

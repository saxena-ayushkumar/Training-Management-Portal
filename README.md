# TeckStac Training Management System

A comprehensive full-stack training management platform built with React.js and Spring Boot, designed to streamline the training process between trainers and trainees.

##  Features

### For Trainers
- **Dashboard Analytics** - Real-time insights and performance metrics
- **Course Management** - Create, edit, and manage training courses
- **Batch Management** - Organize trainees into custom batches
- **Session Scheduling** - Schedule and manage training sessions
- **Assessment Creation** - Create assignments, quizzes, and exams
- **Trainee Approval** - Review and approve trainee registrations
- **Leave Management** - Handle trainee leave requests
- **Attendance Tracking** - Mark and monitor session attendance
- **Certificate Management** - View and download trainee certificates

### For Trainees
- **Course Enrollment** - Browse and enroll in available courses
- **Assignment Submission** - Submit assignments with file uploads
- **Progress Tracking** - Monitor learning progress and grades
- **Leave Requests** - Submit and track leave applications
- **Certificate Access** - View and download completion certificates
- **Feedback System** - Provide course feedback and ratings

##  Technology Stack

### Frontend
- **React.js** 19.2.3 - Modern UI framework
- **React Router DOM** 7.11.0 - Client-side routing
- **Lucide React** - Modern icon library
- **CSS3** - Custom styling with modern design patterns

### Backend
- **Spring Boot** 3.2.0 - Java web framework
- **Spring Data JPA** - Database abstraction layer
- **MySQL** - Relational database
- **Maven** - Dependency management

##  Project Structure

```
TeckStac-V1/
├── backend/                          # Spring Boot Backend
│   ├── src/main/java/com/trainer/app/
│   │   ├── config/                   # Configuration classes
│   │   ├── controller/               # REST API controllers
│   │   ├── dto/                      # Data Transfer Objects
│   │   ├── model/                    # JPA Entity classes
│   │   ├── repository/               # Data access repositories
│   │   ├── service/                  # Business logic services
│   │   └── TrainerAppApplication.java
│   ├── src/main/resources/
│   │   └── application.properties    # Database & server config
│   ├── uploads/                      # File upload storage
│   └── pom.xml                       # Maven dependencies
├── frontend/                         # React Frontend
│   ├── public/                       # Static assets
│   ├── src/
│   │   ├── components/               # React components
│   │   │   ├── Homepage.js           # Authentication page
│   │   │   ├── LandingPage.js        # Role selection
│   │   │   ├── TrainerDashboard.js   # Trainer interface
│   │   │   └── TraineeDashboard.js   # Trainee interface
│   │   ├── context/
│   │   │   └── AppContext.js         # Global state management
│   │   ├── App.js                    # Main application component
│   │   └── index.js                  # Application entry point
│   ├── uploads/                      # Frontend file storage
│   └── package.json                  # NPM dependencies
└── README.md                         # Project documentation
```

##  Installation & Setup

### Prerequisites
- **Node.js** 16+ and npm
- **Java** 17+
- **MySQL** 8.0+
- **Maven** 3.6+

### Database Setup
1. Install MySQL and create database:
```sql
CREATE DATABASE training_portal;
```

2. Update database credentials in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/training_portal
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
Backend runs on `http://localhost:8080`

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
Frontend runs on `http://localhost:3000`

##  Configuration

### Environment Variables
Create `.env` file in frontend directory:
```env
REACT_APP_API_URL=http://localhost:8080
```

### Database Configuration
The application uses MySQL with automatic table creation via JPA/Hibernate.

##  API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### Course Management
- `GET /api/courses/trainer/{empId}` - Get trainer courses
- `POST /api/courses` - Create new course
- `PUT /api/courses/{id}` - Update course
- `GET /api/courses/{id}/analytics` - Course analytics

### Trainee Management
- `GET /api/trainer/trainees` - Get approved trainees
- `GET /api/trainer/pending-trainees` - Get pending requests
- `POST /api/trainer/approve-trainee/{id}` - Approve trainee
- `DELETE /api/trainer/reject-trainee/{id}` - Reject trainee

### Session Management
- `GET /api/sessions/trainer/{empId}` - Get trainer sessions
- `POST /api/sessions` - Create session

### Assessment Management
- `GET /api/assessments/trainer/{empId}` - Get assessments
- `POST /api/assessments` - Create assessment
- `GET /api/assessments/{id}/submissions` - Get submissions

##  Usage Guide

### Getting Started
1. **Access Application**: Navigate to `http://localhost:3000`
2. **Select Role**: Choose Trainer or Trainee
3. **Register/Login**: Create account or sign in
4. **Complete Profile**: Fill in required information

### For Trainers
1. **Create Batches**: Organize trainees into groups
2. **Approve Trainees**: Review and approve registration requests
3. **Create Courses**: Design training curriculum
4. **Schedule Sessions**: Plan training sessions
5. **Create Assessments**: Design assignments and exams
6. **Monitor Progress**: Track trainee performance

### For Trainees
1. **Join Batch**: Get approved by trainer
2. **Enroll in Courses**: Browse available courses
3. **Attend Sessions**: Join scheduled training sessions
4. **Submit Assignments**: Complete and submit work
5. **Track Progress**: Monitor learning journey
6. **Request Leave**: Submit leave applications

##  Security Features

- Role-based access control (Trainer/Trainee)
- Session management with user authentication
- CORS configuration for secure API access
- Input validation and sanitization
- File upload restrictions and validation

##  Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices

##  Known Issues & Limitations

- Password storage uses plain text (should implement hashing)
- No JWT token authentication
- File uploads stored locally (consider cloud storage)
- Limited real-time notifications

##  Future Enhancements

- [ ] JWT authentication implementation
- [ ] Real-time notifications with WebSocket
- [ ] Email notification system
- [ ] Advanced analytics and reporting
- [ ] Video conferencing integration
- [ ] Mobile application
- [ ] Cloud file storage integration
- [ ] Advanced role permissions

##  Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

##  License

This project is developed for educational and training purposes.

##  Support

For support and questions:
- Create an issue in the repository
- Check the console for error messages
- Ensure all dependencies are properly installed

##  Development

### Running in Development Mode
```bash
# Backend
cd backend && mvn spring-boot:run

# Frontend
cd frontend && npm start
```

### Building for Production
```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && mvn clean package
```

### Testing
```bash
# Frontend
cd frontend && npm test

# Backend
cd backend && mvn test
```

---

**Built with ❤️ for effective training management**
# Training Management Portal (TMP) - Coding Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Framework Structure](#framework-structure)
3. [File Structure & Purpose](#file-structure--purpose)
4. [Prerequisites](#prerequisites)
5. [Installation & Setup](#installation--setup)
6. [Running the Project](#running-the-project)
7. [Coding Details](#coding-details)
8. [API Endpoints](#api-endpoints)
9. [Database Schema](#database-schema)
10. [Development Guidelines](#development-guidelines)

## Project Overview

The Training Management Portal (TMP) is a full-stack web application designed to streamline training processes between trainers and trainees. Built with React.js frontend and Spring Boot backend, it provides comprehensive features for course management, assessment handling, and progress tracking.

### Key Features
- **Dual Role System**: Separate interfaces for trainers and trainees
- **Course Management**: Create, manage, and track training courses
- **Assessment System**: Create assignments, quizzes, and handle submissions
- **Progress Tracking**: Monitor learning progress and completion rates
- **Session Management**: Schedule and manage training sessions
- **Leave Management**: Handle leave requests and approvals
- **Certificate Management**: Upload and manage completion certificates

## Framework Structure

### Frontend Architecture
```
React.js Application
├── Components (UI Components)
├── Context (Global State Management)
├── Styling (CSS Modules)
└── Services (API Communication)
```

### Backend Architecture
```
Spring Boot Application
├── Controllers (REST API Endpoints)
├── Services (Business Logic)
├── Repositories (Data Access Layer)
├── Models (Entity Classes)
├── DTOs (Data Transfer Objects)
└── Configuration (App Configuration)
```

## File Structure & Purpose

### Frontend Structure (`/frontend`)
```
frontend/
├── public/
│   ├── index.html              # Main HTML template
│   └── favicon.ico             # Application icon
├── src/
│   ├── components/
│   │   ├── Homepage.js         # Authentication & role selection
│   │   ├── LandingPage.js      # Initial landing page
│   │   ├── TrainerDashboard.js # Trainer interface
│   │   ├── TraineeDashboard.js # Trainee interface
│   │   └── TrainerDashboard.css # Trainer-specific styles
│   ├── context/
│   │   └── AppContext.js       # Global state management
│   ├── App.js                  # Main application component
│   ├── App.css                 # Global styles
│   ├── index.js                # Application entry point
│   └── index.css               # Base styles
├── uploads/                    # Frontend file storage
├── package.json                # NPM dependencies
└── package-lock.json           # Dependency lock file
```

### Backend Structure (`/backend`)
```
backend/
├── src/main/java/com/trainer/app/
│   ├── controller/
│   │   ├── AuthController.java         # Authentication endpoints
│   │   ├── TrainerController.java      # Trainer-specific endpoints
│   │   ├── TraineeController.java      # Trainee-specific endpoints
│   │   ├── CourseController.java       # Course management
│   │   ├── AssessmentController.java   # Assessment handling
│   │   ├── SessionController.java      # Session management
│   │   ├── LeaveRequestController.java # Leave management
│   │   ├── CertificateController.java  # Certificate handling
│   │   └── FeedbackController.java     # Feedback system
│   ├── service/
│   │   ├── UserService.java            # User business logic
│   │   ├── BatchService.java           # Batch management
│   │   └── CourseService.java          # Course business logic
│   ├── repository/
│   │   ├── UserRepository.java         # User data access
│   │   ├── CourseRepository.java       # Course data access
│   │   ├── BatchRepository.java        # Batch data access
│   │   └── AssessmentRepository.java   # Assessment data access
│   ├── model/
│   │   ├── User.java                   # User entity
│   │   ├── Course.java                 # Course entity
│   │   ├── Assessment.java             # Assessment entity
│   │   ├── Session.java                # Session entity
│   │   ├── Batch.java                  # Batch entity
│   │   ├── LeaveRequest.java           # Leave request entity
│   │   └── CourseCertificate.java      # Certificate entity
│   ├── dto/
│   │   ├── TraineeDetailsDto.java      # Trainee data transfer
│   │   └── BatchWithTraineesDto.java   # Batch data transfer
│   ├── config/
│   │   └── CorsConfig.java             # CORS configuration
│   └── TrainerAppApplication.java      # Main application class
├── src/main/resources/
│   └── application.properties          # Database & server config
├── uploads/                            # Backend file storage
│   ├── assignments/                    # Assignment submissions
│   └── certificates/                   # Certificate uploads
├── pom.xml                             # Maven dependencies
└── target/                             # Compiled classes
```

## Prerequisites

### Software Requirements
- **Node.js**: Version 16.0 or higher
- **npm**: Version 8.0 or higher
- **Java**: JDK 17 or higher
- **Maven**: Version 3.6 or higher
- **MySQL**: Version 8.0 or higher

### Development Tools (Recommended)
- **IDE**: IntelliJ IDEA, Eclipse, or VS Code
- **Database Tool**: MySQL Workbench or phpMyAdmin
- **API Testing**: Postman or Insomnia
- **Git**: For version control

## Installation & Setup

### 1. Database Setup
```sql
-- Create database
CREATE DATABASE training_portal;

-- Create user (optional)
CREATE USER 'tmp_user'@'localhost' IDENTIFIED BY 'tmp_password';
GRANT ALL PRIVILEGES ON training_portal.* TO 'tmp_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Backend Configuration
Update `backend/src/main/resources/application.properties`:
```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/training_portal
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# Server Configuration
server.port=8080

# File Upload Configuration
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

### 3. Frontend Configuration
Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_UPLOAD_URL=http://localhost:8080/uploads
```

## Running the Project

### Backend Startup
```bash
# Navigate to backend directory
cd backend

# Install dependencies and compile
mvn clean install

# Run the application
mvn spring-boot:run

# Alternative: Run compiled JAR
java -jar target/trainer-app-backend-0.0.1-SNAPSHOT.jar
```

### Frontend Startup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Database**: localhost:3306/training_portal

## Coding Details

### Frontend Architecture

#### 1. Component Structure
```javascript
// Main Dashboard Component Pattern
const TrainerDashboard = ({ user, onLogout }) => {
  // State Management
  const [activeSection, setActiveSection] = useState('analytics');
  const [courses, setCourses] = useState([]);
  
  // API Calls
  useEffect(() => {
    fetchData();
  }, [user.empId]);
  
  // Render Methods
  const renderSection = () => {
    switch(activeSection) {
      case 'courses': return renderCourseManagement();
      case 'trainees': return renderTraineeManagement();
      default: return renderAnalytics();
    }
  };
  
  return (
    <div className="dashboard">
      <Sidebar />
      <MainContent>{renderSection()}</MainContent>
    </div>
  );
};
```

#### 2. State Management Pattern
```javascript
// Context Provider Pattern
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  
  const addCourse = (course) => {
    setCourses(prev => [...prev, course]);
  };
  
  return (
    <AppContext.Provider value={{ courses, addCourse }}>
      {children}
    </AppContext.Provider>
  );
};
```

#### 3. API Integration Pattern
```javascript
// API Call Pattern
const fetchCourses = async () => {
  try {
    const response = await fetch(`${API_URL}/api/courses/trainer/${empId}`);
    const data = await response.json();
    if (data.success) {
      setCourses(data.courses);
    }
  } catch (error) {
    console.error('Error fetching courses:', error);
  }
};
```

### Backend Architecture

#### 1. Controller Pattern
```java
@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:3000")
public class CourseController {
    
    @Autowired
    private CourseService courseService;
    
    @GetMapping("/trainer/{empId}")
    public ResponseEntity<?> getCoursesByTrainer(@PathVariable String empId) {
        try {
            List<Course> courses = courseService.findByTrainerEmpId(empId);
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
```

#### 2. Service Layer Pattern
```java
@Service
public class CourseService {
    
    @Autowired
    private CourseRepository courseRepository;
    
    public List<Course> findByTrainerEmpId(String empId) {
        return courseRepository.findByTrainerEmpId(empId);
    }
    
    public Course saveCourse(Course course) {
        return courseRepository.save(course);
    }
}
```

#### 3. Entity Pattern
```java
@Entity
@Table(name = "courses")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "trainer_emp_id")
    private String trainerEmpId;
    
    // Constructors, getters, setters
}
```

## API Endpoints

### Authentication Endpoints
```
POST /api/auth/login          # User login
POST /api/auth/signup         # User registration
```

### Course Management
```
GET    /api/courses/trainer/{empId}     # Get trainer courses
POST   /api/courses                     # Create course
PUT    /api/courses/{id}                # Update course
GET    /api/courses/{id}/analytics      # Course analytics
```

### Trainee Management
```
GET    /api/trainer/trainees            # Get approved trainees
GET    /api/trainer/pending-trainees    # Get pending requests
POST   /api/trainer/approve-trainee/{id} # Approve trainee
DELETE /api/trainer/reject-trainee/{id}  # Reject trainee
```

### Assessment Management
```
GET  /api/assessments/trainer/{empId}   # Get assessments
POST /api/assessments                   # Create assessment
GET  /api/assessments/{id}/submissions  # Get submissions
```

## Database Schema

### Core Tables
```sql
-- Users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    emp_id VARCHAR(100) UNIQUE,
    trainer_emp_id VARCHAR(100),
    batch_name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    phone_number VARCHAR(20),
    experience TEXT,
    skills TEXT,
    address TEXT
);

-- Courses table
CREATE TABLE courses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration VARCHAR(100),
    status VARCHAR(50) DEFAULT 'draft',
    instructor VARCHAR(255),
    course_link VARCHAR(500),
    assigned_batch VARCHAR(255),
    trainer_emp_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assessments table
CREATE TABLE assessments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50),
    batch_name VARCHAR(255),
    due_date DATE,
    total_marks INT DEFAULT 100,
    google_form_link VARCHAR(500),
    trainer_emp_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Development Guidelines

### Code Style
- **Frontend**: Use functional components with hooks
- **Backend**: Follow Spring Boot conventions
- **Naming**: Use camelCase for JavaScript, camelCase for Java
- **Comments**: Document complex business logic

### Error Handling
```javascript
// Frontend Error Handling
try {
  const response = await fetch(url);
  const data = await response.json();
  if (data.success) {
    // Handle success
  } else {
    alert('Error: ' + data.message);
  }
} catch (error) {
  console.error('API Error:', error);
  alert('Network error occurred');
}
```

```java
// Backend Error Handling
@GetMapping("/example")
public ResponseEntity<?> example() {
    try {
        // Business logic
        return ResponseEntity.ok(Map.of("success", true, "data", result));
    } catch (Exception e) {
        return ResponseEntity.badRequest()
            .body(Map.of("success", false, "message", e.getMessage()));
    }
}
```

### Security Considerations
- Input validation on both frontend and backend
- SQL injection prevention using JPA
- CORS configuration for API access
- File upload restrictions and validation

### Performance Optimization
- Lazy loading for large datasets
- Pagination for list views
- Caching for frequently accessed data
- Optimized database queries

---

**Built with ❤️ for effective training management**
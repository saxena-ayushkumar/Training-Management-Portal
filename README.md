# Training Management System

A comprehensive React.js application for managing training programs with separate interfaces for trainers and trainees.

## Enhanced Features

### For Trainers:
- **Analytics Dashboard**: Real-time statistics and performance metrics
- **Dynamic Batch Management**: 
  - Create custom batch names (not just Batch A/B)
  - User-controlled trainee allocation to specific batches
  - Move trainees between batches
  - Remove trainees from batches
  - Batch performance tracking with progress indicators
- **Advanced Assignment Management**: 
  - Multiple assignment types (Assignment, Project, Quiz, Exam)
  - Points system for assignments
  - Assignment statistics (submissions, pending, average scores)
  - Delete and edit assignments
  - Download submissions functionality
- **Enhanced UI**: 
  - Modal dialogs for better user experience
  - Progress bars and visual indicators
  - Hover effects and animations
  - Icon-based actions

### For Trainees:
- **Enhanced Assignment Interface**: 
  - Assignment filtering (All, Pending, Submitted, Graded)
  - Assignment overview dashboard with statistics
  - File upload capability for submissions
  - Grade display and feedback access
  - Assignment type indicators
- **Notifications System**: 
  - Real-time notifications for new assignments, grades, meetings
  - Upcoming events calendar
  - Visual notification indicators
- **Improved Batch Information**: 
  - Comprehensive batch details
  - Topic tracking with visual tags
  - Trainer information display

## Core Features

### For Trainers:
- **Profile Management**: Update personal details and professional information
- **Trainee Management**: 
  - Accept/decline trainee requests
  - Organize trainees into batches
  - View trainee details and documents
- **Assignment Management**: Create and post assignments to specific batches
- **Dashboard**: Overview of all training activities

### For Trainees:
- **Profile Management**: Update personal and educational information
- **Assignment Tracking**: View and submit assignments
- **Batch Information**: Access batch details, schedule, and topics
- **Dashboard**: Personal learning progress overview

## Technology Stack

- **Frontend**: React.js 19.2.3
- **Backend**: Spring Boot 3.x
- **Database**: MySQL 8.x
- **Routing**: React Router DOM 7.11.0
- **Icons**: Lucide React
- **Styling**: CSS3 with modern design patterns
- **State Management**: React Hooks (useState, useEffect)

## Installation & Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager
- Java 17 or higher
- MySQL 8.x
- Maven 3.6+

### Installation Steps

#### Backend Setup:

1. **Setup MySQL Database:**
   - Install MySQL and create a database named `trainer_app_db`
   - Update `backend/src/main/resources/application.properties` with your database credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/trainer_app_db
   spring.datasource.username=<your_mysql_username>
   spring.datasource.password=<your_mysql_password>
   ```

2. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

3. **Run the Spring Boot application:**
   ```bash
   mvn spring-boot:run
   ```
   Backend will start on `http://localhost:8080`

#### Frontend Setup:

1. **Navigate to the project root directory:**
   ```bash
   cd trainer-trainee-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser and visit:**
   ```
   http://localhost:3000
   ```

## How to Use

### Getting Started
1. **Homepage**: Choose between Trainer or Trainee role
2. **Authentication**: Login or Sign up with your credentials
3. **Dashboard**: Access role-specific features and functionalities

### For Trainers:
1. **Profile Setup**: Complete your professional profile
2. **Manage Trainees**: 
   - Review incoming trainee requests
   - Accept trainees and assign them to batches
   - Organize trainees into different batch folders
3. **Create Assignments**: 
   - Post new assignments with descriptions and due dates
   - Assign to specific batches
   - Track assignment submissions

### For Trainees:
1. **Profile Setup**: Complete your educational and personal details
2. **View Assignments**: 
   - Check new assignments from your trainer
   - Submit completed assignments
   - Track assignment status
3. **Batch Information**: 
   - View your batch details
   - Check training schedule and topics
   - See trainer information

## Project Structure

```
trainer-trainee-app/
├── backend/                     # Spring Boot backend
│   ├── src/main/java/
│   │   └── com/trainer/app/
│   │       ├── controller/      # REST controllers
│   │       ├── model/           # JPA entities
│   │       ├── repository/      # Data repositories
│   │       └── service/         # Business logic
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
├── public/
├── src/
│   ├── components/
│   │   ├── Homepage.js          # Landing page with auth
│   │   ├── TrainerDashboard.js  # Trainer interface
│   │   └── TraineeDashboard.js  # Trainee interface
│   ├── App.js                   # Main app component
│   ├── App.css                  # Global styles
│   └── index.js                 # App entry point
├── package.json
└── README.md
```

## Key Features Explained

### Authentication System
- Role-based login (Trainer/Trainee)
- Local storage for session persistence
- Protected routes based on user roles

### Trainer Dashboard
- **Profile Section**: Personal and professional information management
- **Trainee Management**: Accept/decline requests, batch organization
- **Assignment Posting**: Create assignments with batch targeting

### Trainee Dashboard
- **Assignment View**: Real-time assignment updates from trainers
- **Batch Details**: Comprehensive batch information
- **Profile Management**: Personal information updates

### Responsive Design
- Mobile-friendly interface
- Adaptive layouts for different screen sizes
- Modern UI with gradient backgrounds and smooth transitions

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (irreversible)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Backend Features

- **Authentication API**: Secure login/signup with role-based access
- **User Management**: Trainer and trainee registration with approval workflow
- **Database Integration**: MySQL database with JPA/Hibernate
- **RESTful APIs**: Complete CRUD operations for user management
- **CORS Configuration**: Proper frontend-backend communication

## Future Enhancements

- Real-time notifications
- File upload for assignments
- Video conferencing integration
- Progress tracking and analytics
- Email notifications
- Advanced batch management
- Document management system

## Troubleshooting

### Common Issues:

1. **Port 3000 already in use:**
   ```bash
   # Kill the process using port 3000
   npx kill-port 3000
   # Or run on a different port
   PORT=3001 npm start
   ```

2. **Dependencies not installing:**
   ```bash
   # Clear npm cache
   npm cache clean --force
   # Delete node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Build errors:**
   ```bash
   # Check for syntax errors in components
   # Ensure all imports are correct
   # Verify React version compatibility
   ```

## Support

For any issues or questions, please check the console for error messages and ensure all dependencies are properly installed.

## License

This project is created for educational purposes.
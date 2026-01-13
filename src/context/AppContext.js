import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Load data from localStorage or use defaults
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('users');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'John Smith', email: 'trainer@example.com', password: 'trainer123', role: 'trainer', empId: 'TR001' },
      { id: 2, name: 'Alice Brown', email: 'alice@example.com', password: 'alice123', role: 'trainee', empId: 'EMP001', status: 'approved' },
      { id: 3, name: 'Bob Wilson', email: 'bob@example.com', password: 'bob123', role: 'trainee', empId: 'EMP002', status: 'approved' }
    ];
  });

  const [trainees, setTrainees] = useState(() => {
    const saved = localStorage.getItem('trainees');
    return saved ? JSON.parse(saved) : [
      { 
        id: 4, 
        name: 'Alice Brown', 
        email: 'alice@example.com', 
        empId: 'EMP001', 
        trainerEmpId: 'TR001',
        joinDate: '2024-01-01', 
        progress: 75,
        skills: ['JavaScript', 'React', 'HTML', 'CSS'],
        resumeLink: 'https://example.com/resume/alice-brown.pdf',
        batch: 'React Fundamentals',
        status: 'approved'
      },
      { 
        id: 5, 
        name: 'Bob Wilson', 
        email: 'bob@example.com', 
        empId: 'EMP002', 
        trainerEmpId: 'TR001',
        joinDate: '2024-01-02', 
        progress: 60,
        skills: ['Python', 'Django', 'SQL'],
        resumeLink: 'https://example.com/resume/bob-wilson.pdf',
        batch: 'React Fundamentals',
        status: 'approved'
      }
    ];
  });
  
  const [traineeRequests, setTraineeRequests] = useState(() => {
    const saved = localStorage.getItem('traineeRequests');
    return saved ? JSON.parse(saved) : [
      {
        id: 6,
        name: 'Carol Davis',
        email: 'carol@example.com',
        empId: 'EMP003',
        trainerEmpId: 'TR001',
        skills: 'JavaScript, Node.js, MongoDB, Express',
        batch: 'Advanced JavaScript',
        requestDate: '2024-01-10',
        status: 'pending'
      },
      {
        id: 7,
        name: 'David Wilson',
        email: 'david@example.com',
        empId: 'EMP004',
        trainerEmpId: 'TR001',
        skills: 'React, TypeScript, CSS',
        batch: 'Frontend Development',
        requestDate: '2024-01-11',
        status: 'pending'
      }
    ];
  });

  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: 'React Fundamentals',
      description: 'Complete the React basics tutorial and submit your project',
      dueDate: '2024-01-15',
      batch: 'React Fundamentals',
      submissions: [
        {
          id: 1,
          studentName: 'Alice Brown',
          empId: 'EMP001',
          submittedAt: '2024-01-14',
          status: 'submitted',
          files: ['react-project.zip', 'documentation.pdf'],
          grade: null
        },
        {
          id: 2,
          studentName: 'Bob Wilson',
          empId: 'EMP002',
          submittedAt: '2024-01-13',
          status: 'graded',
          files: ['react-app.zip'],
          grade: 'A'
        }
      ]
    },
    {
      id: 2,
      title: 'JavaScript ES6 Features',
      description: 'Implement ES6 features in your project',
      dueDate: '2024-01-20',
      batch: 'Advanced JavaScript',
      submissions: []
    }
  ]);

  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('courses');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        title: 'React.js Fundamentals',
        description: 'Complete guide to React.js development',
        status: 'active',
        duration: '8 weeks',
        enrolledCount: 2,
        materials: ['React Basics.pdf'],
        createdAt: '2024-01-15',
        instructor: 'John Smith',
        courseLink: 'https://reactjs.org/tutorial/tutorial.html'
      }
    ];
  });

  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('sessions');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        courseId: 1,
        title: 'Introduction to React Components',
        date: '2024-01-25',
        time: '10:00',
        duration: '2 hours',
        batch: 'React.js Fundamentals',
        status: 'scheduled',
        attendees: []
      }
    ];
  });

  const [enrollmentRequests, setEnrollmentRequests] = useState(() => {
    const saved = localStorage.getItem('enrollmentRequests');
    return saved ? JSON.parse(saved) : [];
  });

  const [courseFeedback, setCourseFeedback] = useState(() => {
    const saved = localStorage.getItem('courseFeedback');
    return saved ? JSON.parse(saved) : [];
  });

  const [leaveRequests, setLeaveRequests] = useState(() => {
    const saved = localStorage.getItem('leaveRequests');
    return saved ? JSON.parse(saved) : [];
  });

  const [batches, setBatches] = useState(() => {
    const saved = localStorage.getItem('batches');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'React Fundamentals', description: 'Basic React concepts', trainees: [] },
      { id: 2, name: 'Advanced JavaScript', description: 'ES6+ features', trainees: [] }
    ];
  });

  const [notifications, setNotifications] = useState([]);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('trainees', JSON.stringify(trainees));
  }, [trainees]);

  useEffect(() => {
    localStorage.setItem('traineeRequests', JSON.stringify(traineeRequests));
  }, [traineeRequests]);

  useEffect(() => {
    localStorage.setItem('courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('enrollmentRequests', JSON.stringify(enrollmentRequests));
  }, [enrollmentRequests]);

  useEffect(() => {
    localStorage.setItem('courseFeedback', JSON.stringify(courseFeedback));
  }, [courseFeedback]);

  useEffect(() => {
    localStorage.setItem('leaveRequests', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem('batches', JSON.stringify(batches));
  }, [batches]);

  // Register new user
  const registerUser = (userData) => {
    // Check for duplicate email or employee ID
    if (checkDuplicateEmail(userData.email, userData.empId)) {
      throw new Error('Email or Employee ID already exists. Please use different credentials.');
    }
    
    // Validate password
    const passwordValidation = validatePassword(userData.password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join('\n'));
    }
    
    if (userData.role === 'trainer') {
      // Trainers are directly added as users
      const newUser = {
        id: Date.now(),
        ...userData,
        status: 'approved'
      };
      setUsers(prev => [...prev, newUser]);
      return newUser;
    } else {
      // Trainees create a request that needs approval
      const newRequest = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        password: userData.password,
        skills: userData.skills,
        batch: userData.batch,
        phone: userData.phone,
        education: userData.education,
        requestDate: new Date().toISOString().split('T')[0],
        status: 'pending'
      };
      setTraineeRequests(prev => [...prev, newRequest]);
      
      // Return a special response indicating request was created
      return { 
        ...newRequest, 
        role: 'trainee', 
        requestPending: true,
        message: 'Your registration request has been submitted. Please wait for trainer approval before you can login.'
      };
    }
  };
  
  // Authenticate user
  const authenticateUser = (email, password) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // For trainees, check if they are approved
    if (user.role === 'trainee' && user.status !== 'approved') {
      throw new Error('Your account is pending approval. Please wait for trainer approval.');
    }
    
    return user;
  };
  
  // Check duplicate email or employee ID
  const checkDuplicateEmail = (email, empId) => {
    const existsInUsers = users.some(u => u.email.toLowerCase() === email.toLowerCase() || u.empId === empId);
    const existsInRequests = traineeRequests.some(r => r.email.toLowerCase() === email.toLowerCase() || r.empId === empId);
    return existsInUsers || existsInRequests;
  };
  
  // Validate password
  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };
  
  // Add trainee request
  const addTraineeRequest = (traineeData) => {
    const newRequest = {
      id: Date.now(),
      ...traineeData,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    setTraineeRequests(prev => [...prev, newRequest]);
  };

  // Approve trainee request
  const approveTraineeRequest = (requestId, batchName) => {
    const request = traineeRequests.find(r => r.id === requestId);
    if (request) {
      const empId = `EMP${String(trainees.length + users.filter(u => u.role === 'trainee').length + 1).padStart(3, '0')}`;
      
      // Add to users table for login
      const newUser = {
        id: Date.now(),
        name: request.name,
        email: request.email,
        password: request.password,
        role: 'trainee',
        empId: empId,
        status: 'approved'
      };
      setUsers(prev => [...prev, newUser]);
      
      // Add to trainees table for management
      const newTrainee = {
        ...request,
        empId: empId,
        joinDate: new Date().toISOString().split('T')[0],
        progress: 0,
        batch: batchName,
        status: 'approved',
        resumeLink: request.resumeLink || null
      };
      setTrainees(prev => [...prev, newTrainee]);
      
      // Remove from requests
      setTraineeRequests(prev => prev.filter(r => r.id !== requestId));
      return newTrainee;
    }
  };
  
  // Decline trainee request
  const declineTraineeRequest = (requestId) => {
    setTraineeRequests(prev => prev.filter(r => r.id !== requestId));
  };
  
  // Check if user can login (for trainees, they must be approved)
  const canUserLogin = (email, role) => {
    if (role === 'trainer') {
      return true; // Trainers can always login
    }
    // For trainees, check if they are approved
    const trainee = trainees.find(t => t.email.toLowerCase() === email.toLowerCase());
    return trainee && trainee.status === 'approved';
  };

  const addSubmission = (assignmentId, submissionData) => {
    setAssignments(prev => prev.map(assignment => {
      if (assignment.id === assignmentId) {
        const newSubmission = {
          ...submissionData,
          id: Date.now(),
          submittedAt: new Date().toISOString().split('T')[0],
          status: 'submitted'
        };
        return {
          ...assignment,
          submissions: [...(assignment.submissions || []), newSubmission]
        };
      }
      return assignment;
    }));
  };

  const updateSubmissionGrade = (submissionId, grade) => {
    setAssignments(prev => prev.map(assignment => ({
      ...assignment,
      submissions: assignment.submissions?.map(sub => {
        if (sub.id === submissionId) {
          // Create notification for graded assignment
          const notification = {
            id: Date.now(),
            type: 'grade',
            title: 'Assignment Graded',
            message: `Your assignment has been graded: ${grade}`,
            assignmentTitle: assignment.title,
            empId: sub.empId,
            timestamp: new Date().toISOString(),
            read: false
          };
          setNotifications(prev => [...prev, notification]);
          return { ...sub, grade, status: 'graded' };
        }
        return sub;
      })
    })));
  };

  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [...prev, newNotification]);
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  const getNotificationsForUser = (empId) => {
    return notifications.filter(n => n.empId === empId);
  };

  const updateTraineeProfile = (empId, profileData) => {
    setTrainees(prev => prev.map(trainee => 
      trainee.empId === empId ? { ...trainee, ...profileData } : trainee
    ));
    // Also update in users if exists
    setUsers(prev => prev.map(user => 
      user.empId === empId ? { ...user, ...profileData } : user
    ));
  };

  const addCourse = (courseData) => {
    const newCourse = {
      id: Date.now(),
      ...courseData,
      enrolledCount: 0,
      materials: [],
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCourses(prev => [...prev, newCourse]);
    return newCourse;
  };

  const updateCourse = (courseId, updates) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId ? { ...course, ...updates } : course
    ));
  };

  const uploadCourseMaterial = (courseId, fileName) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? { ...course, materials: [...course.materials, fileName] }
        : course
    ));
  };

  const addSession = (sessionData) => {
    const newSession = {
      id: Date.now(),
      ...sessionData,
      status: 'scheduled',
      attendees: []
    };
    setSessions(prev => [...prev, newSession]);
    return newSession;
  };

  const updateSessionAttendance = (sessionId, attendees) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, attendees }
        : session
    ));
  };

  const addEnrollmentRequest = (requestData) => {
    const newRequest = {
      id: Date.now(),
      ...requestData,
      status: 'pending',
      requestDate: new Date().toISOString().split('T')[0]
    };
    setEnrollmentRequests(prev => [...prev, newRequest]);
    return newRequest;
  };

  const approveEnrollmentRequest = (requestId) => {
    const request = enrollmentRequests.find(r => r.id === requestId);
    if (request) {
      // Update course enrollment count
      setCourses(prev => prev.map(course => 
        course.id === request.courseId 
          ? { ...course, enrolledCount: course.enrolledCount + 1 }
          : course
      ));
      // Remove from requests
      setEnrollmentRequests(prev => prev.filter(r => r.id !== requestId));
    }
  };

  const rejectEnrollmentRequest = (requestId) => {
    setEnrollmentRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const submitCourseFeedback = (feedbackData) => {
    const newFeedback = {
      id: Date.now(),
      ...feedbackData,
      submittedAt: new Date().toISOString().split('T')[0]
    };
    setCourseFeedback(prev => [...prev, newFeedback]);
    return newFeedback;
  };

  const submitLeaveRequest = (leaveData) => {
    const newLeave = {
      id: Date.now(),
      ...leaveData,
      status: 'pending',
      submittedAt: new Date().toISOString().split('T')[0]
    };
    setLeaveRequests(prev => [...prev, newLeave]);
    return newLeave;
  };

  const approveLeaveRequest = (leaveId) => {
    setLeaveRequests(prev => prev.map(leave => 
      leave.id === leaveId ? { ...leave, status: 'approved' } : leave
    ));
  };

  const rejectLeaveRequest = (leaveId) => {
    setLeaveRequests(prev => prev.map(leave => 
      leave.id === leaveId ? { ...leave, status: 'rejected' } : leave
    ));
  };

  const addBatch = (batchData) => {
    const newBatch = {
      id: Date.now(),
      ...batchData,
      trainees: []
    };
    setBatches(prev => [...prev, newBatch]);
    return newBatch;
  };

  const assignTraineeToBatch = (traineeId, batchId) => {
    setBatches(prev => prev.map(batch => {
      if (batch.id === batchId) {
        return { ...batch, trainees: [...batch.trainees, traineeId] };
      }
      return { ...batch, trainees: batch.trainees.filter(id => id !== traineeId) };
    }));
    
    setTrainees(prev => prev.map(trainee => 
      trainee.id === traineeId ? { ...trainee, batchId } : trainee
    ));
  };

  const updateCourseCompletion = (traineeId, courseId, completed) => {
    setTrainees(prev => prev.map(trainee => {
      if (trainee.id === traineeId) {
        const courseCompletions = trainee.courseCompletions || {};
        return {
          ...trainee,
          courseCompletions: {
            ...courseCompletions,
            [courseId]: completed
          }
        };
      }
      return trainee;
    }));
  };

  const value = {
    trainees,
    setTrainees,
    traineeRequests,
    setTraineeRequests,
    assignments,
    setAssignments,
    courses,
    setCourses,
    sessions,
    setSessions,
    enrollmentRequests,
    courseFeedback,
    leaveRequests,
    batches,
    notifications,
    users,
    registerUser,
    authenticateUser,
    checkDuplicateEmail,
    validatePassword,
    addTraineeRequest,
    approveTraineeRequest,
    declineTraineeRequest,
    canUserLogin,
    addSubmission,
    updateSubmissionGrade,
    addNotification,
    markNotificationAsRead,
    getNotificationsForUser,
    updateTraineeProfile,
    addCourse,
    updateCourse,
    uploadCourseMaterial,
    addSession,
    updateSessionAttendance,
    addEnrollmentRequest,
    approveEnrollmentRequest,
    rejectEnrollmentRequest,
    submitCourseFeedback,
    submitLeaveRequest,
    approveLeaveRequest,
    rejectLeaveRequest,
    addBatch,
    assignTraineeToBatch,
    updateCourseCompletion
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
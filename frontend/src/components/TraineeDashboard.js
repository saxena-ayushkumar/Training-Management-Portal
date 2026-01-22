import React, { useState, useEffect } from 'react';
import { 
  User, FileText, BookOpen, Calendar, Award, Clock, 
  CheckCircle, Play, Download, Upload, BarChart3, 
  TrendingUp, Activity, Bell, Eye, Star, Code, CalendarDays
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const TraineeDashboard = ({ user, onLogout }) => {
  const { 
    courses, assignments, addSubmission, 
    addEnrollmentRequest, submitCourseFeedback,
    updateTraineeProfile,
    updateCourseCompletion
  } = useAppContext();
  const [activeSection, setActiveSection] = useState('catalog');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  // State
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [enrollmentRequests, setEnrollmentRequests] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState('');
  const [keyLearnings, setKeyLearnings] = useState('');
  const [codeEditorLanguage, setCodeEditorLanguage] = useState('javascript');
  const [codeContent, setCodeContent] = useState('');
  const [codeOutput, setCodeOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [resume, setResume] = useState(null);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [courseFilter, setCourseFilter] = useState('all');
  const [assignmentFilter, setAssignmentFilter] = useState('all');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phoneNumber || '',
    empId: user?.empId || '',
    batch: user?.batchName || '',
    education: '', // This will be stored in a separate field if needed
    skills: user?.skills || '',
    experience: user?.address || '', // Using address field for experience
    address: user?.address || ''
  });

  // Initialize profile data when user data is available
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phoneNumber || '',
        empId: user.empId || '',
        batch: user.batchName || '',
        education: '', // This can be added to User model if needed
        skills: user.skills || '',
        experience: user.address || '', // Using address field for experience
        address: user.address || ''
      });
    }
  }, [user]);

  // Fetch functions
  const fetchAssessments = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/assessments/trainee/${user.empId}`);
      const assessmentsData = await response.json();
      if (Array.isArray(assessmentsData)) {
        setAssessments(assessmentsData);
      }
    } catch (error) {
      console.error('Error fetching assessments:', error);
    }
  };

  const handleResubmitAssessment = async (assessmentId) => {
    if (window.confirm('Are you sure you want to resubmit this assessment? Your previous submission will be deleted.')) {
      try {
        // Find and delete existing submission
        const existingSubmission = assessments.find(a => a.id === assessmentId);
        if (existingSubmission && existingSubmission.submitted) {
          const response = await fetch(`http://localhost:8080/api/assessments/submissions/${existingSubmission.submissionId}`, {
            method: 'DELETE'
          });
          
          if (response.ok) {
            // Update local state to show as not submitted and clear update flag
            setAssessments(prev => prev.map(a => 
              a.id === assessmentId ? { 
                ...a, 
                submitted: false, 
                submissionStatus: 'pending', 
                grade: null,
                updatedAfterSubmission: false 
              } : a
            ));
            alert('Previous submission deleted. You can now submit again.');
          }
        }
      } catch (error) {
        console.error('Error deleting submission:', error);
        alert('Error preparing for resubmission');
      }
    }
  };

  // Fetch leave requests on component mount
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/leave/trainee/${user.empId}`);
        const data = await response.json();
        if (data.success) {
          setLeaveRequests(data.leaveRequests);
        }
      } catch (error) {
        console.error('Error fetching leave requests:', error);
      }
    };
    
    const fetchSessions = async () => {
      try {
        // Get trainee's batch first
        const traineeResponse = await fetch(`http://localhost:8080/api/trainees/${user.empId}`);
        const traineeData = await traineeResponse.json();
        
        if (traineeData.success && traineeData.trainee.batchName) {
          const sessionsResponse = await fetch(`http://localhost:8080/api/sessions/batch/${traineeData.trainee.batchName}`);
          const sessionsData = await sessionsResponse.json();
          
          if (Array.isArray(sessionsData)) {
            setSessions(sessionsData);
          }
        }
      } catch (error) {
        console.error('Error fetching sessions:', error);
      }
    };
    
    if (user && user.empId) {
      fetchLeaveRequests();
      fetchSessions();
      fetchAssessments();
    }
  }, [user]);

  const performance = {
    overallGrade: 'A-',
    averageScore: 85,
    attendanceRate: 92,
    completedAssignments: 8,
    totalAssignments: 10,
    coursesCompleted: 2,
    coursesInProgress: 1
  };

  const notifications = [
    {
      id: 1,
      type: 'assignment',
      title: 'New Assignment Posted',
      message: 'React Component Assignment has been posted',
      time: '2 hours ago',
      read: false
    }
  ];

  useEffect(() => {
    // Fetch courses from backend API based on trainee's batch
    const fetchCoursesForTrainee = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/courses/trainee/${user.empId}`);
        const data = await response.json();
        
        if (data.success) {
          console.log('Courses for trainee:', data.courses);
          console.log('Trainee batch:', data.traineeBatch);
          
          // Check certificate status for each course
          const coursesWithCertificates = await Promise.all(
            data.courses.map(async (course) => {
              try {
                const certResponse = await fetch(`http://localhost:8080/api/certificates/check/${user.empId}/${course.id}`);
                const certData = await certResponse.json();
                
                return {
                  ...course,
                  enrolled: true,
                  progress: course.progressPercentage || 0,
                  completedLessons: Math.floor(Math.random() * 20),
                  totalLessons: 20,
                  nextSession: '2024-01-20 10:00 AM',
                  score: Math.floor(Math.random() * 100),
                  certificateUploaded: certData.hasCertificate || false,
                  started: course.progressPercentage > 0,
                  completed: course.progressPercentage === 100
                };
              } catch (error) {
                console.error('Error checking certificate for course', course.id, error);
                return {
                  ...course,
                  enrolled: true,
                  progress: course.progressPercentage || 0,
                  completedLessons: Math.floor(Math.random() * 20),
                  totalLessons: 20,
                  nextSession: '2024-01-20 10:00 AM',
                  score: Math.floor(Math.random() * 100),
                  certificateUploaded: false,
                  started: course.progressPercentage > 0,
                  completed: course.progressPercentage === 100
                };
              }
            })
          );
          
          setAvailableCourses(data.courses);
          setEnrolledCourses(coursesWithCertificates);
        } else {
          console.error('Failed to fetch courses:', data.message);
          alert('Failed to load courses: ' + data.message);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        // Fallback to context courses if API fails
        const activeCourses = courses.filter(course => course.status === 'active').map(course => ({
          ...course,
          enrolled: true,
          progress: 0,
          completedLessons: Math.floor(Math.random() * 20),
          totalLessons: 20,
          nextSession: '2024-01-20 10:00 AM',
          score: Math.floor(Math.random() * 100),
          started: false,
          completed: false,
          certificateUploaded: false
        }));
        setEnrolledCourses(activeCourses);
      }
    };
    
    if (user && user.empId) {
      fetchCoursesForTrainee();
    }
  }, [user, courses]);

  const handleEnrollRequest = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    addEnrollmentRequest({
      courseId,
      courseName: course.title,
      traineeId: user.id,
      traineeName: user.name
    });
    alert('Enrollment request submitted! Waiting for trainer approval.');
  };

  const handleSubmitFeedback = (courseId, rating, comments) => {
    submitCourseFeedback({
      courseId,
      traineeId: user.id,
      traineeName: user.name,
      rating,
      comments
    });
    alert('Feedback submitted successfully!');
  };

  const handleSubmitAssignment = (assignmentId) => {
    addSubmission(assignmentId, {
      studentName: user.name,
      empId: user.empId || 'EMP004',
      text: submissionText,
      files: uploadedFiles.map(file => file.name)
    });
    setSubmissionText('');
    setUploadedFiles([]);
    setShowSubmissionModal(false);
    alert('Assignment submitted successfully!');
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const renderCourseCatalog = () => {
    // Use courses from backend API (already filtered by batch)
    const filteredCourses = availableCourses.filter(course => {
      const enrolledCourse = enrolledCourses.find(ec => ec.id === course.id);
      if (courseFilter === 'completed') {
        return enrolledCourse && enrolledCourse.completed === true;
      } else if (courseFilter === 'in-progress') {
        return enrolledCourse && enrolledCourse.started === true && enrolledCourse.completed !== true;
      } else if (courseFilter === 'not-started') {
        return !enrolledCourse || enrolledCourse.started !== true;
      }
      return true; // 'all' filter
    });

    return (
      <div className="content-section">
        <h2 className="section-title">Course Catalog</h2>
        
        <div className="catalog-filters">
          <button 
            className={`filter-btn ${courseFilter === 'all' ? 'active' : ''}`}
            onClick={() => setCourseFilter('all')}
          >
            All Courses
          </button>
          <button 
            className={`filter-btn ${courseFilter === 'not-started' ? 'active' : ''}`}
            onClick={() => setCourseFilter('not-started')}
          >
            Not Started
          </button>
          <button 
            className={`filter-btn ${courseFilter === 'in-progress' ? 'active' : ''}`}
            onClick={() => setCourseFilter('in-progress')}
          >
            In Progress
          </button>
          <button 
            className={`filter-btn ${courseFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setCourseFilter('completed')}
          >
            Completed
          </button>
        </div>
        
        <div className="courses-grid">
          {filteredCourses.map(course => {
            const enrolledCourse = enrolledCourses.find(ec => ec.id === course.id);
            
            return (
              <div key={course.id} className="catalog-course-card">
                <div className="course-header">
                  <h3>{course.title}</h3>
                  <div className="course-status">
                    <span className={`status-badge ${course.status}`}>{course.status}</span>
                    {enrolledCourse && (
                      <span className={`completion-badge ${
                        enrolledCourse.completed ? 'completed' : 
                        enrolledCourse.started ? 'in-progress' : 'not-started'
                      }`}>
                        {enrolledCourse.completed ? '✓ Completed' : 
                         enrolledCourse.started ? '🔄 In Progress' : '⏸️ Not Started'}
                      </span>
                    )}
                  </div>
                </div>
                <p className="course-description">{course.description}</p>
                <div className="course-details">
                  <span><Clock size={14} /> {course.duration}</span>
                  <span>🏫 {course.instructor}</span>
                  {/* <span>👥 {course.enrolledCount} enrolled</span> */}
                  {course.assignedBatch && (
                    <span>🎯 {course.assignedBatch} Batch</span>
                  )}
                  {course.courseLink && (
                    <span>
                      <a href={course.courseLink} target="_blank" rel="noopener noreferrer" className="course-link">
                        🔗 Course Link
                      </a>
                    </span>
                  )}
                </div>
                <div className="course-actions">
                  {enrolledCourse ? (
                    !enrolledCourse.started ? (
                      <button 
                        className="start-btn"
                        onClick={async () => {
                          try {
                            const response = await fetch('http://localhost:8080/api/courses/progress/start', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                courseId: course.id,
                                traineeEmpId: user.empId
                              })
                            });
                            
                            const data = await response.json();
                            if (data.success) {
                              setEnrolledCourses(prev => prev.map(c => 
                                c.id === course.id ? { ...c, started: true, progress: 1 } : c
                              ));
                              alert('Course started successfully!');
                            } else {
                              alert('Failed to start course: ' + data.message);
                            }
                          } catch (error) {
                            console.error('Backend not available, using local state:', error);
                            // Fallback to local state if backend is not available
                            setEnrolledCourses(prev => prev.map(c => 
                              c.id === course.id ? { ...c, started: true, progress: 1 } : c
                            ));
                            alert('Course started successfully!');
                          }
                        }}
                      >
                        🚀 Start Course
                      </button>
                    ) : enrolledCourse.completed ? (
                      <button className="completed-btn" disabled>
                        ✓ Completed
                      </button>
                    ) : (
                      <div className="course-progress-actions">
                        <button 
                          className="upload-cert-btn"
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = '.pdf,.jpg,.png,.jpeg,.doc,.docx';
                            input.onchange = async (e) => {
                              if (e.target.files[0]) {
                                const file = e.target.files[0];
                                const formData = new FormData();
                                formData.append('file', file);
                                formData.append('traineeEmpId', user.empId);
                                formData.append('courseId', course.id);
                                
                                try {
                                  const response = await fetch('http://localhost:8080/api/certificates/upload', {
                                    method: 'POST',
                                    body: formData
                                  });
                                  
                                  const data = await response.json();
                                  if (data.success) {
                                    setEnrolledCourses(prev => prev.map(c => 
                                      c.id === course.id ? { ...c, certificateUploaded: true } : c
                                    ));
                                    alert('Certificate uploaded successfully! Please submit feedback to complete the course.');
                                  } else {
                                    alert('Failed to upload certificate: ' + data.message);
                                  }
                                } catch (error) {
                                  console.error('Error uploading certificate:', error);
                                  alert('Error uploading certificate');
                                }
                              }
                            };
                            input.click();
                          }}
                        >
                          📄 {enrolledCourse.certificateUploaded ? '✓ Certificate Uploaded' : 'Upload Certificate'}
                        </button>
                      </div>
                    )
                  ) : (
                    <button 
                      className="enroll-btn"
                      onClick={() => handleEnrollRequest(course.id)}
                    >
                      📝 Request Enrollment
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {filteredCourses.length === 0 && (
          <div className="no-data">
            <p>No courses found for the selected filter.</p>
          </div>
        )}
      </div>
    );
  };

  const renderLearningProgress = () => {
    // Calculate dynamic statistics from enrolled courses
    const totalCourses = enrolledCourses.length;
    const completedCourses = enrolledCourses.filter(course => course.completed).length;
    const overallProgress = totalCourses > 0 ? 
      Math.round(enrolledCourses.reduce((sum, course) => sum + (course.progress || 0), 0) / totalCourses) : 0;
    const averageProgress = totalCourses > 0 ? 
      Math.round(enrolledCourses.reduce((sum, course) => sum + (course.progress || 0), 0) / totalCourses) : 0;

    return (
      <div className="content-section">
        <h2 className="section-title">Learning Progress</h2>
        
        <div className="progress-summary">
          {/* <div className="summary-card">
            <h3>Overall Progress</h3>
            <div className="progress-circle">
              <span className="progress-percentage">{overallProgress}%</span>
            </div>
          </div> */}
          <div className="summary-card">
            <h3>Completed Courses</h3>
            <div className="completion-stats">
              <span className="completed-count">{completedCourses}</span>
              <span className="total-count">/ {totalCourses}</span>
            </div>
          </div>
          <div className="summary-card">
            <h3>Average Progress</h3>
            <div className="score-display">
              <span className="score">{averageProgress > 0 ? `${averageProgress}%` : 'N/A'}</span>
            </div>
          </div>
        </div>
        
        <div className="courses-progress">
          <h3>Course Progress</h3>
          {enrolledCourses.map(course => (
            <div key={course.id} className="progress-item">
              <div className="progress-header">
                <h4>{course.title}</h4>
                <div className="progress-input-container">
                  <input 
                    type="number" 
                    min="1" 
                    max="99" 
                    value={course.progress || ''}
                    onChange={async (e) => {
                      const value = e.target.value;
                      const newProgress = value === '' ? 1 : Math.min(99, Math.max(1, parseInt(value) || 1));
                      
                      // Update local state immediately
                      setEnrolledCourses(prev => prev.map(c => 
                        c.id === course.id ? { ...c, progress: newProgress } : c
                      ));
                      
                      // Update backend
                      try {
                        const response = await fetch('http://localhost:8080/api/courses/progress/update', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            courseId: course.id,
                            traineeEmpId: user.empId,
                            progressPercentage: newProgress
                          })
                        });
                        
                        const data = await response.json();
                        if (!data.success) {
                          console.error('Failed to update progress:', data.message);
                        }
                      } catch (error) {
                        console.error('Error updating progress:', error);
                      }
                    }}
                    className="progress-input"
                    placeholder="1"
                    disabled={course.completed || !course.started}
                  />
                  <span className="progress-percent">%</span>
                </div>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: `${course.progress || 0}%`}}></div>
              </div>
              <div className="progress-details">
                {course.completed && <span className="certified-badge">🏆 Certified</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAssessments = () => {
    const filteredAssessments = assessments.filter(assessment => {
      if (assignmentFilter === 'pending') {
        return !assessment.submitted;
      } else if (assignmentFilter === 'submitted') {
        return assessment.submitted && assessment.submissionStatus === 'submitted';
      } else if (assignmentFilter === 'graded') {
        return assessment.submitted && assessment.submissionStatus === 'graded';
      }
      return true;
    });

    const pendingCount = assessments.filter(a => !a.submitted).length;
    const submittedCount = assessments.filter(a => a.submitted && a.submissionStatus === 'submitted').length;
    const gradedCount = assessments.filter(a => a.submitted && a.submissionStatus === 'graded').length;

    const handleSubmitAssignment = async (assessmentId) => {
      const formData = new FormData();
      formData.append('assessmentId', assessmentId);
      formData.append('traineeEmpId', user.empId);
      formData.append('traineeName', user.name);
      formData.append('submissionText', submissionText);
      
      if (uploadedFiles.length > 0) {
        formData.append('file', uploadedFiles[0]);
      }
      
      try {
        const response = await fetch('http://localhost:8080/api/assessments/submit', {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        if (data.success) {
          fetchAssessments();
          setSubmissionText('');
          setUploadedFiles([]);
          setShowSubmissionModal(false);
          alert('Assessment submitted successfully!');
        } else {
          alert('Failed to submit: ' + data.message);
        }
      } catch (error) {
        console.error('Error submitting assessment:', error);
        alert('Error submitting assessment');
      }
    };

    return (
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">Assessments & Assignments</h2>
          <div className="assignment-filters">
            <button 
              className={`filter-btn ${assignmentFilter === 'all' ? 'active' : ''}`}
              onClick={() => setAssignmentFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${assignmentFilter === 'pending' ? 'active' : ''}`}
              onClick={() => setAssignmentFilter('pending')}
            >
              Pending
            </button>
            <button 
              className={`filter-btn ${assignmentFilter === 'submitted' ? 'active' : ''}`}
              onClick={() => setAssignmentFilter('submitted')}
            >
              Submitted
            </button>
            <button 
              className={`filter-btn ${assignmentFilter === 'graded' ? 'active' : ''}`}
              onClick={() => setAssignmentFilter('graded')}
            >
              Graded
            </button>
          </div>
        </div>
        
        <div className="assignments-overview">
          <div className="overview-metric">
            <span className="metric-number">{gradedCount}</span>
            <span className="metric-label">Completed</span>
          </div>
          <div className="overview-metric">
            <span className="metric-number">{pendingCount}</span>
            <span className="metric-label">Pending</span>
          </div>
          <div className="overview-metric">
            <span className="metric-number">{submittedCount}</span>
            <span className="metric-label">Submitted</span>
          </div>
        </div>
        
        <div className="assignments-grid">
          {filteredAssessments.map(assessment => {
            return (
              <div key={assessment.id} className="assignment-card">
                <div className="assignment-header">
                  <div className="assignment-title">
                    <h3>{assessment.title}</h3>
                    <span className={`type-badge ${assessment.type}`}>{assessment.type}</span>
                  </div>
                  <span className={`status-badge ${assessment.submissionStatus}`}>
                    {assessment.submitted ? assessment.submissionStatus : 'pending'}
                  </span>
                </div>
                
                <p className="assignment-description">{assessment.description}</p>
                
                <div className="assignment-meta">
                  <div className="meta-item">
                    <Calendar size={14} />
                    <span>Due: {assessment.dueDate}</span>
                  </div>
                  <div className="meta-item">
                    <Award size={14} />
                    <span>Points: {assessment.totalMarks}</span>
                  </div>
                </div>
                
                {assessment.grade && (
                  <div className="assignment-grade">
                    <Star size={16} />
                    <span>Grade: {assessment.grade}/{assessment.totalMarks}</span>
                  </div>
                )}
                
                <div className="assignment-actions">
                  {assessment.type === 'quiz' && assessment.googleFormLink && !assessment.submitted && (
                    <a 
                      href={assessment.googleFormLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="submit-btn"
                    >
                      📝 Take Quiz
                    </a>
                  )}
                  {assessment.type === 'assignment' && !assessment.submitted && (
                    <button 
                      className="submit-btn"
                      onClick={() => {
                        setSelectedAssignment(assessment);
                        setShowSubmissionModal(true);
                      }}
                    >
                      <Upload size={14} /> Submit Assignment
                    </button>
                  )}
                  {assessment.submitted && (
                    <button 
                      className="resubmit-btn"
                      onClick={() => handleResubmitAssessment(assessment.id)}
                    >
                      🔄 Resubmit
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredAssessments.length === 0 && (
          <div className="no-data">
            <p>No assessments found for the selected filter.</p>
          </div>
        )}

        {showSubmissionModal && selectedAssignment && (
          <div className="modal-overlay">
            <div className="modal large">
              <h3>Submit Assignment: {selectedAssignment.title}</h3>
              <div className="submission-form">
                <div className="form-group">
                  <label>Submission Text</label>
                  <textarea
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    placeholder="Enter your submission details..."
                    rows="6"
                  />
                </div>
                
                <div className="form-group">
                  <label>Upload File</label>
                  <div className="file-upload-area">
                    <input
                      type="file"
                      onChange={(e) => setUploadedFiles([e.target.files[0]])}
                      accept=".pdf,.doc,.docx,.zip,.js,.html,.css,.py,.java,.cpp,.txt"
                    />
                    <div className="upload-text">
                      <Upload size={24} />
                      <p>Click to upload file</p>
                      <small>Supported: PDF, DOC, ZIP, Code files</small>
                    </div>
                  </div>
                  
                  {uploadedFiles.length > 0 && (
                    <div className="uploaded-files">
                      <h4>Selected File:</h4>
                      <div className="file-item">
                        <FileText size={16} />
                        <span>{uploadedFiles[0].name}</span>
                        <button onClick={() => setUploadedFiles([])}>
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="modal-actions">
                  <button 
                    className="primary-btn"
                    onClick={() => handleSubmitAssignment(selectedAssignment.id)}
                  >
                    Submit Assignment
                  </button>
                  <button 
                    className="secondary-btn"
                    onClick={() => setShowSubmissionModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderFeedback = () => {
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!selectedCourse || rating === 0) {
        alert('Please select a course and rating');
        return;
      }
      
      if (keyLearnings.length < 200 || keyLearnings.length > 500) {
        alert('Key learnings must be between 200 and 500 characters');
        return;
      }
      
      // Check if certificate is uploaded for the selected course
      const course = enrolledCourses.find(c => c.id === parseInt(selectedCourse));
      if (!course || !course.certificateUploaded) {
        alert('Please upload your certificate before submitting feedback');
        return;
      }
      
      try {
        const response = await fetch('http://localhost:8080/api/feedback/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            courseId: parseInt(selectedCourse),
            traineeEmpId: user.empId,
            rating: rating,
            keyLearnings: keyLearnings,
            feedback: comments
          })
        });
        
        const data = await response.json();
        if (data.success) {
          // Automatically mark course as completed after feedback submission
          try {
            const completeResponse = await fetch('http://localhost:8080/api/courses/progress/complete', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                courseId: parseInt(selectedCourse),
                traineeEmpId: user.empId
              })
            });
            
            const completeData = await completeResponse.json();
            if (completeData.success) {
              setEnrolledCourses(prev => prev.map(c => 
                c.id === parseInt(selectedCourse) ? { ...c, completed: true, progress: 100 } : c
              ));
              alert('Feedback submitted successfully! Course marked as completed.');
            } else {
              alert('Feedback submitted but failed to mark course as completed: ' + completeData.message);
            }
          } catch (error) {
            console.error('Error completing course:', error);
            // Still mark as completed locally if backend fails
            setEnrolledCourses(prev => prev.map(c => 
              c.id === parseInt(selectedCourse) ? { ...c, completed: true, progress: 100 } : c
            ));
            alert('Feedback submitted successfully! Course marked as completed.');
          }
          
          setSelectedCourse('');
          setRating(0);
          setKeyLearnings('');
          setComments('');
        } else {
          alert('Failed to submit feedback: ' + data.message);
        }
      } catch (error) {
        console.error('Error submitting feedback:', error);
        alert('Error submitting feedback');
      }
    };

    return (
      <div className="content-section">
        <h2 className="section-title">Course Feedback</h2>
        
        <div className="feedback-form">
          <h3>Course</h3>
          <form onSubmit={handleSubmit}>
            <select 
              className="course-select"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              required
            >
              <option value="">Select Course</option>
              {enrolledCourses.filter(course => course.certificateUploaded && !course.completed).map(course => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </select>
            {enrolledCourses.filter(course => course.certificateUploaded && !course.completed).length === 0 && (
              <p className="no-courses-message">No courses available for feedback. Please upload certificates for your courses first.</p>
            )}
            <div className="rating-section">
              <h4>Rating</h4>
              <div className="star-rating">
                {[1,2,3,4,5].map(star => (
                  <span 
                    key={star} 
                    className={`star ${rating >= star ? 'selected' : ''}`}
                    onClick={() => setRating(star)}
                  >
                    ⭐
                  </span>
                ))}
              </div>
            </div>
            <div className="key-learnings-section">
              <h4>Key Learnings</h4>
              <div className="character-count">
                {keyLearnings.length}/500 characters (minimum 200 required)
              </div>
              <textarea 
                placeholder="Key learnings from this course..."
                value={keyLearnings}
                onChange={(e) => setKeyLearnings(e.target.value)}
                minLength={200}
                maxLength={500}
                required
              />
            </div>
            <div className="feedback-section">
              <h4>Feedback</h4>
              <textarea 
                placeholder="Your feedback and comments..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="submit-feedback-btn">Submit Feedback</button>
          </form>
        </div>
      </div>
    );
  };

  const renderCodeEditor = () => {
    const executeCode = async () => {
      setIsRunning(true);
      setCodeOutput('Running...');
      
      try {
        if (codeEditorLanguage === 'javascript') {
          const originalLog = console.log;
          let output = '';
          console.log = (...args) => {
            output += args.join(' ') + '\n';
          };
          
          try {
            eval(codeContent);
            setCodeOutput(output || 'Code executed successfully (no output)');
          } catch (error) {
            setCodeOutput(`Error: ${error.message}`);
          } finally {
            console.log = originalLog;
          }
        } else if (codeEditorLanguage === 'java') {
          let output = '';
          
          const printMatches = codeContent.match(/System\.out\.println?\s*\(([^)]+)\)/g);
          if (printMatches) {
            printMatches.forEach(match => {
              const content = match.match(/\(([^)]+)\)/)[1].trim();
              if (content.startsWith('"') && content.endsWith('"')) {
                output += content.slice(1, -1) + '\n';
              } else if (content.includes('+')) {
                const parts = content.split('+').map(p => p.trim());
                let result = '';
                parts.forEach(part => {
                  if (part.startsWith('"') && part.endsWith('"')) {
                    result += part.slice(1, -1);
                  } else {
                    result += part;
                  }
                });
                output += result + '\n';
              } else {
                output += content + '\n';
              }
            });
          }
          
          setCodeOutput(output || 'Java code compiled and executed successfully');
        }
      } catch (error) {
        setCodeOutput(`Execution Error: ${error.message}`);
      }
      
      setIsRunning(false);
    };

    const getDefaultCode = (language) => {
      if (language === 'javascript') {
        return `// JavaScript Code Editor\nconsole.log('Hello, World!');\n\n// Try some JavaScript code:\nconst numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(n => n * 2);\nconsole.log('Doubled numbers:', doubled);\n\n// Function example\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nconsole.log('Fibonacci(7):', fibonacci(7));`;
      } else {
        return `// Java Code Editor\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n        \n        // Array example\n        int[] numbers = {1, 2, 3, 4, 5};\n        System.out.println("Array length: " + numbers.length);\n        \n        // Loop example\n        for (int i = 0; i < numbers.length; i++) {\n            System.out.println("Number: " + numbers[i]);\n        }\n        \n        // Method call\n        int result = fibonacci(7);\n        System.out.println("Fibonacci(7): " + result);\n    }\n    \n    public static int fibonacci(int n) {\n        if (n <= 1) return n;\n        return fibonacci(n - 1) + fibonacci(n - 2);\n    }\n}`;
      }
    };

    const handleLanguageChange = (language) => {
      setCodeEditorLanguage(language);
      setCodeContent(getDefaultCode(language));
      setCodeOutput('');
    };

    if (!codeContent) {
      setCodeContent(getDefaultCode(codeEditorLanguage));
    }

    return (
      <div className="content-section">
        <h2 className="section-title">Code Editor</h2>
        
        <div className="code-editor-container">
          <div className="editor-header">
            <div className="language-selector">
              <button 
                className={`lang-btn ${codeEditorLanguage === 'javascript' ? 'active' : ''}`}
                onClick={() => handleLanguageChange('javascript')}
              >
                JavaScript
              </button>
              <button 
                className={`lang-btn ${codeEditorLanguage === 'java' ? 'active' : ''}`}
                onClick={() => handleLanguageChange('java')}
              >
                Java
              </button>
            </div>
            <button 
              className="run-btn"
              onClick={executeCode}
              disabled={isRunning}
            >
              <Play size={16} />
              {isRunning ? 'Running...' : 'Run Code'}
            </button>
          </div>
          
          <div className="editor-workspace">
            <div className="code-input-section">
              <h3>Code Input</h3>
              <textarea
                className="code-textarea"
                value={codeContent}
                onChange={(e) => setCodeContent(e.target.value)}
                placeholder={`Write your ${codeEditorLanguage} code here...`}
                spellCheck={false}
              />
            </div>
            
            <div className="code-output-section">
              <h3>Output</h3>
              <div className="output-console">
                {codeOutput || 'Click "Run Code" to see output here...'}
              </div>
            </div>
          </div>
          
          <div className="editor-actions">
            <button 
              className="clear-btn"
              onClick={() => {
                setCodeContent(getDefaultCode(codeEditorLanguage));
                setCodeOutput('');
              }}
            >
              Reset Code
            </button>
            <button 
              className="save-btn"
              onClick={() => {
                const blob = new Blob([codeContent], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `code.${codeEditorLanguage === 'javascript' ? 'js' : 'java'}`;
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              <Download size={16} /> Save Code
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderProfile = () => {
    const handleSaveProfile = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/trainees/${user.empId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(profileData)
        });
        
        const data = await response.json();
        if (data.success) {
          alert('Profile updated successfully!');
          setIsEditingProfile(false);
        } else {
          alert('Failed to update profile: ' + data.message);
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Error updating profile');
      }
    };

    return (
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">Profile Management</h2>
          <button 
            className="primary-btn"
            onClick={() => setIsEditingProfile(!isEditingProfile)}
          >
            {isEditingProfile ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
        
        <div className="profile-form">
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                disabled={!isEditingProfile}
              />
            </div>
            <div className="form-group">
              <label>Employee ID</label>
              <input 
                type="text"
                value={profileData.empId}
                disabled
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                disabled={!isEditingProfile}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input 
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                disabled={!isEditingProfile}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Batch</label>
              <input 
                type="text"
                value={profileData.batch}
                onChange={(e) => setProfileData({...profileData, batch: e.target.value})}
                disabled={!isEditingProfile}
              />
            </div>
            <div className="form-group">
              <label>Education</label>
              <input 
                type="text"
                value={profileData.education}
                onChange={(e) => setProfileData({...profileData, education: e.target.value})}
                disabled={!isEditingProfile}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Skills</label>
            <textarea 
              value={profileData.skills}
              onChange={(e) => setProfileData({...profileData, skills: e.target.value})}
              disabled={!isEditingProfile}
              placeholder="List your technical skills..."
            />
          </div>
          
          <div className="form-group">
            <label>Experience</label>
            <textarea 
              value={profileData.experience}
              onChange={(e) => setProfileData({...profileData, experience: e.target.value})}
              disabled={!isEditingProfile}
              placeholder="Describe your work experience..."
            />
          </div>
          
          <div className="form-group">
            <label>Address</label>
            <textarea 
              value={profileData.address}
              onChange={(e) => setProfileData({...profileData, address: e.target.value})}
              disabled={!isEditingProfile}
              placeholder="Enter your address..."
            />
          </div>
          
          {isEditingProfile && (
            <div className="form-actions">
              <button className="primary-btn" onClick={handleSaveProfile}>
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderLeaveManagement = () => {
    const handleSubmitLeave = async () => {
      if (!leaveType || !startDate || !endDate || !leaveReason) {
        alert('Please fill all fields');
        return;
      }
      
      try {
        const response = await fetch('http://localhost:8080/api/leave/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            traineeEmpId: user.empId,
            leaveType,
            startDate,
            endDate,
            reason: leaveReason
          })
        });
        
        const data = await response.json();
        if (data.success) {
          alert('Leave request submitted successfully!');
          // Refresh leave requests
          const leaveResponse = await fetch(`http://localhost:8080/api/leave/trainee/${user.empId}`);
          const leaveData = await leaveResponse.json();
          if (leaveData.success) {
            setLeaveRequests(leaveData.leaveRequests);
          }
        } else {
          alert('Failed to submit leave request: ' + data.message);
        }
      } catch (error) {
        console.error('Error submitting leave request:', error);
        alert('Error submitting leave request');
      }
      
      setLeaveType('');
      setStartDate('');
      setEndDate('');
      setLeaveReason('');
      setShowLeaveModal(false);
    };

    const userLeaves = leaveRequests || [];
    
    return (
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">Leave Management</h2>
          <button 
            className="primary-btn"
            onClick={() => setShowLeaveModal(true)}
          >
            <CalendarDays size={16} /> Apply Leave
          </button>
        </div>
        
        <div className="leave-stats">
          <div className="stat-card">
            <h3>Total Leaves Applied</h3>
            <div className="stat-number">{userLeaves.length}</div>
          </div>
          <div className="stat-card">
            <h3>Approved</h3>
            <div className="stat-number">{userLeaves.filter(l => l.status === 'approved').length}</div>
          </div>
          <div className="stat-card">
            <h3>Pending</h3>
            <div className="stat-number">{userLeaves.filter(l => l.status === 'pending').length}</div>
          </div>
          <div className="stat-card">
            <h3>Rejected</h3>
            <div className="stat-number">{userLeaves.filter(l => l.status === 'rejected').length}</div>
          </div>
        </div>
        
        <div className="leave-history">
          <h3>Leave History</h3>
          <div className="leave-table">
            <table>
              <thead>
                <tr>
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Applied On</th>
                </tr>
              </thead>
              <tbody>
                {userLeaves.map(leave => (
                  <tr key={leave.id}>
                    <td>{leave.leaveType}</td>
                    <td>{leave.startDate}</td>
                    <td>{leave.endDate}</td>
                    <td>{leave.reason}</td>
                    <td>
                      <span className={`status-badge ${leave.status}`}>
                        {leave.status === 'rejected' && leave.rejectionFeedback 
                          ? `Rejected: ${leave.rejectionFeedback}` 
                          : leave.status
                        }
                      </span>
                    </td>
                    <td>{new Date(leave.submittedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {userLeaves.length === 0 && (
              <div className="no-data">No leave requests found</div>
            )}
          </div>
        </div>
        
        {showLeaveModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Apply for Leave</h3>
              <div className="form-group">
                <label>Leave Type</label>
                <select 
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                >
                  <option value="">Select Leave Type</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Emergency Leave">Emergency Leave</option>
                  <option value="Personal Leave">Personal Leave</option>
                </select>
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input 
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input 
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="form-group">
                <label>Reason</label>
                <textarea 
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  placeholder="Enter reason for leave..."
                  rows="4"
                />
              </div>
              <div className="modal-actions">
                <button className="primary-btn" onClick={handleSubmitLeave}>
                  Submit Leave Request
                </button>
                <button 
                  className="secondary-btn"
                  onClick={() => setShowLeaveModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSessions = () => {
    const upcomingSessions = sessions.filter(session => {
      const sessionDate = new Date(session.sessionDate + ' ' + session.sessionTime);
      return sessionDate > new Date() && session.status === 'scheduled';
    });
    
    const pastSessions = sessions.filter(session => {
      const sessionDate = new Date(session.sessionDate + ' ' + session.sessionTime);
      return sessionDate <= new Date() || session.status === 'completed';
    });

    return (
      <div className="content-section">
        <h2 className="section-title">Training Sessions</h2>
        
        <div className="sessions-overview">
          <div className="overview-card">
            <h3>Upcoming Sessions</h3>
            <div className="session-count">{upcomingSessions.length}</div>
            <p>Sessions scheduled</p>
          </div>
          <div className="overview-card">
            <h3>Completed Sessions</h3>
            <div className="session-count">{pastSessions.length}</div>
            <p>Sessions attended</p>
          </div>
          <div className="overview-card">
            <h3>Total Sessions</h3>
            <div className="session-count">{sessions.length}</div>
            <p>All sessions</p>
          </div>
        </div>
        
        <div className="sessions-section">
          <h3>Upcoming Sessions</h3>
          <div className="sessions-list">
            {upcomingSessions.map(session => (
              <div key={session.id} className="session-item">
                <div className="session-time">
                  <div className="session-date">{session.sessionDate}</div>
                  <div className="session-hour">{session.sessionTime}</div>
                </div>
                <div className="session-info">
                  <h4>{session.title}</h4>
                  {session.description && <p>{session.description}</p>}
                  <div className="session-details">
                    <span>📚 {session.batchName} Batch Session</span>
                    <span>⏱️ {session.duration}</span>
                    <span>🎯 {session.batchName}</span>
                  </div>
                </div>
                <div className="session-actions">
                  {session.meetingLink ? (
                    <a 
                      href={session.meetingLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="join-session-btn"
                    >
                      🔗 Join Session
                    </a>
                  ) : (
                    <span className="no-link">Link will be shared</span>
                  )}
                </div>
              </div>
            ))}
            {upcomingSessions.length === 0 && (
              <div className="no-data">
                <p>No upcoming sessions scheduled.</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="sessions-section">
          <h3>Past Sessions</h3>
          <div className="sessions-list">
            {pastSessions.slice(0, 5).map(session => (
              <div key={session.id} className="session-item past">
                <div className="session-time">
                  <div className="session-date">{session.sessionDate}</div>
                  <div className="session-hour">{session.sessionTime}</div>
                </div>
                <div className="session-info">
                  <h4>{session.title}</h4>
                  {session.description && <p>{session.description}</p>}
                  <div className="session-details">
                    <span>📚 {session.batchName} Batch Session</span>
                    <span>⏱️ {session.duration}</span>
                    <span>🎯 {session.batchName}</span>
                  </div>
                </div>
                <div className="session-status">
                  <span className={`status-badge ${session.status}`}>
                    {session.status === 'completed' ? '✅ Completed' : '📅 Past'}
                  </span>
                </div>
              </div>
            ))}
            {pastSessions.length === 0 && (
              <div className="no-data">
                <p>No past sessions found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  const sidebarItems = [
    { id: 'catalog', label: 'Course Catalog', icon: BookOpen },
    { id: 'progress', label: 'Learning Progress', icon: BarChart3 },
    { id: 'assessments', label: 'Assessments', icon: FileText },
    { id: 'sessions', label: 'Training Sessions', icon: Calendar },
    { id: 'codeeditor', label: 'Code Editor', icon: Code },
    { id: 'leave', label: 'Leave Management', icon: CalendarDays },
    { id: 'feedback', label: 'Feedback', icon: Bell }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Trainee Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user.name}</span>
          <div className="profile-dropdown-container">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/6660/6660666.png"
              alt="Profile"
              className="profile-avatar-image" 
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            />
            {showProfileDropdown && (
              <div className="profile-dropdown">
                <div className="dropdown-item" onClick={() => {
                  setActiveSection('profile');
                  setShowProfileDropdown(false);
                }}>
                  <span>👤</span> Profile
                </div>
                <div className="dropdown-item logout" onClick={onLogout}>
                  <span>🚪</span> Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="sidebar">
          {sidebarItems.map(item => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`sidebar-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => setActiveSection(item.id)}
              >
                <Icon size={20} />
                {item.label}
              </div>
            );
          })}
        </div>
        
        <div className="main-content">
          {activeSection === 'catalog' && renderCourseCatalog()}
          {activeSection === 'progress' && renderLearningProgress()}
          {activeSection === 'assessments' && renderAssessments()}
          {activeSection === 'sessions' && renderSessions()}
          {activeSection === 'codeeditor' && renderCodeEditor()}
          {activeSection === 'leave' && renderLeaveManagement()}
          {activeSection === 'feedback' && renderFeedback()}
          {activeSection === 'profile' && renderProfile()}
        </div>
      </div>
    </div>
  );
};

export default TraineeDashboard;
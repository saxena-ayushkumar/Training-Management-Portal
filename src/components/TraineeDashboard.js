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
    sessions, addEnrollmentRequest, submitCourseFeedback,
    leaveRequests, submitLeaveRequest, updateTraineeProfile,
    updateCourseCompletion
  } = useAppContext();
  const [activeSection, setActiveSection] = useState('catalog');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  // State
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [enrollmentRequests, setEnrollmentRequests] = useState([]);
  const [feedback, setFeedback] = useState([]);
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
    const activeCourses = courses.filter(course => course.status === 'active').map(course => ({
      ...course,
      enrolled: true,
      progress: Math.floor(Math.random() * 100),
      completedLessons: Math.floor(Math.random() * 20),
      totalLessons: 20,
      nextSession: '2024-01-20 10:00 AM',
      score: Math.floor(Math.random() * 100),
      started: false,
      completed: false,
      certificateUploaded: false
    }));
    setEnrolledCourses(activeCourses);
  }, [courses]);

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
    const filteredCourses = courses.filter(course => {
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
                  <span>👨🏫 {course.instructor}</span>
                  <span>👥 {course.enrolledCount} enrolled</span>
                </div>
                <div className="course-actions">
                  {enrolledCourse ? (
                    !enrolledCourse.started ? (
                      <button 
                        className="start-btn"
                        onClick={() => {
                          setEnrolledCourses(prev => prev.map(c => 
                            c.id === course.id ? { ...c, started: true } : c
                          ));
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
                            input.accept = '.pdf,.jpg,.png';
                            input.onchange = (e) => {
                              if (e.target.files[0]) {
                                setEnrolledCourses(prev => prev.map(c => 
                                  c.id === course.id ? { ...c, certificateUploaded: true } : c
                                ));
                                alert('Certificate uploaded successfully!');
                              }
                            };
                            input.click();
                          }}
                        >
                          📄 Upload Certificate
                        </button>
                        {enrolledCourse.certificateUploaded && (
                          <button 
                            className="mark-complete-btn"
                            onClick={() => {
                              setEnrolledCourses(prev => prev.map(c => 
                                c.id === course.id ? { ...c, completed: true } : c
                              ));
                              alert('Course marked as completed!');
                            }}
                          >
                            ✓ Mark Complete
                          </button>
                        )}
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

  const renderLearningProgress = () => (
    <div className="content-section">
      <h2 className="section-title">Learning Progress & Certifications</h2>
      
      <div className="progress-summary">
        <div className="summary-card">
          <h3>Overall Progress</h3>
          <div className="progress-circle">
            <span className="progress-percentage">78%</span>
          </div>
        </div>
        <div className="summary-card">
          <h3>Completed Courses</h3>
          <div className="completion-stats">
            <span className="completed-count">4</span>
            <span className="total-count">/ 6</span>
          </div>
        </div>
        <div className="summary-card">
          <h3>Average Score</h3>
          <div className="score-display">
            <span className="score">85%</span>
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
                  min="0" 
                  max="100" 
                  value={course.progress || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    const newProgress = value === '' ? 0 : Math.min(100, Math.max(0, parseInt(value) || 0));
                    setEnrolledCourses(prev => prev.map(c => 
                      c.id === course.id ? { ...c, progress: newProgress } : c
                    ));
                  }}
                  className="progress-input"
                  placeholder="0"
                />
                <span className="progress-percent">%</span>
              </div>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${course.progress || 0}%`}}></div>
            </div>
            <div className="progress-details">
              <span>Score: {course.score}%</span>
              {course.completed && <span className="certified-badge">🏆 Certified</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAssessments = () => {
    // Filter assignments based on trainee's batch and filter selection
    const traineeAssignments = assignments.filter(assignment => {
      // Assuming trainee belongs to a batch - you can modify this logic based on your batch system
      return true; // For now, show all assignments
    });

    const filteredAssignments = traineeAssignments.filter(assignment => {
      const userSubmission = assignment.submissions?.find(s => s.empId === (user.empId || 'EMP004'));
      const assignmentStatus = userSubmission ? userSubmission.status : 'pending';
      
      if (assignmentFilter === 'pending') {
        return assignmentStatus === 'pending' || !userSubmission;
      } else if (assignmentFilter === 'submitted') {
        return assignmentStatus === 'submitted';
      } else if (assignmentFilter === 'graded') {
        return assignmentStatus === 'graded';
      }
      return true; // 'all' filter
    });

    const pendingCount = traineeAssignments.filter(a => {
      const userSubmission = a.submissions?.find(s => s.empId === (user.empId || 'EMP004'));
      return !userSubmission || userSubmission.status === 'pending';
    }).length;

    const submittedCount = traineeAssignments.filter(a => {
      const userSubmission = a.submissions?.find(s => s.empId === (user.empId || 'EMP004'));
      return userSubmission && userSubmission.status === 'submitted';
    }).length;

    const gradedCount = traineeAssignments.filter(a => {
      const userSubmission = a.submissions?.find(s => s.empId === (user.empId || 'EMP004'));
      return userSubmission && userSubmission.status === 'graded';
    }).length;

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
          {filteredAssignments.map(assignment => {
            const course = enrolledCourses.find(c => c.id === assignment.courseId);
            const userSubmission = assignment.submissions?.find(s => s.empId === (user.empId || 'EMP004'));
            const assignmentStatus = userSubmission ? userSubmission.status : 'pending';
            const assignmentGrade = userSubmission?.grade;
            
            return (
              <div key={assignment.id} className="assignment-card">
                <div className="assignment-header">
                  <div className="assignment-title">
                    <h3>{assignment.title}</h3>
                    <span className={`type-badge ${assignment.type || 'assignment'}`}>{assignment.type || 'assignment'}</span>
                  </div>
                  <span className={`status-badge ${assignmentStatus}`}>{assignmentStatus}</span>
                </div>
                
                <p className="assignment-course">Course: {course?.title}</p>
                <p className="assignment-description">{assignment.description}</p>
                
                <div className="assignment-meta">
                  <div className="meta-item">
                    <Calendar size={14} />
                    <span>Due: {assignment.dueDate}</span>
                  </div>
                  <div className="meta-item">
                    <Award size={14} />
                    <span>Points: {assignment.points || 100}</span>
                  </div>
                </div>
                
                {assignmentGrade && (
                  <div className="assignment-grade">
                    <Star size={16} />
                    <span>Grade: {assignmentGrade}</span>
                  </div>
                )}
                
                <div className="assignment-actions">
                  {assignmentStatus === 'pending' && (
                    <button 
                      className="submit-btn"
                      onClick={() => {
                        setSelectedAssignment(assignment);
                        setShowSubmissionModal(true);
                      }}
                    >
                      <Upload size={14} /> Submit Assignment
                    </button>
                  )}
                  {assignmentStatus === 'submitted' && (
                    <button className="view-btn">
                      <Eye size={14} /> View Submission
                    </button>
                  )}
                  {assignmentStatus === 'graded' && (
                    <button className="feedback-btn">
                      <Eye size={14} /> View Feedback
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredAssignments.length === 0 && (
          <div className="no-data">
            <p>No assignments found for the selected filter.</p>
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
                  <label>Upload Files</label>
                  <div className="file-upload-area">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.zip,.js,.html,.css,.py,.java,.cpp,.txt"
                    />
                    <div className="upload-text">
                      <Upload size={24} />
                      <p>Click to upload files</p>
                      <small>Supported: PDF, DOC, ZIP, Code files</small>
                    </div>
                  </div>
                  
                  {uploadedFiles.length > 0 && (
                    <div className="uploaded-files">
                      <h4>Uploaded Files:</h4>
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="file-item">
                          <FileText size={16} />
                          <span>{file.name}</span>
                          <button onClick={() => setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))}>
                            Remove
                          </button>
                        </div>
                      ))}
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
    const handleSubmit = (e) => {
      e.preventDefault();
      if (!selectedCourse || rating === 0) {
        alert('Please select a course and rating');
        return;
      }
      handleSubmitFeedback(parseInt(selectedCourse), rating, comments);
      setSelectedCourse('');
      setRating(0);
      setComments('');
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
              {enrolledCourses.map(course => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </select>
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
              <textarea 
                placeholder="Key learnings from this course..."
                value={keyLearnings}
                onChange={(e) => setKeyLearnings(e.target.value)}
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

  const renderLeaveManagement = () => {
    const handleSubmitLeave = () => {
      if (!leaveType || !startDate || !endDate || !leaveReason) {
        alert('Please fill all fields');
        return;
      }
      
      submitLeaveRequest({
        traineeId: user.id,
        traineeName: user.name,
        empId: user.empId,
        leaveType,
        startDate,
        endDate,
        reason: leaveReason
      });
      
      setLeaveType('');
      setStartDate('');
      setEndDate('');
      setLeaveReason('');
      setShowLeaveModal(false);
      alert('Leave request submitted successfully!');
    };

    const userLeaves = leaveRequests.filter(leave => leave.empId === user.empId);
    
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
                        {leave.status}
                      </span>
                    </td>
                    <td>{leave.submittedAt}</td>
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
  const sidebarItems = [
    { id: 'catalog', label: 'Course Catalog', icon: BookOpen },
    { id: 'progress', label: 'Learning Progress', icon: BarChart3 },
    { id: 'assessments', label: 'Assessments', icon: FileText },
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
          {activeSection === 'codeeditor' && renderCodeEditor()}
          {activeSection === 'leave' && renderLeaveManagement()}
          {activeSection === 'feedback' && renderFeedback()}
        </div>
      </div>
    </div>
  );
};

export default TraineeDashboard;
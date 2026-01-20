import React, { useState, useEffect } from 'react';
import { 
  User, Users, FileText, Settings, Plus, Edit, Trash2, Download, Upload, 
  Calendar, BarChart3, Eye, BookOpen, Clock, Award, CheckCircle, 
  PlayCircle, PauseCircle, Activity, TrendingUp, UserCheck, Bell, CalendarDays
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './TrainerDashboard.css';

const TrainerDashboard = ({ user, onLogout }) => {
  const { 
    courses, addCourse, updateCourse, uploadCourseMaterial, 
    approveTraineeRequest, declineTraineeRequest,
    sessions, addSession, updateSessionAttendance,
    enrollmentRequests, approveEnrollmentRequest, rejectEnrollmentRequest,
    courseFeedback, leaveRequests, approveLeaveRequest, rejectLeaveRequest,
    batches, addBatch, assignTraineeToBatch
  } = useAppContext();
  // State
  const [trainees, setTrainees] = useState([]);
  const [batchesData, setBatchesData] = useState([]);
  const [traineeRequests, setTraineeRequests] = useState([]);
  const [activeSection, setActiveSection] = useState('analytics');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showTraineeRequestPopup, setShowTraineeRequestPopup] = useState(false);
  const [selectedBatchForRequest, setSelectedBatchForRequest] = useState({});
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [filteredTrainees, setFilteredTrainees] = useState([]);
  
  // Modal States
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [newBatch, setNewBatch] = useState({ name: '', description: '' });
  const [showEditCourseModal, setShowEditCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  
  // Form States
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    duration: '',
    status: 'draft',
    instructor: user.name,
    courseLink: ''
  });
  
  const [materialFile, setMaterialFile] = useState(null);

  // Filter trainees when batch selection changes
  useEffect(() => {
    if (selectedBatch) {
      setFilteredTrainees(trainees.filter(trainee => trainee.batch === selectedBatch.name));
    } else {
      setFilteredTrainees(trainees);
    }
  }, [selectedBatch, trainees]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch batches first
        const batchesResponse = await fetch(`http://localhost:8080/api/trainer/batches?trainerEmpId=${user.empId}`);
        const batchesData = await batchesResponse.json();
        console.log('Fetched batches:', batchesData);
        if (Array.isArray(batchesData)) {
          setBatchesData(batchesData);
        }
        
        // Fetch trainees
        const traineesResponse = await fetch(`http://localhost:8080/api/trainer/trainees?trainerEmpId=${user.empId}`);
        const traineesData = await traineesResponse.json();
        if (Array.isArray(traineesData)) {
          setTrainees(traineesData.map(trainee => ({
            id: trainee.id,
            name: trainee.name,
            email: trainee.email,
            empId: trainee.empId,
            batch: trainee.batchName,
            attendance: trainee.attendance,
            participation: trainee.participation,
            enrolledCourses: [trainee.enrolledCourses],
            courseCompletions: {},
            status: trainee.status
          })));
        }
        
        // Fetch pending trainees
        const pendingResponse = await fetch(`http://localhost:8080/api/trainer/pending-trainees?trainerEmpId=${user.empId}`);
        const pendingData = await pendingResponse.json();
        if (Array.isArray(pendingData)) {
          const formattedRequests = pendingData.map(trainee => ({
            id: trainee.id,
            name: trainee.name,
            email: trainee.email,
            empId: trainee.empId,
            trainerEmpId: trainee.trainerEmpId,
            skills: 'JavaScript, React, Node.js',
            requestDate: new Date().toISOString().split('T')[0],
            status: trainee.status
          }));
          setTraineeRequests(formattedRequests);
          if (formattedRequests.length > 0) {
            setShowTraineeRequestPopup(true);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, [user.empId]);
  
  // Session Management State
  const [newSession, setNewSession] = useState({
    courseId: '',
    title: '',
    date: '',
    time: '',
    duration: '',
    batch: ''
  });
  
  const [selectedSession, setSelectedSession] = useState(null);
  const [attendanceData, setAttendanceData] = useState({});
  
  // Assessment State
  const [assessments, setAssessments] = useState([
    {
      id: 1,
      title: 'React Basics Quiz',
      type: 'quiz',
      courseId: 1,
      questions: 10,
      duration: 30,
      totalMarks: 100,
      submissions: [],
      dueDate: '2024-01-25'
    }
  ]);
  
  const [newAssessment, setNewAssessment] = useState({
    title: '',
    type: 'quiz',
    courseId: '',
    questions: 10,
    duration: 30,
    totalMarks: 100,
    dueDate: ''
  });

  // Course Management Functions
  const handleCreateCourse = (e) => {
    e.preventDefault();
    addCourse(newCourse);
    setNewCourse({ title: '', description: '', duration: '', status: 'draft', instructor: user.name, courseLink: '' });
    setShowCourseModal(false);
  };

  const toggleCourseStatus = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    updateCourse(courseId, { 
      status: course.status === 'active' ? 'inactive' : 'active' 
    });
  };

  const handleMaterialUpload = (e) => {
    e.preventDefault();
    if (materialFile && selectedCourse) {
      uploadCourseMaterial(selectedCourse.id, materialFile.name);
      setMaterialFile(null);
      setShowMaterialModal(false);
      setSelectedCourse(null);
    }
  };

  const handleApproveTrainee = async (traineeId, batchName) => {
    if (!batchName) {
      alert('Please select a batch before approving');
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:8080/api/trainer/approve-trainee/${traineeId}?batchName=${encodeURIComponent(batchName)}`, {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Remove from local state
        setTraineeRequests(prev => prev.filter(t => t.id !== traineeId));
        
        // Refresh trainees and batches data
        const traineesResponse = await fetch(`http://localhost:8080/api/trainer/trainees?trainerEmpId=${user.empId}`);
        const traineesData = await traineesResponse.json();
        if (Array.isArray(traineesData)) {
          setTrainees(traineesData.map(trainee => ({
            id: trainee.id,
            name: trainee.name,
            email: trainee.email,
            empId: trainee.empId,
            batch: trainee.batchName,
            attendance: trainee.attendance,
            participation: trainee.participation,
            enrolledCourses: [trainee.enrolledCourses],
            courseCompletions: {},
            status: trainee.status
          })));
        }
        
        // Refresh batches
        const batchesResponse = await fetch(`http://localhost:8080/api/trainer/batches?trainerEmpId=${user.empId}`);
        const batchesData = await batchesResponse.json();
        if (Array.isArray(batchesData)) {
          setBatchesData(batchesData);
        }
        
        alert('Trainee approved successfully!');
      } else {
        alert('Failed to approve trainee: ' + data.message);
      }
    } catch (error) {
      console.error('Error approving trainee:', error);
      alert('Error approving trainee');
    }
  };

  const handleRejectTrainee = async (traineeId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/trainer/reject-trainee/${traineeId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Remove from local state
        setTraineeRequests(prev => prev.filter(t => t.id !== traineeId));
        // Also update context if needed
        declineTraineeRequest(traineeId);
        alert('Trainee request declined');
      } else {
        alert('Failed to reject trainee: ' + data.message);
      }
    } catch (error) {
      console.error('Error rejecting trainee:', error);
      alert('Error rejecting trainee');
    }
  };

  // Session Management Functions
  const handleCreateSession = (e) => {
    e.preventDefault();
    addSession(newSession);
    setNewSession({ courseId: '', title: '', date: '', time: '', duration: '', batch: '' });
    setShowSessionModal(false);
    alert('Session scheduled successfully!');
  };

  // Attendance Functions
  const handleMarkAttendance = (sessionId) => {
    setSelectedSession(sessions.find(s => s.id === sessionId));
    const initialAttendance = {};
    trainees.forEach(trainee => {
      initialAttendance[trainee.id] = false;
    });
    setAttendanceData(initialAttendance);
    setShowAttendanceModal(true);
  };

  const saveAttendance = () => {
    const attendeeIds = Object.keys(attendanceData).filter(id => attendanceData[id]);
    updateSessionAttendance(selectedSession.id, attendeeIds);
    setShowAttendanceModal(false);
    alert('Attendance saved successfully!');
  };

  const handleCreateBatch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/trainer/batches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          name: newBatch.name,
          description: newBatch.description,
          trainerEmpId: user.empId
        })
      });
      
      const data = await response.json();
      if (data.success) {
        // Refresh batches data
        const batchesResponse = await fetch(`http://localhost:8080/api/trainer/batches?trainerEmpId=${user.empId}`);
        const batchesData = await batchesResponse.json();
        if (Array.isArray(batchesData)) {
          setBatchesData(batchesData);
        }
        
        setNewBatch({ name: '', description: '' });
        setShowBatchModal(false);
        alert('Batch created successfully!');
      } else {
        alert('Failed to create batch: ' + data.message);
      }
    } catch (error) {
      console.error('Error creating batch:', error);
      alert('Error creating batch');
    }
  };

  const handleAssignToBatch = (traineeId, batchId) => {
    assignTraineeToBatch(traineeId, parseInt(batchId));
    alert('Trainee assigned to batch successfully!');
  };

  const handleBatchTransfer = async (traineeId, newBatchName) => {
    console.log('Transfer request:', { traineeId, newBatchName });
    
    if (!newBatchName) {
      alert('Please select a batch');
      return;
    }
    
    try {
      const url = `http://localhost:8080/api/trainer/approve-trainee/${traineeId}?batchName=${encodeURIComponent(newBatchName)}`;
      console.log('Request URL:', url);
      
      const response = await fetch(url, {
        method: 'POST'
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        // Refresh data
        const traineesResponse = await fetch(`http://localhost:8080/api/trainer/trainees?trainerEmpId=${user.empId}`);
        const traineesData = await traineesResponse.json();
        if (Array.isArray(traineesData)) {
          setTrainees(traineesData.map(trainee => ({
            id: trainee.id,
            name: trainee.name,
            email: trainee.email,
            empId: trainee.empId,
            batch: trainee.batchName,
            attendance: trainee.attendance,
            participation: trainee.participation,
            enrolledCourses: [trainee.enrolledCourses],
            courseCompletions: {},
            status: trainee.status
          })));
        }
        
        // Refresh batches
        const batchesResponse = await fetch(`http://localhost:8080/api/trainer/batches?trainerEmpId=${user.empId}`);
        const batchesData = await batchesResponse.json();
        if (Array.isArray(batchesData)) {
          setBatchesData(batchesData);
        }
        
        alert('Trainee transferred successfully!');
      } else {
        alert('Failed to transfer trainee: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error transferring trainee:', error);
      alert('Error transferring trainee: ' + error.message);
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setShowEditCourseModal(true);
  };

  const handleUpdateCourse = (e) => {
    e.preventDefault();
    updateCourse(editingCourse.id, editingCourse);
    setShowEditCourseModal(false);
    setEditingCourse(null);
    alert('Course updated successfully!');
  };

  // Enrollment Management
  const handleApproveEnrollment = (requestId) => {
    approveEnrollmentRequest(requestId);
    alert('Enrollment approved successfully!');
  };

  const handleRejectEnrollment = (requestId) => {
    rejectEnrollmentRequest(requestId);
    alert('Enrollment request rejected.');
  };

  // Assessment Functions
  const handleCreateAssessment = (e) => {
    e.preventDefault();
    const assessment = {
      id: Date.now(),
      ...newAssessment,
      submissions: []
    };
    setAssessments([...assessments, assessment]);
    setNewAssessment({ title: '', type: 'quiz', courseId: '', questions: 10, duration: 30, totalMarks: 100, dueDate: '' });
    setShowAssessmentModal(false);
    alert('Assessment created successfully!');
  };

  // Render Functions
  const renderCourseManagement = () => (
    <div className="content-section">
      <div className="section-header">
        <h2 className="section-title">Course Management</h2>
        <button className="primary-btn" onClick={() => setShowCourseModal(true)}>
          <Plus size={16} /> Create Course
        </button>
      </div>
      
      <div className="courses-grid">
        {courses.map(course => (
          <div key={course.id} className="course-card">
            <div className="course-header">
              <h3>{course.title}</h3>
              <div className="course-actions">
                <button className="icon-btn edit" title="Edit Course" onClick={() => handleEditCourse(course)}>
                  <Edit size={16} />
                </button>
                <button 
                  className={`status-btn ${course.status}`}
                  onClick={() => toggleCourseStatus(course.id)}
                >
                  {course.status === 'active' ? <PauseCircle size={16} /> : <PlayCircle size={16} />}
                </button>
              </div>
            </div>
            <p className="course-description">{course.description}</p>
            <div className="course-stats">
              <span><Users size={14} /> {course.enrolledCount} enrolled</span>
              <span><Clock size={14} /> {course.duration}</span>
              <span className={`status-badge ${course.status}`}>{course.status}</span>
            </div>
            {course.courseLink && (
              <div className="course-link">
                <a href={course.courseLink} target="_blank" rel="noopener noreferrer" className="link-btn">
                  🔗 Course Link
                </a>
              </div>
            )}
            <div className="course-materials">
              <h4>Materials ({course.materials.length})</h4>
              <button 
                className="upload-btn"
                onClick={() => {
                  setSelectedCourse(course);
                  setShowMaterialModal(true);
                }}
              >
                <Upload size={14} /> Upload Material
              </button>
            </div>
          </div>
        ))}
      </div>

      {showCourseModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Create New Course</h3>
            <form onSubmit={handleCreateCourse}>
              <div className="form-group">
                <label>Course Title</label>
                <input
                  type="text"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Duration</label>
                <input
                  type="text"
                  value={newCourse.duration}
                  onChange={(e) => setNewCourse({...newCourse, duration: e.target.value})}
                  placeholder="e.g., 8 weeks"
                  required
                />
              </div>
              <div className="form-group">
                <label>Course Link (Optional)</label>
                <input
                  type="url"
                  value={newCourse.courseLink}
                  onChange={(e) => setNewCourse({...newCourse, courseLink: e.target.value})}
                  placeholder="https://example.com/course"
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={newCourse.status}
                  onChange={(e) => setNewCourse({...newCourse, status: e.target.value})}
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="primary-btn">Create Course</button>
                <button type="button" className="secondary-btn" onClick={() => setShowCourseModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showMaterialModal && selectedCourse && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Upload Material - {selectedCourse.title}</h3>
            <form onSubmit={handleMaterialUpload}>
              <div className="form-group">
                <label>Select File</label>
                <input
                  type="file"
                  onChange={(e) => setMaterialFile(e.target.files[0])}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="primary-btn">Upload Material</button>
                <button type="button" className="secondary-btn" onClick={() => {
                  setShowMaterialModal(false);
                  setSelectedCourse(null);
                  setMaterialFile(null);
                }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Course Modal */}
      {showEditCourseModal && editingCourse && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Course</h3>
            <form onSubmit={handleUpdateCourse}>
              <div className="form-group">
                <label>Course Title</label>
                <input
                  type="text"
                  value={editingCourse.title}
                  onChange={(e) => setEditingCourse({...editingCourse, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={editingCourse.description}
                  onChange={(e) => setEditingCourse({...editingCourse, description: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Duration</label>
                <input
                  type="text"
                  value={editingCourse.duration}
                  onChange={(e) => setEditingCourse({...editingCourse, duration: e.target.value})}
                  placeholder="e.g., 8 weeks"
                  required
                />
              </div>
              <div className="form-group">
                <label>Course Link (Optional)</label>
                <input
                  type="url"
                  value={editingCourse.courseLink || ''}
                  onChange={(e) => setEditingCourse({...editingCourse, courseLink: e.target.value})}
                  placeholder="https://example.com/course"
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={editingCourse.status}
                  onChange={(e) => setEditingCourse({...editingCourse, status: e.target.value})}
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="primary-btn">Update Course</button>
                <button type="button" className="secondary-btn" onClick={() => {
                  setShowEditCourseModal(false);
                  setEditingCourse(null);
                }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderSessionManagement = () => (
    <div className="content-section">
      <div className="section-header">
        <h2 className="section-title">Session Management</h2>
        <button className="primary-btn" onClick={() => setShowSessionModal(true)}>
          <Plus size={16} /> Schedule Session
        </button>
      </div>
      
      <div className="sessions-timeline">
        {sessions.map(session => {
          const course = courses.find(c => c.id === session.courseId);
          return (
            <div key={session.id} className="session-card">
              <div className="session-info">
                <h3>{session.title}</h3>
                <p>Course: {course?.title}</p>
                <div className="session-details">
                  <span><Calendar size={14} /> {session.date}</span>
                  <span><Clock size={14} /> {session.time}</span>
                  <span><Users size={14} /> {session.batch}</span>
                </div>
              </div>
              <div className="session-actions">
                <button 
                  className="attendance-btn"
                  onClick={() => handleMarkAttendance(session.id)}
                >
                  <UserCheck size={16} /> Mark Attendance
                </button>
                <span className={`status-badge ${session.status}`}>{session.status}</span>
              </div>
            </div>
          );
        })}
      </div>

      {showSessionModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Schedule New Session</h3>
            <form onSubmit={handleCreateSession}>
              <div className="form-group">
                <label>Course</label>
                <select
                  value={newSession.courseId}
                  onChange={(e) => setNewSession({...newSession, courseId: e.target.value})}
                  required
                >
                  <option value="">Select Course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Session Title</label>
                <input
                  type="text"
                  value={newSession.title}
                  onChange={(e) => setNewSession({...newSession, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={newSession.date}
                  onChange={(e) => setNewSession({...newSession, date: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input
                  type="time"
                  value={newSession.time}
                  onChange={(e) => setNewSession({...newSession, time: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Duration</label>
                <input
                  type="text"
                  value={newSession.duration}
                  onChange={(e) => setNewSession({...newSession, duration: e.target.value})}
                  placeholder="e.g., 2 hours"
                  required
                />
              </div>
              <div className="form-group">
                <label>Batch</label>
                <input
                  type="text"
                  value={newSession.batch}
                  onChange={(e) => setNewSession({...newSession, batch: e.target.value})}
                  placeholder="e.g., Batch A"
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="primary-btn">Schedule Session</button>
                <button type="button" className="secondary-btn" onClick={() => setShowSessionModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAttendanceModal && selectedSession && (
        <div className="modal-overlay">
          <div className="modal large">
            <h3>Mark Attendance - {selectedSession.title}</h3>
            <div className="attendance-list">
              {trainees.map(trainee => (
                <div key={trainee.id} className="attendance-item">
                  <div className="trainee-info">
                    <span className="trainee-name">{trainee.name}</span>
                    <span className="trainee-id">{trainee.empId}</span>
                  </div>
                  <label className="attendance-checkbox">
                    <input
                      type="checkbox"
                      checked={attendanceData[trainee.id] || false}
                      onChange={(e) => setAttendanceData({
                        ...attendanceData,
                        [trainee.id]: e.target.checked
                      })}
                    />
                    <span className="checkmark"></span>
                    Present
                  </label>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button className="primary-btn" onClick={saveAttendance}>Save Attendance</button>
              <button className="secondary-btn" onClick={() => setShowAttendanceModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderTraineeManagement = () => (
    <div className="content-section">
      <div className="section-header">
        <h2 className="section-title">Trainee Management</h2>
        <button className="primary-btn" onClick={() => setShowBatchModal(true)}>
          <Plus size={16} /> Create Batch
        </button>
      </div>
      
      {/* Pending Trainee Requests */}
      {traineeRequests.length > 0 && (
        <div className="pending-requests-section">
          <h3>Pending Trainee Requests ({traineeRequests.length})</h3>
          <div className="requests-grid">
            {traineeRequests.map(trainee => (
              <div key={trainee.id} className="trainee-request-card">
                <div className="trainee-request-header">
                  <div className="trainee-info">
                    <div className="trainee-name">{trainee.name}</div>
                    <div className="trainee-email">{trainee.email}</div>
                    <div className="trainee-skills">Skills: {trainee.skills}</div>
                  </div>
                  <div className="trainee-actions">
                    <div className="batch-selection">
                      <label>Assign to Batch:</label>
                      <select 
                        value={selectedBatchForRequest[trainee.id] || ''}
                        onChange={(e) => setSelectedBatchForRequest(prev => ({...prev, [trainee.id]: e.target.value}))}
                      >
                        <option value="">Select Batch</option>
                        {batchesData.map(batch => (
                          <option key={batch.id} value={batch.name}>{batch.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="action-buttons">
                      <button 
                        className="accept-btn"
                        onClick={() => handleApproveTrainee(trainee.id, selectedBatchForRequest[trainee.id])}
                        disabled={!selectedBatchForRequest[trainee.id]}
                      >
                        ✓ Approve
                      </button>
                      <button 
                        className="decline-btn"
                        onClick={() => handleRejectTrainee(trainee.id)}
                      >
                        ✗ Decline
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Batch Overview */}
      <div className="batch-overview">
        <h3>Batches</h3>
        <div className="batches-grid">
          <div 
            className={`batch-card ${!selectedBatch ? 'selected' : ''}`}
            onClick={() => setSelectedBatch(null)}
          >
            <h4>All Batches</h4>
            <p>View all trainees</p>
            <span className="trainee-count">{trainees.length} trainees</span>
          </div>
          {batchesData.map(batch => (
            <div 
              key={batch.id} 
              className={`batch-card ${selectedBatch?.id === batch.id ? 'selected' : ''}`}
              onClick={() => setSelectedBatch(batch)}
            >
              <h4>{batch.name}</h4>
              <p>{batch.description}</p>
              <span className="trainee-count">{batch.traineeCount} trainees</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Trainee Details */}
      <div className="trainee-details-section">
        <h3>{selectedBatch ? `Trainees in ${selectedBatch.name}` : 'All Trainees'}</h3>
        <div className="trainee-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Employee ID</th>
                <th>Email</th>
                <th>Batch</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrainees.map(trainee => (
                <tr key={trainee.id}>
                  <td>
                    <div className="trainee-cell">
                      {/* <img 
                        src={trainee.profilePicture || "https://via.placeholder.com/30"} 
                        alt="Trainee" 
                        className="table-avatar"
                      /> */}
                      {trainee.name}
                    </div>
                  </td>
                  <td>{trainee.empId}</td>
                  <td>{trainee.email}</td>
                  <td>
                    <span className="batch-badge">
                      {trainee.batch || 'No Batch'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${trainee.status || 'active'}`}>
                      {trainee.status || 'Active'}
                    </span>
                  </td>
                  <td>
                    <select 
                      value={trainee.batch || ''}
                      onChange={(e) => handleBatchTransfer(trainee.id, e.target.value)}
                      className="batch-transfer-select"
                    >
                      <option value="">No Batch</option>
                      {batchesData.map(batch => (
                        <option key={batch.id} value={batch.name}>{batch.name}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTrainees.length === 0 && (
            <div className="no-data">
              {selectedBatch ? `No trainees found in ${selectedBatch.name}` : 'No trainees found'}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderAssessments = () => (
    <div className="content-section">
      <div className="section-header">
        <h2 className="section-title">Assessments & Evaluation</h2>
        <button className="primary-btn" onClick={() => setShowAssessmentModal(true)}>
          <Plus size={16} /> Create Assessment
        </button>
      </div>
      
      <div className="assessments-grid">
        {assessments.map(assessment => {
          const course = courses.find(c => c.id === assessment.courseId);
          return (
            <div key={assessment.id} className="assessment-card">
              <div className="assessment-header">
                <h3>{assessment.title}</h3>
                <span className={`type-badge ${assessment.type}`}>{assessment.type}</span>
              </div>
              <p>Course: {course?.title}</p>
              <div className="assessment-stats">
                <span>Questions: {assessment.questions}</span>
                <span>Duration: {assessment.duration} min</span>
                <span>Total Marks: {assessment.totalMarks}</span>
              </div>
              <div className="assessment-actions">
                <button className="view-btn">
                  <Eye size={14} /> View Submissions
                </button>
                <button className="edit-btn">
                  <Edit size={14} /> Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showAssessmentModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Create Assessment</h3>
            <form onSubmit={handleCreateAssessment}>
              <div className="form-group">
                <label>Assessment Title</label>
                <input
                  type="text"
                  value={newAssessment.title}
                  onChange={(e) => setNewAssessment({...newAssessment, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select
                  value={newAssessment.type}
                  onChange={(e) => setNewAssessment({...newAssessment, type: e.target.value})}
                >
                  <option value="quiz">Quiz</option>
                  <option value="assignment">Assignment</option>
                  <option value="exam">Exam</option>
                </select>
              </div>
              <div className="form-group">
                <label>Course</label>
                <select
                  value={newAssessment.courseId}
                  onChange={(e) => setNewAssessment({...newAssessment, courseId: e.target.value})}
                  required
                >
                  <option value="">Select Course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Number of Questions</label>
                <input
                  type="number"
                  value={newAssessment.questions}
                  onChange={(e) => setNewAssessment({...newAssessment, questions: parseInt(e.target.value)})}
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Duration (minutes)</label>
                <input
                  type="number"
                  value={newAssessment.duration}
                  onChange={(e) => setNewAssessment({...newAssessment, duration: parseInt(e.target.value)})}
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Total Marks</label>
                <input
                  type="number"
                  value={newAssessment.totalMarks}
                  onChange={(e) => setNewAssessment({...newAssessment, totalMarks: parseInt(e.target.value)})}
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={newAssessment.dueDate}
                  onChange={(e) => setNewAssessment({...newAssessment, dueDate: e.target.value})}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="primary-btn">Create Assessment</button>
                <button type="button" className="secondary-btn" onClick={() => setShowAssessmentModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderReports = () => (
    <div className="content-section">
      <h2 className="section-title">Reports & Insights</h2>
      
      <div className="reports-grid">
        <div className="report-card">
          <div className="report-header">
            <h3>Training Completion Report</h3>
            <TrendingUp className="report-icon" />
          </div>
          <div className="report-stats">
            <div className="stat">
              <span className="stat-number">85%</span>
              <span className="stat-label">Average Completion</span>
            </div>
            <div className="stat">
              <span className="stat-number">23</span>
              <span className="stat-label">Completed Courses</span>
            </div>
          </div>
          <button className="download-btn">
            <Download size={14} /> Download Report
          </button>
        </div>

        <div className="report-card">
          <div className="report-header">
            <h3>Performance Analytics</h3>
            <BarChart3 className="report-icon" />
          </div>
          <div className="report-stats">
            <div className="stat">
              <span className="stat-number">78%</span>
              <span className="stat-label">Average Score</span>
            </div>
            <div className="stat">
              <span className="stat-number">156</span>
              <span className="stat-label">Assessments Taken</span>
            </div>
          </div>
          <button className="download-btn">
            <Download size={14} /> Download Report
          </button>
        </div>

        <div className="report-card">
          <div className="report-header">
            <h3>Attendance Report</h3>
            <Activity className="report-icon" />
          </div>
          <div className="report-stats">
            <div className="stat">
              <span className="stat-number">92%</span>
              <span className="stat-label">Average Attendance</span>
            </div>
            <div className="stat">
              <span className="stat-number">45</span>
              <span className="stat-label">Sessions Conducted</span>
            </div>
          </div>
          <button className="download-btn">
            <Download size={14} /> Download Report
          </button>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="content-section">
      <h2 className="section-title">Profile Settings</h2>
      <div className="profile-form">
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" defaultValue={user.name} />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" defaultValue={user.email} />
        </div>
        <div className="form-group">
          <label>Employee ID</label>
          <input type="text" defaultValue={user.empId} />
        </div>
        <div className="form-group">
          <label>Department</label>
          <input type="text" placeholder="Training Department" />
        </div>
        <button className="save-btn">Save Changes</button>
      </div>
    </div>
  );

  const renderAttendanceTracker = () => (
    <div className="content-section">
      <h2 className="section-title">Attendance Tracker</h2>
      
      <div className="attendance-overview">
        <div className="overview-card">
          <h3>Today's Sessions</h3>
          <div className="session-count">3</div>
          <p>Sessions scheduled</p>
        </div>
        <div className="overview-card">
          <h3>Present Today</h3>
          <div className="session-count">22/25</div>
          <p>Trainees present</p>
        </div>
        <div className="overview-card">
          <h3>Weekly Average</h3>
          <div className="session-count">88%</div>
          <p>Attendance rate</p>
        </div>
      </div>

      <div className="attendance-calendar">
        <h3>Attendance Calendar</h3>
        <div className="calendar-placeholder">
          <p>Calendar view showing attendance patterns</p>
        </div>
      </div>
    </div>
  );

  const renderLeaveManagement = () => {
    const pendingLeaves = leaveRequests.filter(leave => leave.status === 'pending');
    const allLeaves = leaveRequests;
    
    return (
      <div className="content-section">
        <h2 className="section-title">Leave Management</h2>
        
        <div className="leave-stats">
          <div className="stat-card">
            <h3>Pending Requests</h3>
            <div className="stat-number">{pendingLeaves.length}</div>
          </div>
          <div className="stat-card">
            <h3>Approved</h3>
            <div className="stat-number">{allLeaves.filter(l => l.status === 'approved').length}</div>
          </div>
          <div className="stat-card">
            <h3>Rejected</h3>
            <div className="stat-number">{allLeaves.filter(l => l.status === 'rejected').length}</div>
          </div>
          <div className="stat-card">
            <h3>Total Requests</h3>
            <div className="stat-number">{allLeaves.length}</div>
          </div>
        </div>
        
        <div className="leave-requests-section">
          <h3>Pending Leave Requests</h3>
          <div className="leave-requests-grid">
            {pendingLeaves.map(leave => (
              <div key={leave.id} className="leave-request-card">
                <div className="leave-header">
                  <h4>{leave.traineeName}</h4>
                  <span className="leave-type-badge">{leave.leaveType}</span>
                </div>
                <div className="leave-details">
                  <p><strong>Employee ID:</strong> {leave.empId}</p>
                  <p><strong>Duration:</strong> {leave.startDate} to {leave.endDate}</p>
                  <p><strong>Reason:</strong> {leave.reason}</p>
                  <p><strong>Applied on:</strong> {leave.submittedAt}</p>
                </div>
                <div className="leave-actions">
                  <button 
                    className="accept-btn"
                    onClick={() => {
                      approveLeaveRequest(leave.id);
                      alert('Leave request approved!');
                    }}
                  >
                    ✓ Approve
                  </button>
                  <button 
                    className="decline-btn"
                    onClick={() => {
                      rejectLeaveRequest(leave.id);
                      alert('Leave request rejected!');
                    }}
                  >
                    ✗ Reject
                  </button>
                </div>
              </div>
            ))}
            {pendingLeaves.length === 0 && (
              <div className="no-data">No pending leave requests</div>
            )}
          </div>
        </div>
        
        <div className="leave-history-section">
          <h3>All Leave Requests</h3>
          <div className="leave-table">
            <table>
              <thead>
                <tr>
                  <th>Trainee Name</th>
                  <th>Employee ID</th>
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Applied On</th>
                </tr>
              </thead>
              <tbody>
                {allLeaves.map(leave => (
                  <tr key={leave.id}>
                    <td>{leave.traineeName}</td>
                    <td>{leave.empId}</td>
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
            {allLeaves.length === 0 && (
              <div className="no-data">No leave requests found</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderAnalytics = () => (
    <div className="content-section">
      <h2 className="section-title">Analytics Dashboard</h2>
      
      <div className="analytics-overview">
        <div className="analytics-card">
          <div className="analytics-icon">
            <Users size={24} />
          </div>
          <div className="analytics-content">
            <h3>{trainees.length}</h3>
            <p>Total Trainees</p>
          </div>
        </div>
        <div className="analytics-card">
          <div className="analytics-icon">
            <BookOpen size={24} />
          </div>
          <div className="analytics-content">
            <h3>{courses.length}</h3>
            <p>Active Courses</p>
          </div>
        </div>
        <div className="analytics-card">
          <div className="analytics-icon">
            <Calendar size={24} />
          </div>
          <div className="analytics-content">
            <h3>{sessions.length}</h3>
            <p>Sessions Conducted</p>
          </div>
        </div>
        <div className="analytics-card">
          <div className="analytics-icon">
            <CalendarDays size={24} />
          </div>
          <div className="analytics-content">
            <h3>{leaveRequests.length}</h3>
            <p>Leave Requests</p>
          </div>
        </div>
      </div>
      
      <div className="analytics-charts">
        <div className="chart-container">
          <h3>Trainee Performance</h3>
          <div className="chart-placeholder">
            <BarChart3 size={48} />
            <p>Performance analytics chart would be displayed here</p>
          </div>
        </div>
        <div className="chart-container">
          <h3>Course Completion Rate</h3>
          <div className="chart-placeholder">
            <TrendingUp size={48} />
            <p>Course completion analytics would be displayed here</p>
          </div>
        </div>
      </div>
      
      <div className="trainee-details-section">
        <h3>Trainee Details</h3>
        <div className="trainee-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Employee ID</th>
                <th>Email</th>
                <th>Batch</th>
                <th>Enrolled Courses</th>
                <th>Course Completion</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {trainees.map(trainee => {
                const assignedBatch = batches.find(b => b.trainees.includes(trainee.id));
                return (
                  <tr key={trainee.id}>
                    <td>
                      <div className="trainee-cell">
                        {/* <img 
                          src={trainee.profilePicture || "https://via.placeholder.com/30"} 
                          alt="Trainee" 
                          className="table-avatar"
                        /> */}
                        {trainee.name}
                      </div>
                    </td>
                    <td>{trainee.empId}</td>
                    <td>{trainee.email}</td>
                    <td>
                      <span className="batch-badge">
                        {trainee.batch || 'No Batch'}
                      </span>
                    </td>
                    <td>{trainee.enrolledCourses?.length || 0}</td>
                    <td>
                      <div className="completion-status">
                        {Object.keys(trainee.courseCompletions || {}).filter(courseId => 
                          trainee.courseCompletions[courseId]
                        ).length} / {trainee.enrolledCourses?.length || 0} completed
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${trainee.status || 'active'}`}>
                        {trainee.status || 'Active'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {trainees.length === 0 && (
            <div className="no-data">No trainees found</div>
          )}
        </div>
      </div>
    </div>
  );

  const sidebarItems = [
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'courses', label: 'Course Management', icon: BookOpen },
    { id: 'sessions', label: 'Session Management', icon: Calendar },
    { id: 'trainees', label: 'Trainee Management', icon: Users },
    { id: 'assessments', label: 'Assessments', icon: Award },
    { id: 'leave', label: 'Leave Management', icon: CalendarDays },
    { id: 'attendance', label: 'Attendance Tracker', icon: CheckCircle }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">👨‍🏫 Trainer Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user.name}</span>
          <div className="notification-bell" onClick={() => setShowTraineeRequestPopup(true)}>
            <Bell size={20} />
            <span className="notification-count">{traineeRequests.length + enrollmentRequests.length}</span>
          </div>
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
                  <User size={16} /> View Profile
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
          {activeSection === 'analytics' && renderAnalytics()}
          {activeSection === 'courses' && renderCourseManagement()}
          {activeSection === 'sessions' && renderSessionManagement()}
          {activeSection === 'trainees' && renderTraineeManagement()}
          {activeSection === 'assessments' && renderAssessments()}
          {activeSection === 'leave' && renderLeaveManagement()}
          {activeSection === 'attendance' && renderAttendanceTracker()}
          {activeSection === 'profile' && renderProfile()}
        </div>
      </div>
      
      {/* Trainee Request Popup */}
      {showTraineeRequestPopup && (
        <div className="modal-overlay">
          <div className="modal large">
            <div className="modal-header">
              <h3>Pending Requests ({traineeRequests.length + enrollmentRequests.length})</h3>
              <button 
                className="close-btn"
                onClick={() => setShowTraineeRequestPopup(false)}
              >
                ×
              </button>
            </div>
            <div className="trainee-requests-popup">
              {traineeRequests.length === 0 && enrollmentRequests.length === 0 ? (
                <p>No pending requests</p>
              ) : (
                <>
                  {traineeRequests.map(trainee => (
                    <div key={trainee.id} className="trainee-request-card">
                      <div className="trainee-request-header">
                        <div className="trainee-info">
                          <div className="trainee-name">{trainee.name}</div>
                          <div className="trainee-email">{trainee.email}</div>
                          <div className="trainee-skills">Skills: {trainee.skills}</div>
                          <div className="request-type">Type: New Trainee Registration</div>
                        </div>
                        <div className="trainee-actions">
                          <div className="batch-selection">
                            <label>Assign to Batch:</label>
                            <select 
                              value={selectedBatchForRequest[trainee.id] || ''}
                              onChange={(e) => setSelectedBatchForRequest(prev => ({...prev, [trainee.id]: e.target.value}))}
                            >
                              <option value="">Select Batch</option>
                              {batchesData.map(batch => (
                                <option key={batch.id} value={batch.name}>{batch.name}</option>
                              ))}
                            </select>
                          </div>
                          <div className="action-buttons">
                            <button 
                              className="accept-btn"
                              onClick={() => handleApproveTrainee(trainee.id, selectedBatchForRequest[trainee.id])}
                              disabled={!selectedBatchForRequest[trainee.id]}
                            >
                              ✓ Approve
                            </button>
                            <button 
                              className="decline-btn"
                              onClick={() => handleRejectTrainee(trainee.id)}
                            >
                              ✗ Decline
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {enrollmentRequests.map(request => (
                    <div key={`enroll-${request.id}`} className="trainee-request-card">
                      <div className="trainee-request-header">
                        <div className="trainee-info">
                          <div className="trainee-name">{request.traineeName}</div>
                          <div className="trainee-email">Course: {request.courseName}</div>
                          <div className="trainee-skills">Request Date: {request.requestDate}</div>
                          <div className="request-type">Type: Course Enrollment</div>
                        </div>
                        <div className="trainee-actions">
                          <div className="action-buttons">
                            <button 
                              className="accept-btn"
                              onClick={() => handleApproveEnrollment(request.id)}
                            >
                              ✓ Approve Enrollment
                            </button>
                            <button 
                              className="decline-btn"
                              onClick={() => handleRejectEnrollment(request.id)}
                            >
                              ✗ Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Batch Creation Modal */}
      {showBatchModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Create New Batch</h3>
            <form onSubmit={handleCreateBatch}>
              <div className="form-group">
                <label>Batch Name</label>
                <input
                  type="text"
                  value={newBatch.name}
                  onChange={(e) => setNewBatch({...newBatch, name: e.target.value})}
                  required
                  placeholder="Enter batch name"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newBatch.description}
                  onChange={(e) => setNewBatch({...newBatch, description: e.target.value})}
                  placeholder="Enter batch description"
                  rows="3"
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="primary-btn">Create Batch</button>
                <button type="button" className="secondary-btn" onClick={() => setShowBatchModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerDashboard;
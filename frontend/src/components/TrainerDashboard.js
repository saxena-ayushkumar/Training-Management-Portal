import React, { useState, useEffect } from 'react';
import { 
  User, Users, FileText, Settings, Plus, Edit, Trash2, Download, Upload, 
  Calendar, BarChart3, Eye, BookOpen, Clock, Award, CheckCircle, 
  PlayCircle, PauseCircle, Activity, TrendingUp, UserCheck, Bell, CalendarDays
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../context/AppContext';
import './TrainerDashboard.css';

const TrainerDashboard = ({ user, onLogout }) => {
  const { 
    assignments, addSubmission, 
    addSession, updateSessionAttendance,
    enrollmentRequests, approveEnrollmentRequest, rejectEnrollmentRequest,
    courseFeedback, approveTraineeRequest, declineTraineeRequest,
    batches, addBatch, assignTraineeToBatch,
    uploadCourseMaterial
  } = useAppContext();
  // State
  const [courses, setCourses] = useState([]);
  const [trainees, setTrainees] = useState([]);
  const [batchesData, setBatchesData] = useState([]);
  const [traineeRequests, setTraineeRequests] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [activeSection, setActiveSection] = useState('analytics');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showTraineeRequestPopup, setShowTraineeRequestPopup] = useState(false);
  const [selectedBatchForRequest, setSelectedBatchForRequest] = useState({});
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [filteredTrainees, setFilteredTrainees] = useState([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    empId: user?.empId || '',
    phoneNumber: user?.phoneNumber || '',
    yearsOfExperience: user?.yearsOfExperience || '',
    address: user?.address || ''
  });
  
  const handleProfileInputChange = (field, value) => {
    // Full name validation - only letters, max 20 characters
    if (field === 'name') {
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        alert('Full name can only contain letters and spaces');
        return;
      }
      if (value.length > 20) {
        alert('Full name cannot exceed 20 characters');
        return;
      }
    }
    
    // Phone number validation - only 10 digits
    if (field === 'phoneNumber') {
      if (!/^\d*$/.test(value)) {
        alert('Phone number can only contain digits');
        return;
      }
      if (value.length > 10) {
        alert('Phone number must be exactly 10 digits');
        return;
      }
    }
    
    // Years of experience validation - minimum 2, no negative
    if (field === 'yearsOfExperience') {
      const numValue = parseInt(value);
      if (value !== '' && (isNaN(numValue) || numValue < 2)) {
        alert('Years of experience must be 2 or greater');
        return;
      }
    }
    
    // Address validation - no restrictions
    if (field === 'address') {
      // No validation restrictions for address
    }
    
    setProfileData(prev => ({ ...prev, [field]: value }));
  };
  
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
    courseLink: '',
    assignedBatch: ''
  });
  
  const [materialFile, setMaterialFile] = useState(null);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [selectedCourseAnalytics, setSelectedCourseAnalytics] = useState(null);
  const [expandedTrainee, setExpandedTrainee] = useState(null);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [selectedAssessmentSubmissions, setSelectedAssessmentSubmissions] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [showRejectLeaveModal, setShowRejectLeaveModal] = useState(false);
  const [rejectingLeaveId, setRejectingLeaveId] = useState(null);
  const [rejectionFeedback, setRejectionFeedback] = useState('');
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [selectedBatchPerformance, setSelectedBatchPerformance] = useState('');
  const [showCourseCompletionModal, setShowCourseCompletionModal] = useState(false);
  const [selectedBatchCompletion, setSelectedBatchCompletion] = useState('');

  const handleViewSubmissions = async (assessmentId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/assessments/${assessmentId}/submissions`);
      const data = await response.json();
      if (data.success) {
        setSubmissions(data.submissions);
        setSelectedAssessmentSubmissions(assessments.find(a => a.id === assessmentId));
        setShowSubmissionsModal(true);
      } else {
        alert('Failed to fetch submissions: ' + data.message);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
      alert('Error fetching submissions');
    }
  };

  const handleDownloadSubmission = async (submissionId, fileName) => {
    try {
      const response = await fetch(`http://localhost:8080/api/assessments/submissions/${submissionId}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        alert('Failed to download file');
      }
    } catch (error) {
      console.error('Error downloading submission:', error);
      alert('Error downloading file');
    }
  };

  const [showEditAssessmentModal, setShowEditAssessmentModal] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState(null);

  const handleEditAssessment = (assessment) => {
    setEditingAssessment(assessment);
    setShowEditAssessmentModal(true);
  };

  const handleUpdateAssessment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/api/assessments/${editingAssessment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingAssessment)
      });
      
      const data = await response.json();
      if (data.success) {
        fetchAssessments();
        setShowEditAssessmentModal(false);
        setEditingAssessment(null);
        alert('Assessment updated successfully!');
      } else {
        alert('Failed to update assessment: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating assessment:', error);
      alert('Error updating assessment');
    }
  };

  const handleDeleteAssessment = async (assessmentId) => {
    if (window.confirm('Are you sure you want to delete this assessment? This will also delete all submissions.')) {
      try {
        const response = await fetch(`http://localhost:8080/api/assessments/${assessmentId}`, {
          method: 'DELETE'
        });
        
        const data = await response.json();
        if (data.success) {
          fetchAssessments();
          alert('Assessment deleted successfully!');
        } else {
          alert('Failed to delete assessment: ' + data.message);
        }
      } catch (error) {
        console.error('Error deleting assessment:', error);
        alert('Error deleting assessment');
      }
    }
  };

  // Filter trainees when batch selection changes
  useEffect(() => {
    if (selectedBatch && Array.isArray(trainees)) {
      setFilteredTrainees(trainees.filter(trainee => trainee.batch === selectedBatch.name));
    } else if (Array.isArray(trainees)) {
      setFilteredTrainees(trainees);
    } else {
      setFilteredTrainees([]);
    }
  }, [selectedBatch, trainees]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch courses from backend
        const coursesResponse = await fetch(`http://localhost:8080/api/courses/trainer/${user.empId}`);
        const coursesData = await coursesResponse.json();
        if (Array.isArray(coursesData)) {
          setCourses(coursesData);
        }
        
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
        console.log('Trainees data from API:', traineesData);
        if (Array.isArray(traineesData)) {
          setTrainees(traineesData.map(trainee => ({
            id: trainee.id,
            name: trainee.name,
            email: trainee.email,
            empId: trainee.empId,
            batch: trainee.batch,
            attendance: trainee.attendance || 0,
            participation: trainee.participation || 0,
            enrolledCourses: trainee.enrolledCourses ? [trainee.enrolledCourses] : [],
            courseCompletions: {},
            status: trainee.status,
            enrolledCoursesCount: trainee.enrolledCoursesCount || 0,
            completedCoursesCount: trainee.completedCoursesCount || 0
          })));
        } else {
          setTrainees([]);
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
            // skills: 'JavaScript, React, Node.js',
            requestDate: new Date().toISOString().split('T')[0],
            status: trainee.status
          }));
          setTraineeRequests(formattedRequests);
          if (formattedRequests.length > 0) {
            setShowTraineeRequestPopup(true);
          }
        } else {
          setTraineeRequests([]);
        }
        
        // Fetch leave requests
        const leaveResponse = await fetch(`http://localhost:8080/api/leave/trainer/${user.empId}`);
        const leaveData = await leaveResponse.json();
        if (leaveData.success) {
          setLeaveRequests(leaveData.leaveRequests);
        } else {
          setLeaveRequests([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set default empty arrays on error
        setCourses([]);
        setBatchesData([]);
        setTrainees([]);
        setTraineeRequests([]);
        setLeaveRequests([]);
      }
    };
    
    fetchData();
  }, [user.empId]);
  
  // Session Management State
  const [newSession, setNewSession] = useState({
    title: '',
    date: '',
    time: '',
    duration: '',
    batch: '',
    description: '',
    meetingLink: ''
  });
  
  const [selectedSession, setSelectedSession] = useState(null);
  const [attendanceData, setAttendanceData] = useState({});
  
  // Assessment State
  const [newAssessment, setNewAssessment] = useState({
    title: '',
    description: '',
    type: 'assignment',
    batchName: '',
    dueDate: '',
    totalMarks: 100,
    googleFormLink: ''
  });

  const handleRejectLeave = async (leaveId, feedback = '') => {
    try {
      const response = await fetch(`http://localhost:8080/api/leave/reject/${leaveId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feedback })
      });
      const data = await response.json();
      if (data.success) {
        // Refresh leave requests
        const leaveResponse = await fetch(`http://localhost:8080/api/leave/trainer/${user.empId}`);
        const leaveData = await leaveResponse.json();
        if (leaveData.success) {
          setLeaveRequests(leaveData.leaveRequests);
        }
        alert('Leave request rejected!');
      } else {
        alert('Failed to reject leave: ' + data.message);
      }
    } catch (error) {
      console.error('Error rejecting leave:', error);
      alert('Error rejecting leave request');
    }
  };
  
  const handleRejectLeaveWithFeedback = (leaveId) => {
    setRejectingLeaveId(leaveId);
    setRejectionFeedback('');
    setShowRejectLeaveModal(true);
  };
  
  const submitRejection = async () => {
    await handleRejectLeave(rejectingLeaveId, rejectionFeedback);
    setShowRejectLeaveModal(false);
    setRejectingLeaveId(null);
    setRejectionFeedback('');
  };

  const handleApproveLeave = async (leaveId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/leave/approve/${leaveId}`, {
        method: 'POST'
      });
      const data = await response.json();
      if (data.success) {
        // Refresh leave requests
        const leaveResponse = await fetch(`http://localhost:8080/api/leave/trainer/${user.empId}`);
        const leaveData = await leaveResponse.json();
        if (leaveData.success) {
          setLeaveRequests(leaveData.leaveRequests);
        }
        alert('Leave request approved!');
      } else {
        alert('Failed to approve leave: ' + data.message);
      }
    } catch (error) {
      console.error('Error approving leave:', error);
      alert('Error approving leave request');
    }
  };

  const handleViewCertificate = (certificateId) => {
    const viewUrl = `http://localhost:8080/api/certificates/view/${certificateId}/trainer/${user.empId}`;
    window.open(viewUrl, '_blank');
  };

  const handleDownloadCertificate = async (certificateId) => {
    try {
      const downloadUrl = `http://localhost:8080/api/certificates/download/${certificateId}/trainer/${user.empId}`;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `certificate_${certificateId}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('Error downloading certificate');
    }
  };

  const getTraineePerformanceData = () => {
    if (!selectedBatchPerformance) return [];
    
    const batchTrainees = trainees.filter(t => t.batch === selectedBatchPerformance);
    return batchTrainees.map(trainee => ({
      name: trainee.name,
      performance: Math.floor(Math.random() * 20) + 80
    }));
  };

  const getCourseCompletionData = () => {
    if (!selectedBatchCompletion) return [];
    
    const batchCourses = courses.filter(c => c.assignedBatch === selectedBatchCompletion || !c.assignedBatch)
      .sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    
    if (batchCourses.length === 0) return [];
    
    return batchCourses.map(course => ({
      name: course.title,
      completion: Math.floor(Math.random() * 30) + 70
    }));
  };

  // Course Management Functions
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    console.log('Creating course:', newCourse);
    
    try {
      const response = await fetch('http://localhost:8080/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newCourse.title,
          description: newCourse.description,
          duration: newCourse.duration,
          status: newCourse.status,
          instructor: newCourse.instructor,
          courseLink: newCourse.courseLink || '',
          assignedBatch: newCourse.assignedBatch || null,
          trainerEmpId: user.empId
        })
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
        // Add to local state immediately
        setCourses(prev => [...prev, data.course]);
        setNewCourse({ title: '', description: '', duration: '', status: 'draft', instructor: user.name, courseLink: '', assignedBatch: '' });
        setShowCourseModal(false);
        alert('Course created successfully!');
      } else {
        alert('Failed to create course: ' + data.message);
      }
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Error creating course: ' + error.message);
    }
  };

  const handleViewAnalytics = async (courseId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/courses/${courseId}/analytics?trainerEmpId=${user.empId}`);
      const data = await response.json();
      
      if (data.success) {
        setSelectedCourseAnalytics(data);
        setShowAnalyticsModal(true);
      } else {
        alert('Failed to fetch analytics: ' + data.message);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      alert('Error fetching course analytics');
    }
  };

  const toggleCourseStatus = async (courseId) => {
    const course = courses.find(c => c.id === courseId);
    const newStatus = course.status === 'active' ? 'inactive' : 'active';
    
    try {
      const response = await fetch(`http://localhost:8080/api/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...course,
          status: newStatus
        })
      });
      
      const data = await response.json();
      if (data.success) {
        // Update local state
        setCourses(prev => prev.map(c => 
          c.id === courseId ? { ...c, status: newStatus } : c
        ));
        
        // Refresh trainee data to update enrollment counts
        const traineesResponse = await fetch(`http://localhost:8080/api/trainer/trainees?trainerEmpId=${user.empId}`);
        const traineesData = await traineesResponse.json();
        if (Array.isArray(traineesData)) {
          setTrainees(traineesData.map(trainee => ({
            id: trainee.id,
            name: trainee.name,
            email: trainee.email,
            empId: trainee.empId,
            batch: trainee.batch,
            attendance: trainee.attendance || 0,
            participation: trainee.participation || 0,
            enrolledCourses: trainee.enrolledCourses ? [trainee.enrolledCourses] : [],
            courseCompletions: {},
            status: trainee.status,
            enrolledCoursesCount: trainee.enrolledCoursesCount || 0,
            completedCoursesCount: trainee.completedCoursesCount || 0
          })));
        }
      } else {
        alert('Failed to update course status: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating course status:', error);
      alert('Error updating course status');
    }
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
    
    if (!window.confirm(`Are you sure you want to add this trainee to ${batchName} batch?`)) {
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
            batch: trainee.batch,
            attendance: trainee.attendance,
            participation: trainee.participation,
            enrolledCourses: [trainee.enrolledCourses],
            courseCompletions: {},
            status: trainee.status,
            enrolledCoursesCount: trainee.enrolledCoursesCount || 0,
            completedCoursesCount: trainee.completedCoursesCount || 0
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
    if (!window.confirm('Are you sure you want to reject this trainee request?')) {
      return;
    }
    
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
  const handleCreateSession = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newSession.title,
          description: newSession.description || '',
          trainerEmpId: user.empId,
          batchName: newSession.batch,
          sessionDate: newSession.date,
          sessionTime: newSession.time,
          duration: newSession.duration,
          meetingLink: newSession.meetingLink || ''
        })
      });
      
      const data = await response.json();
      if (data.success) {
        // Refresh sessions list
        fetchSessions();
        setNewSession({ title: '', date: '', time: '', duration: '', batch: '', description: '', meetingLink: '' });
        setShowSessionModal(false);
        alert('Session scheduled successfully!');
      } else {
        alert('Failed to create session: ' + data.message);
      }
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Error creating session');
    }
  };

  const fetchSessions = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/sessions/trainer/${user.empId}`);
      const sessionsData = await response.json();
      if (Array.isArray(sessionsData)) {
        setSessions(sessionsData);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  // Fetch sessions on component mount
  useEffect(() => {
    if (user && user.empId) {
      fetchSessions();
      fetchAssessments();
    }
  }, [user]);

  const fetchAssessments = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/assessments/trainer/${user.empId}`);
      const assessmentsData = await response.json();
      if (Array.isArray(assessmentsData)) {
        setAssessments(assessmentsData);
      }
    } catch (error) {
      console.error('Error fetching assessments:', error);
    }
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
    // Simply close the modal without any API calls or errors
    setShowAttendanceModal(false);
    setSelectedSession(null);
    setAttendanceData({});
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
            batch: trainee.batch,
            attendance: trainee.attendance,
            participation: trainee.participation,
            enrolledCourses: [trainee.enrolledCourses],
            courseCompletions: {},
            status: trainee.status,
            enrolledCoursesCount: trainee.enrolledCoursesCount || 0,
            completedCoursesCount: trainee.completedCoursesCount || 0
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

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/api/courses/${editingCourse.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editingCourse.title,
          description: editingCourse.description,
          duration: editingCourse.duration,
          status: editingCourse.status,
          instructor: editingCourse.instructor,
          courseLink: editingCourse.courseLink,
          assignedBatch: editingCourse.assignedBatch,
          trainerEmpId: user.empId
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setShowEditCourseModal(false);
        setEditingCourse(null);
        alert('Course updated successfully!');
        // Refresh courses list
        window.location.reload();
      } else {
        alert('Failed to update course: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Error updating course');
    }
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
  const handleCreateAssessment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/assessments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newAssessment,
          trainerEmpId: user.empId
        })
      });
      
      const data = await response.json();
      if (data.success) {
        fetchAssessments();
        setNewAssessment({ title: '', description: '', type: 'assignment', batchName: '', dueDate: '', totalMarks: 100, googleFormLink: '' });
        setShowAssessmentModal(false);
        alert('Assessment created successfully!');
      } else {
        alert('Failed to create assessment: ' + data.message);
      }
    } catch (error) {
      console.error('Error creating assessment:', error);
      alert('Error creating assessment');
    }
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
        {(courses || []).map(course => (
          <div key={course.id} className="course-card">
            <div className="course-header">
              <h3>{course.title}</h3>
              <div className="course-actions">
                <button className="icon-btn analytics" title="View Analytics" onClick={() => handleViewAnalytics(course.id)}>
                  <BarChart3 size={16} />
                </button>
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
            <div className="course-batch-info">
              <span className="batch-assignment">
                📚 Access: {course.assignedBatch ? `${course.assignedBatch} Batch Only` : 'All Trainees'}
              </span>
            </div>
            {course.courseLink && (
              <div className="course-link">
                <a href={course.courseLink} target="_blank" rel="noopener noreferrer" className="link-btn">
                  🔗 Course Link
                </a>
              </div>
            )}
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
                <label>Assign to Batch (Optional)</label>
                <select
                  value={newCourse.assignedBatch}
                  onChange={(e) => setNewCourse({...newCourse, assignedBatch: e.target.value})}
                >
                  <option value="">All Trainees (No Batch Restriction)</option>
                  {batchesData.map(batch => (
                    <option key={batch.id} value={batch.name}>{batch.name}</option>
                  ))}
                </select>
                <small>If selected, only trainees in this batch can access the course</small>
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
                <label>Assign to Batch (Optional)</label>
                <select
                  value={editingCourse.assignedBatch || ''}
                  onChange={(e) => setEditingCourse({...editingCourse, assignedBatch: e.target.value})}
                >
                  <option value="">All Trainees (No Batch Restriction)</option>
                  {batchesData.map(batch => (
                    <option key={batch.id} value={batch.name}>{batch.name}</option>
                  ))}
                </select>
                <small>If selected, only trainees in this batch can access the course</small>
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
        {(sessions || []).map(session => {
          const course = (courses || []).find(c => c.id === session.courseId);
          return (
            <div key={session.id} className="session-card">
              <div className="session-info">
                <h3>{session.title}</h3>
                {session.description && <p className="session-description">{session.description}</p>}
                <p>Batch Session: {session.batchName}</p>
                <div className="session-details">
                  <span><Calendar size={14} /> {session.sessionDate}</span>
                  <span><Clock size={14} /> {session.sessionTime}</span>
                  <span><Users size={14} /> {session.batchName}</span>
                  <span>⏱️ {session.duration}</span>
                </div>
                {session.meetingLink && (
                  <div className="session-link">
                    <a href={session.meetingLink} target="_blank" rel="noopener noreferrer" className="meeting-link">
                      🔗 Join Meeting
                    </a>
                  </div>
                )}
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
                <label>Session Title</label>
                <input
                  type="text"
                  value={newSession.title}
                  onChange={(e) => setNewSession({...newSession, title: e.target.value})}
                  required
                  placeholder="Enter session title"
                />
              </div>
              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea
                  value={newSession.description}
                  onChange={(e) => setNewSession({...newSession, description: e.target.value})}
                  placeholder="Enter session description"
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={newSession.date}
                  onChange={(e) => setNewSession({...newSession, date: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
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
                <select
                  value={newSession.batch}
                  onChange={(e) => setNewSession({...newSession, batch: e.target.value})}
                  required
                >
                  <option value="">Select Batch</option>
                  {batchesData.map(batch => (
                    <option key={batch.id} value={batch.name}>{batch.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Meeting Link (Optional)</label>
                <input
                  type="url"
                  value={newSession.meetingLink}
                  onChange={(e) => setNewSession({...newSession, meetingLink: e.target.value})}
                  placeholder="https://meet.google.com/..."
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
              {(trainees || []).map(trainee => (
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
      {(traineeRequests || []).length > 0 && (
        <div className="pending-requests-section">
          <h3>Pending Trainee Requests ({(traineeRequests || []).length})</h3>
          <div className="requests-grid">
            {(traineeRequests || []).map(trainee => (
              <div key={trainee.id} className="trainee-request-card">
                <div className="trainee-request-header">
                  <div className="trainee-info">
                    <div className="trainee-name">{trainee.name}</div>
                    <div className="trainee-email">{trainee.email}</div>
                    {/* <div className="trainee-skills">Skills: {trainee.skills}</div> */}
                  </div>
                  <div className="trainee-actions">
                    <div className="batch-selection">
                      <label>Assign to Batch:</label>
                      <select 
                        value={selectedBatchForRequest[trainee.id] || ''}
                        onChange={(e) => setSelectedBatchForRequest(prev => ({...prev, [trainee.id]: e.target.value}))}
                      >
                        <option value="">Select Batch</option>
                        {(batchesData || []).map(batch => (
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
            <span className="trainee-count">{(trainees || []).length} trainees</span>
          </div>
          {(batchesData || []).map(batch => (
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
              {(filteredTrainees || []).map(trainee => (
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
                      {(batchesData || []).map(batch => (
                        <option key={batch.id} value={batch.name}>{batch.name}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(filteredTrainees || []).length === 0 && (
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
          return (
            <div key={assessment.id} className="assessment-card">
              <div className="assessment-header">
                <h3>{assessment.title}</h3>
                <span className={`type-badge ${assessment.type}`}>{assessment.type}</span>
              </div>
              <p>{assessment.description}</p>
              <div className="assessment-stats">
                <span>Batch: {assessment.batchName}</span>
                <span>Due: {assessment.dueDate}</span>
                <span>Total Marks: {assessment.totalMarks}</span>
              </div>
              <div className="assessment-actions">
                <button className="view-btn" onClick={() => handleViewSubmissions(assessment.id)}>
                  <Eye size={14} /> View Submissions ({assessment.submissionCount || 0})
                </button>
                <button className="edit-btn" onClick={() => handleEditAssessment(assessment)}>
                  <Edit size={14} /> Edit
                </button>
                <button className="delete-btn" onClick={() => handleDeleteAssessment(assessment.id)}>
                  <Trash2 size={14} /> Delete
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
                <label>Description</label>
                <textarea
                  value={newAssessment.description}
                  onChange={(e) => setNewAssessment({...newAssessment, description: e.target.value})}
                  placeholder="Enter assessment description"
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select
                  value={newAssessment.type}
                  onChange={(e) => setNewAssessment({...newAssessment, type: e.target.value})}
                >
                  <option value="assignment">Assignment</option>
                  <option value="quiz">Quiz</option>
                  <option value="exam">Exam</option>
                </select>
              </div>
              <div className="form-group">
                <label>Batch</label>
                <select
                  value={newAssessment.batchName}
                  onChange={(e) => setNewAssessment({...newAssessment, batchName: e.target.value})}
                  required
                >
                  <option value="">Select Batch</option>
                  {batchesData.map(batch => (
                    <option key={batch.id} value={batch.name}>{batch.name}</option>
                  ))}
                </select>
              </div>
              {newAssessment.type === 'quiz' && (
                <div className="form-group">
                  <label>Google Form Link</label>
                  <input
                    type="url"
                    value={newAssessment.googleFormLink}
                    onChange={(e) => setNewAssessment({...newAssessment, googleFormLink: e.target.value})}
                    placeholder="https://forms.google.com/..."
                    required={newAssessment.type === 'quiz'}
                  />
                  <small>Create a Google Form for the quiz and paste the link here</small>
                </div>
              )}
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
                  min={new Date().toISOString().split('T')[0]}
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

      {/* Submissions Modal */}
      {showSubmissionsModal && selectedAssessmentSubmissions && (
        <div className="modal-overlay">
          <div className="modal large">
            <div className="modal-header">
              <h3>Submissions - {selectedAssessmentSubmissions.title}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowSubmissionsModal(false);
                  setSelectedAssessmentSubmissions(null);
                  setSubmissions([]);
                }}
              >
                ×
              </button>
            </div>
            
            <div className="submissions-content">
              <div className="submissions-stats">
                <div className="stat-item">
                  <span className="stat-number">{submissions.length}</span>
                  <span className="stat-label">Total Submissions</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{submissions.filter(s => s.grade).length}</span>
                  <span className="stat-label">Graded</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{submissions.filter(s => !s.grade).length}</span>
                  <span className="stat-label">Pending</span>
                </div>
              </div>
              
              <div className="submissions-list">
                {submissions.map(submission => (
                  <div key={submission.id} className="submission-card">
                    <div className="submission-header">
                      <div className="trainee-info">
                        <h4>{submission.traineeName}</h4>
                        <span className="trainee-id">ID: {submission.traineeEmpId}</span>
                      </div>
                      <div className="submission-status">
                        <span className={`status-badge ${submission.grade ? 'graded' : 'pending'}`}>
                          {submission.grade ? `Graded: ${submission.grade}/${selectedAssessmentSubmissions.totalMarks}` : 'Pending'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="submission-content">
                      <div className="submission-text">
                        <h5>Submission Text:</h5>
                        <p>{submission.submissionText || 'No text submission'}</p>
                      </div>
                      
                      {submission.fileName && (
                        <div className="submission-file">
                          <h5>Attached File:</h5>
                          <div className="file-info">
                            <span className="file-name">{submission.fileName}</span>
                            <button 
                              className="download-btn"
                              onClick={() => handleDownloadSubmission(submission.id, submission.fileName)}
                            >
                              <Download size={14} /> Download
                            </button>
                          </div>
                        </div>
                      )}
                      
                      <div className="submission-meta">
                        <span>Submitted: {new Date(submission.submittedAt).toLocaleString()}</span>
                        {submission.gradedAt && (
                          <span>Graded: {new Date(submission.gradedAt).toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {submissions.length === 0 && (
                  <div className="no-data">
                    <p>No submissions found for this assessment.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Assessment Modal */}
      {showEditAssessmentModal && editingAssessment && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Assessment</h3>
            <form onSubmit={handleUpdateAssessment}>
              <div className="form-group">
                <label>Assessment Title</label>
                <input
                  type="text"
                  value={editingAssessment.title}
                  onChange={(e) => setEditingAssessment({...editingAssessment, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={editingAssessment.description}
                  onChange={(e) => setEditingAssessment({...editingAssessment, description: e.target.value})}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select
                  value={editingAssessment.type}
                  onChange={(e) => setEditingAssessment({...editingAssessment, type: e.target.value})}
                >
                  <option value="assignment">Assignment</option>
                  <option value="quiz">Quiz</option>
                  <option value="exam">Exam</option>
                </select>
              </div>
              <div className="form-group">
                <label>Total Marks</label>
                <input
                  type="number"
                  value={editingAssessment.totalMarks}
                  onChange={(e) => setEditingAssessment({...editingAssessment, totalMarks: parseInt(e.target.value)})}
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={editingAssessment.dueDate}
                  onChange={(e) => setEditingAssessment({...editingAssessment, dueDate: e.target.value})}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="primary-btn">Update Assessment</button>
                <button type="button" className="secondary-btn" onClick={() => {
                  setShowEditAssessmentModal(false);
                  setEditingAssessment(null);
                }}>Cancel</button>
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

  const renderProfile = () => {
    const handleSaveProfile = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/trainer/${user.empId}`, {
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
                onChange={(e) => handleProfileInputChange('name', e.target.value)}
                disabled={!isEditingProfile}
                maxLength={20}
              />
            </div>
            <div className="form-group">
              <label>Employee ID</label>
              <input 
                type="text"
                value={profileData.empId}
                disabled
                style={{ backgroundColor: '#f1f3f4', color: '#666' }}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email"
                value={profileData.email}
                disabled
                style={{ backgroundColor: '#f1f3f4', color: '#666' }}
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input 
                type="tel"
                value={profileData.phoneNumber}
                onChange={(e) => handleProfileInputChange('phoneNumber', e.target.value)}
                disabled={!isEditingProfile}
                placeholder="Enter 10-digit phone number"
                maxLength={10}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Years of Experience</label>
              <input 
                type="number"
                value={profileData.yearsOfExperience}
                onChange={(e) => handleProfileInputChange('yearsOfExperience', e.target.value)}
                disabled={!isEditingProfile}
                placeholder="Minimum 2 years"
                min="2"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Address</label>
            <textarea 
              value={profileData.address}
              onChange={(e) => handleProfileInputChange('address', e.target.value)}
              disabled={!isEditingProfile}
              placeholder="Enter your address"
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
    const pendingLeaves = (leaveRequests || []).filter(leave => leave.status === 'pending');
    const allLeaves = leaveRequests || [];
    
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
                  {leave.status === 'rejected' && leave.rejectionFeedback && (
                    <p><strong>Rejection Reason:</strong> {leave.rejectionFeedback}</p>
                  )}
                </div>
                <div className="leave-actions">
                  <button 
                    className="accept-btn"
                    onClick={() => handleApproveLeave(leave.id)}
                  >
                    ✓ Approve
                  </button>
                  <button 
                    className="decline-btn"
                    onClick={() => handleRejectLeaveWithFeedback(leave.id)}
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
                    <td>{leave.traineeEmpId}</td>
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
            {allLeaves.length === 0 && (
              <div className="no-data">No leave requests found</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderAnalytics = () => {
    const handleViewBatchPerformance = () => {
      if (!selectedBatchPerformance) {
        alert('Please select a batch');
        return;
      }
      setShowPerformanceModal(true);
    };

    return (
      <div className="content-section">
        <h2 className="section-title">Analytics Dashboard</h2>
        
        <div className="analytics-overview">
          <div className="analytics-card">
            <div className="analytics-icon">
              <Users size={24} />
            </div>
            <div className="analytics-content">
              <h3>{(trainees || []).length}</h3>
              <p>Total Trainees</p>
            </div>
          </div>
          <div className="analytics-card">
            <div className="analytics-icon">
              <BookOpen size={24} />
            </div>
            <div className="analytics-content">
              <h3>{(courses || []).filter(course => course.status === 'active').length}</h3>
              <p>Active Courses</p>
            </div>
          </div>
          <div className="analytics-card">
            <div className="analytics-icon">
              <Calendar size={24} />
            </div>
            <div className="analytics-content">
              <h3>{(sessions || []).length}</h3>
              <p>Sessions Conducted</p>
            </div>
          </div>
          <div className="analytics-card">
            <div className="analytics-icon">
              <CalendarDays size={24} />
            </div>
            <div className="analytics-content">
              <h3>{(leaveRequests || []).length}</h3>
              <p>Leave Requests</p>
            </div>
          </div>
        </div>
        
        <div className="analytics-charts">
          <div className="chart-container">
            <h3>Trainee Performance</h3>
            <p className="batch-instruction">Select a batch to view trainee performance</p>
            <div className="batch-buttons-grid">
              {batchesData.map(batch => (
                <button 
                  key={batch.id}
                  className="batch-button"
                  onClick={() => {
                    setSelectedBatchPerformance(batch.name);
                    setShowPerformanceModal(true);
                  }}
                >
                  {batch.name}
                </button>
              ))}
            </div>
          </div>
          <div className="chart-container">
            <h3>Course Completion Rate</h3>
            <p className="batch-instruction">Select a batch to view course completion rates</p>
            <div className="batch-buttons-grid">
              {batchesData.map(batch => (
                <button 
                  key={batch.id}
                  className="batch-button"
                  onClick={() => {
                    setSelectedBatchCompletion(batch.name);
                    setShowCourseCompletionModal(true);
                  }}
                >
                  {batch.name}
                </button>
              ))}
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
              {(trainees || []).map(trainee => {
                // Get actual enrolled courses count from the backend response
                const enrolledCoursesCount = trainee.enrolledCoursesCount || 0;
                const completedCoursesCount = trainee.completedCoursesCount || 0;
                
                return (
                  <tr key={trainee.id}>
                    <td>
                      <div className="trainee-cell">
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
                    <td>{enrolledCoursesCount}</td>
                    <td>
                      <div className="completion-status">
                        {completedCoursesCount} / {enrolledCoursesCount} completed
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
          {(trainees || []).length === 0 && (
            <div className="no-data">No trainees found</div>
          )}
        </div>
      </div>
    </div>
    );
  };

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
            <span className="notification-count">{(traineeRequests || []).length + (leaveRequests || []).filter(leave => leave.status === 'pending').length}</span>
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
              <h3>Pending Requests ({(traineeRequests || []).length + (enrollmentRequests || []).length + (leaveRequests || []).filter(leave => leave.status === 'pending').length})</h3>
              <button 
                className="close-btn"
                onClick={() => setShowTraineeRequestPopup(false)}
              >
                ×
              </button>
            </div>
            <div className="trainee-requests-popup">
              {(traineeRequests || []).length === 0 && (enrollmentRequests || []).length === 0 && (leaveRequests || []).filter(leave => leave.status === 'pending').length === 0 ? (
                <p>No pending requests</p>
              ) : (
                <>
                  {(traineeRequests || []).map(trainee => (
                    <div key={trainee.id} className="trainee-request-card">
                      <div className="trainee-request-header">
                        <div className="trainee-info">
                          <div className="trainee-name">{trainee.name}</div>
                          <div className="trainee-email">{trainee.email}</div>
                          {/* <div className="trainee-skills">Skills: {trainee.skills}</div> */}
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
                              {(batchesData || []).map(batch => (
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
                  {(enrollmentRequests || []).map(request => (
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
                  {(leaveRequests || []).filter(leave => leave.status === 'pending').map(leave => (
                    <div key={`leave-${leave.id}`} className="trainee-request-card">
                      <div className="trainee-request-header">
                        <div className="trainee-info">
                          <div className="trainee-name">{leave.traineeName}</div>
                          <div className="trainee-email">Employee ID: {leave.empId}</div>
                          <div className="trainee-skills">Leave Type: {leave.leaveType}</div>
                          <div className="trainee-skills">Duration: {leave.startDate} to {leave.endDate}</div>
                          <div className="trainee-skills">Reason: {leave.reason}</div>
                          <div className="request-type">Type: Leave Request</div>
                        </div>
                        <div className="trainee-actions">
                          <div className="action-buttons">
                            <button 
                              className="accept-btn"
                              onClick={() => handleApproveLeave(leave.id)}
                            >
                              ✓ Approve Leave
                            </button>
                            <button 
                              className="decline-btn"
                              onClick={() => handleRejectLeaveWithFeedback(leave.id)}
                            >
                              ✗ Reject Leave
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
      
      {/* Course Analytics Modal */}
      {showAnalyticsModal && selectedCourseAnalytics && (
        <div className="modal-overlay">
          <div className="modal large">
            <div className="modal-header">
              <h3>📊 Course Analytics - {selectedCourseAnalytics.course.title}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowAnalyticsModal(false);
                  setExpandedTrainee(null);
                }}
              >
                ×
              </button>
            </div>
            
            <div className="analytics-summary">
              <div className="summary-stats">
                <div className="stat-item">
                  <span className="stat-number">{selectedCourseAnalytics.statistics?.totalEnrollments || 0}</span>
                  <span className="stat-label">Total Enrollments</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{selectedCourseAnalytics.statistics?.feedbackCount || 0}</span>
                  <span className="stat-label">Feedback Received</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    {selectedCourseAnalytics.statistics?.averageRating 
                      ? selectedCourseAnalytics.statistics.averageRating.toFixed(1)
                      : '0.0'
                    }
                  </span>
                  <span className="stat-label">Average Rating</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{selectedCourseAnalytics.statistics?.completedCount || 0}</span>
                  <span className="stat-label">Completed</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{selectedCourseAnalytics.statistics?.inProgressCount || 0}</span>
                  <span className="stat-label">In Progress</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{selectedCourseAnalytics.statistics?.notStartedCount || 0}</span>
                  <span className="stat-label">Not Started</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{selectedCourseAnalytics.statistics?.completionPercentage || 0}%</span>
                  <span className="stat-label">Completion Rate</span>
                </div>
              </div>
            </div>
            
            <div className="analytics-details">
              <div className="enrollments-section">
                <h4>📚 Enrolled Trainees</h4>
                <div className="trainees-list">
                  {selectedCourseAnalytics.enrollments?.map(enrollment => {
                    const feedback = selectedCourseAnalytics.feedback?.find(f => f.traineeEmpId === enrollment.traineeEmpId);
                    const isExpanded = expandedTrainee === enrollment.traineeEmpId;
                    
                    return (
                      <div key={enrollment.id} className="trainee-analytics-card">
                        <div 
                          className="trainee-header clickable"
                          onClick={() => setExpandedTrainee(isExpanded ? null : enrollment.traineeEmpId)}
                        >
                          <div className="trainee-info">
                            <h5>{enrollment.traineeEmpId} - {enrollment.traineeName}</h5>
                            <span className={`status-badge ${enrollment.status}`}>{enrollment.status}</span>
                            {feedback && <span className="feedback-indicator">⭐ {feedback.rating}/5</span>}
                            <span className="progress-indicator">Progress: {enrollment.progressPercentage || 0}%</span>
                          </div>
                          <div className="expand-icon">
                            {isExpanded ? '▼' : '▶'}
                          </div>
                        </div>
                        
                        {isExpanded && (
                          <div className="trainee-details">
                            <div className="trainee-progress">
                              <span>Enrolled: {enrollment.enrolledAt ? new Date(enrollment.enrolledAt).toLocaleDateString() : 'N/A'}</span>
                              {enrollment.completedAt && (
                                <span>Completed: {new Date(enrollment.completedAt).toLocaleDateString()}</span>
                              )}
                              <span>Progress: {enrollment.progressPercentage || 0}%</span>
                              <div className="progress-bar">
                                <div 
                                  className="progress-fill" 
                                  style={{width: `${enrollment.progressPercentage || 0}%`}}
                                ></div>
                              </div>
                            </div>
                            
                            {feedback ? (
                              <div className="trainee-feedback">
                                <div className="feedback-rating">
                                  <strong>Rating:</strong> ⭐ {feedback.rating}/5
                                </div>
                                <div className="feedback-content">
                                  <p><strong>Key Learnings:</strong> {feedback.keyLearnings}</p>
                                  <p><strong>Overall Feedback:</strong> {feedback.feedback}</p>
                                </div>
                                <div className="feedback-date">
                                  <small>Submitted: {new Date(feedback.submittedAt).toLocaleDateString()}</small>
                                </div>
                              </div>
                            ) : (
                              <div className="no-feedback">
                                <p>No feedback submitted yet</p>
                              </div>
                            )}
                            
                            {/* Certificate Section */}
                            <div className="certificate-section">
                              <h5>📜 Completion Certificate</h5>
                              {enrollment.hasCertificate ? (
                                <div className="certificate-info">
                                  <div className="certificate-details">
                                    <p><strong>File:</strong> {enrollment.certificateFileName}</p>
                                    <p><strong>Uploaded:</strong> {new Date(enrollment.certificateUploadedAt).toLocaleDateString()}</p>
                                  </div>
                                  <div className="certificate-actions">
                                    <button 
                                      className="view-certificate-btn"
                                      onClick={() => handleViewCertificate(enrollment.certificateId)}
                                    >
                                      👁️ View Certificate
                                    </button>
                                    <button 
                                      className="download-certificate-btn"
                                      onClick={() => handleDownloadCertificate(enrollment.certificateId)}
                                    >
                                      📥 Download
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="no-certificate">
                                  <p>No certificate uploaded yet</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {(!selectedCourseAnalytics.enrollments || selectedCourseAnalytics.enrollments.length === 0) && (
                    <div className="no-data">No enrollments found</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Rejection Feedback Modal */}
      {showRejectLeaveModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Reject Leave Request</h3>
            <div className="form-group">
              <label>Rejection Reason/Feedback (Optional)</label>
              <textarea
                value={rejectionFeedback}
                onChange={(e) => setRejectionFeedback(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                rows="4"
              />
            </div>
            <div className="modal-actions">
              <button className="primary-btn" onClick={submitRejection}>
                Reject Leave
              </button>
              <button className="secondary-btn" onClick={() => {
                setShowRejectLeaveModal(false);
                setRejectingLeaveId(null);
                setRejectionFeedback('');
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Performance Modal */}
      {showPerformanceModal && selectedBatchPerformance && (
        <div className="modal-overlay">
          <div className="modal large">
            <div className="modal-header">
              <h3> Trainee Performance - {selectedBatchPerformance}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowPerformanceModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="performance-content">
              {getTraineePerformanceData().length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={getTraineePerformanceData()} margin={{ top: 20, right: 30, left: 20, bottom: 80 }} barSize={60}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={0} 
                      textAnchor="middle" 
                      height={80}
                      tick={{ fontSize: 14, fontWeight: 600, fill: '#333' }}
                    />
                    <YAxis 
                      label={{ value: 'Performance (%)', angle: -90, position: 'insideLeft' }}
                      domain={[0, 100]}
                    />
                    <Tooltip />
                    <Bar dataKey="performance" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#764ba2" />
                        <stop offset="100%" stopColor="#667eea" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="chart-placeholder">
                  <p>No trainees found in this batch</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Course Completion Modal */}
      {showCourseCompletionModal && selectedBatchCompletion && (
        <div className="modal-overlay">
          <div className="modal large">
            <div className="modal-header">
              <h3>📚 Course Completion Rate - {selectedBatchCompletion}</h3>
              <button className="close-btn" onClick={() => setShowCourseCompletionModal(false)}>×</button>
            </div>
            
            <div className="performance-content">
              {getCourseCompletionData().length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={getCourseCompletionData()} margin={{ top: 20, right: 30, left: 20, bottom: 80 }} barSize={60}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={0} 
                      textAnchor="middle" 
                      height={80}
                      tick={{ fontSize: 14, fontWeight: 600, fill: '#333' }}
                    />
                    <YAxis 
                      label={{ value: 'Completion (%)', angle: -90, position: 'insideLeft' }}
                      domain={[0, 100]}
                    />
                    <Tooltip />
                    <Bar dataKey="completion" fill="url(#courseGradient)" radius={[8, 8, 0, 0]} />
                    <defs>
                      <linearGradient id="courseGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#667eea" />
                        <stop offset="100%" stopColor="#764ba2" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="chart-placeholder">
                  <p>No courses found for this batch</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerDashboard;
import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Homepage = ({ onLogin, selectedRole: initialRole, onBack }) => {
  const { registerUser, authenticateUser } = useAppContext();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState(initialRole || 'trainer');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    empId: '',
    trainerEmpId: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors.length > 0) {
      setErrors([]);
    }
  };

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
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    
    try {
      if (isLogin) {
        // Call backend login API
        const response = await fetch('http://localhost:8080/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Validate role matches selected role
          if (data.user.role !== selectedRole) {
            throw new Error(`Invalid credentials. This account is registered as ${data.user.role}, but you selected ${selectedRole} login.`);
          }
          onLogin(data.user);
        } else {
          throw new Error(data.message || 'Login failed');
        }
      } else {
        // Validate password
        const passwordErrors = validatePassword(formData.password);
        if (passwordErrors.length > 0) {
          throw new Error(passwordErrors.join('. '));
        }
        
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match!');
        }
        
        if (!formData.empId) {
          throw new Error('Employee ID is required');
        }
        
        if (selectedRole === 'trainee' && !formData.trainerEmpId) {
          throw new Error('Trainer Employee ID is required for trainees');
        }
        
        // Call backend signup API
        const response = await fetch('http://localhost:8080/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: selectedRole,
            empId: formData.empId,
            trainerEmpId: selectedRole === 'trainee' ? formData.trainerEmpId : null
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          if (selectedRole === 'trainee') {
            alert('Registration request submitted! Please wait for trainer approval before logging in.');
            setFormData({
              name: '',
              email: '',
              password: '',
              confirmPassword: '',
              empId: '',
              trainerEmpId: ''
            });
          } else {
            alert('Registration successful!');
            onLogin(data.user);
          }
        } else {
          throw new Error(data.message || 'Signup failed');
        }
      }
    } catch (error) {
      setErrors([error.message]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      empId: '',
      trainerEmpId: ''
    });
  };

  return (
    <div className="homepage">
      <div className="homepage-container">
        <div className="homepage-left">
          <button className="back-btn" onClick={onBack}>
            ← Back to Role Selection
          </button>
          <div className="logo-container">
            <div className="logo">
              <div className="logo-icon">
                <img 
                  src="https://www.companieslogo.com/img/orig/CTSH-82a8444b.png" 
                  alt="Cognizant Logo"
                />
              </div>
              <div className="logo-name">
                <h1>Training Management Portal</h1>
                <p>Program</p>
              </div>
            </div>
          </div>
          <p className="homepage-subtitle">
            Revolutionize your learning experience with our cutting-edge platform. 
            Seamlessly connect trainers and trainees, manage comprehensive coursework, 
            track real-time progress, and unlock your full potential.
          </p>
          <div className="features-highlight">
            <div className="feature-point">
              <span className="feature-icon">🎯</span>
              <span>Smart Learning Paths</span>
            </div>
            <div className="feature-point">
              <span className="feature-icon">📊</span>
              <span>Real-time Analytics</span>
            </div>
            <div className="feature-point">
              <span className="feature-icon">🚀</span>
              <span>Career Acceleration</span>
            </div>
          </div>
        </div>
        
        <div className="homepage-right">
          <div className="auth-container">
            <div className="role-display">
              <h2>Welcome {selectedRole === 'trainer' ? 'Trainer 🏫' : 'Trainee 🎓'}</h2>
              <p>Please login or sign up to continue</p>
            </div>
            
            <div className="auth-tabs">
              <button 
                className={`auth-tab ${isLogin ? 'active' : ''}`}
                onClick={() => {
                  setIsLogin(true);
                  setErrors([]);
                  resetForm();
                }}
              >
                Login
              </button>
              <button 
                className={`auth-tab ${!isLogin ? 'active' : ''}`}
                onClick={() => {
                  setIsLogin(false);
                  setErrors([]);
                  resetForm();
                }}
              >
                Sign Up
              </button>
            </div>
            
            {errors.length > 0 && (
              <div className="error-container">
                <AlertCircle size={16} className="error-icon" />
                <div className="error-messages">
                  {errors.map((error, index) => (
                    <div key={index} className="error-message">{error}</div>
                  ))}
                </div>
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                    className="form-input"
                  />
                </div>
              )}
              
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your email"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Password *</label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your password"
                    className="form-input password-input"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {!isLogin && (
                  <div className="password-requirements">
                    <small>Password must contain:</small>
                    <ul>
                      <li>At least 8 characters</li>
                      <li>One uppercase letter</li>
                      <li>One lowercase letter</li>
                      <li>One number</li>
                      <li>One special character (!@#$%^&*)</li>
                    </ul>
                  </div>
                )}
              </div>
              
              {!isLogin && (
                <div className="form-group">
                  <label>Confirm Password *</label>
                  <div className="password-input-container">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      placeholder="Confirm your password"
                      className="form-input password-input"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}
              
              {!isLogin && (
                <div className="form-group">
                  <label>Employee ID *</label>
                  <input
                    type="text"
                    name="empId"
                    value={formData.empId}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your employee ID"
                    className="form-input"
                  />
                </div>
              )}
              
              {!isLogin && selectedRole === 'trainee' && (
                <div className="form-group">
                  <label>Trainer Employee ID *</label>
                  <input
                    type="text"
                    name="trainerEmpId"
                    value={formData.trainerEmpId}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter trainer's employee ID"
                    className="form-input"
                  />
                </div>
              )}
              
              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  `${isLogin ? 'Login' : 'Sign Up'} as ${selectedRole}`
                )}
              </button>
              
              {isLogin && (
                <div className="forgot-password-link">
                  <button 
                    type="button" 
                    onClick={() => navigate('/forgot-password')}
                    className="forgot-link-btn"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .homepage {
          position: relative;
        }
        
        .back-btn {
          position: absolute;
          top: 20px;
          left: 20px;
          background: rgba(255,255,255,0.2);
          color: white;
          border: 1px solid rgba(255,255,255,0.3);
          padding: 10px 20px;
          border-radius: 25px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s;
        }
        
        .back-btn:hover {
          background: rgba(255,255,255,0.3);
          transform: translateX(-2px);
        }
        
        .role-display {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .role-display h2 {
          font-size: 2rem;
          margin: 0 0 10px 0;
          color: #333;
        }
        
        .role-display p {
          font-size: 1.1rem;
          color: #666;
          margin: 0;
        }
        
        .auth-container {
          background: white;
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          border: 2px solid #f0f0f0;
        }
        
        .auth-tabs {
          display: flex;
          margin-bottom: 20px;
          border-radius: 8px;
          overflow: hidden;
          border: 2px solid #e0e0e0;
        }
        
        .auth-tab {
          flex: 1;
          padding: 12px 20px;
          border: none;
          background: #f8f9fa;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s;
          border-right: 1px solid #e0e0e0;
        }
        
        .auth-tab:last-child {
          border-right: none;
        }
        
        .auth-tab.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        .auth-tab:hover:not(.active) {
          background: #e9ecef;
        }
        
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .form-group label {
          font-weight: 500;
          color: #333;
          font-size: 14px;
        }
        
        .error-container {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          background: #ffebee;
          border: 1px solid #ffcdd2;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 20px;
        }
        
        .error-icon {
          color: #d32f2f;
          margin-top: 2px;
          flex-shrink: 0;
        }
        
        .error-messages {
          flex: 1;
        }
        
        .error-message {
          color: #d32f2f;
          font-size: 14px;
          margin-bottom: 4px;
        }
        
        .error-message:last-child {
          margin-bottom: 0;
        }
        
        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.3s;
          background: #fafafa;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .password-input-container {
          position: relative;
        }
        
        .password-input {
          padding-right: 45px;
        }
        
        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #666;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.3s;
        }
        
        .password-toggle:hover {
          background: #f0f0f0;
          color: #333;
        }
        
        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #ffffff;
          border-top: 2px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .auth-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .auth-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }
        
        .auth-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .password-requirements {
          margin-top: 8px;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 6px;
          border-left: 3px solid #667eea;
        }
        
        .password-requirements small {
          color: #666;
          font-weight: 500;
          display: block;
          margin-bottom: 8px;
        }
        
        .password-requirements ul {
          margin: 0;
          padding-left: 16px;
          color: #666;
          font-size: 12px;
        }
        
        .password-requirements li {
          margin-bottom: 2px;
        }
        
        .forgot-password-link {
          text-align: center;
          margin-top: 15px;
        }
        
        .forgot-link-btn {
          background: none;
          border: none;
          color: #667eea;
          font-size: 14px;
          cursor: pointer;
          text-decoration: underline;
          transition: all 0.3s;
        }
        
        .forgot-link-btn:hover {
          color: #764ba2;
        }
      `}</style>
    </div>
  );
};

export default Homepage;
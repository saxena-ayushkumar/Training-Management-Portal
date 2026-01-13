import React from 'react';

const LandingPage = ({ onRoleSelect }) => {
  return (
    <div className="landing-page">
      <div className="landing-container">
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
            </div>
          </div>
        </div>
        
        <p className="landing-subtitle">
          Revolutionize your learning experience with our cutting-edge platform. 
          Seamlessly connect trainers and trainees, manage comprehensive coursework, 
          track real-time progress, and unlock your full potential.
        </p>
        
        <div className="role-selection">
          <h2>Select Your Role</h2>
          <div className="role-buttons">
            <button 
              className="role-card trainer-card"
              onClick={() => onRoleSelect('trainer')}
            >
              <div className="role-icon">👨🏫</div>
              <h3>Trainer</h3>
              <p>Manage trainees, create assignments, and track progress</p>
            </button>
            <button 
              className="role-card trainee-card"
              onClick={() => onRoleSelect('trainee')}
            >
              <div className="role-icon">👨🎓</div>
              <h3>Trainee</h3>
              <p>Access courses, submit assignments, and track your learning</p>
            </button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .landing-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        
        .landing-container {
          max-width: 800px;
          text-align: center;
          color: white;
        }
        
        .logo-container {
          margin-bottom: 30px;
        }
        
        .logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .logo-icon img {
          width: 60px;
          height: 60px;
          border-radius: 10px;
        }
        
        .logo-name h1 {
          font-size: 2.5rem;
          margin: 0;
          font-weight: 700;
        }
        
        .landing-subtitle {
          font-size: 1.2rem;
          line-height: 1.6;
          margin-bottom: 50px;
          opacity: 0.9;
        }
        
        .role-selection h2 {
          font-size: 2rem;
          margin-bottom: 30px;
          font-weight: 600;
        }
        
        .role-buttons {
          display: flex;
          gap: 30px;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        .role-card {
          background: white;
          color: #333;
          border: none;
          border-radius: 15px;
          padding: 40px 30px;
          min-width: 250px;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .role-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.2);
        }
        
        .trainer-card:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        .trainee-card:hover {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
        }
        
        .role-icon {
          font-size: 3rem;
          margin-bottom: 15px;
        }
        
        .role-card h3 {
          font-size: 1.5rem;
          margin: 0 0 10px 0;
          font-weight: 600;
        }
        
        .role-card p {
          margin: 0;
          font-size: 1rem;
          opacity: 0.8;
        }
        
        @media (max-width: 768px) {
          .logo-name h1 {
            font-size: 2rem;
          }
          
          .role-buttons {
            gap: 20px;
          }
          
          .role-card {
            min-width: 200px;
            padding: 30px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
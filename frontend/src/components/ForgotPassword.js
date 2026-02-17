import React from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const navigate = useNavigate();

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="message-box">
          <h2> Password Reset</h2>
          <p>Password reset functionality is currently under development.</p>
          <p>Please contact your system administrator for password assistance.</p>
          <button className="back-to-login-btn" onClick={() => navigate('/')}>
            Back to Login
          </button>
        </div>
      </div>

      <style jsx>{`
        .forgot-password-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .forgot-password-container {
          width: 100%;
          max-width: 500px;
          padding: 20px;
        }

        .message-box {
          background: white;
          border-radius: 15px;
          padding: 40px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          text-align: center;
        }

        .message-box h2 {
          font-size: 2rem;
          margin: 0 0 20px 0;
          color: #333;
        }

        .message-box p {
          font-size: 1.1rem;
          color: #666;
          margin: 0 0 15px 0;
          line-height: 1.6;
        }

        .back-to-login-btn {
          margin-top: 30px;
          padding: 14px 30px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .back-to-login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import LandingPage from './components/LandingPage';
import Homepage from './components/Homepage';
import TrainerDashboard from './components/TrainerDashboard';
import TraineeDashboard from './components/TraineeDashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setSelectedRole(null);
    localStorage.removeItem('user');
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleBackToLanding = () => {
    setSelectedRole(null);
  };

  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route 
              path="/" 
              element={
                user ? (
                  user.role === 'trainer' ? 
                  <Navigate to="/trainer-dashboard" /> : 
                  <Navigate to="/trainee-dashboard" />
                ) : selectedRole ? (
                  <Homepage 
                    onLogin={login} 
                    selectedRole={selectedRole} 
                    onBack={handleBackToLanding}
                  />
                ) : (
                  <LandingPage onRoleSelect={handleRoleSelect} />
                )
              } 
            />
            <Route 
              path="/trainer-dashboard" 
              element={
                user && user.role === 'trainer' ? 
                <TrainerDashboard user={user} onLogout={logout} /> : 
                <Navigate to="/" />
              } 
            />
            <Route 
              path="/trainee-dashboard" 
              element={
                user && user.role === 'trainee' ? 
                <TraineeDashboard user={user} onLogout={logout} /> : 
                <Navigate to="/" />
              } 
            />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
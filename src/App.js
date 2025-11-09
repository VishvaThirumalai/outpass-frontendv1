// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import StudentDashboard from './components/student/StudentDashboard';
import WardenDashboard from './components/warden/WardenDashboard';
import SecurityDashboard from './components/security/SecurityDashboard';
import './styles/App.css';
import AdminDashboard from './components/admin/AdminDashboard';
import Profile from './components/common/Profile';
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/student/*" element={
              <ProtectedRoute role="STUDENT">
                
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/warden/*" element={
              <ProtectedRoute role="WARDEN">
                <WardenDashboard />
              </ProtectedRoute>
            } />
            <Route path="/security/*" element={
              <ProtectedRoute role="SECURITY">
                <SecurityDashboard />
              </ProtectedRoute>
            } />
            <Route  path="/admin/*" element={
              <ProtectedRoute role="ADMIN">
                <AdminDashboard />
            </ProtectedRoute>
             }/>
            <Route path="/" element={<Navigate to="/login" />} />
            
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
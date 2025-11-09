// src/components/common/Header.js
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Common.css';
import hostellogo from '../../images/hostellogo.jpg';

const Header = ({ title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleProfileClick = () => {
    navigate('/profile');
    setShowProfileMenu(false);
  };

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
  };

  return (
    <>
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <div className="college-logo">
              <img
                src={hostellogo}
                alt="Hostel Logo"
                className="logo-image"
                onLoad={(e) => {
                  // hide placeholder if image loads
                  const placeholder = e.target.parentNode.querySelector('.college-logo-placeholder');
                  if (placeholder) placeholder.style.display = 'none';
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  const placeholder = e.target.parentNode.querySelector('.college-logo-placeholder');
                  if (placeholder) placeholder.style.display = 'flex';
                }}
              />
              <div className="college-logo-placeholder" style={{ display: 'none' }}>
                🏛️ MIT
              </div>
            </div>

            <div className="header-title-section">
              <h1>MIT Hostel</h1>
              <p className="header-subtitle">Hostel Management System</p>
            </div>
          </div>
          
          <div className="header-right">
            <div className="user-profile-dropdown">
              <button 
                className="profile-toggle"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="user-avatar-small">
                  {user?.fullName?.charAt(0) || 'U'}
                </div>
                <div className="user-info">
                  <span className="user-name">{user?.fullName || 'Guest User'}</span>
                  <span className="user-role">{user?.role || 'GUEST'}</span>
                </div>
                <span className="dropdown-arrow">▼</span>
              </button>

              {showProfileMenu && (
                <div className="profile-menu">
                  <button onClick={handleProfileClick} className="menu-item">
                    <span className="menu-icon">👤</span>
                    My Profile
                  </button>
                  <button onClick={() => navigate('/help')} className="menu-item">
                    <span className="menu-icon">❓</span>
                    Help & Support
                  </button>
                  <div className="menu-divider"></div>
                  <button onClick={handleLogout} className="menu-item logout">
                    <span className="menu-icon">🚪</span>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Marquee Section */}
      <div className="marquee-container">
        <div className="marquee-content">
          <span>
            <span className="marquee-icon">📢</span>
            Welcome to MIT Hostel Outpass Management System
            <span className="marquee-icon">•</span>
            Please ensure all outpass details are accurate before submission
            <span className="marquee-icon">•</span>
            Contact hostel office for any queries or assistance
            <span className="marquee-icon">•</span>
            Emergency contact: hostel@mitindia.edu | +91-44-2223-5555
          </span>
        </div>
      </div>
    </>
  );
};

export default Header;
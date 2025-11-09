// src/components/warden/WardenLayout.js
import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { wardenService } from '../../services/wardenService';
import './WardenLayout.css';

const WardenLayout = ({ children }) => {
  const { user, logout, updateUser } = useAuth();

  useEffect(() => {
    let mounted = true;

    // If user object misses name or hostel, fetch full profile from backend
    const needProfile = !user || !user.name || !user.hostel;
    if (needProfile && updateUser) {
      (async () => {
        try {
          const resp = await wardenService.getProfile();
          // resp may be ApiResponse { success, data } or direct warden object
          const data = resp && resp.success !== undefined ? resp.data : resp;
          if (mounted && data) {
            const name = data.name || data.fullName || data.username || data.email;
            // backend Warden entity exposes 'hostelAssigned' (column hostel_assigned)
            const hostel = data.hostel || data.hostelName || data.assignedHostel || data.hostelAssigned || data.hostel_assigned;
            updateUser({ name, hostel });
          }
        } catch (err) {
          console.warn('Failed to fetch warden profile:', err);
        }
      })();
    }

    return () => { mounted = false; };
  }, [user, updateUser]);
  const location = useLocation();
  const navigate = useNavigate();
  // Sidebar is always open for warden layout — simplified UX to match student portal

  const navItems = [
    { path: '/warden/home', icon: '🏠', label: 'Dashboard' },
    { path: '/warden/outpasses', icon: '📋', label: 'All Outpasses' },
    { path: '/warden/outpasses?status=pending', icon: '⏳', label: 'Pending' },
    { path: '/warden/outpasses?status=approved', icon: '✅', label: 'Approved' },
    { path: '/warden/outpasses?status=active', icon: '🚶', label: 'Active' },
  ];

  const isActive = (path) => {
    if (path.includes('?')) {
      return location.pathname + location.search === path;
    }
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getHostelBadgeClass = (hostel) => {
    const h = (hostel || '').toLowerCase();
    if (h.includes('boys')) return 'boys';
    if (h.includes('girls')) return 'girls';
    if (h.includes('postgrad') || h.includes('pg')) return 'postgrad';
    if (h.includes('faculty')) return 'faculty';
    return 'boys';
  };

  return (
    <div className="warden-layout">
      {/* Sidebar */}
      <div className={`sidebar`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🧑</span>
            <span className="logo-text">Warden Portal</span>
          </div>
        </div>

        {/* Show assigned hostel only (no profile block) */}
        <div className="sidebar-hostel">
          <div className="hostel-label">Assigned Hostel</div>
          <div className={`hostel-badge ${getHostelBadgeClass(user?.hostel || '')}`}>
            {user?.hostel || 'Not assigned'}
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <span className="nav-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content - No Header/Footer */}
      <div className={`main-content sidebar-open`}>
        {children}
      </div>
    </div>
  );
};

export default WardenLayout;
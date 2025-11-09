// src/components/admin/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/adminService';
import UserRegistration from './UserRegistration';
import PasswordReset from './PasswordReset';
import UserManagement from './UserManagement';
import AdminManagement from './AdminManagement';
import Profile from '../common/Profile';
import AdminHelp from './AdminHelp';
import { 
  FiHome, 
  FiUsers, 
  FiUserPlus, 
  FiKey, 
  FiLogOut, 
  FiUser, 
  FiHelpCircle,
  FiRefreshCw,
  FiDatabase,
  FiTrendingUp,
  FiActivity,
  FiBarChart2,
  FiMail,
  FiPhone,
  FiAward,
  FiSettings
} from 'react-icons/fi';
import { 
  FaUserGraduate, 
  FaUserShield, 
  FaUserTie,
  FaUserCog
} from 'react-icons/fa';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    students: 0,
    wardens: 0,
    security: 0,
    admins: 0,
    pendingOutpasses: 0
  });
  const [permissionLevel, setPermissionLevel] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [recentActivity, setRecentActivity] = useState([]);

  // Permission level badge styling
  const getPermissionBadgeStyle = (level) => {
    const styles = {
      'SUPER_ADMIN': 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-600',
      'ADMIN': 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-600',
      'MODERATOR': 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-600',
      'VIEWER': 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-gray-600'
    };
    return styles[level] || 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-gray-600';
  };

  const getPermissionLabel = (level) => {
  const labels = {
    'SUPER_ADMIN': 'Super Admin',
    'ADMIN': 'Admin', 
    'MODERATOR': 'Moderator',
    'VIEWER': 'Viewer',
    'STANDARD': 'Admin' // Map STANDARD to Admin for display
  };
  return labels[level] || 'User';
};

  const isSuperAdmin = permissionLevel === 'SUPER_ADMIN';
  const isAdmin = permissionLevel === 'ADMIN' || isSuperAdmin;
  const isModerator = permissionLevel === 'MODERATOR' || isAdmin;

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch permission level and stats
  useEffect(() => {
    fetchPermissionLevel();
    fetchStats();
    fetchRecentActivity();
  }, []);

  // In AdminDashboard.js - Update fetchPermissionLevel method
const fetchPermissionLevel = async () => {
  try {
    console.log('🔐 Fetching permission level...');
    const response = await adminService.getMyPermissionLevel();
    
    console.log('🔐 Permission level response:', response);
    
    if (response && response.permissionLevel) {
      console.log('✅ Setting permission level to:', response.permissionLevel);
      setPermissionLevel(response.permissionLevel);
    } else if (response && response.data && response.data.permissionLevel) {
      console.log('✅ Setting permission level from data:', response.data.permissionLevel);
      setPermissionLevel(response.data.permissionLevel);
    } else {
      console.warn('⚠️ No permission level found in response, defaulting to MODERATOR');
      setPermissionLevel('MODERATOR');
    }
  } catch (err) {
    console.error('❌ Error fetching permission level:', err);
    setPermissionLevel('MODERATOR');
  }
};

// Also update fetchStats method
const fetchStats = async () => {
  try {
    setRefreshing(true);
    setError('');
    
    console.log('🔄 Fetching dashboard stats...');
    const response = await adminService.getDashboardStats();
    
    console.log('📊 Dashboard stats response:', response);
    
    if (response) {
      setStats({
        totalUsers: response.totalUsers || 0,
        students: response.students || 0,
        wardens: response.wardens || 0,
        security: response.security || 0,
        admins: response.admins || 0,
        pendingOutpasses: response.pendingOutpasses || 0
      });

      if (response.userPermissionLevel) {
        console.log('📊 Setting permission from stats:', response.userPermissionLevel);
        setPermissionLevel(response.userPermissionLevel);
      }
    } else {
      throw new Error('Invalid response from stats endpoint');
    }
    
  } catch (error) {
    console.error('❌ Error fetching stats:', error);
    setError('Failed to load statistics: ' + (error.message || 'Please check your connection'));
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

  const fetchRecentActivity = async () => {
    try {
      const activities = [
        { id: 1, action: 'User Registered', user: 'John Doe', role: 'Student', time: '2 mins ago', icon: '👤', color: 'text-green-500' },
        { id: 2, action: 'Password Reset', user: 'Security Officer', role: 'Security', time: '5 mins ago', icon: '🔑', color: 'text-orange-500' },
        { id: 3, action: 'Profile Updated', user: 'Dr. Smith', role: 'Warden', time: '10 mins ago', icon: '📝', color: 'text-blue-500' },
        { id: 4, action: 'System Backup', user: 'System', role: 'Admin', time: '1 hour ago', icon: '💾', color: 'text-purple-500' }
      ];
      setRecentActivity(activities);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  const getNavigationItems = () => {
  const baseItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <FiHome className="w-5 h-5" />,
      color: 'from-blue-500 to-blue-600',
      visible: true
    },
    {
      id: 'users',
      label: 'User Management',
      icon: <FiUsers className="w-5 h-5" />,
      color: 'from-green-500 to-green-600',
      visible: isModerator // All admins can manage users
    },
    {
      id: 'register',
      label: 'Register User',
      icon: <FiUserPlus className="w-5 h-5" />,
      color: 'from-purple-500 to-purple-600',
      visible: isModerator // All admins can register users
    },
    {
      id: 'reset-password',
      label: 'Password Reset',
      icon: <FiKey className="w-5 h-5" />,
      color: 'from-orange-500 to-orange-600',
      visible: isModerator // All admins can reset passwords
    },
  ];

  // Add admin management only for SUPER_ADMIN
  if (isSuperAdmin) {
    baseItems.splice(2, 0, {
      id: 'admin-management',
      label: 'Admin Management',
      icon: <FaUserCog className="w-5 h-5" />,
      color: 'from-red-500 to-red-600',
      visible: true
    });
  }

  return baseItems.filter(item => item.visible);
};

  const navigationItems = getNavigationItems();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfile = () => {
    setActiveTab('profile');
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const handleHelp = () => {
    setActiveTab('help');
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const getStatColor = (type) => {
    const colors = {
      totalUsers: 'from-purple-500 to-purple-600',
      students: 'from-blue-500 to-blue-600',
      wardens: 'from-green-500 to-green-600',
      security: 'from-orange-500 to-orange-600',
      admins: 'from-red-500 to-red-600',
      pendingOutpasses: 'from-yellow-500 to-yellow-600'
    };
    return colors[type] || 'from-gray-500 to-gray-600';
  };

  const getStatIcon = (type) => {
    const icons = {
      totalUsers: <FiUsers className="w-6 h-6" />,
      students: <FaUserGraduate className="w-6 h-6" />,
      wardens: <FaUserTie className="w-6 h-6" />,
      security: <FaUserShield className="w-6 h-6" />,
      admins: <FaUserCog className="w-6 h-6" />,
      pendingOutpasses: <FiActivity className="w-6 h-6" />
    };
    return icons[type] || <FiDatabase className="w-6 h-6" />;
  };

  const StatCard = ({ title, value, description, type, loading }) => (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/60 hover:shadow-xl transition-all duration-300 group hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${getStatColor(type)} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <div className="text-white">
            {getStatIcon(type)}
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="text-2xl font-bold text-gray-900 font-poppins">
          {loading ? (
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            value.toLocaleString()
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 font-poppins group-hover:text-gray-700 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-600 font-outfit leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => (
    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200/60 hover:bg-white hover:shadow-md transition-all duration-200 group">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${activity.color} bg-white shadow-sm border group-hover:scale-110 transition-transform duration-300`}>
        {activity.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <p className="font-semibold text-gray-900 font-poppins truncate">
            {activity.action}
          </p>
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
            {activity.role}
          </span>
        </div>
        <p className="text-sm text-gray-600 font-outfit truncate">
          {activity.user}
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-gray-500 font-outfit">
          {activity.time}
        </p>
      </div>
    </div>
  );

  const renderDashboardContent = () => {
    return (
      <div className="space-y-8">
        {/* Dashboard Header */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200/60">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <FiAward className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 font-poppins tracking-tight">
                    Admin Dashboard
                  </h1>
                  <div className="flex items-center space-x-4 mt-2">
                    <p className="text-gray-600 font-outfit">
                      Welcome back, <strong>{user?.fullName || user?.name || 'Admin'}</strong>!
                    </p>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getPermissionBadgeStyle(permissionLevel)} font-outfit`}>
                      {getPermissionLabel(permissionLevel)}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1 font-outfit">
                    Manage the hostel outpass system efficiently with your {getPermissionLabel(permissionLevel).toLowerCase()} privileges.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500 font-outfit">
                <div className="flex items-center space-x-1">
                  <FiActivity className="w-4 h-4 text-green-500" />
                  <span>System Status: <strong className="text-green-600">Operational</strong></span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <FiBarChart2 className="w-4 h-4 text-blue-500" />
                  <span>Last updated: {new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={fetchStats}
              disabled={refreshing}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium font-outfit hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh Data'}</span>
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <FiHelpCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <span className="text-red-800 font-outfit font-medium">{error}</span>
                  <p className="text-red-600 text-sm font-outfit mt-1">
                    Please try refreshing the data or contact support if the issue persists.
                  </p>
                </div>
              </div>
              <button 
                onClick={fetchStats}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Statistics Grid - Show Admins card only for Super Admin */}
        <div className={`grid gap-6 ${isSuperAdmin ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            description="All registered users in system"
            type="totalUsers"
            loading={loading}
          />
          <StatCard
            title="Students"
            value={stats.students}
            description="Registered students"
            type="students"
            loading={loading}
          />
          <StatCard
            title="Wardens"
            value={stats.wardens}
            description="Hostel wardens & staff"
            type="wardens"
            loading={loading}
          />
          <StatCard
            title="Security"
            value={stats.security}
            description="Security personnel"
            type="security"
            loading={loading}
          />
          {isSuperAdmin && (
            <StatCard
              title="Admins"
              value={stats.admins}
              description="Administrative users"
              type="admins"
              loading={loading}
            />
          )}
          <StatCard
            title="Pending Outpasses"
            value={stats.pendingOutpasses}
            description="Awaiting approval"
            type="pendingOutpasses"
            loading={loading}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="xl:col-span-2 bg-white rounded-2xl p-8 shadow-lg border border-gray-200/60">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <FiActivity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 font-poppins">Recent Activity</h3>
                  <p className="text-gray-600 font-outfit text-sm">Latest system activities</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-medium font-outfit transition-colors duration-200 flex items-center space-x-1">
                <span>View All</span>
                <FiTrendingUp className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200/60">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <FiSettings className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 font-poppins">Quick Actions</h3>
                <p className="text-gray-600 font-outfit text-sm">Frequently used tasks</p>
              </div>
            </div>
            <div className="space-y-3">
              {navigationItems.filter(item => item.id !== 'dashboard').map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className="w-full flex items-center space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-200/60 hover:bg-gradient-to-r hover:from-gray-50 hover:to-white hover:shadow-md transition-all duration-200 group"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-to-r ${item.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon}
                  </div>
                  <span className="font-medium text-gray-900 font-poppins group-hover:text-gray-700 transition-colors">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Support Section */}
            <div className="mt-8 pt-6 border-t border-gray-200/60">
              <h4 className="text-lg font-semibold text-gray-900 font-poppins mb-4">Need Help?</h4>
              <div className="space-y-3">
                <button 
                  onClick={handleHelp}
                  className="w-full flex items-center space-x-3 p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
                >
                  <FiHelpCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium font-poppins">Help & Documentation</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 group">
                  <FiMail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium font-poppins">Email Support</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200 group">
                  <FiPhone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium font-poppins">Contact Admin</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // FIXED: Properly render the active tab content
  const renderContent = () => {
    console.log('Active Tab:', activeTab); // Debug log
    
    switch (activeTab) {
      case 'profile':
        return <Profile />;
      case 'help':
        return <AdminHelp />;
      case 'dashboard':
        return renderDashboardContent();
      case 'users':
        // Pass permissionLevel to UserManagement to control which tabs are visible
        return <UserManagement permissionLevel={permissionLevel} />;
      case 'register':
        return <UserRegistration onUserRegistered={fetchStats} permissionLevel={permissionLevel} />;
      case 'reset-password':
        return <PasswordReset onPasswordReset={() => setActiveTab('dashboard')} permissionLevel={permissionLevel} />;
      case 'admin-management':
        // Only Super Admin can access this
        return isSuperAdmin ? <AdminManagement /> : renderDashboardContent();
      default:
        return renderDashboardContent();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-800 to-slate-900 shadow-lg border-b border-slate-700">
        <div className="flex items-center justify-between p-4">
          <button 
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-200"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm text-white font-medium font-poppins">
                {user?.name?.split(' ')[0] || user?.username || 'Admin'}
              </p>
              <p className="text-xs text-slate-300 font-outfit">
                {getPermissionLabel(permissionLevel)}
              </p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg border-2 border-white/20">
              <FiAward className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-80 bg-gradient-to-b from-slate-800 to-slate-900 shadow-2xl lg:shadow-none border-r border-slate-700
        transform transition-transform duration-300 ease-in-out
        flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
              <FiAward className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white font-poppins">Admin Portal</h1>
              <p className="text-sm text-slate-400 font-outfit">Hostel Management System</p>
            </div>
          </div>
          <button 
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all duration-200"
            onClick={() => setIsSidebarOpen(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User Profile Section */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg border-2 border-white/20">
                <FiAward className="w-7 h-7" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-slate-800"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-white font-poppins truncate">
                {user?.name || user?.username || user?.fullName || 'Administrator'}
              </h2>
              <p className="text-sm text-slate-300 font-outfit truncate">
                {user?.role || 'System Administrator'}
              </p>
              <span className={`inline-block mt-1 px-3 py-1 text-xs font-medium rounded-full ${getPermissionBadgeStyle(permissionLevel)} font-outfit`}>
                {getPermissionLabel(permissionLevel)}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-sm font-semibold text-slate-300 font-outfit mb-4 uppercase tracking-wide flex items-center space-x-2">
            <FiBarChart2 className="w-4 h-4" />
            <span>System Overview</span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-700/40 rounded-xl p-3 backdrop-blur-sm border border-slate-600/50">
              <div className="text-lg font-bold text-white font-poppins bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent">
                {stats.totalUsers}
              </div>
              <div className="text-xs text-slate-300 font-outfit mt-1 flex items-center space-x-1">
                <FiUsers className="w-3 h-3" />
                <span>Total Users</span>
              </div>
            </div>
            <div className="bg-slate-700/40 rounded-xl p-3 backdrop-blur-sm border border-slate-600/50">
              <div className="text-lg font-bold text-white font-poppins bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                {stats.admins}
              </div>
              <div className="text-xs text-slate-300 font-outfit mt-1 flex items-center space-x-1">
                <FiAward className="w-3 h-3" />
                <span>Total Admins</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-6 space-y-1 overflow-y-auto">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group
                  ${activeTab === item.id 
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 shadow-lg' 
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white border border-transparent'
                  }
                `}
                onClick={() => handleTabChange(item.id)}
              >
                <div className={`
                  flex-shrink-0 transition-transform duration-200
                  ${activeTab === item.id ? 'text-yellow-400 scale-110' : 'text-slate-400 group-hover:text-white group-hover:scale-110'}
                `}>
                  {item.icon}
                </div>
                <span className="font-medium font-poppins">{item.label}</span>
                {activeTab === item.id && (
                  <div className="ml-auto w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="p-6 border-t border-slate-700 ">
          {/* Help Button */}
          <button 
            className={`
              w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 border group
              ${activeTab === 'help' 
                ? 'bg-blue-500/20 text-blue-400 border-blue-500/30 shadow-lg' 
                : 'text-slate-300 hover:bg-blue-500/20 hover:text-blue-400 border-transparent hover:border-blue-500/30'
              }
            `}
            onClick={handleHelp}
          >
            <FiHelpCircle className={`
              w-5 h-5 transition-colors duration-200
              ${activeTab === 'help' ? 'text-blue-400' : 'text-slate-400 group-hover:text-blue-400'}
            `} />
            <span className="font-medium font-poppins">Help & Support</span>
            {activeTab === 'help' && (
              <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            )}
          </button>

          {/* Profile Button */}
          <button 
            className={`
              w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 border group
              ${activeTab === 'profile' 
                ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 shadow-lg' 
                : 'text-slate-300 hover:bg-slate-700/50 hover:text-white border-transparent'
              }
            `}
            onClick={handleProfile}
          >
            <FiUser className={`
              w-5 h-5 transition-colors duration-200
              ${activeTab === 'profile' ? 'text-yellow-400' : 'text-slate-400 group-hover:text-white'}
            `} />
            <span className="font-medium font-poppins">My Profile</span>
            {activeTab === 'profile' && (
              <div className="ml-auto w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            )}
          </button>

          {/* Logout Button */}
          <button 
            className="w-full flex items-center space-x-3 px-4 py-3 text-slate-300 hover:bg-red-500/20 hover:text-red-400 rounded-xl transition-all duration-200 border border-transparent hover:border-red-500/30 group"
            onClick={handleLogout}
          >
            <FiLogOut className="w-5 h-5 text-slate-400 group-hover:text-red-400 transition-colors" />
            <span className="font-medium font-poppins">Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col lg:ml-0 pt-16 lg:pt-0 min-h-0">
        {/* Content Header */}
        <div className="bg-white shadow-sm border-b border-gray-200/60 backdrop-blur-sm bg-white/95">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 font-poppins tracking-tight">
                  {activeTab === 'profile' 
                    ? 'My Profile' 
                    : activeTab === 'help' 
                    ? 'Help & Support' 
                    : navigationItems.find(item => item.id === activeTab)?.label || 'Admin Dashboard'
                  }
                </h1>
                <nav className="flex space-x-2 text-sm text-gray-600 mt-2 font-outfit">
                  <span className="text-gray-500">Admin Portal</span>
                  <span className="text-gray-300">/</span>
                  <span className="text-gray-900 font-semibold">
                    {activeTab === 'profile' 
                      ? 'My Profile' 
                      : activeTab === 'help' 
                      ? 'Help & Support' 
                      : navigationItems.find(item => item.id === activeTab)?.label || 'Dashboard'
                    }
                  </span>
                </nav>
              </div>
              <div className="hidden lg:flex items-center space-x-6">
                {/* User Avatar */}
                <div className="flex items-center space-x-3 bg-gray-50 rounded-2xl px-4 py-2 border border-gray-200/60">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 font-poppins">
                      {user?.name?.split(' ')[0] || user?.username || 'Admin'}
                    </p>
                    <p className="text-xs text-gray-500 font-outfit">
                      {getPermissionLabel(permissionLevel)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center text-white font-semibold text-lg shadow-lg border-2 border-white/20">
                    <FiAward className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-yellow-50/30">
          <div className="p-8">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
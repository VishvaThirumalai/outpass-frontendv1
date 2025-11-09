import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { securityService } from '../../services/securityService';
import CheckInOut from './CheckInOut';
import ActivePasses from './ActivePasses';
import TodayActivity from './TodayActivity';
import HelpSection from './HelpSection';
import Profile from '../common/Profile';
import { 
  Home, 
  Users, 
  LogOut, 
  User, 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Calendar,
  TrendingUp,
  BarChart3,
  HelpCircle
} from 'lucide-react';

const SecurityDashboard = () => {
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    approvedOutpasses: 0,
    activeOutpasses: 0,
    completedToday: 0,
    lateReturns: 0,
    pendingDepartures: [],
    pendingReturns: [],
    recentActivity: []
  });
  const [securityProfile, setSecurityProfile] = useState(null);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Helper function to get gate name - FIXED: Uses gateAssigned field
  const getGateName = () => {
    if (profileLoading) {
      return 'Loading...';
    }
    
    console.log('🔍 Security Profile Data:', securityProfile);
    
    // Check security profile first (from database)
    if (securityProfile) {
      // The field name from your backend is 'gateAssigned'
      if (securityProfile.gateAssigned) {
        console.log('✅ Found gate in securityProfile.gateAssigned:', securityProfile.gateAssigned);
        return securityProfile.gateAssigned;
      }
      
      // Also check other possible field names as fallback
      const possibleFields = [
        'gate',
        'gateName', 
        'assignedGate',
        'securityGate',
        'post',
        'postName',
        'assignedPost',
        'location'
      ];
      
      for (const field of possibleFields) {
        if (securityProfile[field]) {
          console.log(`✅ Found gate in securityProfile.${field}:`, securityProfile[field]);
          return securityProfile[field];
        }
      }
    }
    
    // Fallback to user context (from authentication)
    if (user) {
      if (user.gateAssigned) {
        console.log('✅ Found gate in user.gateAssigned:', user.gateAssigned);
        return user.gateAssigned;
      }
      
      const userPossibleFields = ['gate', 'gateName', 'location'];
      for (const field of userPossibleFields) {
        if (user[field]) {
          console.log(`✅ Found gate in user.${field}:`, user[field]);
          return user[field];
        }
      }
    }
    
    console.log('⚠️ No gate assignment found, using default');
    return 'Main Gate'; // Default fallback
  };

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

  useEffect(() => {
    if (activeTab === 'dashboard') {
      loadDashboard();
    }
  }, [activeTab]);

  // Fetch security profile from database
  useEffect(() => {
    fetchSecurityProfile();
  }, []);

  const fetchSecurityProfile = async () => {
    try {
      setProfileLoading(true);
      console.log('🔄 Fetching security profile from API...');
      
      const response = await securityService.getProfile();
      console.log('📋 Security Profile API Response:', response);
      
      if (response && response.success) {
        setSecurityProfile(response.data);
        console.log('✅ Security profile data set:', response.data);
        
        // Log gate assignment specifically
        if (response.data.gateAssigned) {
          console.log('🎯 Gate Assignment Found:', response.data.gateAssigned);
        } else {
          console.log('❌ No gateAssigned field found in profile');
          console.log('📊 Available fields:', Object.keys(response.data));
        }
      } else {
        console.warn('⚠️ Security profile request failed:', response?.message);
        setSecurityProfile({});
      }
    } catch (error) {
      console.error('❌ Error fetching security profile:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to load profile data' 
      });
      setSecurityProfile({});
    } finally {
      setProfileLoading(false);
    }
  };

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setMessage({ type: 'info', text: 'Loading dashboard data...' });
      
      const response = await securityService.getDashboard();
      console.log('📊 Dashboard response:', response);
      
      if (response.success) {
        setDashboardData(response.data || {
          approvedOutpasses: 0,
          activeOutpasses: 0,
          completedToday: 0,
          lateReturns: 0,
          pendingDepartures: [],
          pendingReturns: [],
          recentActivity: []
        });
        setMessage({ type: 'success', text: 'Dashboard loaded successfully' });
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to load dashboard' });
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setMessage({ type: 'error', text: 'Network error loading dashboard' });
    } finally {
      setLoading(false);
    }
  };

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
      approved: 'from-blue-500 to-blue-600',
      active: 'from-green-500 to-green-600',
      completed: 'from-purple-500 to-purple-600',
      warning: 'from-red-500 to-red-600'
    };
    return colors[type] || 'from-gray-500 to-gray-600';
  };

  // DashboardHome component
  const DashboardHome = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/30 font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-3 font-poppins">
                Security Dashboard
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0">
                <p className="text-xl text-gray-600 font-outfit">
                  Welcome back, <strong className="text-gray-900">{user?.name || user?.username || 'Security Officer'}</strong>!
                </p>
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium rounded-full border border-orange-600 font-outfit">
                    Security Officer
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full border border-gray-300 font-outfit">
                    {getGateName()}
                  </span>
                </div>
              </div>
              <p className="text-gray-500 mt-2 font-outfit">
                Monitoring student movements and outpass management at {getGateName()}
              </p>
            </div>
            
            {/* Refresh Button */}
            <div className="mt-4 lg:mt-0">
              <button
                onClick={() => {
                  loadDashboard();
                  fetchSecurityProfile();
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200 font-outfit text-sm font-medium"
              >
                🔄 Refresh All
              </button>
            </div>
          </div>
        </div>

        {/* Alert Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl ${
            message.type === 'success' 
              ? 'bg-green-50 border-l-4 border-green-500 text-green-800' 
              : message.type === 'error'
              ? 'bg-red-50 border-l-4 border-red-500 text-red-800'
              : 'bg-blue-50 border-l-4 border-blue-500 text-blue-800'
          }`}>
            <div className="flex items-center">
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              ) : message.type === 'error' ? (
                <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />
              ) : (
                <Clock className="w-5 h-5 mr-3 flex-shrink-0" />
              )}
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        )}

        {/* Profile Debug Info - Remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-yellow-800 mb-2">Debug Info:</h3>
            <div className="text-xs text-yellow-700 space-y-1">
              <p><strong>Profile Loading:</strong> {profileLoading ? 'Yes' : 'No'}</p>
              <p><strong>Assigned Location:</strong> {getGateName()}</p>
              <p><strong>Has Profile Data:</strong> {securityProfile ? 'Yes' : 'No'}</p>
              <p><strong>User Role:</strong> {user?.role}</p>
              {securityProfile && (
                <div>
                  <p><strong>Profile Fields:</strong> {Object.keys(securityProfile).join(', ')}</p>
                  <p><strong>Raw Profile Data:</strong> {JSON.stringify(securityProfile, null, 2)}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-poppins text-lg">Loading security dashboard...</p>
          </div>
        ) : (
          <>
            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                {
                  key: 'approved',
                  title: 'Pending Departures',
                  value: dashboardData.approvedOutpasses || 0,
                  description: 'Approved outpasses ready for departure',
                  icon: LogOut,
                  color: 'from-blue-500 to-blue-600',
                  bgColor: 'bg-blue-50',
                  textColor: 'text-blue-700',
                  borderColor: 'border-blue-200'
                },
                {
                  key: 'active',
                  title: 'Currently Out',
                  value: dashboardData.activeOutpasses || 0,
                  description: 'Students outside campus',
                  icon: Users,
                  color: 'from-green-500 to-green-600',
                  bgColor: 'bg-green-50',
                  textColor: 'text-green-700',
                  borderColor: 'border-green-200'
                },
                {
                  key: 'completed',
                  title: 'Completed Today',
                  value: dashboardData.completedToday || 0,
                  description: 'Returns processed today',
                  icon: CheckCircle,
                  color: 'from-purple-500 to-purple-600',
                  bgColor: 'bg-purple-50',
                  textColor: 'text-purple-700',
                  borderColor: 'border-purple-200'
                },
                {
                  key: 'warning',
                  title: 'Late Returns',
                  value: dashboardData.lateReturns || 0,
                  description: 'Total late returns',
                  icon: AlertTriangle,
                  color: 'from-red-500 to-red-600',
                  bgColor: 'bg-red-50',
                  textColor: 'text-red-700',
                  borderColor: 'border-red-200'
                }
              ].map((stat) => {
                const IconComponent = stat.icon;
                return (
                  <div 
                    key={stat.key}
                    className={`bg-white rounded-2xl shadow-lg border-2 ${stat.borderColor} p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                        <IconComponent className={`w-6 h-6 ${stat.textColor}`} />
                      </div>
                      <div className="text-right">
                        <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent font-poppins`}>
                          {stat.value}
                        </div>
                      </div>
                    </div>
                    <h3 className={`text-lg font-semibold ${stat.textColor} mb-1 font-poppins`}>
                      {stat.title}
                    </h3>
                    <p className="text-gray-600 text-sm font-outfit">
                      {stat.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 font-poppins">Quick Actions</h2>
                  <p className="text-gray-600 font-outfit mt-1">Manage student movements efficiently</p>
                </div>
                <div className="hidden lg:flex items-center space-x-2 text-orange-600">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-sm font-medium font-outfit">Quick Access</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: 'Mark Departure',
                    description: `${dashboardData.approvedOutpasses || 0} students waiting`,
                    icon: LogOut,
                    tab: 'departure',
                    color: 'from-blue-500 to-blue-600',
                    bgColor: 'bg-blue-50',
                    iconColor: 'text-blue-600'
                  },
                  {
                    title: 'Mark Return',
                    description: `${dashboardData.activeOutpasses || 0} students outside`,
                    icon: Users,
                    tab: 'return',
                    color: 'from-green-500 to-green-600',
                    bgColor: 'bg-green-50',
                    iconColor: 'text-green-600'
                  },
                  {
                    title: 'Active Passes',
                    description: 'Monitor current outpasses',
                    icon: CheckCircle,
                    tab: 'active',
                    color: 'from-purple-500 to-purple-600',
                    bgColor: 'bg-purple-50',
                    iconColor: 'text-purple-600'
                  },
                  {
                    title: "Today's Activity",
                    description: 'View daily movements',
                    icon: Calendar,
                    tab: 'today',
                    color: 'from-orange-500 to-orange-600',
                    bgColor: 'bg-orange-50',
                    iconColor: 'text-orange-600'
                  }
                ].map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleTabChange(action.tab)}
                      className="group text-left"
                    >
                      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 border-gray-200 p-6 hover:border-orange-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group-hover:scale-105">
                        <div className="flex items-start space-x-4">
                          <div className={`p-3 rounded-xl ${action.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                            <IconComponent className={`w-6 h-6 ${action.iconColor}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 font-poppins group-hover:text-orange-700 transition-colors duration-200">
                              {action.title}
                            </h3>
                            <p className="text-gray-600 text-sm font-outfit">
                              {action.description}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-orange-600 text-sm font-medium font-outfit group-hover:text-orange-700 transition-colors duration-200">
                            Access Now →
                          </span>
                          <div className="w-2 h-2 bg-orange-400 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-6 h-6 text-orange-600" />
                  <h3 className="text-xl font-semibold text-gray-900 font-poppins">Recent Activity</h3>
                </div>
                <button 
                  onClick={() => handleTabChange('today')}
                  className="text-orange-600 hover:text-orange-700 font-medium font-outfit transition-colors duration-200"
                >
                  View Details →
                </button>
              </div>
              
              {dashboardData.recentActivity && dashboardData.recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.recentActivity.slice(0, 10).map(activity => (
                    <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-orange-50 hover:border-orange-200 transition-all duration-200">
                      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                        {activity.actualReturnTime ? (
                          <Users className="w-5 h-5 text-orange-600" />
                        ) : (
                          <LogOut className="w-5 h-5 text-orange-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 font-poppins">
                          {activity.studentName}
                        </p>
                        <p className="text-sm text-gray-600 font-outfit">
                          {activity.actualReturnTime 
                            ? `Returned at ${new Date(activity.actualReturnTime).toLocaleString()}`
                            : `Departed at ${new Date(activity.actualDepartureTime).toLocaleString()}`
                          }
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 font-outfit">
                          {activity.actualReturnTime 
                            ? new Date(activity.actualReturnTime).toLocaleTimeString()
                            : new Date(activity.actualDepartureTime).toLocaleTimeString()
                          }
                        </p>
                        <p className={`text-xs font-outfit ${
                          activity.actualReturnTime ? 'text-green-600' : 'text-blue-600'
                        }`}>
                          {activity.actualReturnTime ? 'Return' : 'Departure'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 font-outfit">No recent activity</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );

  // Navigation items
  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home className="w-5 h-5" />,
      component: <DashboardHome />
    },
    {
      id: 'departure',
      label: 'Mark Departure',
      icon: <LogOut className="w-5 h-5" />,
      component: <CheckInOut type="DEPARTURE" onSuccess={loadDashboard} />
    },
    {
      id: 'return',
      label: 'Mark Return',
      icon: <Users className="w-5 h-5" />,
      component: <CheckInOut type="RETURN" onSuccess={loadDashboard} />
    },
    {
      id: 'active',
      label: 'Active Passes',
      icon: <CheckCircle className="w-5 h-5" />,
      component: <ActivePasses />
    },
    {
      id: 'today',
      label: "Today's Activity",
      icon: <Calendar className="w-5 h-5" />,
      component: <TodayActivity />
    }
  ];

  const renderContent = () => {
    if (activeTab === 'profile') {
      return <Profile />;
    }
    if (activeTab === 'help') {
      return <HelpSection />;
    }
    const activeItem = navigationItems.find(item => item.id === activeTab);
    return activeItem ? activeItem.component : <DashboardHome />;
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
                {user?.name?.split(' ')[0] || user?.username || 'Security'}
              </p>
              <p className="text-xs text-slate-300 font-outfit">
                {getGateName()}
              </p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg border-2 border-white/20">
              {(user?.name?.charAt(0) || user?.username?.charAt(0) || 'S').toUpperCase()}
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
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white font-poppins">Security Portal</h1>
              <p className="text-sm text-slate-400 font-outfit">University Management System</p>
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
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg border-2 border-white/20">
                {(user?.name?.charAt(0) || user?.username?.charAt(0) || 'S').toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-slate-800"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-white font-poppins truncate">
                {user?.name || user?.username || 'Security Officer'}
              </h2>
              <p className="text-sm text-slate-300 font-outfit truncate">
                Security Officer
              </p>
              <span className="inline-block mt-1 px-3 py-1 text-xs font-medium bg-orange-500/20 text-orange-400 rounded-full border border-orange-500/30 font-outfit">
                {getGateName()}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-sm font-semibold text-slate-300 font-outfit mb-4 uppercase tracking-wide">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-3">
            {['approved', 'active'].map((statType) => (
              <div key={statType} className="bg-slate-700/40 rounded-xl p-3 backdrop-blur-sm border border-slate-600/50">
                <div className={`text-lg font-bold text-white font-poppins bg-gradient-to-r ${getStatColor(statType)} bg-clip-text text-transparent`}>
                  {dashboardData[statType === 'approved' ? 'approvedOutpasses' : 'activeOutpasses'] || 0}
                </div>
                <div className="text-xs text-slate-300 font-outfit mt-1 capitalize">
                  {statType === 'approved' ? 'Pending' : 'Active'}
                </div>
              </div>
            ))}
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
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30 shadow-lg' 
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white border border-transparent'
                  }
                `}
                onClick={() => handleTabChange(item.id)}
              >
                <div className={`
                  flex-shrink-0 transition-transform duration-200
                  ${activeTab === item.id ? 'text-orange-400 scale-110' : 'text-slate-400 group-hover:text-white group-hover:scale-110'}
                `}>
                  {item.icon}
                </div>
                <span className="font-medium font-poppins">{item.label}</span>
                {activeTab === item.id && (
                  <div className="ml-auto w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
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
            <HelpCircle className={`
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
                ? 'bg-orange-500/20 text-orange-400 border-orange-500/30 shadow-lg' 
                : 'text-slate-300 hover:bg-slate-700/50 hover:text-white border-transparent'
              }
            `}
            onClick={handleProfile}
          >
            <User className={`
              w-5 h-5 transition-colors duration-200
              ${activeTab === 'profile' ? 'text-orange-400' : 'text-slate-400 group-hover:text-white'}
            `} />
            <span className="font-medium font-poppins">My Profile</span>
            {activeTab === 'profile' && (
              <div className="ml-auto w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
            )}
          </button>

          {/* Logout Button */}
          <button 
            className="w-full flex items-center space-x-3 px-4 py-3 text-slate-300 hover:bg-red-500/20 hover:text-red-400 rounded-xl transition-all duration-200 border border-transparent hover:border-red-500/30 group"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-400 transition-colors" />
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
                    : navigationItems.find(item => item.id === activeTab)?.label || 'Security Dashboard'
                  }
                </h1>
                <nav className="flex space-x-2 text-sm text-gray-600 mt-2 font-outfit">
                  <span className="text-gray-500">Security Portal</span>
                  <span className="text-gray-300">/</span>
                  <span className="text-gray-900 font-semibold">
                    {activeTab === 'profile' 
                      ? 'My Profile' 
                      : activeTab === 'help' 
                      ? 'Help & Support' 
                      : navigationItems.find(item => item.id === activeTab)?.label || 'Dashboard'
                    }
                  </span>
                  <span className="text-gray-300">/</span>
                  <span className="text-orange-600 font-semibold">
                    {getGateName()}
                  </span>
                </nav>
              </div>
              <div className="hidden lg:flex items-center space-x-6">
                {/* Notification Bell */}
                <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.24 8.56a5.97 5.97 0 01-4.66-6.24M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-outfit font-bold">
                    {dashboardData.approvedOutpasses || 0}
                  </span>
                </button>
                
                {/* User Avatar */}
                <div className="flex items-center space-x-3 bg-gray-50 rounded-2xl px-4 py-2 border border-gray-200/60">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 font-poppins">
                      {user?.name?.split(' ')[0] || user?.username || 'Security'}
                    </p>
                    <p className="text-xs text-gray-500 font-outfit">
                      {getGateName()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center text-white font-semibold text-lg shadow-lg border-2 border-white/20">
                    {(user?.name?.charAt(0) || user?.username?.charAt(0) || 'S').toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-orange-50/30">
          <div className="p-8">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SecurityDashboard;
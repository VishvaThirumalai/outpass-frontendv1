import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom'; 
import { useAuth } from '../../context/AuthContext';
import { wardenService } from '../../services/wardenService';
import WardenHome from './WardenHome';
import OutpassList from './OutpassList';
import ReviewOutpass from './ReviewOutpass';
import WardenHelp from './WardenHelp';
import Profile from '../common/Profile';

const WardenDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ 
    pending: 0, 
    approved: 0, 
    rejected: 0, 
    total: 0, 
    active: 0,
    today: 0 
  });
  const [wardenProfile, setWardenProfile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);

  const navigationItems = [
    {
      id: 'home',
      label: 'Dashboard',
      path: '/warden/home',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      component: <WardenHome />
    },
    {
      id: 'review',
      label: 'All Outpasses',
      path: '/warden/outpasses',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      component: <OutpassList />
    },
    {
      id: 'pending',
      label: 'Pending Requests',
      path: '/warden/outpasses?status=pending',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      component: <OutpassList />
    },
    {
      id: 'active',
      label: 'Active Outpasses',
      path: '/warden/outpasses?status=active',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      component: <OutpassList />
    },
    {
      id: 'help',
      label: 'Help & Support',
      path: '/warden/help',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      component: <WardenHelp />
    }
  ];

  // Helper function to get hostel name with proper fallbacks
  const getHostelName = () => {
    if (profileLoading) {
      return 'Loading...';
    }
    // Try multiple possible field names for hostel
    return wardenProfile?.hostel || 
           wardenProfile?.hostelName || 
           wardenProfile?.hostelAssigned || 
           user?.hostel || 
           user?.hostelName || 
           'Hostel Not Assigned';
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

  // Set active tab based on route
  useEffect(() => {
    const currentPath = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const status = searchParams.get('status');
    
    // Determine active tab based on both path and query parameters
    if (currentPath.includes('/outpasses')) {
      if (status === 'pending') {
        setActiveTab('pending');
      } else if (status === 'active') {
        setActiveTab('active');
      } else {
        setActiveTab('review');
      }
    } else {
      const activeItem = navigationItems.find(item => currentPath.includes(item.path));
      if (activeItem) {
        setActiveTab(activeItem.id);
      }
    }
  }, [location.pathname, location.search]);

  // Fetch warden stats and profile from database
  useEffect(() => {
    fetchDashboardData();
    fetchWardenProfile();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Use the actual hostel name from the profile
      const hostelName = getHostelName();
      const response = await wardenService.getStats(hostelName);
      const statsData = response.data || response;
      
      // Update the stats state with actual data from database
      setStats({
        pending: statsData.pending || 0,
        approved: statsData.approved || 0,
        rejected: statsData.rejected || 0,
        total: statsData.total || 0,
        active: statsData.active || 0,
        today: statsData.today || 0
      });
    } catch (error) {
      console.error('Error fetching warden dashboard data:', error);
      // Fallback to zeros if API fails
      setStats({
        pending: 0,
        approved: 0,
        rejected: 0,
        total: 0,
        active: 0,
        today: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchWardenProfile = async () => {
    try {
      setProfileLoading(true);
      const response = await wardenService.getProfile();
      console.log('Warden Profile Response:', response); // Debug log
      
      if (response && response.success) {
        setWardenProfile(response.data);
        console.log('Warden Profile Data:', response.data); // Debug log
        console.log('Hostel fields in profile:', {
          hostel: response.data?.hostel,
          hostelName: response.data?.hostelName,
          hostelAssigned: response.data?.hostelAssigned
        });
      }
    } catch (error) {
      console.error('Error fetching warden profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleTabChange = (item) => {
    setActiveTab(item.id);
    navigate(item.path);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/warden/profile');
  };

  const getStatColor = (type) => {
    const colors = {
      pending: 'from-yellow-500 to-yellow-600',
      approved: 'from-green-500 to-green-600',
      rejected: 'from-red-500 to-red-600',
      total: 'from-purple-500 to-purple-600',
      active: 'from-blue-500 to-blue-600',
      today: 'from-indigo-500 to-indigo-600'
    };
    return colors[type] || 'from-gray-500 to-gray-600';
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
                {user?.name?.split(' ')[0] || user?.username || 'Warden'}
              </p>
              <p className="text-xs text-slate-300 font-outfit">
                {getHostelName()}
              </p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg border-2 border-white/20">
              {(user?.name?.charAt(0) || user?.username?.charAt(0) || 'W').toUpperCase()}
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
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
              🏢
            </div>
            <div>
              <h1 className="text-xl font-bold text-white font-poppins">Warden Portal</h1>
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
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg border-2 border-white/20">
                {(user?.name?.charAt(0) || user?.username?.charAt(0) || 'W').toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-slate-800"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-white font-poppins truncate">
                {user?.name || user?.username || 'Warden'}
              </h2>
              <p className="text-sm text-slate-300 font-outfit truncate">
                {user?.role || 'Senior Warden'}
              </p>
              <span className="inline-block mt-1 px-3 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full border border-green-500/30 font-outfit">
                {getHostelName()}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats - Using Actual Data from Database */}
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-sm font-semibold text-slate-300 font-outfit mb-4 uppercase tracking-wide">Quick Stats</h3>
          {loading ? (
            <div className="grid grid-cols-2 gap-3">
              {['pending', 'today'].map((statType) => (
                <div key={statType} className="bg-slate-700/40 rounded-xl p-3 backdrop-blur-sm border border-slate-600/50">
                  <div className="animate-pulse">
                    <div className="h-6 bg-slate-600 rounded mb-2"></div>
                    <div className="h-4 bg-slate-600 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {['pending', 'today'].map((statType) => (
                <div key={statType} className="bg-slate-700/40 rounded-xl p-3 backdrop-blur-sm border border-slate-600/50">
                  <div className={`text-lg font-bold text-white font-poppins bg-gradient-to-r ${getStatColor(statType)} bg-clip-text text-transparent`}>
                    {stats[statType]}
                  </div>
                  <div className="text-xs text-slate-300 font-outfit mt-1 capitalize">
                    {statType === 'today' ? 'Today' : 'Pending'}
                  </div>
                </div>
              ))}
            </div>
          )}
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
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30 shadow-lg' 
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white border border-transparent'
                  }
                `}
                onClick={() => handleTabChange(item)}
              >
                <div className={`
                  flex-shrink-0 transition-transform duration-200
                  ${activeTab === item.id ? 'text-green-400 scale-110' : 'text-slate-400 group-hover:text-white group-hover:scale-110'}
                `}>
                  {item.icon}
                </div>
                <span className="font-medium text-white font-poppins">{item.label}</span>
                {activeTab === item.id && (
                  <div className="ml-auto w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="p-6 border-t border-slate-700 space-y-3">
          {/* Profile Button */}
          <button 
            className="w-full flex items-center space-x-3 px-4 py-3 text-slate-300 hover:bg-slate-700/50 hover:text-white rounded-xl transition-all duration-200 border border-transparent hover:border-slate-600 group"
            onClick={handleProfile}
          >
            <svg className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="font-medium text-white font-poppins">My Profile</span>
          </button>

          {/* Logout Button */}
          <button 
            className="w-full flex items-center space-x-3 px-4 py-3 text-slate-300 hover:bg-red-500/20 hover:text-red-400 rounded-xl transition-all duration-200 border border-transparent hover:border-red-500/30 group"
            onClick={handleLogout}
          >
            <svg className="w-5 h-5 text-slate-400 group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium text-white font-poppins">Logout</span>
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
                  {navigationItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                </h1>
                <nav className="flex space-x-2 text-sm text-gray-600 mt-2 font-outfit">
                  <span className="text-gray-500">Warden Portal</span>
                  <span className="text-gray-300">/</span>
                  <span className="text-gray-900 font-semibold">
                    {navigationItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                  </span>
                  <span className="text-gray-300">/</span>
                  <span className="text-green-600 font-semibold">
                    {getHostelName()}
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
                    {stats.pending}
                  </span>
                </button>
                
                {/* User Avatar */}
                <div className="flex items-center space-x-3 bg-gray-50 rounded-2xl px-4 py-2 border border-gray-200/60">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 font-poppins">
                      {user?.name?.split(' ')[0] || user?.username || 'Warden'}
                    </p>
                    <p className="text-xs text-gray-500 font-outfit">
                      {getHostelName()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center text-white font-semibold text-lg shadow-lg border-2 border-white/20">
                    {(user?.name?.charAt(0) || user?.username?.charAt(0) || 'W').toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-green-50/30">
          <div className="p-8">
            <Routes>
              <Route path="/home" element={<WardenHome />} />
              <Route path="/outpasses" element={<OutpassList />} />
              <Route path="/review/:id" element={<ReviewOutpass />} />
              <Route path="/outpass/:id" element={<ReviewOutpass />} />
              <Route path="/help" element={<WardenHelp />} />
              <Route path="/profile" element={<Profile />} />
              {/* Optional: Redirect unknown paths to home */}
              <Route path="*" element={<Navigate to="/warden/home" replace />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WardenDashboard;
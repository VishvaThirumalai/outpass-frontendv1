  // src/components/student/StudentDashboard.js
  import React, { useState, useEffect } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { useAuth } from '../../context/AuthContext';
  import { studentService } from '../../services/studentService';
  import StudentHome from './StudentHome';
  import ApplyOutpass from './ApplyOutpass';
  import OutpassHistory from './OutpassHistory';
  import HelpSection from './HelpSection';
  import Profile from '../common/Profile';

  const StudentDashboard = () => {
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState({ active: 0, pending: 0, approved: 0, rejected: 0, total: 0, completed: 0 });
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    const navigationItems = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        ),
        component: <StudentHome />
      },
      {
        id: 'apply',
        label: 'Apply Outpass',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        ),
        component: <ApplyOutpass onSuccess={() => setActiveTab('history')} />
      },
      {
        id: 'history',
        label: 'Outpass History',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        ),
        component: <OutpassHistory />
      },
      {
        id: 'help',
        label: 'Help & Support',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        component: <HelpSection />
      }
    ];

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

    // Fetch stats and profile data
    useEffect(() => {
      let mounted = true;
      const loadData = async () => {
        try {
          // Load profile data
          if ((!user?.rollNumber || !user?.hostel) && localStorage.getItem('token')) {
            const profileResp = await studentService.getProfile();
            if (mounted && profileResp && profileResp.success && profileResp.data) {
              setProfile(profileResp.data);
            }
          }

          // Load stats data
          const statsResponse = await studentService.getStats();
          if (mounted && statsResponse) {
            const statsData = statsResponse.data || statsResponse;
            setStats({
              total: statsData.totalOutpasses || statsData.total || 0,
              pending: statsData.pendingOutpasses || statsData.pending || 0,
              approved: statsData.approvedOutpasses || statsData.approved || 0,
              active: statsData.activeOutpasses || statsData.active || 0,
              completed: statsData.completedOutpasses || statsData.completed || 0,
              rejected: statsData.rejectedOutpasses || statsData.rejected || 0
            });
          }
        } catch (err) {
          console.warn('StudentDashboard: could not load data', err?.message || err);
        }
      };
      loadData();
      return () => { mounted = false; };
    }, [user]);

    const handleTabChange = (tab) => {
      setActiveTab(tab);
      if (isMobile) {
        setIsSidebarOpen(false);
      }
    };

    const handleProfile = () => {
      setActiveTab('profile');
      if (isMobile) {
        setIsSidebarOpen(false);
      }
    };

    const handleLogout = () => {
      logout();
      navigate('/login');
    };

    const getHostelBadgeColor = (hostel) => {
      const hostelType = hostel?.toLowerCase() || '';
      if (hostelType.includes('boys')) return 'bg-blue-100 text-blue-800 border-blue-200';
      if (hostelType.includes('girls')) return 'bg-pink-100 text-pink-800 border-pink-200';
      if (hostelType.includes('postgrad') || hostelType.includes('pg')) return 'bg-purple-100 text-purple-800 border-purple-200';
      if (hostelType.includes('faculty')) return 'bg-green-100 text-green-800 border-green-200';
      return 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getStatColor = (type) => {
      const colors = {
        active: 'from-green-500 to-green-600',
        pending: 'from-yellow-500 to-yellow-600',
        approved: 'from-blue-500 to-blue-600',
        rejected: 'from-red-500 to-red-600',
        total: 'from-purple-500 to-purple-600',
        completed: 'from-indigo-500 to-indigo-600'
      };
      return colors[type] || 'from-gray-500 to-gray-600';
    };

    const renderContent = () => {
      if (activeTab === 'profile') {
        return <Profile />;
      }
      const activeItem = navigationItems.find(item => item.id === activeTab);
      return activeItem ? activeItem.component : <StudentHome />;
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
                  {user?.name?.split(' ')[0] || user?.username || 'Student'}
                </p>
                <p className="text-xs text-slate-300 font-outfit">
                  {user?.rollNumber || profile?.rollNumber || 'ID'}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg border-2 border-white/20">
                {user?.name?.charAt(0) || user?.username?.charAt(0) || 'S'}
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
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                🎓
              </div>
              <div>
                <h1 className="text-xl font-bold text-white font-poppins">Student Portal</h1>
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
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg border-2 border-white/20">
                  {user?.name?.charAt(0) || user?.username?.charAt(0) || 'S'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-slate-800"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-white font-poppins truncate">
                  {user?.name || user?.username || profile?.fullName || 'Student'}
                </h2>
                <p className="text-sm text-slate-300 font-outfit truncate">
                  {user?.rollNumber || profile?.rollNumber || 'Student ID'}
                </p>
                {(user?.hostel || profile?.hostelName || profile?.hostel) && (
                  <span className={`inline-block mt-1 px-3 py-1 text-xs font-medium rounded-full border ${getHostelBadgeColor(user?.hostel || profile?.hostelName || profile?.hostel)} font-outfit`}>
                    {user?.hostel || profile?.hostelName || profile?.hostel}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats - Matching Home Page Style */}
          <div className="p-6 border-b border-slate-700">
            <h3 className="text-sm font-semibold text-slate-300 font-outfit mb-4 uppercase tracking-wide">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              {['active', 'pending'].map((statType) => (
                <div key={statType} className="bg-slate-700/40 rounded-xl p-3 backdrop-blur-sm border border-slate-600/50">
                  <div className={`text-lg font-bold text-white font-poppins bg-gradient-to-r ${getStatColor(statType)} bg-clip-text text-transparent`}>
                    {stats[statType]}
                  </div>
                  <div className="text-xs text-slate-300 font-outfit mt-1 capitalize">
                    {statType === 'active' ? 'Active Now' : 'Pending'}
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
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-lg' 
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white border border-transparent'
                    }
                  `}
                  onClick={() => handleTabChange(item.id)}
                >
                  <div className={`
                    flex-shrink-0 transition-transform duration-200
                    ${activeTab === item.id ? 'text-blue-400 scale-110' : 'text-slate-300 group-hover:text-white group-hover:scale-110'}
                  `}>
                    {item.icon}
                  </div>
                  <span className="font-medium font-poppins">{item.label}</span>
                  {activeTab === item.id && (
                    <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          </nav>

          {/* Bottom Actions - Profile above Logout */}
          <div className="p-6 border-t border-slate-700 space-y-3">
            {/* Profile Button */}
            <button 
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 border group
                ${activeTab === 'profile' 
                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/30 shadow-lg' 
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white border-transparent'
                }
              `}
              onClick={handleProfile}
            >
              <svg className={`
                w-5 h-5 transition-colors duration-200
                ${activeTab === 'profile' ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'}
              `} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="font-medium font-poppins">My Profile</span>
              {activeTab === 'profile' && (
                <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              )}
            </button>

            {/* Logout Button */}
            <button 
              className="w-full flex items-center space-x-3 px-4 py-3 text-slate-300 hover:bg-red-500/20 hover:text-red-400 rounded-xl transition-all duration-200 border border-transparent hover:border-red-500/30 group"
              onClick={handleLogout}
            >
              <svg className="w-5 h-5 text-slate-400 group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
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
                    {activeTab === 'profile' ? 'My Profile' : navigationItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                  </h1>
                  <nav className="flex space-x-2 text-sm text-gray-600 mt-2 font-outfit">
                    <span className="text-gray-500">Student Portal</span>
                    <span className="text-gray-300">/</span>
                    <span className="text-gray-900 font-semibold">
                      {activeTab === 'profile' ? 'My Profile' : navigationItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
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
                      3
                    </span>
                  </button>
                  
                  {/* User Avatar */}
                  <div className="flex items-center space-x-3 bg-gray-50 rounded-2xl px-4 py-2 border border-gray-200/60">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 font-poppins">
                        {user?.name?.split(' ')[0] || user?.username || 'Student'}
                      </p>
                      <p className="text-xs text-gray-500 font-outfit">
                        {user?.rollNumber || profile?.rollNumber || 'Student ID'}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center text-white font-semibold text-lg shadow-lg border-2 border-white/20">
                      {user?.name?.charAt(0) || user?.username?.charAt(0) || 'S'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50/30">
            <div className="p-8">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    );
  };

  export default StudentDashboard;
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';
import { wardenService } from '../../services/wardenService';
import { adminService } from '../../services/adminService';
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Building, 
  BookOpen,
  Calendar,
  MapPin,
  GraduationCap,
  Briefcase,
  Clock,
  CheckCircle,
  Edit3,
  ArrowLeft,
  IdCard,
  DoorOpen,
  AlertCircle,
  Save,
  ShieldCheck,
  Crown,
  Users,
  Settings
} from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    username: ''
  });
  const [detailedUser, setDetailedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  // Helper function to get hostel name with proper fallbacks
  const getHostelName = (userData) => {
    return userData?.hostelName || userData?.hostel || userData?.hostelAssigned || 'Not Assigned';
  };

  // Helper function to get designation with proper fallbacks
  const getDesignation = (userData) => {
    return userData?.designation || 'Senior Staff';
  };

  // Helper to get user identifier (try multiple fields)
  const getUserId = (userData) => {
    return userData?.id || userData?.userId || userData?.username;
  };

  const fetchUserProfile = async () => {
    try {
      setFetching(true);
      setError('');

      if (!user) {
        setError('No user data available');
        setFetching(false);
        return;
      }

      console.log('🔍 Fetching profile for user:', user);

      // Set basic data from authenticated user
      const basicProfileData = {
        fullName: user.fullName || user.name || '',
        email: user.email || '',
        mobileNumber: user.mobileNumber || user.phone || '',
        username: user.username || ''
      };
      
      setProfileData(basicProfileData);
      
      // Start with basic user data
      let userProfileData = { ...user };

      // Fetch additional profile data based on role
      try {
        let response;
        
        switch (user.role) {
          case 'STUDENT':
            response = await userService.getStudentProfile();
            break;
          case 'WARDEN':
            response = await wardenService.getProfile();
            break;
          case 'SECURITY':
            response = await adminService.getAllSecurity();
            if (response && Array.isArray(response)) {
              const securityUser = response.find(sec => 
                sec.id === user.id || 
                sec.email === user.email || 
                sec.username === user.username
              );
              if (securityUser) response = { success: true, data: securityUser };
            }
            break;
          case 'ADMIN':
            response = await adminService.getAllAdmins();
            if (response && Array.isArray(response)) {
              const adminUser = response.find(admin => 
                admin.id === user.id || 
                admin.email === user.email || 
                admin.username === user.username
              );
              if (adminUser) response = { success: true, data: adminUser };
            }
            break;
          default:
            response = { success: true, data: user };
        }

        console.log('📊 Profile API response:', response);

        if (response && response.success && response.data) {
          userProfileData = { ...userProfileData, ...response.data };
        }

      } catch (apiError) {
        console.log('⚠️ Profile API error, using basic data:', apiError);
      }

      console.log('✅ Final profile data:', userProfileData);
      setDetailedUser(userProfileData);

      // Update profile form with the best available data
      setProfileData(prev => ({
        ...prev,
        fullName: userProfileData.fullName || userProfileData.name || prev.fullName,
        email: userProfileData.email || prev.email,
        mobileNumber: userProfileData.mobileNumber || userProfileData.phone || prev.mobileNumber,
        username: userProfileData.username || prev.username
      }));

    } catch (err) {
      console.error('❌ Error in fetchUserProfile:', err);
      setError('Failed to load profile data. Using basic information.');
      setDetailedUser(user);
    } finally {
      setFetching(false);
    }
  };

  const handleBackToDashboard = () => {
    const routes = {
      'ADMIN': '/admin',
      'STUDENT': '/student',
      'WARDEN': '/warden',
      'SECURITY': '/security'
    };
    navigate(routes[user?.role] || '/admin');
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (message) setMessage('');
    if (error) setError('');
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      if (!profileData.fullName.trim()) {
        throw new Error('Full name is required');
      }

      if (!profileData.email.trim()) {
        throw new Error('Email address is required');
      }

      if (!profileData.mobileNumber.trim()) {
        throw new Error('Mobile number is required');
      }

      if (!/^\d{10}$/.test(profileData.mobileNumber)) {
        throw new Error('Mobile number must be exactly 10 digits');
      }

      if (!/\S+@\S+\.\S+/.test(profileData.email)) {
        throw new Error('Please enter a valid email address');
      }

      console.log('🔄 Updating profile with data:', profileData);

      const updateData = {
        fullName: profileData.fullName,
        email: profileData.email,
        mobileNumber: profileData.mobileNumber
      };

      const updateResponse = await userService.updateUserProfile(updateData);

      console.log('📨 Update response:', updateResponse);

      if (updateResponse && updateResponse.success) {
        const updatedUser = { ...user, ...updateData };
        updateUser(updatedUser);
        setDetailedUser(prev => ({ ...prev, ...updateData }));
        
        setMessage('Profile updated successfully! 🎉');
        
        setTimeout(() => {
          fetchUserProfile();
        }, 1500);
      } else {
        throw new Error(updateResponse?.message || 'Failed to update profile. Please try again.');
      }
    } catch (err) {
      console.error('❌ Profile update error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      STUDENT: 'from-blue-500 to-blue-600',
      ADMIN: 'from-purple-500 to-purple-600',
      WARDEN: 'from-cyan-500 to-cyan-600',
      SECURITY: 'from-emerald-500 to-emerald-600'
    };
    return colors[role] || 'from-gray-500 to-gray-600';
  };

  const getRoleIcon = (role) => {
    const icons = {
      STUDENT: <GraduationCap className="w-5 h-5" />,
      ADMIN: <Crown className="w-5 h-5" />,
      WARDEN: <Building className="w-5 h-5" />,
      SECURITY: <ShieldCheck className="w-5 h-5" />
    };
    return icons[role] || <User className="w-5 h-5" />;
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      STUDENT: 'bg-blue-100 text-blue-800 border-blue-200',
      ADMIN: 'bg-purple-100 text-purple-800 border-purple-200',
      WARDEN: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      SECURITY: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    };
    return colors[role] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const renderRoleSpecificInfo = () => {
    if (!detailedUser) return null;

    const commonCardClass = "bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 hover:border-blue-200 group";
    const iconContainerClass = "p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300";

    switch (detailedUser.role) {
      case 'STUDENT':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                <GraduationCap className="w-7 h-7 text-blue-500 mr-3" />
                Student Information
              </h3>
              <span className="text-sm text-gray-500">Academic Details</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className={commonCardClass}>
                <div className={iconContainerClass}>
                  <IdCard className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-semibold text-gray-600 mt-4 mb-1">Roll Number</h4>
                <p className="text-xl font-bold text-gray-800">{detailedUser.rollNumber || 'N/A'}</p>
              </div>
              
              <div className={commonCardClass}>
                <div className={iconContainerClass}>
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-semibold text-gray-600 mt-4 mb-1">Course</h4>
                <p className="text-lg font-semibold text-gray-800">{detailedUser.course || 'Not specified'}</p>
              </div>
              
              <div className={commonCardClass}>
                <div className={iconContainerClass}>
                  <Calendar className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-semibold text-gray-600 mt-4 mb-1">Year of Study</h4>
                <p className="text-xl font-bold text-blue-600">{detailedUser.yearOfStudy || 'N/A'}</p>
              </div>
              
              <div className={commonCardClass}>
                <div className={iconContainerClass}>
                  <Building className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-semibold text-gray-600 mt-4 mb-1">Hostel</h4>
                <p className="text-lg font-semibold text-gray-800">{getHostelName(detailedUser)}</p>
              </div>
              
              <div className={commonCardClass}>
                <div className={iconContainerClass}>
                  <DoorOpen className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-semibold text-gray-600 mt-4 mb-1">Room Number</h4>
                <p className="text-xl font-bold text-blue-600">{detailedUser.roomNumber || 'N/A'}</p>
              </div>
              
              <div className={commonCardClass}>
                <div className={iconContainerClass}>
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-semibold text-gray-600 mt-4 mb-1">Degree</h4>
                <p className="text-lg font-semibold text-gray-800">{detailedUser.degree || 'Not specified'}</p>
              </div>
            </div>
          </div>
        );

      case 'WARDEN':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                <Building className="w-7 h-7 text-cyan-500 mr-3" />
                Warden Information
              </h3>
              <span className="text-sm text-gray-500">Staff Details</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className={commonCardClass}>
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 text-white group-hover:from-cyan-600 group-hover:to-cyan-700 transition-all duration-300">
                  <IdCard className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-semibold text-gray-600 mt-4 mb-1">Employee ID</h4>
                <p className="text-xl font-bold text-cyan-600">{detailedUser.employeeId || detailedUser.username}</p>
              </div>
              
              <div className={commonCardClass}>
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 text-white group-hover:from-cyan-600 group-hover:to-cyan-700 transition-all duration-300">
                  <Building className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-semibold text-gray-600 mt-4 mb-1">Department</h4>
                <p className="text-lg font-semibold text-gray-800">{detailedUser.department || 'Not specified'}</p>
              </div>
              
              <div className={commonCardClass}>
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 text-white group-hover:from-cyan-600 group-hover:to-cyan-700 transition-all duration-300">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-semibold text-gray-600 mt-4 mb-1">Designation</h4>
                <p className="text-lg font-semibold text-gray-800">{getDesignation(detailedUser)}</p>
              </div>
              
              <div className={commonCardClass}>
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 text-white group-hover:from-cyan-600 group-hover:to-cyan-700 transition-all duration-300">
                  <MapPin className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-semibold text-gray-600 mt-4 mb-1">Hostel Assigned</h4>
                <p className="text-lg font-semibold text-gray-800">{getHostelName(detailedUser)}</p>
              </div>
            </div>
          </div>
        );

      case 'SECURITY':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                <ShieldCheck className="w-7 h-7 text-emerald-500 mr-3" />
                Security Information
              </h3>
              <span className="text-sm text-gray-500">Security Details</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className={commonCardClass}>
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white group-hover:from-emerald-600 group-hover:to-emerald-700 transition-all duration-300">
                  <IdCard className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-semibold text-gray-600 mt-4 mb-1">Security ID</h4>
                <p className="text-xl font-bold text-emerald-600">{detailedUser.securityId || detailedUser.username}</p>
              </div>
              
              <div className={commonCardClass}>
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white group-hover:from-emerald-600 group-hover:to-emerald-700 transition-all duration-300">
                  <Clock className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-semibold text-gray-600 mt-4 mb-1">Shift</h4>
                <p className="text-lg font-semibold text-gray-800">{detailedUser.shift || 'Not assigned'}</p>
              </div>
              
              <div className={commonCardClass}>
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white group-hover:from-emerald-600 group-hover:to-emerald-700 transition-all duration-300">
                  <MapPin className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-semibold text-gray-600 mt-4 mb-1">Gate Assigned</h4>
                <p className="text-lg font-semibold text-gray-800">{detailedUser.gateAssigned || 'Not assigned'}</p>
              </div>
            </div>
          </div>
        );

      case 'ADMIN':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                <Crown className="w-7 h-7 text-purple-500 mr-3" />
                Administrator Information
              </h3>
              <span className="text-sm text-gray-500">Administrative Details</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className={commonCardClass}>
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white group-hover:from-purple-600 group-hover:to-purple-700 transition-all duration-300">
                  <IdCard className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-semibold text-gray-600 mt-4 mb-1">Admin ID</h4>
                <p className="text-xl font-bold text-purple-600">{detailedUser.adminId || detailedUser.username}</p>
              </div>
              
              <div className={commonCardClass}>
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white group-hover:from-purple-600 group-hover:to-purple-700 transition-all duration-300">
                  <Building className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-semibold text-gray-600 mt-4 mb-1">Department</h4>
                <p className="text-lg font-semibold text-gray-800">{detailedUser.department || 'Administration'}</p>
              </div>
              
              <div className={commonCardClass}>
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white group-hover:from-purple-600 group-hover:to-purple-700 transition-all duration-300">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-semibold text-gray-600 mt-4 mb-1">Designation</h4>
                <p className="text-lg font-semibold text-gray-800">{getDesignation(detailedUser)}</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4 font-poppins">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-gray-200 transform hover:scale-105 transition-transform duration-300">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Loading Profile</h3>
          <p className="text-gray-600">Please wait while we load your information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 font-poppins">
      <div className="container mx-auto px-4 py-8">
        

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            User Profile
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Manage your account information and personal details in one place
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-2xl shadow-sm p-2 flex space-x-2 border border-gray-300">
            <button
              className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-105'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              <Edit3 className="w-5 h-5 mr-3" />
              Edit Profile
            </button>
            <button
              className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center ${
                activeTab === 'info'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-105'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('info')}
            >
              <User className="w-5 h-5 mr-3" />
              Account Details
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-300 transform hover:shadow-2xl transition-all duration-300">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm">
                    <Edit3 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Edit Profile Information</h3>
                    <p className="text-blue-100 mt-1">Update your personal details and contact information</p>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleProfileUpdate} className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 flex items-center">
                      <User className="w-4 h-4 mr-2 text-blue-500" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={profileData.fullName}
                      onChange={handleProfileChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-white shadow-sm"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-blue-500" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-white shadow-sm"
                      placeholder="Enter your email address"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="mobileNumber" className="block text-sm font-semibold text-gray-700 flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-blue-500" />
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      id="mobileNumber"
                      name="mobileNumber"
                      value={profileData.mobileNumber}
                      onChange={handleProfileChange}
                      pattern="[0-9]{10}"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-white shadow-sm"
                      placeholder="Enter 10-digit mobile number"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="username" className="block text-sm font-semibold text-gray-700 flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={profileData.username}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 bg-gray-100 rounded-xl text-gray-500 cursor-not-allowed shadow-sm"
                      placeholder="Username cannot be changed"
                    />
                    <p className="text-xs text-gray-500 mt-2 flex items-center">
                      <Settings className="w-3 h-3 mr-1" />
                      Username cannot be modified
                    </p>
                  </div>
                </div>

                {/* Messages */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center shadow-sm">
                    <div className="w-6 h-6 bg-red-400 rounded-full flex items-center justify-center mr-3">
                      <AlertCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-red-700 font-medium">{error}</span>
                  </div>
                )}
                
                {message && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center shadow-sm">
                    <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center mr-3">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-green-700 font-medium">{message}</span>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Updating Profile...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <Save className="w-5 h-5 mr-3" />
                      Update Profile
                    </span>
                  )}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'info' && detailedUser && (
            <div className="space-y-8">
              {/* Basic Info Card */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-300 transform hover:shadow-2xl transition-all duration-300">
                <div className={`bg-gradient-to-r ${getRoleColor(detailedUser.role)} p-8`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center text-white text-3xl font-bold backdrop-blur-sm border-2 border-white border-opacity-30 shadow-lg">
                        {detailedUser.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-white mb-2">{detailedUser.fullName || 'User'}</h3>
                        <div className="flex items-center space-x-3">
                          <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border-2 border-white border-opacity-30 bg-white bg-opacity-20 backdrop-blur-sm text-white shadow-sm`}>
                            {getRoleIcon(detailedUser.role)}
                            <span className="ml-2">{detailedUser.role}</span>
                          </span>
                          <span className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-full text-sm font-semibold border-2 border-white border-opacity-30 shadow-sm">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white text-opacity-90 text-sm">Member Since</p>
                      <p className="text-white font-semibold">
                        {detailedUser.createdAt ? new Date(detailedUser.createdAt).toLocaleDateString() : 'Recently'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-500" />
                    Basic Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                      <label className="text-sm font-semibold text-gray-600 flex items-center mb-2">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        Username
                      </label>
                      <p className="text-xl font-bold text-gray-800">{detailedUser.username}</p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                      <label className="text-sm font-semibold text-gray-600 flex items-center mb-2">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        Email
                      </label>
                      <p className="text-lg font-semibold text-gray-800 truncate">{detailedUser.email}</p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                      <label className="text-sm font-semibold text-gray-600 flex items-center mb-2">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        Mobile
                      </label>
                      <p className="text-lg font-semibold text-gray-800">{detailedUser.mobileNumber || 'Not provided'}</p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                      <label className="text-sm font-semibold text-gray-600 flex items-center mb-2">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        Last Login
                      </label>
                      <p className="text-base font-semibold text-gray-800">
                        {detailedUser.lastLogin ? new Date(detailedUser.lastLogin).toLocaleString() : 'Recently'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Role Specific Information */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-300 transform hover:shadow-2xl transition-all duration-300">
                {renderRoleSpecificInfo()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
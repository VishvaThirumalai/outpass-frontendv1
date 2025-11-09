import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { wardenService } from '../../services/wardenService';
import { 
  Clock, 
  CheckCircle, 
  Users, 
  XCircle, 
  FileText, 
  AlertCircle,
  TrendingUp,
  Calendar,
  Shield
} from 'lucide-react';

const WardenHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    active: 0,
    rejected: 0,
    total: 0
  });
  const [wardenProfile, setWardenProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);

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

  // Helper function to get designation with proper fallbacks
  const getDesignation = () => {
    if (profileLoading) {
      return 'Loading...';
    }
    return wardenProfile?.designation || 
           user?.designation || 
           'Senior Warden';
  };

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
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching warden dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWardenProfile = async () => {
    try {
      setProfileLoading(true);
      const response = await wardenService.getProfile();
      console.log('Warden Profile Response in Home:', response); // Debug log
      
      if (response && response.success) {
        setWardenProfile(response.data);
        console.log('Warden Profile Data in Home:', response.data); // Debug log
        console.log('Designation fields:', {
          designation: response.data?.designation,
          userDesignation: user?.designation
        });
        console.log('Hostel fields in Home:', {
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

  const getHostelBadgeColor = (hostel) => {
    const hostelType = hostel?.toLowerCase() || '';
    if (hostelType.includes('boys')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (hostelType.includes('girls')) return 'bg-pink-100 text-pink-800 border-pink-200';
    if (hostelType.includes('postgrad') || hostelType.includes('pg')) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (hostelType.includes('faculty')) return 'bg-green-100 text-green-800 border-green-200';
    if (hostelType.includes('kalam')) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const statCards = [
    {
      key: 'pending',
      title: 'Pending Review',
      value: stats.pending,
      description: 'Awaiting your decision',
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-200'
    },
    {
      key: 'approved',
      title: 'Approved',
      value: stats.approved,
      description: 'Applications approved',
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200'
    },
    {
      key: 'active',
      title: 'Active',
      value: stats.active,
      description: 'Students outside',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200'
    },
    {
      key: 'rejected',
      title: 'Rejected',
      value: stats.rejected,
      description: 'Applications rejected',
      icon: XCircle,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200'
    },
    {
      key: 'total',
      title: 'Total',
      value: stats.total,
      description: 'All applications',
      icon: FileText,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200'
    }
  ];

  const quickActions = [
    {
      title: 'Review Outpasses',
      description: 'View and manage pending outpass applications',
      icon: FileText,
      path: '/warden/outpasses',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Pending Requests',
      description: 'Check applications waiting for approval',
      icon: Clock,
      path: '/warden/outpasses?status=pending',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600'
    },
    {
      title: 'Active Outpasses',
      description: 'Monitor students currently outside campus',
      icon: Users,
      path: '/warden/outpasses?status=active',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-poppins text-lg">Loading warden dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30 font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-3 font-poppins">
                Warden Dashboard
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0">
                <p className="text-xl text-gray-600 font-outfit">
                  Welcome back, <strong className="text-gray-900">{user?.name || user?.username}</strong>!
                </p>
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium rounded-full border border-green-600 font-outfit">
                    {getDesignation()}
                  </span>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getHostelBadgeColor(getHostelName())} font-outfit`}>
                    {getHostelName()}
                  </span>
                </div>
              </div>
              <p className="text-gray-500 mt-2 font-outfit">
                Managing outpass applications for {getHostelName()}
              </p>
            </div>
            
            {/* Date and Time */}
            <div className="mt-4 lg:mt-0 lg:text-right">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600 font-outfit">Today</p>
                    <p className="text-lg font-semibold text-gray-900 font-poppins">
                      {new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          {statCards.map((stat) => {
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
              <p className="text-gray-600 font-outfit mt-1">Manage outpass applications efficiently</p>
            </div>
            <div className="hidden lg:flex items-center space-x-2 text-green-600">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium font-outfit">Quick Access</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Link
                  key={index}
                  to={action.path}
                  className="group"
                >
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 border-gray-200 p-6 hover:border-green-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group-hover:scale-105">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-xl ${action.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className={`w-6 h-6 ${action.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 font-poppins group-hover:text-green-700 transition-colors duration-200">
                          {action.title}
                        </h3>
                        <p className="text-gray-600 text-sm font-outfit">
                          {action.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-green-600 text-sm font-medium font-outfit group-hover:text-green-700 transition-colors duration-200">
                        Access Now →
                      </span>
                      <div className="w-2 h-2 bg-green-400 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <AlertCircle className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900 font-poppins">Recent Activity</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 font-poppins">
                    New outpass requests pending
                  </p>
                  <p className="text-xs text-gray-600 font-outfit">
                    {stats.pending} applications need your attention
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-xl border border-green-200">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 font-poppins">
                    Active outpasses
                  </p>
                  <p className="text-xs text-gray-600 font-outfit">
                    {stats.active} students are currently outside campus
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-semibold text-gray-900 font-poppins">System Status</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-sm font-medium text-gray-700 font-poppins">Outpass System</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full font-outfit">
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-sm font-medium text-gray-700 font-poppins">Database</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full font-outfit">
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-sm font-medium text-gray-700 font-poppins">Security</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full font-outfit">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WardenHome;
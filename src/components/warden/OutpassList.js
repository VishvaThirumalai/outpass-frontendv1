// src/components/warden/OutpassList.js - UPDATED VERSION WITH LATE REASON TOGGLE
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { wardenService } from '../../services/wardenService';
import { formatDate } from '../../utils/formatters';

const OutpassList = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') || 'all';
  
  const [outpasses, setOutpasses] = useState([]);
  const [filteredOutpasses, setFilteredOutpasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(statusFilter);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayLimit, setDisplayLimit] = useState(10);
  const [customLimit, setCustomLimit] = useState('');
  const [sortBy, setSortBy] = useState('created');
  const [expandedLateReasons, setExpandedLateReasons] = useState({}); // Track which late reasons are expanded

  useEffect(() => {
    setFilter(statusFilter);
    fetchOutpasses(statusFilter);
  }, [statusFilter]);

  useEffect(() => {
    filterAndSortOutpasses();
  }, [outpasses, searchTerm, displayLimit, sortBy]);

  const fetchOutpasses = async (status = 'all') => {
    try {
      setLoading(true);
      const outpassesData = await wardenService.getOutpasses(status);
      console.log('📋 Outpasses data received:', outpassesData);
      setOutpasses(outpassesData);
      
      // Reset expanded states when new data loads
      setExpandedLateReasons({});
    } catch (error) {
      console.error('Error fetching outpasses:', error);
      setOutpasses([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortOutpasses = () => {
    let filtered = [...outpasses];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(outpass => 
        outpass.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        outpass.studentRollNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        outpass.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        outpass.reason?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'departure':
          return new Date(a.leaveStartDate) - new Date(b.leaveStartDate);
        case 'return':
          return new Date(a.expectedReturnDate) - new Date(b.expectedReturnDate);
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    // Apply display limit
    filtered = filtered.slice(0, displayLimit);
    
    setFilteredOutpasses(filtered);
  };

  // Toggle late reason visibility
  const toggleLateReason = (outpassId) => {
    setExpandedLateReasons(prev => ({
      ...prev,
      [outpassId]: !prev[outpassId]
    }));
  };

  const handleCustomLimitChange = (e) => {
    const value = e.target.value;
    setCustomLimit(value);
    
    if (value === '') {
      setDisplayLimit(10);
    } else {
      const numValue = parseInt(value);
      if (!isNaN(numValue) && numValue > 0) {
        setDisplayLimit(numValue);
      }
    }
  };

  const handleCustomLimitSubmit = (e) => {
    e.preventDefault();
    if (customLimit === '') {
      setDisplayLimit(10);
    } else {
      const numValue = parseInt(customLimit);
      if (!isNaN(numValue) && numValue > 0) {
        setDisplayLimit(numValue);
        setCustomLimit('');
      }
    }
  };

  // Status badge styling function
  const getStatusBadgeClass = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'PENDING': return `${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-200`;
      case 'APPROVED': return `${baseClasses} bg-green-100 text-green-800 border border-green-200`;
      case 'ACTIVE': return `${baseClasses} bg-blue-100 text-blue-800 border border-blue-200`;
      case 'REJECTED': return `${baseClasses} bg-red-100 text-red-800 border border-red-200`;
      case 'COMPLETED': return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`;
      case 'CANCELLED': return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`;
      default: return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  // Status icon function
  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return '⏳';
      case 'APPROVED': return '✅';
      case 'ACTIVE': return '🚶';
      case 'REJECTED': return '❌';
      case 'COMPLETED': return '✔️';
      case 'CANCELLED': return '🚫';
      default: return '📄';
    }
  };

  // Filter title
  const getFilterTitle = () => {
    switch (filter) {
      case 'pending': return '⏳ Pending Outpasses';
      case 'approved': return '✅ Approved Outpasses';
      case 'active': return '🚶 Active Outpasses';
      default: return '📋 All Outpasses';
    }
  };

  // Sort options
  const sortOptions = [
    { value: 'created', label: 'Recently Created', icon: '🆕' },
    { value: 'departure', label: 'Departure Time (Soonest First)', icon: '🕐' },
    { value: 'return', label: 'Return Time (Soonest First)', icon: '🔄' }
  ];

  // Display limit options
  const limitOptions = [10, 25, 50, 100];

  // Check if outpass can be reviewed (only PENDING status)
  const canReviewOutpass = (outpass) => {
    return outpass.status === 'PENDING';
  };

  // Check if outpass has late return
  const hasLateReturn = (outpass) => {
    return outpass.status === 'COMPLETED' && outpass.isLateReturn;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-poppins flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading outpasses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-poppins p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {getFilterTitle()}
              </h1>
              <p className="text-gray-600">
                Managing outpasses for <span className="font-semibold text-blue-600">{user?.hostel} Hostel</span>
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <p className="text-sm text-gray-600">Total outpasses</p>
                <p className="text-2xl font-bold text-gray-900">{outpasses.length}</p>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 mb-6">
            <div className="flex space-x-1">
              <Link 
                to="/warden/outpasses" 
                className={`flex-1 py-3 px-4 text-center rounded-lg font-medium transition-all duration-200 ${
                  filter === 'all' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                📋 All
              </Link>
              <Link 
                to="/warden/outpasses?status=pending" 
                className={`flex-1 py-3 px-4 text-center rounded-lg font-medium transition-all duration-200 ${
                  filter === 'pending' 
                    ? 'bg-yellow-500 text-white shadow-md' 
                    : 'text-gray-600 hover:text-yellow-600 hover:bg-gray-50'
                }`}
              >
                ⏳ Pending
              </Link>
              <Link 
                to="/warden/outpasses?status=approved" 
                className={`flex-1 py-3 px-4 text-center rounded-lg font-medium transition-all duration-200 ${
                  filter === 'approved' 
                    ? 'bg-green-500 text-white shadow-md' 
                    : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
                }`}
              >
                ✅ Approved
              </Link>
              <Link 
                to="/warden/outpasses?status=active" 
                className={`flex-1 py-3 px-4 text-center rounded-lg font-medium transition-all duration-200 ${
                  filter === 'active' 
                    ? 'bg-blue-500 text-white shadow-md' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                🚶 Active
              </Link>
            </div>
          </div>

          {/* Search and Controls Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🔍 Search Outpasses
                </label>
                <input
                  type="text"
                  placeholder="Search by name, roll number, destination..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📊 Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.icon} {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Display Limit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📄 Show Results
                </label>
                <div className="flex space-x-2">
                  <select
                    value={displayLimit}
                    onChange={(e) => setDisplayLimit(Number(e.target.value))}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-white"
                  >
                    {limitOptions.map(limit => (
                      <option key={limit} value={limit}>
                        {limit} outpasses
                      </option>
                    ))}
                  </select>
                  {/* Custom input for any number */}
                  <form onSubmit={handleCustomLimitSubmit} className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Custom"
                      value={customLimit}
                      onChange={handleCustomLimitChange}
                      min="1"
                      max="1000"
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Set
                    </button>
                  </form>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Currently showing: {displayLimit} outpasses
                </p>
              </div>
            </div>

            {/* Results Info */}
            <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
              <span>
                Showing {filteredOutpasses.length} of {outpasses.length} outpasses
                {searchTerm && ` matching "${searchTerm}"`}
              </span>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Outpass List Grid */}
        {filteredOutpasses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No matching outpasses found' : 'No outpasses found'}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {searchTerm 
                ? `No outpasses found matching "${searchTerm}". Try adjusting your search terms.`
                : `There are no ${filter !== 'all' ? filter : ''} outpasses for your hostel at the moment.`
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOutpasses.map((outpass) => (
              <div 
                key={outpass.id} 
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden"
              >
                {/* Late Return Reason Banner - Shows above the card when expanded */}
                {hasLateReturn(outpass) && expandedLateReasons[outpass.id] && (
                  <div className="bg-red-50 border-b border-red-200 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="text-red-600 font-semibold text-sm uppercase tracking-wide mr-2">
                            ⚠️ Late Return Reason
                          </span>
                          {outpass.lateReturnReason && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                              {outpass.lateReturnReason.length > 100 ? 'Long Reason' : 'Short Reason'}
                            </span>
                          )}
                        </div>
                        <p className="text-red-800 text-sm">
                          {outpass.lateReturnReason || 'No reason provided for late return'}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleLateReason(outpass.id)}
                        className="text-red-600 hover:text-red-800 ml-2 flex-shrink-0"
                        title="Hide reason"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}

                {/* Card Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {outpass.studentName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {outpass.studentRollNumber} • {formatDate(outpass.createdAt)}
                      </p>
                    </div>
                    <div className={getStatusBadgeClass(outpass.status)}>
                      <span className="mr-1">{getStatusIcon(outpass.status)}</span>
                      {outpass.status}
                    </div>
                  </div>

                  {/* Late Return Indicator Button */}
                  {hasLateReturn(outpass) && !expandedLateReasons[outpass.id] && (
                    <div className="mt-3">
                      <button
                        onClick={() => toggleLateReason(outpass.id)}
                        className="w-full bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 px-3 rounded-lg transition-all duration-200 text-sm flex items-center justify-center"
                      >
                        <span className="mr-2">⚠️</span>
                        Show Late Return Reason
                        <span className="ml-2 text-xs bg-red-200 text-red-800 px-1.5 py-0.5 rounded">
                          Click to view
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Destination</span>
                      <p className="text-gray-900 font-medium mt-1">{outpass.destination}</p>
                    </div>
                    
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Reason</span>
                      <p className="text-gray-900 mt-1">{outpass.reason}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          {sortBy === 'departure' ? '🕐 Departure' : 'From'}
                        </span>
                        <p className="text-gray-900 font-medium mt-1">{formatDate(outpass.leaveStartDate)}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          {sortBy === 'return' ? '🔄 Return' : 'To'}
                        </span>
                        <p className="text-gray-900 font-medium mt-1">{formatDate(outpass.expectedReturnDate)}</p>
                      </div>
                    </div>

                    {outpass.emergencyContactName && (
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Emergency Contact</span>
                        <p className="text-gray-900 mt-1">
                          {outpass.emergencyContactName} 
                          <span className="text-gray-500 ml-2">({outpass.emergencyContactRelation})</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  {canReviewOutpass(outpass) ? (
                    <Link 
                      to={`/warden/outpass/${outpass.id}`}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md text-center block"
                    >
                      Review Outpass
                    </Link>
                  ) : (
                    <Link 
                      to={`/warden/outpass/${outpass.id}`}
                      className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md text-center block"
                    >
                      View Details
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OutpassList;
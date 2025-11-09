// src/components/security/ActivePasses.js
import React, { useState, useEffect } from 'react';
import { securityService } from '../../services/securityService';
import { formatDate, getStatusColor } from '../../utils/formatters';
import LateReturnModal from './LateReturnModal';

const ActivePasses = () => {
  const [activeOutpasses, setActiveOutpasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [lateReturnModal, setLateReturnModal] = useState({
    isOpen: false,
    outpass: null,
    isExpired: false,
    isOverdue: false
  });

  useEffect(() => {
    loadActiveOutpasses();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadActiveOutpasses, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadActiveOutpasses = async () => {
    try {
      const response = await securityService.getActiveOutpasses();
      if (response.success) {
        setActiveOutpasses(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load active outpasses:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeSinceDeparture = (departureTime) => {
    const now = new Date();
    const departed = new Date(departureTime);
    const diffMs = now - departed;
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffMins = Math.floor((diffMs % 3600000) / 60000);
    
    if (diffHrs > 0) {
      return `${diffHrs}h ${diffMins}m ago`;
    }
    return `${diffMins}m ago`;
  };

  const handleReturnClick = (outpass) => {
    const now = new Date();
    const expectedReturn = new Date(outpass.expectedReturnDate);
    const departureTime = new Date(outpass.actualDepartureTime);
    
    // Check if overdue (past expected return time)
    const isOverdue = now > expectedReturn;
    
    // Check if expired (24 hours after departure)
    const isExpired = departureTime && (now > new Date(departureTime.getTime() + 24 * 60 * 60 * 1000));
    
    if (isExpired || isOverdue) {
      // Show late return modal for expired or overdue returns
      setLateReturnModal({
        isOpen: true,
        outpass: outpass,
        isExpired: isExpired,
        isOverdue: isOverdue
      });
    } else {
      // Direct return for on-time returns
      if (window.confirm(`Mark ${outpass.studentName} as returned?`)) {
        handleMarkReturn(outpass);
      }
    }
  };

  const handleMarkReturn = async (outpass, lateReturnReason = null, comments = null) => {
    try {
      const response = await securityService.markReturn(
        outpass.id, 
        comments || 'Student returned',
        lateReturnReason
      );
      
      if (response.success) {
        // Refresh the list
        await loadActiveOutpasses();
        // Show success message
        alert('Return marked successfully!');
      } else {
        alert(response.message || 'Failed to mark return');
      }
    } catch (error) {
      console.error('Error marking return:', error);
      alert('Failed to mark return: ' + (error.message || 'Unknown error'));
    }
  };

  const filteredOutpasses = activeOutpasses.filter(outpass =>
    outpass.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    outpass.studentRollNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper function to calculate expired and overdue counts
  const calculateStats = () => {
    const now = new Date();
    
    const expiredCount = activeOutpasses.filter(o => {
      const departureTime = new Date(o.actualDepartureTime);
      return departureTime && (now > new Date(departureTime.getTime() + 24 * 60 * 60 * 1000));
    }).length;

    const overdueCount = activeOutpasses.filter(o => {
      const expectedReturn = new Date(o.expectedReturnDate);
      return now > expectedReturn;
    }).length;

    return { expiredCount, overdueCount };
  };

  const { expiredCount, overdueCount } = calculateStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-poppins flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading active passes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-poppins p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                🚶 Currently Outside
              </h1>
              <p className="text-gray-600 text-lg">
                Students currently outside the hostel premises
              </p>
            </div>
            
            {/* Search Box */}
            <div className="relative min-w-[300px]">
              <input
                type="text"
                placeholder="Search by name or roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-poppins"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">{activeOutpasses.length}</div>
              <div className="text-sm text-gray-600">Total Students Out</div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-2xl font-bold text-green-600">{filteredOutpasses.length}</div>
              <div className="text-sm text-gray-600">Filtered Results</div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {overdueCount}
              </div>
              <div className="text-sm text-gray-600">Overdue Returns</div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-2xl font-bold text-red-600">
                {expiredCount}
              </div>
              <div className="text-sm text-gray-600">Expired Returns</div>
            </div>
          </div>
        </div>

        {/* Active Passes Table */}
        {filteredOutpasses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">🏢</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No matching students found' : 'No students are currently out'}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {searchTerm 
                ? `No active outpasses found matching "${searchTerm}".`
                : 'All students are currently inside the hostel premises.'
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
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Active Outpasses ({filteredOutpasses.length})
                </h3>
                <button
                  onClick={loadActiveOutpasses}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Roll No
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Destination
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Departed At
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time Out
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expected Return
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Emergency Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOutpasses.map((outpass) => {
                    const now = new Date();
                    const expectedReturn = new Date(outpass.expectedReturnDate);
                    const departureTime = new Date(outpass.actualDepartureTime);
                    
                    const isOverdue = now > expectedReturn;
                    const isExpired = departureTime && (now > new Date(departureTime.getTime() + 24 * 60 * 60 * 1000));
                    
                    return (
                      <tr 
                        key={outpass.id} 
                        className={`hover:bg-gray-50 transition-colors duration-150 ${
                          isExpired ? 'bg-red-50 hover:bg-red-100' : 
                          isOverdue ? 'bg-orange-50 hover:bg-orange-100' : ''
                        }`}
                      >
                        {/* Student Name */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm mr-3">
                              {outpass.studentName?.charAt(0) || 'S'}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {outpass.studentName}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Roll Number */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-mono">
                            {outpass.studentRollNumber}
                          </div>
                        </td>

                        {/* Destination */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {outpass.destination || 'N/A'}
                          </div>
                        </td>

                        {/* Departed At */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(outpass.actualDepartureTime)}
                          </div>
                        </td>

                        {/* Time Out */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-blue-600">
                            {getTimeSinceDeparture(outpass.actualDepartureTime)}
                          </div>
                        </td>

                        {/* Expected Return */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${isExpired ? 'text-red-600' : isOverdue ? 'text-orange-600' : 'text-gray-900'}`}>
                            {formatDate(outpass.expectedReturnDate)}
                            {isExpired && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                                🚨 EXPIRED
                              </span>
                            )}
                            {isOverdue && !isExpired && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                                ⚠️ OVERDUE
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                            style={{ 
                              backgroundColor: `${getStatusColor(outpass.status)}20`,
                              color: getStatusColor(outpass.status),
                              borderColor: `${getStatusColor(outpass.status)}40`
                            }}
                          >
                            {outpass.status}
                          </span>
                        </td>

                        {/* Emergency Contact */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {outpass.emergencyContactName ? (
                            <div className="text-sm">
                              <div className="font-medium text-gray-900">
                                {outpass.emergencyContactName}
                              </div>
                              <div className="text-gray-500 font-mono">
                                {outpass.emergencyContactNumber}
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">N/A</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleReturnClick(outpass)}
                            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                              isExpired 
                                ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-300' 
                                : isOverdue
                                ? 'bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-300'
                                : 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-300'
                            }`}
                          >
                            {isExpired ? 'Mark Expired Return' : 
                             isOverdue ? 'Mark Late Return' : 'Mark Return'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div>
                  Showing {filteredOutpasses.length} of {activeOutpasses.length} active outpasses
                  {searchTerm && ` matching "${searchTerm}"`}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
                    <span>Expired returns</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-100 border border-orange-200 rounded"></div>
                    <span>Overdue returns</span>
                  </div>
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
          </div>
        )}

        {/* Auto-refresh Indicator */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-white rounded-full px-4 py-2 border border-gray-200">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            Auto-refreshing every 30 seconds
          </div>
        </div>

        {/* Late Return Modal */}
        {lateReturnModal.isOpen && (
          <LateReturnModal
            isOpen={lateReturnModal.isOpen}
            onClose={() => setLateReturnModal({ isOpen: false, outpass: null, isExpired: false, isOverdue: false })}
            onConfirm={(lateReturnReason, comments) => 
              handleMarkReturn(lateReturnModal.outpass, lateReturnReason, comments)
            }
            studentName={lateReturnModal.outpass?.studentName}
            rollNumber={lateReturnModal.outpass?.studentRollNumber}
            expectedReturn={lateReturnModal.outpass?.expectedReturnDate}
            actualDepartureTime={lateReturnModal.outpass?.actualDepartureTime}
            isExpired={lateReturnModal.isExpired}
            isOverdue={lateReturnModal.isOverdue}
          />
        )}
      </div>
    </div>
  );
};

export default ActivePasses;
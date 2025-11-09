// src/components/student/OutpassHistory.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/studentService';
import EditOutpassModal from './EditOutpassModal';

const OutpassHistory = () => {
  const { user } = useAuth();
  const [outpasses, setOutpasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [selectedOutpass, setSelectedOutpass] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadOutpasses();
  }, []);

  const loadOutpasses = async () => {
    try {
      setLoading(true);
      const response = await studentService.getMyOutpasses();
      if (response.success) {
        setOutpasses(response.data || []);
      } else {
        setOutpasses([]);
      }
    } catch (error) {
      console.error('Failed to load outpasses:', error);
      setOutpasses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (outpass) => {
    setSelectedOutpass(outpass);
    setShowEditModal(true);
  };

  const handleCancelOutpass = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this outpass?')) {
      return;
    }

    try {
      await studentService.cancelOutpass(id);
      alert('Outpass cancelled successfully');
      loadOutpasses();
    } catch (error) {
      alert('Failed to cancel outpass: ' + (error.message || 'Unknown error'));
    }
  };

  const getFilteredOutpasses = () => {
    if (filter === 'ALL') return outpasses;
    return outpasses.filter(o => o.status === filter);
  };

  const getStatusBadgeClass = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    
    const statusClasses = {
      'PENDING': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      'APPROVED': 'bg-green-100 text-green-800 border border-green-200',
      'ACTIVE': 'bg-blue-100 text-blue-800 border border-blue-200',
      'COMPLETED': 'bg-gray-100 text-gray-800 border border-gray-200',
      'REJECTED': 'bg-red-100 text-red-800 border border-red-200',
      'CANCELLED': 'bg-gray-100 text-gray-800 border border-gray-200'
    };
    
    return `${baseClasses} ${statusClasses[status] || statusClasses.PENDING}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const filteredOutpasses = getFilteredOutpasses();

  // Calculate summary statistics
  const summaryStats = {
    total: outpasses.length,
    pending: outpasses.filter(o => o.status === 'PENDING').length,
    approved: outpasses.filter(o => o.status === 'APPROVED').length,
    active: outpasses.filter(o => o.status === 'ACTIVE').length,
    completed: outpasses.filter(o => o.status === 'COMPLETED').length,
    rejected: outpasses.filter(o => o.status === 'REJECTED').length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 font-poppins">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600 text-lg">Loading your outpass history...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-poppins py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-left mb-8">
          <h1 className="text-2xl font-semibold text-gray-700 mb-2">View and manage all your outpass applications</h1>
          <p className="text-gray-600 text-lg"></p>
        </div>

        {/* Stats Overview */}
        

        {/* Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Filter by Status:
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="block w-full sm:w-48 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="ALL">All Outpasses</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="REJECTED">Rejected</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            
            <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
              Showing <span className="font-semibold text-gray-900">{filteredOutpasses.length}</span> of{' '}
              <span className="font-semibold text-gray-900">{outpasses.length}</span> outpasses
            </div>
          </div>
        </div>

        {/* Outpass Grid */}
        {filteredOutpasses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No outpasses found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {filter === 'ALL'
                ? "You haven't applied for any outpasses yet."
                : `No ${filter.toLowerCase()} outpasses found.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOutpasses.map(outpass => (
              <div key={outpass.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                {/* Card Header */}
                <div className="flex justify-between items-start p-6 pb-4 border-b border-gray-100">
                  <div className="text-sm font-semibold text-blue-600">Outpass #{outpass.id}</div>
                  <span className={getStatusBadgeClass(outpass.status)}>
                    {outpass.status}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Destination</div>
                      <div className="text-sm font-medium text-gray-900 truncate">{outpass.destination}</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Reason</div>
                      <div className="text-sm font-medium text-gray-900 truncate">{outpass.reason}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">From</div>
                      <div className="text-sm font-medium text-gray-900">{formatDate(outpass.leaveStartDate || outpass.fromDate)}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">To</div>
                      <div className="text-sm font-medium text-gray-900">{formatDate(outpass.expectedReturnDate || outpass.toDate)}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Roll No</div>
                      <div className="text-sm font-medium text-gray-900">{outpass.studentRollNumber || user?.rollNumber || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Hostel</div>
                      <div className="text-sm font-medium text-gray-900">{outpass.hostelName || user?.hostel || 'N/A'}</div>
                    </div>
                  </div>

                  {outpass.wardenComments && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="text-xs font-medium text-yellow-800 uppercase tracking-wide mb-1">Warden Comments</div>
                      <div className="text-sm text-yellow-700">{outpass.wardenComments}</div>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="px-6 pb-6 pt-4 border-t border-gray-100">
                  <div className="flex space-x-2">
                    {outpass.status === 'PENDING' && (
                      <>
                        <button
                          className="flex-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                          onClick={() => handleEdit(outpass)}
                        >
                          <span>✏️</span>
                          <span>Edit</span>
                        </button>
                        <button
                          className="flex-1 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                          onClick={() => handleCancelOutpass(outpass.id)}
                        >
                          <span>❌</span>
                          <span>Cancel</span>
                        </button>
                      </>
                    )}
                    {outpass.status === 'APPROVED' && (
                      <button className="flex-1 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1">
                        <span>📄</span>
                        <span>Download</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedOutpass && (
          <EditOutpassModal
            outpass={selectedOutpass}
            onSuccess={() => {
              setShowEditModal(false);
              loadOutpasses();
            }}
            onCancel={() => setShowEditModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default OutpassHistory;
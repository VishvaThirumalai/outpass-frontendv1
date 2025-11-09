// src/components/warden/ReviewOutpass.js - CLEAN SINGLE CARD DESIGN
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { wardenService } from '../../services/wardenService';
import { formatDate } from '../../utils/formatters';

const ReviewOutpass = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [outpass, setOutpass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);
  const [comments, setComments] = useState('');
  const [decision, setDecision] = useState('APPROVE');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOutpass();
  }, [id]);

  const fetchOutpass = async () => {
    try {
      setLoading(true);
      setError('');
      const outpassData = await wardenService.getOutpass(id);
      
      if (!outpassData || !outpassData.id) {
        throw new Error('Invalid outpass data received');
      }
      
      setOutpass(outpassData);
    } catch (error) {
      console.error('Error fetching outpass:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async () => {
    if (!window.confirm(`Are you sure you want to ${decision.toLowerCase()} this outpass?`)) {
      return;
    }

    try {
      setReviewing(true);
      await wardenService.reviewOutpass(id, decision, comments);
      alert(`Outpass ${decision.toLowerCase()}d successfully!`);
      navigate('/warden/outpasses');
    } catch (error) {
      console.error('Review error:', error);
      alert(`Failed to review outpass: ${error.message}`);
    } finally {
      setReviewing(false);
    }
  };

  // Calculate duration
  const calculateDuration = () => {
    if (!outpass?.leaveStartDate || !outpass?.expectedReturnDate) return '';
    try {
      const start = new Date(outpass.leaveStartDate);
      const end = new Date(outpass.expectedReturnDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    } catch (error) {
      return 'N/A';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-poppins flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading outpass details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 font-poppins flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-4xl mb-4">❌</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Outpass</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => navigate('/warden/outpasses')} 
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Back to List
            </button>
            <button 
              onClick={fetchOutpass} 
              className="px-6 py-2 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!outpass) {
    return (
      <div className="min-h-screen bg-gray-50 font-poppins flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-4xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Outpass Not Found</h3>
          <p className="text-gray-600 mb-6">The outpass you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/warden/outpasses')} 
            className="px-6 py-2 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Back to Outpasses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-poppins py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Single Unified Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-200 bg-gray-50 rounded-t-xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Review Outpass Application</h1>
                <p className="text-gray-600 mt-1">
                  Outpass #{outpass.id} • Applied on {formatDate(outpass.createdAt)}
                </p>
              </div>
              <button
                onClick={() => navigate('/warden/outpasses')}
                className="mt-4 lg:mt-0 px-4 py-2 text-gray-600 hover:text-gray-800 font-medium flex items-center transition-colors duration-200"
              >
                ← Back to List
              </button>
            </div>
          </div>

          {/* Main Content - All in one card */}
          <div className="p-8">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              
              {/* Left Column - Student & Application Information */}
              <div className="xl:col-span-2 space-y-6">
                
                {/* Student Information */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Student Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Full Name</span>
                      <p className="text-gray-900 font-semibold">{outpass.studentName}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Roll Number</span>
                      <p className="text-gray-900 font-semibold font-mono">{outpass.studentRollNumber}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Hostel</span>
                      <p className="text-gray-900 font-semibold">{outpass.hostelName}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Status</span>
                      <p className="text-gray-900 font-semibold">{outpass.status}</p>
                    </div>
                  </div>
                </div>

                {/* Trip Information */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Trip Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Destination</span>
                      <p className="text-gray-900 font-semibold">{outpass.destination}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Duration</span>
                      <p className="text-gray-900 font-semibold">{calculateDuration()}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">From Date</span>
                      <p className="text-gray-900 font-semibold">{formatDate(outpass.leaveStartDate)}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">To Date</span>
                      <p className="text-gray-900 font-semibold">{formatDate(outpass.expectedReturnDate)}</p>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                {outpass.emergencyContactName && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Emergency Contact
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Contact Person</span>
                        <p className="text-gray-900 font-semibold">{outpass.emergencyContactName}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Phone Number</span>
                        <p className="text-gray-900 font-semibold font-mono">{outpass.emergencyContactNumber}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Relationship</span>
                        <p className="text-gray-900 font-semibold">{outpass.emergencyContactRelation}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reason for Leave */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Reason for Leave
                  </h2>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-700 leading-relaxed">{outpass.reason}</p>
                  </div>
                </div>

              </div>

              {/* Right Column - Decision Panel */}
              <div className="xl:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                    Make Decision
                  </h2>
                  
                  {/* Decision Options */}
                  <div className="space-y-3 mb-6">
                    <label className="flex items-center p-3 border border-gray-300 rounded-lg bg-white cursor-pointer transition-colors duration-200 hover:border-gray-400">
                      <input
                        type="radio"
                        value="APPROVE"
                        checked={decision === 'APPROVE'}
                        onChange={(e) => setDecision(e.target.value)}
                        className="h-4 w-4 text-gray-600 focus:ring-gray-500"
                      />
                      <div className="ml-3 flex items-center space-x-2">
                        <span className="text-lg">✅</span>
                        <div>
                          <span className="font-semibold text-gray-800">Approve Outpass</span>
                          <p className="text-gray-600 text-sm">Grant permission</p>
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center p-3 border border-gray-300 rounded-lg bg-white cursor-pointer transition-colors duration-200 hover:border-gray-400">
                      <input
                        type="radio"
                        value="REJECT"
                        checked={decision === 'REJECT'}
                        onChange={(e) => setDecision(e.target.value)}
                        className="h-4 w-4 text-gray-600 focus:ring-gray-500"
                      />
                      <div className="ml-3 flex items-center space-x-2">
                        <span className="text-lg">❌</span>
                        <div>
                          <span className="font-semibold text-gray-800">Reject Outpass</span>
                          <p className="text-gray-600 text-sm">Deny permission</p>
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Comments */}
                  <div className="mb-6">
                    <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-2">
                      * Comments
                    </label>
                    <textarea
                      id="comments"
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Provide feedback or instructions for the student..."
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-colors duration-200 resize-none"
                    />
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={handleReview}
                    disabled={reviewing}
                    className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors duration-200 ${
                      decision === 'APPROVE' 
                        ? 'bg-gray-800 hover:bg-gray-900' 
                        : 'bg-gray-600 hover:bg-gray-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {reviewing ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      `${decision} Outpass`
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewOutpass;
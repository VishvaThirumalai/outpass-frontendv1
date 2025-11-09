// src/components/security/CheckInOut.js - FIXED VERSION
import React, { useState, useEffect } from 'react';
import { securityService } from '../../services/securityService';
import { formatDate } from '../../utils/formatters';
import { STATUS_COLORS } from '../../utils/constants';

const CheckInOut = ({ type, onSuccess }) => {
  const [outpasses, setOutpasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOutpass, setSelectedOutpass] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [comments, setComments] = useState('');
  const [lateReturnReason, setLateReturnReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadOutpasses();
  }, [type]);

  const loadOutpasses = async () => {
    try {
      setLoading(true);
      setMessage({ type: 'info', text: `Loading ${type === 'DEPARTURE' ? 'approved' : 'active'} outpasses...` });
      
      let response;
      if (type === 'DEPARTURE') {
        response = await securityService.getApprovedOutpasses();
      } else {
        response = await securityService.getActiveOutpasses();
      }
      
      console.log(`📋 ${type} outpasses service response:`, response);
      
      if (response.success) {
        // FOR DEPARTURE: Filter only outpasses within 24-hour window around departure
        // FOR RETURN: Show ALL active outpasses (no time restriction)
        const filteredData = type === 'DEPARTURE' 
          ? (response.data || []).filter(outpass => isWithinDepartureWindow(outpass.leaveStartDate))
          : (response.data || []);
        
        setOutpasses(filteredData);
        setMessage({ 
          type: 'success', 
          text: `Loaded ${filteredData.length} ${type === 'DEPARTURE' ? 'approved' : 'active'} outpasses` 
        });
      } else {
        setOutpasses([]);
        setMessage({ type: 'error', text: response.message || 'Failed to load outpasses' });
      }
    } catch (error) {
      console.error('Error loading outpasses:', error);
      setOutpasses([]);
      setMessage({ type: 'error', text: 'Network error loading outpasses' });
    } finally {
      setLoading(false);
    }
  };

  // Check if current time is within 24 hours BEFORE or AFTER departure date (FOR DEPARTURES ONLY)
  const isWithinDepartureWindow = (departureDate) => {
    const departureTime = new Date(departureDate);
    const currentTime = new Date();
    
    // 24 hours BEFORE departure
    const twentyFourHoursBefore = new Date(departureTime.getTime() - 24 * 60 * 60 * 1000);
    // 24 hours AFTER departure  
    const twentyFourHoursAfter = new Date(departureTime.getTime() + 24 * 60 * 60 * 1000);
    
    return currentTime >= twentyFourHoursBefore && currentTime <= twentyFourHoursAfter;
  };

  // Check if action window has expired (more than 24 hours after departure) - FOR DEPARTURES ONLY
  const isActionWindowExpired = (departureDate) => {
    const departureTime = new Date(departureDate);
    const currentTime = new Date();
    const twentyFourHoursAfter = new Date(departureTime.getTime() + 24 * 60 * 60 * 1000);
    
    return currentTime > twentyFourHoursAfter;
  };

  // Check if it's too early (more than 24 hours before departure) - FOR DEPARTURES ONLY
  const isTooEarlyForAction = (departureDate) => {
    const departureTime = new Date(departureDate);
    const currentTime = new Date();
    const twentyFourHoursBefore = new Date(departureTime.getTime() - 24 * 60 * 60 * 1000);
    
    return currentTime < twentyFourHoursBefore;
  };

  // Calculate time status relative to departure - FOR DEPARTURES ONLY
  const getTimeStatus = (departureDate) => {
    const departureTime = new Date(departureDate);
    const currentTime = new Date();
    
    const twentyFourHoursBefore = new Date(departureTime.getTime() - 24 * 60 * 60 * 1000);
    const twentyFourHoursAfter = new Date(departureTime.getTime() + 24 * 60 * 60 * 1000);
    
    if (currentTime < twentyFourHoursBefore) {
      const timeUntilWindow = twentyFourHoursBefore - currentTime;
      const hours = Math.floor(timeUntilWindow / (1000 * 60 * 60));
      const minutes = Math.floor((timeUntilWindow % (1000 * 60 * 60)) / (1000 * 60));
      return { status: 'TOO_EARLY', hours, minutes };
    } 
    else if (currentTime > twentyFourHoursAfter) {
      return { status: 'EXPIRED', hours: 0, minutes: 0 };
    }
    else if (currentTime < departureTime) {
      // Before departure - countdown to departure
      const timeUntilDeparture = departureTime - currentTime;
      const hours = Math.floor(timeUntilDeparture / (1000 * 60 * 60));
      const minutes = Math.floor((timeUntilDeparture % (1000 * 60 * 60)) / (1000 * 60));
      return { status: 'COUNTDOWN_TO_DEPARTURE', hours, minutes };
    }
    else {
      // After departure - time remaining to mark departure
      const timeRemaining = twentyFourHoursAfter - currentTime;
      const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      return { status: 'TIME_REMAINING', hours, minutes };
    }
  };

  const handleAction = (outpass) => {
    // FOR DEPARTURE: Check time window restrictions
    if (type === 'DEPARTURE') {
      const timeStatus = getTimeStatus(outpass.leaveStartDate);
      
      // Prevent action if too early or expired
      if (timeStatus.status === 'TOO_EARLY') {
        setMessage({ 
          type: 'error', 
          text: `Too early! Departure can be marked starting ${timeStatus.hours}h ${timeStatus.minutes}m from now.` 
        });
        return;
      }
      
      if (timeStatus.status === 'EXPIRED') {
        setMessage({ 
          type: 'error', 
          text: 'This outpass has expired. Departure window (24 hours after departure time) has passed.' 
        });
        return;
      }
    }
    
    // FOR RETURN: No time restrictions - always allow
    setSelectedOutpass(outpass);
    setShowModal(true);
    setComments('');
    setLateReturnReason('');
    setMessage({ type: '', text: '' });
  };

  const isLateReturn = (expectedReturnDate) => {
    return new Date() > new Date(expectedReturnDate);
  };

  const submitAction = async () => {
    if (!selectedOutpass) return;
    
    setProcessing(true);
    setMessage({ type: '', text: '' });
    
    try {
      let response;
      if (type === 'DEPARTURE') {
        response = await securityService.markDeparture(selectedOutpass.id, comments);
      } else {
        const isLate = isLateReturn(selectedOutpass.expectedReturnDate);
        response = await securityService.markReturn(
          selectedOutpass.id, 
          comments,
          isLate ? lateReturnReason : null
        );
      }

      if (response.success) {
        setMessage({ 
          type: 'success', 
          text: `Successfully marked ${type === 'DEPARTURE' ? 'departure' : 'return'}` 
        });
        setShowModal(false);
        setSelectedOutpass(null);
        loadOutpasses();
        if (onSuccess) onSuccess();
        
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 3000);
      } else {
        setMessage({ type: 'error', text: response.message || 'Operation failed' });
      }
    } catch (error) {
      console.error('Error in submitAction:', error);
      setMessage({ type: 'error', text: error.message || 'Operation failed' });
    } finally {
      setProcessing(false);
    }
  };

  const filteredOutpasses = outpasses.filter(outpass => 
    outpass.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    outpass.studentRollNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Count statistics for informational purposes - FOR DEPARTURES ONLY
  const getOutpassStats = () => {
    if (type !== 'DEPARTURE') return { expired: 0, tooEarly: 0, valid: filteredOutpasses.length };
    
    let expired = 0;
    let tooEarly = 0;
    let valid = 0;
    
    filteredOutpasses.forEach(outpass => {
      const timeStatus = getTimeStatus(outpass.leaveStartDate);
      if (timeStatus.status === 'EXPIRED') expired++;
      else if (timeStatus.status === 'TOO_EARLY') tooEarly++;
      else valid++;
    });
    
    return { expired, tooEarly, valid };
  };

  const stats = getOutpassStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-poppins flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading {type === 'DEPARTURE' ? 'approved' : 'active'} outpasses...</p>
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
                {type === 'DEPARTURE' ? '🚪 Mark Departure' : '🏠 Mark Return'}
              </h1>
              <p className="text-gray-600 text-lg">
                {type === 'DEPARTURE' 
                  ? 'Mark student departures (24 hours before/after departure time)' 
                  : 'Mark student returns - all active outpasses shown'
                }
              </p>
              {type === 'DEPARTURE' && (
                <p className="text-sm text-orange-600 mt-1">
                  ⏰ Departures can be marked 24 hours before until 24 hours after departure time
                </p>
              )}
              {type === 'RETURN' && (
                <p className="text-sm text-green-600 mt-1">
                  ✅ All active outpasses shown - mark returns anytime, even if late
                </p>
              )}
            </div>
            
            {/* Search and Refresh */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 min-w-[300px]">
                <input
                  type="text"
                  placeholder="Search by student name or roll number..."
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
              <button 
                onClick={loadOutpasses}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {type === 'DEPARTURE' ? stats.valid : filteredOutpasses.length}
                </div>
                <div className="text-sm text-gray-600">
                  {type === 'DEPARTURE' ? 'Valid for Action' : 'Active Outpasses'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{filteredOutpasses.length}</div>
                <div className="text-sm text-gray-600">Total Displayed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {type === 'RETURN' 
                    ? filteredOutpasses.filter(op => isLateReturn(op.expectedReturnDate)).length 
                    : stats.expired + stats.tooEarly
                  }
                </div>
                <div className="text-sm text-gray-600">
                  {type === 'RETURN' ? 'Late Returns' : 'Not Available'}
                </div>
              </div>
            </div>
            {type === 'DEPARTURE' && (stats.expired > 0 || stats.tooEarly > 0) && (
              <div className="mt-4 text-center text-sm text-gray-500">
                {stats.tooEarly > 0 && <span>{stats.tooEarly} too early • </span>}
                {stats.expired > 0 && <span>{stats.expired} expired</span>}
              </div>
            )}
          </div>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl border ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : message.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <div className="flex items-center">
              {message.type === 'success' && (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {message.type === 'error' && (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              {message.type === 'info' && (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              )}
              {message.text}
            </div>
          </div>
        )}

        {/* Outpasses Grid */}
        {filteredOutpasses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">
              {type === 'DEPARTURE' ? '🚶‍♂️' : '🏠'}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No {type === 'DEPARTURE' ? 'approved' : 'active'} outpasses found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {searchTerm 
                ? `No outpasses found matching "${searchTerm}". Try adjusting your search terms.`
                : type === 'DEPARTURE'
                ? 'There are no valid outpasses available within the 24-hour window around departure time.'
                : 'There are no active outpasses available at the moment.'
              }
            </p>
            <button 
              onClick={loadOutpasses}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              Refresh List
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOutpasses.map(outpass => {
              const isLate = type === 'RETURN' && isLateReturn(outpass.expectedReturnDate);
              const timeStatus = type === 'DEPARTURE' ? getTimeStatus(outpass.leaveStartDate) : null;
              
              return (
                <div 
                  key={outpass.id} 
                  className={`bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border overflow-hidden ${
                    isLate ? 'border-red-200' : 'border-gray-200'
                  } ${
                    timeStatus && (timeStatus.status === 'EXPIRED' || timeStatus.status === 'TOO_EARLY') 
                      ? 'opacity-60' 
                      : ''
                  }`}
                >
                  {isLate && (
                    <div className="bg-red-500 text-white px-4 py-2 text-sm font-medium text-center">
                      ⚠️ LATE RETURN
                    </div>
                  )}
                  
                  {/* Time Status Indicator for DEPARTURES ONLY */}
                  {type === 'DEPARTURE' && timeStatus && (
                    <div className={`px-4 py-2 text-sm font-medium text-center ${
                      timeStatus.status === 'COUNTDOWN_TO_DEPARTURE' 
                        ? 'bg-blue-50 border-b border-blue-200 text-blue-800'
                        : timeStatus.status === 'TIME_REMAINING'
                        ? 'bg-orange-50 border-b border-orange-200 text-orange-800'
                        : timeStatus.status === 'TOO_EARLY'
                        ? 'bg-gray-100 border-b border-gray-300 text-gray-600'
                        : 'bg-red-50 border-b border-red-200 text-red-700'
                    }`}>
                      {timeStatus.status === 'COUNTDOWN_TO_DEPARTURE' && (
                        <span>⏳ Departure in: {timeStatus.hours}h {timeStatus.minutes}m</span>
                      )}
                      {timeStatus.status === 'TIME_REMAINING' && (
                        <span>⏰ Mark departure within: {timeStatus.hours}h {timeStatus.minutes}m</span>
                      )}
                      {timeStatus.status === 'TOO_EARLY' && (
                        <span>🕒 Available in: {timeStatus.hours}h {timeStatus.minutes}m</span>
                      )}
                      {timeStatus.status === 'EXPIRED' && (
                        <span>❌ Departure window expired</span>
                      )}
                    </div>
                  )}
                  
                  {/* Card Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {outpass.studentName}
                        </h3>
                        <p className="text-sm text-gray-500 font-mono">
                          {outpass.studentRollNumber}
                        </p>
                      </div>
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-medium border"
                        style={{ 
                          backgroundColor: `${STATUS_COLORS[outpass.status]}20` || '#f3f4f6',
                          color: STATUS_COLORS[outpass.status] || '#6b7280',
                          borderColor: `${STATUS_COLORS[outpass.status]}40` || '#e5e7eb'
                        }}
                      >
                        {outpass.status}
                      </span>
                    </div>
                  </div>
                  
                  {/* Card Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                        Reason
                      </span>
                      <p className="text-gray-900">{outpass.reason}</p>
                    </div>
                    
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                        Destination
                      </span>
                      <p className="text-gray-900 font-medium">{outpass.destination || 'Not specified'}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                          Departure
                        </span>
                        <p className="text-gray-900 font-medium">{formatDate(outpass.leaveStartDate)}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                          Expected Return
                        </span>
                        <p className={`font-medium ${isLate ? 'text-red-600' : 'text-gray-900'}`}>
                          {formatDate(outpass.expectedReturnDate)}
                        </p>
                      </div>
                    </div>
                    
                    {type === 'RETURN' && outpass.actualDepartureTime && (
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                          Departed At
                        </span>
                        <p className="text-gray-900">{formatDate(outpass.actualDepartureTime)}</p>
                      </div>
                    )}
                    
                    {outpass.emergencyContactName && (
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <span className="text-xs font-medium text-blue-700 uppercase tracking-wide block mb-1">
                          Emergency Contact
                        </span>
                        <p className="text-blue-900 font-medium">{outpass.emergencyContactName}</p>
                        <p className="text-blue-800 text-sm">{outpass.emergencyContactNumber}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Card Actions */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <button
                      className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                        // FOR DEPARTURE: Disable if expired or too early
                        type === 'DEPARTURE' && timeStatus && (timeStatus.status === 'EXPIRED' || timeStatus.status === 'TOO_EARLY')
                          ? 'bg-gray-400 cursor-not-allowed text-white'
                          : // FOR RETURN: Always enabled, different colors for late returns
                          isLate
                          ? 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md'
                          : type === 'DEPARTURE' && timeStatus && timeStatus.status === 'TIME_REMAINING' && timeStatus.hours < 2
                          ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-sm hover:shadow-md'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
                      }`}
                      onClick={() => handleAction(outpass)}
                      disabled={processing || (type === 'DEPARTURE' && timeStatus && (timeStatus.status === 'EXPIRED' || timeStatus.status === 'TOO_EARLY'))}
                    >
                      {type === 'DEPARTURE' && timeStatus && timeStatus.status === 'TOO_EARLY' && 'Too Early'}
                      {type === 'DEPARTURE' && timeStatus && timeStatus.status === 'EXPIRED' && 'Expired'}
                      {type === 'DEPARTURE' && (!timeStatus || (timeStatus.status !== 'TOO_EARLY' && timeStatus.status !== 'EXPIRED')) && '🚪 Mark Departure'}
                      {type === 'RETURN' && '🏠 Mark Return'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Action Modal */}
        {showModal && selectedOutpass && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div 
              className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                  {type === 'DEPARTURE' ? '🚪 Confirm Departure' : '🏠 Confirm Return'}
                </h3>
                <button 
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => !processing && setShowModal(false)}
                  disabled={processing}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Time Status for DEPARTURES ONLY */}
                {type === 'DEPARTURE' && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-blue-800 font-medium">
                        {(() => {
                          const timeStatus = getTimeStatus(selectedOutpass.leaveStartDate);
                          if (timeStatus.status === 'COUNTDOWN_TO_DEPARTURE') {
                            return `Departure in: ${timeStatus.hours}h ${timeStatus.minutes}m`;
                          } else if (timeStatus.status === 'TIME_REMAINING') {
                            return `Mark within: ${timeStatus.hours}h ${timeStatus.minutes}m`;
                          }
                          return 'Valid for departure';
                        })()}
                      </span>
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Student Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedOutpass.studentName}</p>
                    <p><span className="font-medium">Roll Number:</span> {selectedOutpass.studentRollNumber}</p>
                    <p><span className="font-medium">Destination:</span> {selectedOutpass.destination || 'Not specified'}</p>
                    {type === 'RETURN' && isLateReturn(selectedOutpass.expectedReturnDate) && (
                      <p className="text-red-600 font-medium">⚠️ This is a late return!</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comments (Optional)
                  </label>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Enter any observations or comments..."
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  />
                </div>

                {/* Late Return Reason - FOR RETURNS ONLY */}
                {type === 'RETURN' && isLateReturn(selectedOutpass.expectedReturnDate) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Late Return <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={lateReturnReason}
                      onChange={(e) => setLateReturnReason(e.target.value)}
                      placeholder="Please provide reason for late return..."
                      rows="3"
                      required
                      className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 resize-none"
                    />
                  </div>
                )}

                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Current Time:</span> {new Date().toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex space-x-3 p-6 border-t border-gray-200">
                <button 
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                  onClick={() => setShowModal(false)}
                  disabled={processing}
                >
                  Cancel
                </button>
                <button 
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                    type === 'RETURN' && isLateReturn(selectedOutpass.expectedReturnDate) && !lateReturnReason
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
                  }`}
                  onClick={submitAction}
                  disabled={processing || (type === 'RETURN' && isLateReturn(selectedOutpass.expectedReturnDate) && !lateReturnReason)}
                >
                  {processing ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Confirm'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckInOut;
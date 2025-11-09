// src/components/security/TodayActivity.js
import React, { useState, useEffect } from 'react';
import { securityService } from '../../services/securityService';
import { formatDate } from '../../utils/formatters';

const TodayActivity = () => {
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTodayActivity();
    
    // Refresh every minute
    const interval = setInterval(loadTodayActivity, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadTodayActivity = async () => {
    try {
      const response = await securityService.getTodayActivity();
      if (response.success) {
        setActivity(response.data);
      }
    } catch (error) {
      console.error('Failed to load today activity:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-poppins flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading today's activity...</p>
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen bg-gray-50 font-poppins flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No activity data available</h3>
          <p className="text-gray-600">Unable to load today's activity information.</p>
          <button
            onClick={loadTodayActivity}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
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
                📊 Today's Activity
              </h1>
              <p className="text-xl text-gray-600">
                {new Date().toLocaleDateString('en-IN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            {/* Auto-refresh Indicator */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-500 bg-white rounded-full px-4 py-2 border border-gray-200">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Auto-refreshing every minute
              </div>
              <button
                onClick={loadTodayActivity}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Departures Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 text-xl mr-4">
                  🚶‍♂️
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Departures Today</h3>
                  <div className="text-3xl font-bold text-blue-600">
                    {activity.departuresToday?.length || 0}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Students who left the hostel today
              </p>
            </div>

            {/* Returns Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 text-xl mr-4">
                  🏠
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Returns Today</h3>
                  <div className="text-3xl font-bold text-green-600">
                    {activity.returnsToday?.length || 0}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Students who returned to hostel today
              </p>
            </div>

            {/* Expected Returns Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 text-xl mr-4">
                  ⏰
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Expected Returns</h3>
                  <div className="text-3xl font-bold text-orange-600">
                    {activity.expectedReturns?.length || 0}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Students expected to return today
              </p>
            </div>
          </div>
        </div>

        {/* Activity Sections */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Departures Today Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
              <h3 className="text-lg font-semibold text-blue-900 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Departures Today ({activity.departuresToday?.length || 0})
              </h3>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto">
              {activity.departuresToday?.length > 0 ? (
                <div className="space-y-4">
                  {activity.departuresToday.map(outpass => (
                    <div key={outpass.id} className="flex items-start space-x-4 p-4 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                        {outpass.studentName?.charAt(0) || 'S'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <p className="font-medium text-gray-900 truncate">
                            {outpass.studentName}
                          </p>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full ml-2">
                            {formatDate(outpass.actualDepartureTime)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 font-mono mb-1">
                          {outpass.studentRollNumber}
                        </p>
                        <p className="text-sm text-blue-600 font-medium flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {outpass.destination}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🚶‍♂️</div>
                  <p className="text-gray-500 font-medium">No departures today</p>
                  <p className="text-sm text-gray-400 mt-1">No students have left the hostel today</p>
                </div>
              )}
            </div>
          </div>

          {/* Returns Today Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-green-50 px-6 py-4 border-b border-green-100">
              <h3 className="text-lg font-semibold text-green-900 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Returns Today ({activity.returnsToday?.length || 0})
              </h3>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto">
              {activity.returnsToday?.length > 0 ? (
                <div className="space-y-4">
                  {activity.returnsToday.map(outpass => (
                    <div key={outpass.id} className={`flex items-start space-x-4 p-4 rounded-lg border transition-all duration-200 ${
                      outpass.isLateReturn 
                        ? 'border-red-200 hover:border-red-300 hover:bg-red-50' 
                        : 'border-gray-100 hover:border-green-200 hover:bg-green-50'
                    }`}>
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                        outpass.isLateReturn ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                      }`}>
                        {outpass.studentName?.charAt(0) || 'S'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <p className="font-medium text-gray-900 truncate">
                            {outpass.studentName}
                          </p>
                          <div className="flex items-center gap-2">
                            {outpass.isLateReturn && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                                LATE
                              </span>
                            )}
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              {formatDate(outpass.actualReturnTime)}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 font-mono">
                          {outpass.studentRollNumber}
                        </p>
                        {outpass.isLateReturn && (
                          <p className="text-xs text-red-600 mt-1 font-medium">
                            Returned after expected time
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🏠</div>
                  <p className="text-gray-500 font-medium">No returns today</p>
                  <p className="text-sm text-gray-400 mt-1">No students have returned to hostel today</p>
                </div>
              )}
            </div>
          </div>

          {/* Expected Returns Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-orange-50 px-6 py-4 border-b border-orange-100">
              <h3 className="text-lg font-semibold text-orange-900 flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                Expected Returns ({activity.expectedReturns?.length || 0})
              </h3>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto">
              {activity.expectedReturns?.length > 0 ? (
                <div className="space-y-4">
                  {activity.expectedReturns.map(outpass => (
                    <div key={outpass.id} className="flex items-start space-x-4 p-4 rounded-lg border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all duration-200">
                      <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-semibold text-sm">
                        {outpass.studentName?.charAt(0) || 'S'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <p className="font-medium text-gray-900 truncate">
                            {outpass.studentName}
                          </p>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full ml-2">
                            {formatDate(outpass.expectedReturnDate)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 font-mono mb-1">
                          {outpass.studentRollNumber}
                        </p>
                        <p className="text-sm text-orange-600 font-medium flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          Coming from: {outpass.destination}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">⏰</div>
                  <p className="text-gray-500 font-medium">No expected returns</p>
                  <p className="text-sm text-gray-400 mt-1">No students are expected to return today</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Summary Footer */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{activity.departuresToday?.length || 0}</div>
              <div className="text-sm text-gray-600">Total Departures</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{activity.returnsToday?.length || 0}</div>
              <div className="text-sm text-gray-600">Total Returns</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{activity.expectedReturns?.length || 0}</div>
              <div className="text-sm text-gray-600">Expected Returns</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {activity.returnsToday?.filter(r => r.isLateReturn).length || 0}
              </div>
              <div className="text-sm text-gray-600">Late Returns</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodayActivity;
import React from 'react';

const SecurityHelp = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/30 font-poppins">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Security Help Center</h1>
          <p className="text-xl text-gray-600">Procedures and guidelines for managing student movements</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Check-in/Check-out Process */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🚶 Student Movement Process</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 text-sm font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Verify Outpass</h3>
                  <p className="text-gray-600 text-sm">Check approved outpass details including dates, times, and student ID</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 text-sm font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Mark Departure</h3>
                  <p className="text-gray-600 text-sm">Record exact departure time when student leaves campus</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 text-sm font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Mark Return</h3>
                  <p className="text-gray-600 text-sm">Record return time and verify student identity upon arrival</p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Protocols */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🛡️ Security Protocols</h2>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-orange-600 text-xs">!</span>
                </div>
                <p className="text-gray-700">Always verify student ID card along with outpass</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-orange-600 text-xs">!</span>
                </div>
                <p className="text-gray-700">Check for valid dates and warden approval stamp</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-orange-600 text-xs">!</span>
                </div>
                <p className="text-gray-700">Report expired or suspicious outpasses immediately</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-orange-600 text-xs">!</span>
                </div>
                <p className="text-gray-700">Maintain accurate timestamps for all movements</p>
              </div>
            </div>
          </div>

          {/* Emergency Procedures */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🚨 Emergency Procedures</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                  <h3 className="font-semibold text-red-800">Late Returns</h3>
                  <p className="text-red-700 text-sm mt-1">If student exceeds return time by 2+ hours, contact warden immediately and attempt to reach emergency contact.</p>
                </div>
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                  <h3 className="font-semibold text-yellow-800">No Outpass</h3>
                  <p className="text-yellow-700 text-sm mt-1">Students without valid outpass must obtain warden approval before leaving campus.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <h3 className="font-semibold text-blue-800">System Issues</h3>
                  <p className="text-blue-700 text-sm mt-1">If system is down, maintain manual log and update digital records once system is restored.</p>
                </div>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                  <h3 className="font-semibold text-green-800">Medical Emergency</h3>
                  <p className="text-green-700 text-sm mt-1">For medical emergencies, allow immediate exit and notify warden/administration simultaneously.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shift Handover */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🔄 Shift Handover</h2>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Active Outpasses</h3>
                  <p className="text-gray-600 text-sm">Review all students currently outside campus</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Pending Returns</h3>
                  <p className="text-gray-600 text-sm">Note students expected to return during next shift</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Special Instructions</h3>
                  <p className="text-gray-600 text-sm">Communicate any special cases or warnings</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📞 Emergency Contacts</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-semibold text-gray-700">Warden Office</span>
                <span className="text-blue-600 font-medium">+91 9876543210</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-semibold text-gray-700">Control Room</span>
                <span className="text-blue-600 font-medium">+91 9876543211</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-semibold text-gray-700">Medical Emergency</span>
                <span className="text-red-600 font-medium">+91 9876543212</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-semibold text-gray-700">IT Support</span>
                <span className="text-green-600 font-medium">+91 9876543213</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityHelp;
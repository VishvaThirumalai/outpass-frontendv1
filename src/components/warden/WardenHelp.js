import React from 'react';

const WardenHelp = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30 font-poppins">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Warden Help Center</h1>
          <p className="text-xl text-gray-600">Guidelines and support for managing outpass applications</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Approval Process */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 Outpass Approval Process</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 text-sm font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Review Pending Applications</h3>
                  <p className="text-gray-600 text-sm">Check the "Pending Requests" section for new outpass applications requiring your approval</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 text-sm font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Verify Details</h3>
                  <p className="text-gray-600 text-sm">Check student information, destination, reason, and emergency contact details</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 text-sm font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Approve or Reject</h3>
                  <p className="text-gray-600 text-sm">Approve legitimate requests or reject with appropriate reasons</p>
                </div>
              </div>
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">⚡ Quick Guidelines</h2>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 text-xs">✓</span>
                </div>
                <p className="text-gray-700">Process applications within 24 hours of submission</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 text-xs">✓</span>
                </div>
                <p className="text-gray-700">Verify emergency contact numbers before approval</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 text-xs">✓</span>
                </div>
                <p className="text-gray-700">Monitor active outpasses for timely returns</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 text-xs">✓</span>
                </div>
                <p className="text-gray-700">Document reasons for rejected applications</p>
              </div>
            </div>
          </div>

          {/* Common Scenarios */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🎯 Handling Common Scenarios</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                  <h3 className="font-semibold text-yellow-800">Emergency Leave</h3>
                  <p className="text-yellow-700 text-sm mt-1">Prioritize medical and family emergency requests. Verify supporting documents if available.</p>
                </div>
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                  <h3 className="font-semibold text-red-800">Late Returns</h3>
                  <p className="text-red-700 text-sm mt-1">Track students who exceed their return time. Follow up with security and document incidents.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <h3 className="font-semibold text-blue-800">Multiple Requests</h3>
                  <p className="text-blue-700 text-sm mt-1">Review frequent applications carefully. Ensure legitimate reasons and proper intervals between leaves.</p>
                </div>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                  <h3 className="font-semibold text-green-800">Hostel Transfers</h3>
                  <p className="text-green-700 text-sm mt-1">Update student hostel information promptly to maintain accurate outpass records.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📞 Support Contacts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 text-xl">👨‍💼</span>
                </div>
                <h3 className="font-semibold text-gray-900">IT Support</h3>
                <p className="text-gray-600 text-sm mt-1">+91 9876543210</p>
                <p className="text-gray-500 text-xs">System technical issues</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 text-xl">🏢</span>
                </div>
                <h3 className="font-semibold text-gray-900">Administration</h3>
                <p className="text-gray-600 text-sm mt-1">+91 9876543211</p>
                <p className="text-gray-500 text-xs">Policy and guidelines</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-red-600 text-xl">🆘</span>
                </div>
                <h3 className="font-semibold text-gray-900">Emergency</h3>
                <p className="text-gray-600 text-sm mt-1">+91 9876543212</p>
                <p className="text-gray-500 text-xs">24/7 emergency support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WardenHelp;
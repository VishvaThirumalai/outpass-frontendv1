import React from 'react';
import { 
  HelpCircle, 
  FileText, 
  Clock, 
  AlertTriangle, 
  Phone, 
  Mail, 
  CheckCircle, 
  XCircle, 
  PlayCircle,
  Calendar,
  UserCheck,
  Shield
} from 'lucide-react';

const HelpSection = () => {
  const guidelines = [
    {
      icon: Clock,
      title: "Application Timing",
      description: "Apply at least 24 hours in advance when possible"
    },
    {
      icon: UserCheck,
      title: "Accurate Information",
      description: "Provide accurate emergency contact details"
    },
    {
      icon: Calendar,
      title: "Return on Time",
      description: "Return before the expected return time"
    },
    {
      icon: Shield,
      title: "Security Protocol",
      description: "Inform security when leaving and returning"
    },
    {
      icon: AlertTriangle,
      title: "Late Returns",
      description: "Late returns may affect future applications"
    }
  ];

  const statuses = [
    { status: "Pending", color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
    { status: "Approved", color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
    { status: "Active", color: "bg-blue-100 text-blue-800 border-blue-200", icon: PlayCircle },
    { status: "Completed", color: "bg-gray-100 text-gray-800 border-gray-200", icon: CheckCircle },
    { status: "Rejected", color: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
    { status: "Cancelled", color: "bg-orange-100 text-orange-800 border-orange-200", icon: XCircle }
  ];

  const contacts = [
    { icon: Phone, title: "Warden Office", number: "+91 9876543210", description: "For outpass approvals and queries" },
    { icon: Phone, title: "Security Office", number: "+91 9876543211", description: "For entry/exit related issues" },
    { icon: AlertTriangle, title: "Emergency", number: "+91 9876543212", description: "24/7 emergency support" },
    { icon: Mail, title: "Email Support", number: "outpass@mit.edu", description: "General queries and support" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8 font-poppins">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Help & Support</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about the outpass system and get the support you need
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* How to Apply Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-blue-100 rounded-xl mr-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">How to Apply for Outpass</h2>
            </div>
            
            <div className="space-y-4">
              {[
                "Click on 'Apply Outpass' in the sidebar",
                "Fill in all required details including destination, dates, and reason",
                "Ensure your emergency contact information is correct",
                "Submit the application",
                "Wait for warden approval"
              ].map((step, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors duration-200">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 font-medium pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Status Meanings Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-green-100 rounded-xl mr-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Outpass Status Meanings</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {statuses.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={index} className={`flex items-center space-x-3 p-4 rounded-xl border-2 ${item.color} transition-transform duration-200 hover:scale-105`}>
                    <IconComponent className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">{item.status}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Important Guidelines Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-orange-100 rounded-xl mr-4">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Important Guidelines</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {guidelines.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={index} className="text-center p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-blue-200">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-blue-100 rounded-2xl">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 text-sm">{item.title}</h3>
                    <p className="text-gray-600 text-xs">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-purple-100 rounded-xl mr-4">
                <Phone className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contacts.map((contact, index) => {
                const IconComponent = contact.icon;
                return (
                  <div key={index} className="flex items-start space-x-4 p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 hover:shadow-md transition-all duration-300">
                    <div className="flex-shrink-0 p-3 bg-purple-100 rounded-xl">
                      <IconComponent className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{contact.title}</h3>
                      <p className="text-gray-800 font-semibold text-xl mb-2">{contact.number}</p>
                      <p className="text-gray-600 text-sm">{contact.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Emergency Notice */}
            <div className="mt-8 p-6 bg-red-50 border-l-4 border-red-500 rounded-xl">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-red-800 text-lg mb-2">Emergency Notice</h4>
                  <p className="text-red-700">
                    In case of emergencies while outside campus, immediately contact the emergency number provided above. 
                    Always carry your outpass and ID card when leaving the campus premises.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSection;
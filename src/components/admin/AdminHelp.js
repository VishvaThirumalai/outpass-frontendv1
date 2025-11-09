// src/components/admin/AdminHelp.js
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminHelp = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('registration');
  const [searchTerm, setSearchTerm] = useState('');

  const helpSections = [
    {
      id: 'registration',
      title: 'User Registration',
      icon: '👤',
      color: 'from-blue-500 to-blue-600',
      steps: [
        {
          step: 1,
          title: 'Access Registration',
          description: 'Login to admin dashboard and navigate to "Register User" section'
        },
        {
          step: 2,
          title: 'Select User Role',
          description: 'Choose between Student, Warden, or Security personnel'
        },
        {
          step: 3,
          title: 'Basic Information',
          description: 'Fill in name, username, email, and mobile number'
        },
        {
          step: 4,
          title: 'Default Password',
          description: 'System sets "Default123!" - users change on first login'
        },
        {
          step: 5,
          title: 'Role-Specific Details',
          description: 'Fill additional fields based on selected role'
        },
        {
          step: 6,
          title: 'Complete Registration',
          description: 'Click "Register User" to create the account'
        }
      ],
      notes: [
        'Ensure all required fields are filled correctly',
        'Verify email format and mobile number validity',
        'Double-check role-specific information'
      ]
    },
    {
      id: 'management',
      title: 'User Management',
      icon: '📊',
      color: 'from-green-500 to-green-600',
      steps: [
        {
          step: 1,
          title: 'Access Management',
          description: 'Go to "User Management" section in dashboard'
        },
        {
          step: 2,
          title: 'View Users',
          description: 'Switch between Students, Wardens, Security tabs'
        },
        {
          step: 3,
          title: 'Monitor Status',
          description: 'Check user Active/Inactive status and details'
        },
        {
          step: 4,
          title: 'Search & Filter',
          description: 'Use search and filter options to find specific users'
        },
        {
          step: 5,
          title: 'Export Data',
          description: 'Export user lists for reports and analysis'
        },
        {
          step: 6,
          title: 'Coordinate Updates',
          description: 'Work with departments for user information updates'
        }
      ],
      notes: [
        'Regularly review user activity',
        'Update user roles as needed',
        'Maintain accurate department information'
      ]
    },
    {
      id: 'password',
      title: 'Password Reset',
      icon: '🔑',
      color: 'from-orange-500 to-orange-600',
      steps: [
        {
          step: 1,
          title: 'Access Reset Section',
          description: 'Navigate to "Password Management" section'
        },
        {
          step: 2,
          title: 'Enter Username',
          description: 'Input the username of the user needing reset'
        },
        {
          step: 3,
          title: 'Security Verification',
          description: 'Verify mobile number for security purposes'
        },
        {
          step: 4,
          title: 'Set New Password',
          description: 'Create new password (minimum 6 characters)'
        },
        {
          step: 5,
          title: 'Confirm Password',
          description: 'Re-enter new password for confirmation'
        },
        {
          step: 6,
          title: 'Complete Reset',
          description: 'Click "Reset Password" to apply changes'
        }
      ],
      notes: [
        'Inform user immediately after reset',
        'Ensure password meets security requirements',
        'User can login immediately with new password'
      ]
    },
    {
      id: 'monitoring',
      title: 'System Monitoring',
      icon: '📈',
      color: 'from-purple-500 to-purple-600',
      steps: [
        {
          step: 1,
          title: 'Dashboard Overview',
          description: 'Monitor total users by role on main dashboard'
        },
        {
          step: 2,
          title: 'Performance Tracking',
          description: 'Check system usage and performance metrics'
        },
        {
          step: 3,
          title: 'Error Reports',
          description: 'Regularly review system error reports'
        },
        {
          step: 4,
          title: 'User Feedback',
          description: 'Monitor and address user feedback regularly'
        },
        {
          step: 5,
          title: 'Backup Maintenance',
          description: 'Ensure regular system backups are performed'
        },
        {
          step: 6,
          title: 'System Announcements',
          description: 'Update announcements in system marquee'
        }
      ],
      notes: [
        'Coordinate with technical team for issues',
        'Maintain system performance logs',
        'Regularly update monitoring protocols'
      ]
    },
    {
      id: 'security',
      title: 'Security & Maintenance',
      icon: '🛡️',
      color: 'from-red-500 to-red-600',
      steps: [
        {
          step: 1,
          title: 'Account Audits',
          description: 'Regularly audit all user accounts'
        },
        {
          step: 2,
          title: 'Inactive Users',
          description: 'Remove inactive users after semester completion'
        },
        {
          step: 3,
          title: 'Policy Updates',
          description: 'Update system policies as needed'
        },
        {
          step: 4,
          title: 'Data Compliance',
          description: 'Ensure data privacy compliance standards'
        },
        {
          step: 5,
          title: 'Audit Logs',
          description: 'Maintain comprehensive audit logs'
        },
        {
          step: 6,
          title: 'System Maintenance',
          description: 'Schedule and perform regular maintenance'
        }
      ],
      notes: [
        'Keep emergency contacts updated',
        'Follow security protocols strictly',
        'Document all maintenance activities'
      ]
    }
  ];

  const filteredSections = useMemo(() => 
    helpSections.filter(section =>
      section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.steps.some(step => 
        step.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        step.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ),
    [searchTerm]
  );

  const activeSectionData = useMemo(() => 
    helpSections.find(section => section.id === activeSection),
    [activeSection]
  );

  const QuickActionCard = ({ icon, title, description, onClick, color = 'from-blue-500 to-blue-600' }) => (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/60 hover:shadow-xl transition-all duration-300 hover:scale-105 text-left group w-full"
    >
      <div className={`w-14 h-14 bg-gradient-to-r ${color} rounded-2xl flex items-center justify-center text-white text-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 font-poppins mb-2">{title}</h3>
      <p className="text-gray-600 font-outfit text-sm leading-relaxed">{description}</p>
    </button>
  );

  const StepCard = ({ step, title, description, isLast }) => (
    <div className="flex group">
      <div className="flex flex-col items-center mr-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
          {step}
        </div>
        {!isLast && (
          <div className="flex-1 w-1 bg-gradient-to-b from-blue-200 to-blue-300 my-2 rounded-full group-hover:from-blue-300 group-hover:to-blue-400 transition-colors duration-300"></div>
        )}
      </div>
      <div className="flex-1 pb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/60 hover:shadow-xl transition-all duration-300 group-hover:border-blue-200">
          <h4 className="text-lg font-bold text-gray-900 font-poppins mb-2">{title}</h4>
          <p className="text-gray-600 font-outfit leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );

  const SidebarNavigation = () => (
    <div className="lg:col-span-1 space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200/60">
        <div className="p-6 border-b border-gray-200/60">
          <h3 className="text-lg font-bold text-gray-900 font-poppins">Help Topics</h3>
          <p className="text-sm text-gray-600 font-outfit mt-1">Select a category</p>
        </div>
        <nav className="p-4 space-y-2">
          {helpSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                activeSection === section.id
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-md'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                activeSection === section.id
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
              } transition-all duration-200`}>
                {section.icon}
              </div>
              <span className="font-medium font-poppins flex-1">{section.title}</span>
              {activeSection === section.id && (
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Support Card */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl mb-4 mx-auto backdrop-blur-sm">
            💬
          </div>
          <h3 className="text-lg font-bold font-poppins mb-2">Need More Help?</h3>
          <p className="text-purple-100 font-outfit text-sm mb-4">
            Contact our support team for immediate assistance
          </p>
          <button className="w-full bg-white text-purple-600 py-3 px-4 rounded-xl font-semibold font-poppins hover:bg-gray-100 transition-colors duration-200 shadow-lg">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );

  const MainContent = () => (
    <div className="lg:col-span-3">
      {activeSectionData && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200/60 overflow-hidden">
          {/* Section Header */}
          <div className={`bg-gradient-to-r ${activeSectionData.color} p-8 text-white`}>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl backdrop-blur-sm">
                {activeSectionData.icon}
              </div>
              <div>
                <h2 className="text-3xl font-bold font-poppins">{activeSectionData.title}</h2>
                <p className="text-white/80 font-outfit mt-2">
                  Step-by-step guide for {activeSectionData.title.toLowerCase()}
                </p>
              </div>
            </div>
          </div>

          {/* Steps Section */}
          <div className="p-8">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 font-poppins mb-6 flex items-center">
                <span className="w-2 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full mr-4"></span>
                Step-by-Step Process
              </h3>
              <div className="space-y-2">
                {activeSectionData.steps.map((step, index) => (
                  <StepCard
                    key={step.step}
                    step={step.step}
                    title={step.title}
                    description={step.description}
                    isLast={index === activeSectionData.steps.length - 1}
                  />
                ))}
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200/60">
              <h4 className="text-xl font-bold text-gray-900 font-poppins mb-4 flex items-center">
                <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm mr-3">!</span>
                Important Notes & Best Practices
              </h4>
              <ul className="space-y-3">
                {activeSectionData.notes.map((note, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 font-outfit leading-relaxed">{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Tips */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-2xl p-6 border border-green-200/60">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white text-lg">
                    ✅
                  </div>
                  <h5 className="font-bold text-gray-900 font-poppins">Do's</h5>
                </div>
                <ul className="text-sm text-gray-700 font-outfit space-y-2">
                  <li>• Verify all information before submission</li>
                  <li>• Follow security protocols strictly</li>
                  <li>• Document all administrative actions</li>
                </ul>
              </div>
              <div className="bg-red-50 rounded-2xl p-6 border border-red-200/60">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center text-white text-lg">
                    ❌
                  </div>
                  <h5 className="font-bold text-gray-900 font-poppins">Don'ts</h5>
                </div>
                <ul className="text-sm text-gray-700 font-outfit space-y-2">
                  <li>• Share admin credentials with others</li>
                  <li>• Skip verification steps</li>
                  <li>• Ignore system alerts and warnings</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const HeaderSection = () => (
    <div className="text-center mb-12">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl shadow-2xl mb-6">
        <span className="text-3xl text-white">📚</span>
      </div>
      <h1 className="text-4xl font-bold text-gray-900 font-poppins mb-4">
        Admin Help Guide
      </h1>
      <p className="text-xl text-gray-600 font-outfit max-w-3xl mx-auto leading-relaxed">
        Comprehensive guide for managing the Hostel Outpass System. Learn how to efficiently handle user registration, management, and system maintenance.
      </p>
    </div>
  );

  const SearchSection = () => (
    <div className="max-w-2xl mx-auto mb-12">
      <div className="relative">
        <input
          type="text"
          placeholder="Search help topics, steps, or descriptions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-6 py-4 pl-14 bg-white rounded-2xl shadow-lg border border-gray-200/60 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 font-outfit placeholder-gray-400"
        />
        <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </div>
  );

  const QuickActionsSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      <QuickActionCard
        icon="👤"
        title="Quick Registration"
        description="Register new users with role-specific details"
        onClick={() => navigate('/admin?tab=register')}
        color="from-blue-500 to-blue-600"
      />
      <QuickActionCard
        icon="📊"
        title="User Management"
        description="Manage existing users and their permissions"
        onClick={() => navigate('/admin?tab=users')}
        color="from-green-500 to-green-600"
      />
      <QuickActionCard
        icon="🔑"
        title="Password Reset"
        description="Reset user passwords and manage access"
        onClick={() => navigate('/admin?tab=reset-password')}
        color="from-orange-500 to-orange-600"
      />
    </div>
  );

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HeaderSection />
        <SearchSection />
        <QuickActionsSection />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <SidebarNavigation />
          <MainContent />
        </div>
      </div>
    </div>
  );
};

export default AdminHelp;
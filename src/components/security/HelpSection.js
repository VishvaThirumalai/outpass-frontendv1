// src/components/security/HelpSection.js
import React, { useState } from 'react';
import { 
  HelpCircle, 
  Phone, 
  Mail, 
  MessageCircle, 
  Clock, 
  Shield,
  AlertTriangle,
  CheckCircle,
  FileText,
  Video,
  BookOpen,
  Search,
  ChevronDown,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

const HelpSection = () => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [expandedItems, setExpandedItems] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const toggleExpanded = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const helpCategories = {
    general: {
      title: 'General Information',
      icon: <HelpCircle className="w-5 h-5" />,
      items: [
        {
          id: 'welcome',
          question: 'Welcome to Security Portal',
          answer: 'The Security Portal is designed to help security officers efficiently manage student movements through outpass system. Monitor departures, returns, and track active passes in real-time.'
        },
        {
          id: 'access',
          question: 'System Access & Permissions',
          answer: 'As a security officer, you have access to: Mark Departures, Mark Returns, View Active Passes, Monitor Today\'s Activity, and Generate Reports. All actions are logged for security audit.'
        },
        {
          id: 'hours',
          question: 'Operating Hours & Support',
          answer: 'System is available 24/7. Technical support is available from 8:00 AM to 8:00 PM. Emergency technical issues can be reported to IT department via emergency contact numbers.'
        }
      ]
    },
    departure: {
      title: 'Marking Departures',
      icon: <Shield className="w-5 h-5" />,
      items: [
        {
          id: 'departure-process',
          question: 'How to Mark a Departure?',
          answer: '1. Go to "Mark Departure" section\n2. Search for student by name or roll number\n3. Verify student identity and outpass details\n4. Click "Mark Departure"\n5. Add optional comments if needed\n6. Confirm the action'
        },
        {
          id: 'departure-validity',
          question: 'Departure Time Window',
          answer: 'Departures can only be marked within 24 hours of the approved leave start time. The system will automatically prevent marking departures outside this window. Students must depart within their approved timeframe.'
        },
        {
          id: 'id-verification',
          question: 'Student Identity Verification',
          answer: 'Always verify:\n- Student ID Card\n- Outpass approval status\n- Leave dates validity\n- Emergency contact information\nIn case of discrepancy, contact warden office immediately.'
        }
      ]
    },
    return: {
      title: 'Marking Returns',
      icon: <CheckCircle className="w-5 h-5" />,
      items: [
        {
          id: 'return-process',
          question: 'How to Mark a Return?',
          answer: '1. Navigate to "Mark Return" section\n2. Find student in active outpasses list\n3. Verify return time and student identity\n4. Click "Mark Return"\n5. For late returns, provide reason\n6. Add observations if any\n7. Confirm completion'
        },
        {
          id: 'late-returns',
          question: 'Handling Late Returns',
          answer: 'For students returning after expected time:\n- Document the actual return time\n- Mandatory reason required for late return\n- System automatically flags late returns\n- Report repeated late returns to warden'
        },
        {
          id: 'emergency-procedures',
          question: 'Emergency Return Procedures',
          answer: 'In case of emergencies:\n- Document all details thoroughly\n- Contact emergency personnel if needed\n- Notify warden immediately\n- Preserve all evidence and records'
        }
      ]
    },
    technical: {
      title: 'Technical Support',
      icon: <FileText className="w-5 h-5" />,
      items: [
        {
          id: 'login-issues',
          question: 'Login & Access Problems',
          answer: 'If you cannot login:\n- Check internet connection\n- Verify username/password\n- Clear browser cache\n- Try incognito mode\n- Contact IT support if issue persists'
        },
        {
          id: 'system-errors',
          question: 'System Errors & Bugs',
          answer: 'For system errors:\n- Note error message and time\n- Take screenshot if possible\n- Try refreshing the page\n- Report to IT with details\n- Use backup manual process if critical'
        },
        {
          id: 'data-issues',
          question: 'Data Display Issues',
          answer: 'If data appears incorrect:\n- Refresh the page first\n- Check filter settings\n- Verify with other officers\n- Report discrepancies to admin\n- Do not proceed if data seems wrong'
        }
      ]
    },
    emergency: {
      title: 'Emergency Procedures',
      icon: <AlertTriangle className="w-5 h-5" />,
      items: [
        {
          id: 'contact-list',
          question: 'Emergency Contact List',
          answer: 'Immediate Contacts:\n- Chief Warden: +91-9876543210\n- Hospital: +91-9876543211\n- Police Control: 100\n- Fire Station: 101\n- IT Emergency: +91-9876543212\n- Security Head: +91-9876543213'
        },
        {
          id: 'incident-reporting',
          question: 'Incident Reporting Protocol',
          answer: 'For any security incident:\n1. Ensure safety first\n2. Document all details\n3. Take photos if safe\n4. Notify security head\n5. Preserve evidence\n6. Complete incident report form\n7. Follow up as required'
        },
        {
          id: 'system-failure',
          question: 'System Failure Backup',
          answer: 'If system completely fails:\n- Use manual register temporarily\n- Document all movements\n- Take ID card details\n- Note timestamps manually\n- Sync data once system recovers\n- Report outage immediately'
        }
      ]
    }
  };

  const filteredCategories = Object.entries(helpCategories).reduce((acc, [key, category]) => {
    const filteredItems = category.items.filter(item => 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (filteredItems.length > 0 || searchTerm === '') {
      acc[key] = {
        ...category,
        items: filteredItems
      };
    }
    
    return acc;
  }, {});

  const quickActions = [
    {
      title: 'Emergency Contacts',
      description: 'Immediate contact numbers for emergencies',
      icon: <Phone className="w-5 h-5" />,
      category: 'emergency'
    },
    {
      title: 'IT Support',
      description: 'Technical issues and system problems',
      icon: <MessageCircle className="w-5 h-5" />,
      category: 'technical'
    },
    {
      title: 'Departure Guide',
      description: 'Step-by-step departure process',
      icon: <Shield className="w-5 h-5" />,
      category: 'departure'
    },
    {
      title: 'Return Procedures',
      description: 'Complete return marking guide',
      icon: <CheckCircle className="w-5 h-5" />,
      category: 'return'
    }
  ];

  const supportContacts = [
    {
      department: 'IT Support',
      contact: '+91-9876543210',
      email: 'it-support@university.edu',
      availability: '8:00 AM - 8:00 PM',
      icon: <MessageCircle className="w-5 h-5" />
    },
    {
      department: 'Security Head',
      contact: '+91-9876543211',
      email: 'security@university.edu',
      availability: '24/7',
      icon: <Shield className="w-5 h-5" />
    },
    {
      department: 'Warden Office',
      contact: '+91-9876543212',
      email: 'warden@university.edu',
      availability: '9:00 AM - 6:00 PM',
      icon: <HelpCircle className="w-5 h-5" />
    },
    {
      department: 'Administration',
      contact: '+91-9876543213',
      email: 'admin@university.edu',
      availability: '10:00 AM - 5:00 PM',
      icon: <FileText className="w-5 h-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/30 font-poppins p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                🆘 Help & Support
              </h1>
              <p className="text-gray-600 text-lg">
                Get assistance with security portal operations and emergency procedures
              </p>
            </div>
            
            {/* Search Box */}
            <div className="relative min-w-[300px]">
              <input
                type="text"
                placeholder="Search help articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 font-poppins"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => setActiveCategory(action.category)}
                className="group text-left"
              >
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-orange-300 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-orange-100 rounded-xl text-orange-600 group-hover:scale-110 transition-transform duration-300">
                      {action.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 font-poppins group-hover:text-orange-700 transition-colors duration-200">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 font-outfit">
                        {action.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-orange-600 text-sm font-medium font-outfit group-hover:text-orange-700 transition-colors duration-200">
                      View Guide →
                    </span>
                    <ChevronRight className="w-4 h-4 text-orange-500 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 sticky top-8">
              {/* Navigation Header */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 font-poppins flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-orange-600" />
                  Help Categories
                </h3>
              </div>

              {/* Category List */}
              <nav className="p-4">
                <div className="space-y-2">
                  {Object.entries(filteredCategories).map(([key, category]) => (
                    <button
                      key={key}
                      onClick={() => setActiveCategory(key)}
                      className={`
                        w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200 font-poppins
                        ${activeCategory === key
                          ? 'bg-orange-50 text-orange-700 border border-orange-200 shadow-sm'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`
                          p-2 rounded-lg transition-colors duration-200
                          ${activeCategory === key ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'}
                        `}>
                          {category.icon}
                        </div>
                        <span className="font-medium">{category.title}</span>
                      </div>
                      <div className={`
                        w-2 h-2 rounded-full transition-all duration-200
                        ${activeCategory === key ? 'bg-orange-500 scale-125' : 'bg-gray-300'}
                      `}></div>
                    </button>
                  ))}
                </div>
              </nav>

              {/* Support Contacts */}
              <div className="p-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-4 font-poppins uppercase tracking-wide">
                  Quick Contacts
                </h4>
                <div className="space-y-3">
                  {supportContacts.slice(0, 2).map((contact, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                        {contact.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 font-poppins truncate">
                          {contact.department}
                        </p>
                        <p className="text-xs text-gray-600 font-outfit truncate">
                          {contact.contact}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Selected Category Content */}
            {filteredCategories[activeCategory] && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Category Header */}
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                      {filteredCategories[activeCategory].icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 font-poppins">
                        {filteredCategories[activeCategory].title}
                      </h2>
                      <p className="text-orange-600 text-sm font-outfit">
                        {filteredCategories[activeCategory].items.length} articles available
                      </p>
                    </div>
                  </div>
                </div>

                {/* FAQ Items */}
                <div className="divide-y divide-gray-200">
                  {filteredCategories[activeCategory].items.map((item) => (
                    <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                      <button
                        onClick={() => toggleExpanded(item.id)}
                        className="w-full flex items-center justify-between text-left group"
                      >
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 font-poppins group-hover:text-orange-700 transition-colors duration-200">
                            {item.question}
                          </h3>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          {expandedItems[item.id] ? (
                            <ChevronDown className="w-5 h-5 text-orange-600 transform transition-transform duration-200" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors duration-200" />
                          )}
                        </div>
                      </button>
                      
                      {expandedItems[item.id] && (
                        <div className="mt-4 pl-2 border-l-2 border-orange-300">
                          <div className="prose prose-sm max-w-none">
                            <p className="text-gray-700 whitespace-pre-line font-outfit leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="mt-4 flex flex-wrap gap-2">
                            <button className="inline-flex items-center px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium font-outfit hover:bg-orange-200 transition-colors duration-200">
                              <FileText className="w-4 h-4 mr-1" />
                              Save Guide
                            </button>
                            <button className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium font-outfit hover:bg-blue-200 transition-colors duration-200">
                              <Video className="w-4 h-4 mr-1" />
                              Watch Video
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Empty State */}
                {filteredCategories[activeCategory].items.length === 0 && (
                  <div className="text-center py-12">
                    <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 font-poppins mb-2">
                      No articles found
                    </h3>
                    <p className="text-gray-600 font-outfit max-w-md mx-auto">
                      No help articles found matching "{searchTerm}". Try different search terms or browse other categories.
                    </p>
                    <button
                      onClick={() => setSearchTerm('')}
                      className="mt-4 bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium font-outfit"
                    >
                      Clear Search
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Emergency Contact Section */}
            <div className="mt-8 bg-red-50 rounded-2xl shadow-sm border border-red-200 overflow-hidden">
              <div className="px-6 py-4 bg-red-100 border-b border-red-200">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <h3 className="text-lg font-semibold text-red-900 font-poppins">
                    Emergency Contacts
                  </h3>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {supportContacts.map((contact, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-xl border border-red-200 hover:border-red-300 transition-colors duration-200">
                      <div className="p-2 bg-red-100 rounded-lg text-red-600 flex-shrink-0">
                        {contact.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 font-poppins mb-1">
                          {contact.department}
                        </h4>
                        <p className="text-red-600 font-medium font-outfit text-lg mb-1">
                          {contact.contact}
                        </p>
                        <p className="text-gray-600 text-sm font-outfit mb-1">
                          {contact.email}
                        </p>
                        <p className="text-gray-500 text-xs font-outfit flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          Available: {contact.availability}
                        </p>
                      </div>
                      <button className="flex-shrink-0 p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                
                {/* Emergency Instructions */}
                <div className="mt-6 p-4 bg-red-100 rounded-xl border border-red-200">
                  <h4 className="font-semibold text-red-900 font-poppins mb-2">
                    Emergency Protocol
                  </h4>
                  <ul className="text-red-800 text-sm font-outfit space-y-1 list-disc list-inside">
                    <li>Call emergency numbers immediately for critical situations</li>
                    <li>Follow established emergency procedures</li>
                    <li>Document all incidents thoroughly</li>
                    <li>Notify security head and warden office</li>
                  </ul>
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
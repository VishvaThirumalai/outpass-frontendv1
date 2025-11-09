// src/components/common/Help.js
import React, { useState } from 'react';
import '../../styles/Help.css';

const Help = () => {
  const [activeSection, setActiveSection] = useState('student');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const sections = {
    student: {
      title: '👨‍🎓 Student Guide',
      icon: '🎓',
      content: [
        {
          title: 'How to Apply for Outpass',
          steps: [
            'Login to your student dashboard using your credentials',
            'Click on "Apply Outpass" from the sidebar menu',
            'Fill in all required details: reason, destination, dates, and emergency contact',
            'Ensure leave date is current or future time',
            'Review all information carefully before submission',
            'Click "Submit Application" button',
            'You will receive a confirmation message upon successful submission'
          ]
        },
        {
          title: 'Viewing Your Outpass Status',
          steps: [
            'Go to "My Outpasses" section from the dashboard',
            'View all your outpass applications with their current status',
            'Status types: PENDING, APPROVED, REJECTED, ACTIVE, COMPLETED',
            'Click on any outpass card to view detailed information',
            'Check warden comments for approved/rejected applications'
          ]
        },
        {
          title: 'Editing Pending Outpass',
          steps: [
            'Navigate to "My Outpasses" section',
            'Find the outpass with PENDING status',
            'Click "Edit" button on the outpass card',
            'Modify the required fields',
            'Click "Update Outpass" to save changes',
            'Note: Only PENDING outpasses can be edited'
          ]
        },
        {
          title: 'Cancelling Outpass',
          steps: [
            'Go to "My Outpasses" section',
            'Locate the outpass you wish to cancel',
            'Click "Cancel" button',
            'Confirm the cancellation in the popup dialog',
            'The outpass status will change to CANCELLED',
            'Note: Only PENDING outpasses can be cancelled'
          ]
        },
        {
          title: 'Important Guidelines',
          steps: [
            'Minimum outpass duration is 30 minutes',
            'Apply at least 2 hours before your intended departure',
            'Emergency contact details are mandatory',
            'Return on time to avoid penalties',
            'Inform security upon departure and return',
            'Keep your mobile phone charged and accessible',
            'Carry your college ID card at all times'
          ]
        }
      ]
    },
    warden: {
      title: '🏢 Warden Guide',
      icon: '👨‍💼',
      content: [
        {
          title: 'Reviewing Outpass Applications',
          steps: [
            'Login to warden dashboard',
            'Navigate to "Pending Review" section',
            'View list of all pending outpass applications',
            'Click "Review Application" on any outpass card',
            'Review student details, reason, destination, and duration',
            'Select Approve or Reject option',
            'Enter mandatory comments explaining your decision',
            'Click final approval/rejection button to submit'
          ]
        },
        {
          title: 'Viewing All Outpasses',
          steps: [
            'Go to "All Outpasses" from sidebar',
            'Use search box to filter by student name, roll number, or reason',
            'View complete history of all outpass applications',
            'Check status, dates, and comments for each outpass',
            'Export data if needed for records'
          ]
        },
        {
          title: 'Dashboard Statistics',
          steps: [
            'Main dashboard shows overview statistics',
            'Total applications, pending, approved, rejected counts',
            'Currently active outpasses (students outside hostel)',
            'Completed outpasses and late returns',
            'Navigate to "Statistics" for detailed analytics',
            'View approval rates and trend analysis'
          ]
        },
        {
          title: 'Best Practices',
          steps: [
            'Review applications promptly (within 24 hours)',
            'Provide clear, constructive comments',
            'Verify emergency contact information',
            'Check for unusual patterns or frequent applications',
            'Coordinate with security team for active outpasses',
            'Maintain fairness and consistency in decisions',
            'Document reasons for rejections thoroughly'
          ]
        }
      ]
    },
    security: {
      title: '🛡️ Security Guide',
      icon: '🔒',
      content: [
        {
          title: 'Marking Student Departure',
          steps: [
            'Login to security dashboard',
            'Navigate to "Mark Departure" section',
            'Search for student by name or roll number',
            'Verify student identity with college ID card',
            'Check outpass details: destination, return date',
            'Click "Mark Departure" button',
            'Add any observations in comments field (optional)',
            'Confirm to record departure timestamp'
          ]
        },
        {
          title: 'Marking Student Return',
          steps: [
            'Go to "Mark Return" section',
            'Search for returning student',
            'Verify student identity',
            'System will automatically detect if return is late',
            'If late, ask student for reason and enter it',
            'Add any relevant comments',
            'Click "Mark Return" to complete the process',
            'Return timestamp is automatically recorded'
          ]
        },
        {
          title: 'Monitoring Active Passes',
          steps: [
            'Visit "Active Passes" section',
            'View all students currently outside hostel',
            'Check expected return times',
            'Identify overdue returns (highlighted in red)',
            'Contact students who are significantly late',
            'Report persistent late returns to warden',
            'Page refreshes automatically every 30 seconds'
          ]
        },
        {
          title: 'Today\'s Activity',
          steps: [
            'Navigate to "Today\'s Activity" section',
            'View all departures for current day',
            'See all returns completed today',
            'Check expected returns for the day',
            'Use this for shift handover information',
            'Report any anomalies to supervisor'
          ]
        },
        {
          title: 'Security Protocols',
          steps: [
            'Always verify student ID before marking departure/return',
            'Check approved outpass exists in system',
            'Do not allow departure without approved outpass',
            'Report suspicious behavior immediately',
            'Maintain logbook as backup',
            'Coordinate with other security personnel',
            'Emergency contact: +91-98765-43210'
          ]
        }
      ]
    },
    admin: {
      title: '⚙️ Admin Guide',
      icon: '👨‍💻',
      content: [
        {
          title: 'User Registration',
          steps: [
            'Login to admin dashboard',
            'Navigate to "Register User" section',
            'Select user role: Student, Warden, or Security',
            'Fill in basic information: name, username, email, mobile',
            'Default password is "Default123!" (users will change on first login)',
            'Fill role-specific fields based on selected role',
            'For Students: roll number, course, hostel, room details',
            'For Wardens: employee ID, department, designation, hostel',
            'For Security: security ID, shift, gate assignment',
            'Click "Register User" to create account'
          ]
        },
        {
          title: 'User Management',
          steps: [
            'Go to "User Management" section',
            'Switch between Students, Wardens, Security tabs',
            'View comprehensive list of all users',
            'Check user status (Active/Inactive)',
            'Search and filter users as needed',
            'Export user data for reports',
            'Coordinate with respective departments for updates'
          ]
        },
        {
          title: 'Password Reset',
          steps: [
            'Navigate to "Reset Password" section',
            'Enter username of the user',
            'Verify mobile number for security',
            'Set new password (minimum 6 characters)',
            'Confirm new password',
            'Click "Reset Password" to apply changes',
            'Inform user about password reset',
            'User can login immediately with new password'
          ]
        },
        {
          title: 'System Monitoring',
          steps: [
            'Dashboard shows total users by role',
            'Monitor system usage and performance',
            'Check for any error reports',
            'Review user feedback regularly',
            'Maintain system backups',
            'Update system announcements in marquee',
            'Coordinate with technical team for issues'
          ]
        },
        {
          title: 'Security & Maintenance',
          steps: [
            'Regularly audit user accounts',
            'Remove inactive users after semester completion',
            'Update system policies as needed',
            'Ensure data privacy compliance',
            'Maintain audit logs',
            'Schedule regular system maintenance',
            'Keep emergency contacts updated'
          ]
        }
      ]
    }
  };

  const faqs = [
    {
      question: 'What is the minimum notice period for applying outpass?',
      answer: 'Students should apply at least 2 hours before their intended departure time. This allows wardens sufficient time to review and approve the application.'
    },
    {
      question: 'Can I edit my outpass after submission?',
      answer: 'Yes, you can edit your outpass application only if it is still in PENDING status. Once approved or rejected, the outpass cannot be edited.'
    },
    {
      question: 'What happens if I return late?',
      answer: 'Late returns are recorded in the system. Security will ask for a reason which will be documented. Persistent late returns may result in disciplinary action as per hostel rules.'
    },
    {
      question: 'How do I check my outpass status?',
      answer: 'Login to your student dashboard and navigate to "My Outpasses" section. You can see all your applications with their current status and any comments from wardens.'
    },
    {
      question: 'What if my outpass is rejected?',
      answer: 'If your outpass is rejected, you will see the warden\'s comments explaining the reason. You can apply again with proper justification if needed.'
    },
    {
      question: 'Is emergency contact mandatory?',
      answer: 'Yes, emergency contact information is mandatory for all outpass applications. This ensures we can reach someone in case of emergency.'
    },
    {
      question: 'Can I cancel my approved outpass?',
      answer: 'Approved outpasses cannot be cancelled directly. Please contact your hostel warden if you need to cancel an approved outpass.'
    },
    {
      question: 'What documents should I carry?',
      answer: 'Always carry your college ID card, mobile phone, and keep emergency contacts accessible. Inform your emergency contact about your travel plans.'
    },
    {
      question: 'Who do I contact for technical issues?',
      answer: 'For technical issues with the system, contact the admin at hostel@mitindia.edu or call the helpdesk at +91-44-2223-5555.'
    },
    {
      question: 'What are the hostel timings?',
      answer: 'Hostel entry closes at 10:00 PM on weekdays and 11:00 PM on weekends. Late entry requires special permission from the warden.'
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="help-container">
      <div className="help-header">
        <h1>📚 Help & Support Center</h1>
        <p>Comprehensive guide to using MIT Hostel Outpass Management System</p>
      </div>

      {/* Section Navigation */}
      <div className="help-navigation">
        {Object.keys(sections).map(key => (
          <button
            key={key}
            className={`help-nav-button ${activeSection === key ? 'active' : ''}`}
            onClick={() => setActiveSection(key)}
          >
            <span className="nav-icon">{sections[key].icon}</span>
            <span>{sections[key].title}</span>
          </button>
        ))}
      </div>

      {/* Content Section */}
      <div className="help-content">
        <h2 className="section-title">{sections[activeSection].title}</h2>
        
        {sections[activeSection].content.map((item, index) => (
          <div key={index} className="help-card">
            <h3 className="help-card-title">
              <span className="step-number">{index + 1}</span>
              {item.title}
            </h3>
            <ol className="help-steps">
              {item.steps.map((step, stepIndex) => (
                <li key={stepIndex} className="help-step">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <h2>❓ Frequently Asked Questions</h2>
        
        <div className="faq-search">
          <input
            type="text"
            placeholder="🔍 Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="faq-search-input"
          />
        </div>

        <div className="faq-list">
          {filteredFaqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <button
                className="faq-question"
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
              >
                <span>{faq.question}</span>
                <span className="faq-icon">
                  {expandedFaq === index ? '−' : '+'}
                </span>
              </button>
              {expandedFaq === index && (
                <div className="faq-answer">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFaqs.length === 0 && (
          <p className="no-results">No FAQs found matching your search.</p>
        )}
      </div>

      {/* Contact Support */}
      <div className="support-section">
        <h2>📞 Need More Help?</h2>
        <div className="support-cards">
          <div className="support-card">
            <div className="support-icon">📧</div>
            <h3>Email Support</h3>
            <p>hostel@mitindia.edu</p>
            <p className="support-note">Response within 24 hours</p>
          </div>
          <div className="support-card">
            <div className="support-icon">☎️</div>
            <h3>Phone Support</h3>
            <p>+91-44-2223-5555</p>
            <p className="support-note">Mon-Fri: 9 AM - 6 PM</p>
          </div>
          <div className="support-card">
            <div className="support-icon">🚨</div>
            <h3>Emergency Contact</h3>
            <p>+91-98765-43210</p>
            <p className="support-note">24/7 Available</p>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="tips-section">
        <h3>💡 Quick Tips</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <span className="tip-icon">⏰</span>
            <p>Apply for outpass at least 2 hours in advance</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">📱</span>
            <p>Keep your mobile phone charged and accessible</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">🆔</span>
            <p>Always carry your college ID card</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">🔔</span>
            <p>Check your email for outpass status updates</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">⏱️</span>
            <p>Return on time to maintain good records</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">👥</span>
            <p>Update emergency contacts regularly</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
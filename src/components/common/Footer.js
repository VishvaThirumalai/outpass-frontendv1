// src/components/common/Footer.js
import React from 'react';
import '../../styles/Common.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-top">
          <div className="footer-section">
            <h3>About</h3>
            <p>MIT Hostel Outpass Management System streamlines the process of requesting and approving student outpasses.</p>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <div className="footer-links">
              <a href="#" className="footer-link">Help & Support</a>
              <a href="#" className="footer-link">Privacy Policy</a>
              <a href="#" className="footer-link">Terms of Service</a>
            </div>
          </div>

          <div className="footer-section">
            <h3>Contact</h3>
            <p>Madras Institute of Technology</p>
            <p>Anna University, Chennai</p>
            <p>Email: hostel@mitindia.edu</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} <span className="footer-college-name">MIT Hostel Outpass Management System</span>. All rights reserved.</p>
          <p>Developed for Madras Institute of Technology - Anna University</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
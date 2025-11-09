// src/components/common/Layout.js
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import '../../styles/Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <main className="main-content">
        <div className="content-wrapper">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
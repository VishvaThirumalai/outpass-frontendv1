// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 AuthContext: Initializing authentication...');
    
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log('✅ Setting user from localStorage:', parsedUser.username);
        console.log('🏠 User hostel:', parsedUser.hostel);
        setUser(parsedUser);
      } catch (error) {
        console.error('❌ Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      console.log('🔄 AuthContext: Attempting login for:', credentials.username);
      
      const response = await authService.login(credentials);
      
      console.log('✅ Login API response:', response);

      if (response && (response.success || response.data)) {
        const userData = response.data || response;
        
        console.log('✅ Login successful, setting user:', userData.username);
        console.log('🏠 User hostel:', userData.hostel);
        setUser(userData);
        
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userData.token);
        
        return { success: true, user: userData };
      } else {
        return { 
          success: false, 
          message: response?.message || 'Invalid response from server' 
        };
      }
    } catch (err) {
      console.error('💥 Login error:', err);
      
      const errorMessage = err.response?.data?.message || 
                          err.data?.message || 
                          err.message || 
                          'Network error. Please try again.';
      
      return { 
        success: false, 
        message: errorMessage 
      };
    }
  };

  const logout = () => {
    console.log('🚪 AuthContext: Logging out user');
    setUser(null);
    authService.logout();
  };

  const updateUser = (updatedUserData) => {
    console.log('🔄 AuthContext: Updating user data');
    const currentUserRaw = localStorage.getItem('user');
    const currentUser = currentUserRaw ? JSON.parse(currentUserRaw) : {};
    const mergedUser = { ...currentUser, ...updatedUserData };

    setUser(mergedUser);
    localStorage.setItem('user', JSON.stringify(mergedUser));
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
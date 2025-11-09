// src/services/userService.js
import api from './api';

export const userService = {
  // Get current user's detailed profile
  getCurrentUserProfile: async () => {
    try {
      console.log('🔄 Fetching user profile from API...');
      const response = await api.get('/user/profile');
      console.log('✅ User profile API response:', response);
      return response;
    } catch (error) {
      console.error('❌ Error fetching user profile:', error);
      throw error;
    }
  },

  // Get student details specifically
  getStudentProfile: async () => {
    try {
      console.log('🔄 Fetching student profile...');
      const response = await api.get('/student/profile');
      console.log('✅ Student profile API response:', response);
      return response;
    } catch (error) {
      console.error('❌ Error fetching student profile:', error);
      throw error;
    }
  },

  // Get user details by role
  getUserDetailsByRole: async (role) => {
    try {
      console.log(`🔄 Fetching ${role} profile...`);
      let endpoint = '';
      
      switch(role) {
        case 'STUDENT':
          endpoint = '/student/profile';
          break;
        case 'WARDEN':
          endpoint = '/warden/profile';
          break;
        case 'SECURITY':
          endpoint = '/security/profile';
          break;
        case 'ADMIN':
          endpoint = '/admin/profile';
          break;
        default:
          endpoint = '/user/profile';
      }
      
      const response = await api.get(endpoint);
      console.log(`✅ ${role} profile API response:`, response);
      return response;
    } catch (error) {
      console.error(`❌ Error fetching ${role} profile:`, error);
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (profileData) => {
    try {
      console.log('🔄 Updating user profile:', profileData);
      const response = await api.put('/user/profile', profileData);
      console.log('✅ Profile update response:', response);
      return response;
    } catch (error) {
      console.error('❌ Error updating user profile:', error);
      throw error;
    }
  },

  // Get user by ID (for admin)
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      return response;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  },

  updateUserProfile: async (profileData) => {
  try {
    console.log('🔄 Updating user profile:', profileData);
    const response = await api.put('/user/profile', profileData);
    console.log('✅ Profile update response:', response);
    return response;
  } catch (error) {
    console.error('❌ Error updating user profile:', error);
    throw error;
  }
},
};
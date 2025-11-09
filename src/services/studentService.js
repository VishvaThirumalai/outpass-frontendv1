// src/services/studentService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const studentService = {
  // Apply for new outpass - FIXED
  applyOutpass: async (outpassData) => {
    try {
      console.log('📤 Sending outpass application:', outpassData);
      
      // Transform the data to match backend DTO
      const requestData = {
        reason: outpassData.reason || '',
        leaveStartDate: new Date(outpassData.fromDate + 'T' + (outpassData.departureTime || '09:00')).toISOString(),
        expectedReturnDate: new Date(outpassData.toDate + 'T23:59').toISOString(),
        destination: outpassData.destination || '',
        emergencyContactName: outpassData.emergencyContact || '',
        emergencyContactNumber: outpassData.emergencyContact || '',
        emergencyContactRelation: 'Self'
      };

      console.log('🔄 Transformed request data:', requestData);

      const response = await axios.post(
        `${API_URL}/student/outpass`,
        requestData,
        { headers: getAuthHeader() }
      );

      console.log('✅ Outpass application response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error applying outpass:', error.response?.data || error);
      throw error.response?.data || error;
    }
  },

  // Edit outpass - FIXED
  editOutpass: async (id, outpassData) => {
    try {
      const requestData = {
        reason: outpassData.reason,
        leaveStartDate: outpassData.leaveStartDate,
        expectedReturnDate: outpassData.expectedReturnDate,
        destination: outpassData.destination || '',
        emergencyContactName: outpassData.emergencyContactName || '',
        emergencyContactNumber: outpassData.emergencyContactNumber || '',
        emergencyContactRelation: outpassData.emergencyContactRelation || ''
      };

      const response = await axios.put(
        `${API_URL}/student/outpass/${id}`,
        requestData,
        { headers: getAuthHeader() }
      );

      return response.data;
    } catch (error) {
      console.error('Error editing outpass:', error);
      throw error.response?.data || error;
    }
  },

  // Cancel outpass
  cancelOutpass: async (id) => {
    try {
      const response = await axios.delete(
        `${API_URL}/student/outpass/${id}`,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Error cancelling outpass:', error);
      throw error.response?.data || error;
    }
  },

  // Get all outpasses for student
  getMyOutpasses: async () => {
    try {
      const response = await axios.get(
        `${API_URL}/student/outpasses`,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching outpasses:', error);
      throw error.response?.data || error;
    }
  },

  // Get specific outpass
  getOutpass: async (id) => {
    try {
      const response = await axios.get(
        `${API_URL}/student/outpass/${id}`,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching outpass:', error);
      throw error.response?.data || error;
    }
  },

  // Get dashboard stats
  getStats: async () => {
    try {
      const response = await axios.get(
        `${API_URL}/student/dashboard`,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Return default stats if error
      return {
        data: {
          totalOutpasses: 0,
          pendingOutpasses: 0,
          approvedOutpasses: 0,
          activeOutpasses: 0,
          completedOutpasses: 0,
          rejectedOutpasses: 0,
          recentOutpasses: []
        }
      };
    }
  }

  ,

  // Get authenticated student's profile
  getProfile: async () => {
    try {
      const response = await axios.get(
        `${API_URL}/student/profile`,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching student profile:', error.response?.data || error);
      throw error.response?.data || error;
    }
  }
};
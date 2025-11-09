// src/services/wardenService.js - COMPLETE WORKING VERSION
import api from './api';

export const wardenService = {
  // Get outpasses with status filtering
  getOutpasses: async (status = 'all') => {
    console.log('📤 Fetching outpasses with status:', status);
    
    try {
      let url = '/api/warden/outpasses';
      const params = new URLSearchParams();
      
      if (status && status !== 'all') {
        params.append('status', status);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await api.get(url);
      console.log('✅ Warden outpasses API response:', response);
      
      // Handle the ApiResponse wrapper
      if (response.data && response.data.success !== undefined) {
        return response.data.data; // Return the actual outpasses array
      } else if (Array.isArray(response.data)) {
        return response.data; // Direct array response
      } else {
        console.warn('⚠️ Unexpected response format:', response);
        return [];
      }
    } catch (error) {
      console.error('❌ Failed to fetch warden outpasses:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch outpasses');
    }
  },
  
  // Get authenticated warden's profile
  getProfile: async () => {
    try {
      const response = await api.get('/api/warden/profile');
      // `api` interceptor returns response.data already; this may be an ApiResponse wrapper
      return response;
    } catch (error) {
      console.error('❌ Error fetching warden profile:', error);
      throw error;
    }
  },

  // Get specific outpass - FIXED
  getOutpass: async (id) => {
    console.log('📤 Fetching outpass:', id);
    try {
      const response = await api.get(`/api/warden/outpass/${id}`);
      console.log('✅ Outpass API response:', response);
      
      // Handle the ApiResponse wrapper
      if (response.data && response.data.success !== undefined) {
        return response.data.data; // Return the actual outpass object
      } else if (response.data && response.data.id) {
        return response.data; // Direct object response
      } else {
        throw new Error('Invalid outpass data received');
      }
    } catch (error) {
      console.error('❌ Failed to fetch outpass:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch outpass details');
    }
  },

  // Review outpass (approve/reject) - FIXED
  reviewOutpass: async (id, decision, comments = '') => {
    console.log('📤 Reviewing outpass:', id, decision, comments);
    try {
      const response = await api.put(`/api/warden/outpass/${id}/review`, {
        approved: decision === 'APPROVE',
        comments: comments
      });
      console.log('✅ Review outpass API response:', response);
      
      // Handle the ApiResponse wrapper
      if (response.data && response.data.success !== undefined) {
        return response.data.data; // Return the updated outpass
      } else {
        return response.data; // Direct response
      }
    } catch (error) {
      console.error('❌ Failed to review outpass:', error);
      throw new Error(error.response?.data?.message || 'Failed to review outpass');
    }
  },

  // Get basic statistics - FIXED
  getStats: async () => {
    console.log('📤 Fetching warden stats');
    try {
      const response = await api.get('/api/warden/stats');
      console.log('✅ Warden stats API response:', response);
      
      // Handle the ApiResponse wrapper
      if (response.data && response.data.success !== undefined) {
        return response.data.data; // Return the stats object
      } else {
        return response.data; // Direct response
      }
    } catch (error) {
      console.error('❌ Failed to fetch warden stats:', error);
      throw error;
    }
  },

  // Convenience methods
  getPendingOutpasses: async () => {
    return await wardenService.getOutpasses('pending');
  },

  getApprovedOutpasses: async () => {
    return await wardenService.getOutpasses('approved');
  },

  getActiveOutpasses: async () => {
    return await wardenService.getOutpasses('active');
  }
};
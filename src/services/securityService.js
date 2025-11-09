import api from './api';

export const securityService = {
  // Get security profile - ADDED
  getProfile: async () => {
    console.log('🔄 Security Service: Fetching security profile...');
    try {
      const response = await api.get('/api/security/profile');
      console.log('✅ Security Profile API response:', response);
      
      // Handle the ApiResponse wrapper from Spring Boot
      if (response.data && response.data.success !== undefined) {
        console.log('✅ Security profile data:', response.data.data);
        return {
          success: true,
          data: response.data.data
        };
      } else {
        // If it's direct data without wrapper
        return {
          success: true,
          data: response.data
        };
      }
    } catch (error) {
      console.error('❌ Error fetching security profile:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch security profile',
        data: null
      };
    }
  },

  // Get approved outpasses
  getApprovedOutpasses: async () => {
    console.log('🔄 Security Service: Fetching approved outpasses...');
    try {
      const response = await api.get('/api/security/outpasses/approved');
      console.log('✅ Approved outpasses API response:', response);
      
      // Handle the ApiResponse wrapper from Spring Boot
      if (response.data && response.data.success !== undefined) {
        console.log('✅ Approved outpasses data:', response.data.data);
        return {
          success: true,
          data: response.data.data || []
        };
      } else if (Array.isArray(response.data)) {
        return {
          success: true,
          data: response.data
        };
      } else {
        console.warn('⚠️ Unexpected response format for approved outpasses:', response);
        return {
          success: false,
          message: 'Unexpected response format',
          data: []
        };
      }
    } catch (error) {
      console.error('❌ Error fetching approved outpasses:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch approved outpasses',
        data: []
      };
    }
  },

  // Get active outpasses
  getActiveOutpasses: async () => {
    console.log('🔄 Security Service: Fetching active outpasses...');
    try {
      const response = await api.get('/api/security/outpasses/active');
      console.log('✅ Active outpasses API response:', response);
      
      // Handle the ApiResponse wrapper
      if (response.data && response.data.success !== undefined) {
        console.log('✅ Active outpasses data:', response.data.data);
        return {
          success: true,
          data: response.data.data || []
        };
      } else if (Array.isArray(response.data)) {
        return {
          success: true,
          data: response.data
        };
      } else {
        console.warn('⚠️ Unexpected response format for active outpasses:', response);
        return {
          success: false,
          message: 'Unexpected response format',
          data: []
        };
      }
    } catch (error) {
      console.error('❌ Error fetching active outpasses:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch active outpasses',
        data: []
      };
    }
  },

  // Get specific outpass
  getOutpass: async (id) => {
    console.log('🔄 Security Service: Fetching outpass:', id);
    try {
      const response = await api.get(`/api/security/outpass/${id}`);
      
      if (response.data && response.data.success !== undefined) {
        return {
          success: true,
          data: response.data.data
        };
      } else {
        return {
          success: true,
          data: response.data
        };
      }
    } catch (error) {
      console.error('❌ Error fetching outpass:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch outpass details'
      };
    }
  },

  // Mark departure
  markDeparture: async (id, comments) => {
    console.log('🔄 Security Service: Marking departure for:', id);
    try {
      const response = await api.put(`/api/security/outpass/${id}/departure`, { 
        comments: comments || 'Student departed' 
      });
      console.log('✅ Departure marked response:', response);
      
      if (response.data && response.data.success !== undefined) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        return {
          success: true,
          data: response.data
        };
      }
    } catch (error) {
      console.error('❌ Error marking departure:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to mark departure'
      };
    }
  },

  // mark return
markReturn: async (id, comments, lateReturnReason) => {
  console.log('🔄 Security Service: Marking return for:', id);
  try {
    const requestData = { 
      comments: comments || 'Student returned'
    };
    
    // Add lateReturnReason if provided
    if (lateReturnReason) {
      requestData.lateReturnReason = lateReturnReason;
    }
    
    const response = await api.put(`/api/security/outpass/${id}/return`, requestData);
    console.log('✅ Return marked response:', response);
    
    if (response.data && response.data.success !== undefined) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } else {
      return {
        success: true,
        data: response.data
      };
    }
  } catch (error) {
    console.error('❌ Error marking return:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to mark return'
    };
  }
},

  // Get dashboard data
  getDashboard: async () => {
    console.log('🔄 Security Service: Fetching dashboard...');
    try {
      const response = await api.get('/api/security/dashboard');
      console.log('✅ Dashboard API response:', response);
      
      if (response.data && response.data.success !== undefined) {
        console.log('📊 Dashboard data received:', response.data.data);
        return {
          success: true,
          data: response.data.data
        };
      } else {
        return {
          success: true,
          data: response.data
        };
      }
    } catch (error) {
      console.error('❌ Error fetching dashboard:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to load dashboard',
        data: null
      };
    }
  },

  // Get today's activity
  getTodayActivity: async () => {
    console.log('🔄 Security Service: Fetching today activity...');
    try {
      const response = await api.get('/api/security/today');
      
      if (response.data && response.data.success !== undefined) {
        return {
          success: true,
          data: response.data.data
        };
      } else {
        return {
          success: true,
          data: response.data
        };
      }
    } catch (error) {
      console.error('❌ Error fetching today activity:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to load today activity'
      };
    }
  },
};
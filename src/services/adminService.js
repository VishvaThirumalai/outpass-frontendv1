// src/services/adminService.js
import api from './api';

export const adminService = {
  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get('/api/admin/health');
      return response;
    } catch (error) {
      console.error('Health check failed:', error);
      throw new Error('Backend is not running');
    }
  },

  getDashboardStats: async () => {
    try {
      const response = await api.get('/api/admin/dashboard-stats');
      console.log('📊 Dashboard stats raw response:', response);
      
      // Handle different response formats
      if (response && response.data) {
        console.log('📊 Response data structure:', response.data);
        
        // Format 1: Direct data object
        if (response.data.data && typeof response.data.data === 'object') {
          console.log('✅ Using response.data.data');
          return response.data.data;
        }
        // Format 2: Direct stats in response.data
        else if (response.data.students !== undefined || response.data.totalUsers !== undefined) {
          console.log('✅ Using response.data directly');
          return response.data;
        }
        // Format 3: Success with data
        else if (response.data.success && response.data.data) {
          console.log('✅ Using success.data format');
          return response.data.data;
        }
      }
      
      console.error('❌ Invalid response format:', response);
      throw new Error('Invalid response format from dashboard stats endpoint');
    } catch (error) {
      console.error('❌ Error fetching dashboard stats:', error);
      throw error;
    }
  },

  getMyPermissionLevel: async () => {
    try {
      const response = await api.get('/api/admin/my-permission');
      console.log('🔐 Permission level raw response:', response);
      
      if (response && response.data) {
        console.log('🔐 Permission data structure:', response.data);
        
        // Format 1: Direct data object
        if (response.data.data && response.data.data.permissionLevel) {
          console.log('✅ Using response.data.data.permissionLevel');
          return response.data.data;
        }
        // Format 2: Direct permissionLevel in response.data
        else if (response.data.permissionLevel) {
          console.log('✅ Using response.data directly');
          return response.data;
        }
        // Format 3: Success with data
        else if (response.data.success && response.data.data) {
          console.log('✅ Using success.data format');
          return response.data.data;
        }
      }
      
      console.error('❌ Invalid permission response format:', response);
      throw new Error('Invalid response format from permission level endpoint');
    } catch (error) {
      console.error('❌ Error fetching permission level:', error);
      throw error;
    }
  },

  // Admin Management - Fixed CRUD operations
  getAllAdmins: async () => {
    try {
      const response = await api.get('/api/admin/admins');
      console.log('Admins API response:', response);
      
      // Handle response format
      if (response && response.data) {
        if (response.data.success && Array.isArray(response.data.data)) {
          return response.data.data;
        } else if (Array.isArray(response.data.data)) {
          return response.data.data;
        } else if (Array.isArray(response.data)) {
          return response.data;
        }
      }
      throw new Error('Invalid response format from admins endpoint');
    } catch (error) {
      console.error('Error fetching admins:', error);
      throw error;
    }
  },

  createAdmin: async (adminData) => {
    try {
      console.log('🔄 Creating admin with data:', adminData);
      const response = await api.post('/api/admin/admins', adminData);
      
      console.log('✅ Create admin response:', response);
      
      if (response && response.data) {
        if (response.data.success) {
          return {
            success: true,
            message: response.data.message,
            data: response.data.data
          };
        } else {
          throw new Error(response.data.message || 'Failed to create admin');
        }
      } else {
        throw new Error('Invalid response format from create admin endpoint');
      }
    } catch (error) {
      console.error('❌ Error creating admin:', error);
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || error.response.data.data?.message || 'Failed to create admin');
      }
      throw error;
    }
  },

  updateAdmin: async (adminId, adminData) => {
    try {
      console.log('🔄 Updating admin with ID:', adminId, 'Data:', adminData);
      const response = await api.put(`/api/admin/admins/${adminId}`, adminData);
      
      console.log('✅ Update admin response:', response);
      
      if (response && response.data) {
        if (response.data.success) {
          return {
            success: true,
            message: response.data.message,
            data: response.data.data
          };
        } else {
          throw new Error(response.data.message || 'Failed to update admin');
        }
      } else {
        throw new Error('Invalid response format from update admin endpoint');
      }
    } catch (error) {
      console.error('❌ Error updating admin:', error);
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || error.response.data.data?.message || 'Failed to update admin');
      }
      throw error;
    }
  },

  deleteAdmin: async (adminId) => {
    try {
      console.log('🔄 Deleting admin with ID:', adminId);
      const response = await api.delete(`/api/admin/admins/${adminId}`);
      
      console.log('✅ Delete admin response:', response);
      
      if (response && response.data) {
        if (response.data.success) {
          return {
            success: true,
            message: response.data.message
          };
        } else {
          throw new Error(response.data.message || 'Failed to delete admin');
        }
      } else {
        throw new Error('Invalid response format from delete admin endpoint');
      }
    } catch (error) {
      console.error('❌ Error deleting admin:', error);
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || error.response.data.data?.message || 'Failed to delete admin');
      }
      throw error;
    }
  },

  toggleAdminStatus: async (adminId, active) => {
    try {
      console.log('🔄 Toggling admin status:', adminId, 'Active:', active);
      const response = await api.patch(`/api/admin/admins/${adminId}/status`, { active });
      
      console.log('✅ Toggle admin status response:', response);
      
      if (response && response.data) {
        if (response.data.success) {
          return {
            success: true,
            message: response.data.message,
            data: response.data.data
          };
        } else {
          throw new Error(response.data.message || 'Failed to update admin status');
        }
      } else {
        throw new Error('Invalid response format from toggle admin status endpoint');
      }
    } catch (error) {
      console.error('❌ Error toggling admin status:', error);
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || error.response.data.data?.message || 'Failed to update admin status');
      }
      throw error;
    }
  },

  // Get all students data
  getAllStudents: async () => {
    try {
      const response = await api.get('/api/admin/students');
      console.log('Students API response:', response);
      
      // Handle response format
      if (response && response.data) {
        if (response.data.success && Array.isArray(response.data.data)) {
          return response.data.data;
        } else if (Array.isArray(response.data.data)) {
          return response.data.data;
        } else if (Array.isArray(response.data)) {
          return response.data;
        }
      }
      throw new Error('Invalid response format from students endpoint');
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  },

  // Get all wardens data
  getAllWardens: async () => {
    try {
      const response = await api.get('/api/admin/wardens');
      console.log('Wardens API response:', response);
      
      // Handle response format
      if (response && response.data) {
        if (response.data.success && Array.isArray(response.data.data)) {
          return response.data.data;
        } else if (Array.isArray(response.data.data)) {
          return response.data.data;
        } else if (Array.isArray(response.data)) {
          return response.data;
        }
      }
      throw new Error('Invalid response format from wardens endpoint');
    } catch (error) {
      console.error('Error fetching wardens:', error);
      throw error;
    }
  },

  // Get all security data
  getAllSecurity: async () => {
    try {
      const response = await api.get('/api/admin/security');
      console.log('Security API response:', response);
      
      // Handle response format
      if (response && response.data) {
        if (response.data.success && Array.isArray(response.data.data)) {
          return response.data.data;
        } else if (Array.isArray(response.data.data)) {
          return response.data.data;
        } else if (Array.isArray(response.data)) {
          return response.data;
        }
      }
      throw new Error('Invalid response format from security endpoint');
    } catch (error) {
      console.error('Error fetching security:', error);
      throw error;
    }
  },

 // In adminService.js - Replace the updateUser function with this:
updateUser: async (userId, userData) => {
  try {
    console.log('🔄 Updating user with ID:', userId, 'Data:', userData);
    const response = await api.put(`/api/admin/users/${userId}`, userData);
    
    console.log('✅ Update user RAW response:', response);
    
    // Handle different response formats consistently
    if (response && response.data) {
      const responseData = response.data;
      
      // Format 1: Direct success with data
      if (responseData.success === true) {
        return {
          success: true,
          message: responseData.message || 'User updated successfully',
          data: responseData.data || responseData
        };
      }
      // Format 2: Just data object (no success flag)
      else if (responseData.id || responseData.username) {
        return {
          success: true,
          message: 'User updated successfully',
          data: responseData
        };
      }
      // Format 3: HTTP 200 but no specific format
      else {
        return {
          success: true,
          message: 'User updated successfully',
          data: responseData
        };
      }
    } else {
      // If no response data but request was successful
      return {
        success: true,
        message: 'User updated successfully',
        data: null
      };
    }
  } catch (error) {
    console.error('❌ Error updating user:', error);
    
    // Extract error message from different error formats
    let errorMessage = 'Failed to update user';
    
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      errorMessage = errorData.message || 
                    errorData.error || 
                    errorData.data?.message || 
                    'Failed to update user';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
},

  deleteUser: async (userId) => {
    try {
      console.log('🔄 Deleting user with ID:', userId);
      const response = await api.delete(`/api/admin/users/${userId}`);
      
      console.log('✅ Delete user response:', response);
      
      if (response && response.data) {
        if (response.data.success) {
          return {
            success: true,
            message: response.data.message
          };
        } else {
          throw new Error(response.data.message || 'Failed to delete user');
        }
      } else {
        throw new Error('Invalid response format from delete user endpoint');
      }
    } catch (error) {
      console.error('❌ Error deleting user:', error);
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || error.response.data.data?.message || 'Failed to delete user');
      }
      throw error;
    }
  },

 toggleUserStatus: async (userId, active) => {
  try {
    console.log('🔄 Toggling user status:', userId, 'Active:', active);
    const response = await api.patch(`/api/admin/users/${userId}/status`, { active });
    
    console.log('✅ Toggle user status RAW response:', response);
    
    if (response && response.data) {
      const responseData = response.data;
      
      // Handle different response formats
      if (responseData.success === true) {
        return {
          success: true,
          message: responseData.message || 'User status updated successfully',
          data: responseData.data || responseData
        };
      }
      // If no success flag but response exists, assume success
      else {
        return {
          success: true,
          message: 'User status updated successfully',
          data: responseData
        };
      }
    } else {
      return {
        success: true,
        message: 'User status updated successfully',
        data: null
      };
    }
  } catch (error) {
    console.error('❌ Error toggling user status:', error);
    
    let errorMessage = 'Failed to update user status';
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      errorMessage = errorData.message || 
                    errorData.error || 
                    errorData.data?.message || 
                    'Failed to update user status';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
},

  // User Registration
  registerUser: async (userData) => {
    try {
      const response = await api.post('/api/admin/register-user', userData);
      return response;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  // Register specific user types
  registerStudent: async (studentData) => {
    try {
      const response = await api.post('/api/admin/register/student', studentData);
      return response;
    } catch (error) {
      console.error('Error registering student:', error);
      throw error;
    }
  },

  registerWarden: async (wardenData) => {
    try {
      const response = await api.post('/api/admin/register/warden', wardenData);
      return response;
    } catch (error) {
      console.error('Error registering warden:', error);
      throw error;
    }
  },

  registerSecurity: async (securityData) => {
    try {
      const response = await api.post('/api/admin/register/security', securityData);
      return response;
    } catch (error) {
      console.error('Error registering security:', error);
      throw error;
    }
  },

  // Password Management
  resetUserPassword: async (username, newPassword) => {
    try {
      const response = await api.post('/api/admin/reset-user-password', {
        username,
        newPassword
      });
      return response;
    } catch (error) {
      console.error('Error resetting user password:', error);
      throw error;
    }
  },

  simplePasswordReset: async (username, mobileNumber, newPassword) => {
    try {
      console.log('🔐 Sending password reset request for:', username);
      
      const response = await api.post('/auth/simple-reset-password', {
        username,
        mobileNumber,
        newPassword
      });
      
      console.log('✅ Simple password reset FULL response:', response);
      
      // Handle Spring Boot response format
      if (response.data) {
        console.log('🔍 Response data structure:', response.data);
        
        // Format 1: Direct success in response.data
        if (response.data.success === true) {
          console.log('✅ Format 1: Direct success in response.data');
          return {
            success: true,
            message: response.data.message || 'Password reset successfully'
          };
        }
        
        // Format 2: Success in response.data.data
        else if (response.data.data && response.data.data.success === true) {
          console.log('✅ Format 2: Success in response.data.data');
          return {
            success: true,
            message: response.data.data.message || response.data.message || 'Password reset successfully'
          };
        }
        
        // Format 3: Just return the data as is
        else if (response.data.data) {
          console.log('✅ Format 3: Returning response.data.data');
          return response.data.data;
        }
        
        // Format 4: Return the response data directly
        else {
          console.log('✅ Format 4: Returning response.data directly');
          return response.data;
        }
      }
      
      // If response exists but no data structure matches
      console.log('✅ Format 5: Returning generic success');
      return {
        success: true,
        message: 'Password reset successfully'
      };
      
    } catch (error) {
      console.error('❌ Error in simple password reset:', error);
      
      if (error.response && error.response.data) {
        const serverMessage = error.response.data.message || 
                             error.response.data.data?.message || 
                             'Password reset failed. Please verify username and mobile number.';
        throw new Error(serverMessage);
      } else if (error.request) {
        throw new Error('Network error. Please check your connection.');
      } else {
        throw new Error(error.message || 'An unexpected error occurred.');
      }
    }
  }
};

export default adminService;
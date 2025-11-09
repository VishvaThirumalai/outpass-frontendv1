// src/components/admin/AdminManagement.js
import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { FiUserPlus, FiEdit, FiTrash2, FiUser, FiMail, FiPhone, FiShield, FiRefreshCw } from 'react-icons/fi';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    department: 'Administration',
    designation: 'System Administrator',
    permissionLevel: 'MODERATOR'
  });

  const permissionLevels = [
    { value: 'SUPER_ADMIN', label: 'Super Admin', color: 'bg-red-100 text-red-800' },
    { value: 'ADMIN', label: 'Admin', color: 'bg-purple-100 text-purple-800' },
    { value: 'MODERATOR', label: 'Moderator', color: 'bg-blue-100 text-blue-800' },
    { value: 'VIEWER', label: 'Viewer', color: 'bg-gray-100 text-gray-800' }
  ];

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await adminService.getAllAdmins();
      console.log('Admins response:', response);
      
      if (Array.isArray(response)) {
        setAdmins(response);
      } else if (response && response.success && Array.isArray(response.data)) {
        setAdmins(response.data);
      } else if (response && Array.isArray(response.data)) {
        setAdmins(response.data);
      } else {
        throw new Error('Invalid response format for admins');
      }
      
    } catch (err) {
      console.error('Error fetching admins:', err);
      setError(`Failed to fetch admins: ${err.message}`);
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      const adminData = {
        fullName: formData.fullName,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        department: formData.department,
        designation: formData.designation,
        permissionLevel: formData.permissionLevel
      };

      console.log('🔄 Submitting admin data:', adminData);
      
      let response;
      if (editingAdmin) {
        response = await adminService.updateAdmin(editingAdmin.id, adminData);
      } else {
        response = await adminService.createAdmin(adminData);
      }
      
      console.log('✅ Admin operation response:', response);
      
      if (response && response.success) {
        await fetchAdmins();
        resetForm();
        alert(`Admin ${editingAdmin ? 'updated' : 'created'} successfully!`);
      } else {
        throw new Error(response?.message || `Failed to ${editingAdmin ? 'update' : 'create'} admin`);
      }
      
    } catch (err) {
      console.error('❌ Admin operation error:', err);
      setError(err.message || `Failed to ${editingAdmin ? 'update' : 'create'} admin. Please try again.`);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      mobileNumber: '',
      department: 'Administration',
      designation: 'System Administrator',
      permissionLevel: 'MODERATOR'
    });
    setEditingAdmin(null);
    setShowAddForm(false);
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setFormData({
      fullName: admin.fullName || '',
      email: admin.email || '',
      mobileNumber: admin.mobileNumber || '',
      department: admin.department || 'Administration',
      designation: admin.designation || 'System Administrator',
      permissionLevel: admin.permissionLevel || 'MODERATOR'
    });
    setShowAddForm(true);
  };

  const handleDelete = async (adminId) => {
    if (window.confirm('Are you sure you want to delete this admin? This action cannot be undone.')) {
      try {
        setLoading(true);
        setError('');
        
        const response = await adminService.deleteAdmin(adminId);
        
        if (response && response.success) {
          await fetchAdmins();
          alert('Admin deleted successfully!');
        } else {
          throw new Error(response?.message || 'Failed to delete admin');
        }
        
      } catch (err) {
        console.error('❌ Delete admin error:', err);
        setError(err.message || 'Failed to delete admin. Please try again.');
        alert(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleStatus = async (adminId) => {
    try {
      setLoading(true);
      setError('');
      
      const admin = admins.find(a => a.id === adminId);
      const newStatus = !admin.active;
      
      const response = await adminService.toggleAdminStatus(adminId, newStatus);
      
      if (response && response.success) {
        await fetchAdmins();
        alert(`Admin ${newStatus ? 'activated' : 'deactivated'} successfully!`);
      } else {
        throw new Error(response?.message || 'Failed to update admin status');
      }
      
    } catch (err) {
      console.error('❌ Toggle admin status error:', err);
      setError(err.message || 'Failed to update admin status. Please try again.');
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getPermissionColor = (level) => {
    const permission = permissionLevels.find(p => p.value === level);
    return permission ? permission.color : 'bg-gray-100 text-gray-800';
  };

  const getPermissionLabel = (level) => {
    const permission = permissionLevels.find(p => p.value === level);
    return permission ? permission.label : level;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Management</h1>
              <p className="text-gray-600 mt-2">
                Manage administrative users and their permissions
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchAdmins}
                disabled={loading}
                className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <FiUserPlus className="w-5 h-5" />
                <span>Add Admin</span>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-red-600">⚠️ {error}</span>
              </div>
              <button 
                onClick={fetchAdmins} 
                className="ml-4 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Admin Form Modal */}
        {(showAddForm || editingAdmin) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingAdmin ? 'Edit Admin' : 'Add New Admin'}
                </h3>
                <button 
                  onClick={resetForm}
                  disabled={loading}
                  className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Designation
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permission Level *
                  </label>
                  <select
                    name="permissionLevel"
                    value={formData.permissionLevel}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {permissionLevels.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button 
                    type="button" 
                    onClick={resetForm}
                    disabled={loading}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : editingAdmin ? 'Update Admin' : 'Create Admin'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Admins List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Administrative Users ({admins.length})
            </h3>
          </div>

          <div className="overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                <span className="text-gray-600">Loading admins...</span>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {admins.map((admin) => (
                  <div key={admin.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          <FiShield className="w-6 h-6" />
                        </div>
                        
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="text-lg font-semibold text-gray-900">
                              {admin.fullName}
                            </h4>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPermissionColor(admin.permissionLevel)}`}>
                              {getPermissionLabel(admin.permissionLevel)}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <FiMail className="w-4 h-4" />
                              <span>{admin.email}</span>
                            </div>
                            {admin.mobileNumber && (
                              <div className="flex items-center space-x-1">
                                <FiPhone className="w-4 h-4" />
                                <span>{admin.mobileNumber}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-4 mt-2">
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                              admin.active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              <FiUser className="w-3 h-3 mr-1" />
                              {admin.active ? 'Active' : 'Inactive'}
                            </span>
                            <span className="text-xs text-gray-500">
                              Created: {new Date(admin.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(admin)}
                          className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200 transition-colors"
                          disabled={loading}
                        >
                          <FiEdit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        
                        <button
                          onClick={() => handleToggleStatus(admin.id)}
                          className={`flex items-center space-x-1 px-3 py-2 rounded-lg border transition-colors ${
                            admin.active 
                              ? 'text-orange-600 border-orange-200 hover:bg-orange-50' 
                              : 'text-green-600 border-green-200 hover:bg-green-50'
                          }`}
                          disabled={loading}
                        >
                          <FiUser className="w-4 h-4" />
                          <span>{admin.active ? 'Deactivate' : 'Activate'}</span>
                        </button>
                        
                        <button
                          onClick={() => handleDelete(admin.id)}
                          className="flex items-center space-x-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                          disabled={loading}
                        >
                          <FiTrash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {admins.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-4xl mb-4">👥</div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No admins found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by creating your first administrative user.
                    </p>
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="mt-4 inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      <FiUserPlus className="w-4 h-4" />
                      <span>Add Admin</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminManagement;
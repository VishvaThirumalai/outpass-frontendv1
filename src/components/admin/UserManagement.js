// src/components/admin/UserManagement.js
import React, { useState, useEffect, useCallback } from 'react';
import { adminService } from '../../services/adminService';
import { FiEdit, FiTrash2, FiUser, FiMail, FiPhone, FiBook, FiHome, FiBriefcase, FiShield, FiRefreshCw } from 'react-icons/fi';

const UserManagement = ({ permissionLevel }) => {
  const [activeTab, setActiveTab] = useState('students');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [userCounts, setUserCounts] = useState({
    students: 0,
    wardens: 0,
    security: 0,
    admins: 0
  });
  const [searchTerm, setSearchTerm] = useState('');

  const isSuperAdmin = permissionLevel === 'SUPER_ADMIN';
  const isAdmin = permissionLevel === 'ADMIN' || isSuperAdmin;

  const fetchUsers = useCallback(async (type) => {
  try {
    setLoading(true);
    setError('');
    
    let userList = [];
    
    console.log(`🔄 Fetching ${type}...`);
    
    switch (type) {
      case 'students':
        userList = await adminService.getAllStudents();
        break;
      case 'wardens':
        userList = await adminService.getAllWardens();
        break;
      case 'security':
        userList = await adminService.getAllSecurity();
        break;
      case 'admins':
        if (isSuperAdmin) {
          userList = await adminService.getAllAdmins();
        } else {
          throw new Error('Access denied. SUPER_ADMIN permission required.');
        }
        break;
      default:
        return;
    }
    
    console.log(`✅ Raw response for ${type}:`, userList);
    
    // Handle the response format from adminService methods
    if (Array.isArray(userList)) {
      // Direct array response (already processed by service)
      console.log(`✅ Got ${userList.length} ${type}`);
    } else if (userList && userList.success && Array.isArray(userList.data)) {
      // Success object with data array
      userList = userList.data;
      console.log(`✅ Got ${userList.length} ${type} from success.data`);
    } else if (userList && Array.isArray(userList.data)) {
      // Direct data array
      userList = userList.data;
      console.log(`✅ Got ${userList.length} ${type} from data array`);
    } else if (userList && userList.data && Array.isArray(userList.data.users)) {
      // Nested users array
      userList = userList.data.users;
      console.log(`✅ Got ${userList.length} ${type} from data.users`);
    } else {
      console.warn(`⚠️ Unexpected response format for ${type}:`, userList);
      userList = [];
    }
    
    // Ensure we have a valid array
    if (!Array.isArray(userList)) {
      console.error(`❌ Expected array for ${type}, got:`, typeof userList);
      userList = [];
    }
    
    console.log(`✅ Final ${type} list:`, userList);
    setUsers(userList);
    
    // Update counts
    setUserCounts(prev => ({
      ...prev,
      [type]: userList.length
    }));
    
  } catch (err) {
    console.error(`❌ Error fetching ${type}:`, err);
    const errorMessage = `Failed to fetch ${type}: ${err.message}`;
    setError(errorMessage);
    setUsers([]);
    
    // Also update counts to 0 on error
    setUserCounts(prev => ({
      ...prev,
      [type]: 0
    }));
  } finally {
    setLoading(false);
  }
}, [isSuperAdmin]);

  useEffect(() => {
    fetchUsers(activeTab);
  }, [activeTab, fetchUsers]);

  const filteredUsers = users.filter(user => 
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.securityId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.adminId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (user) => {
    if (!isAdmin) {
      alert('You need ADMIN or higher permissions to edit users.');
      return;
    }
    
    setEditingUser(user);
    setEditFormData({
      fullName: user.fullName || '',
      email: user.email || '',
      mobileNumber: user.mobileNumber || '',
      rollNumber: user.rollNumber || '',
      course: user.course || '',
      yearOfStudy: user.yearOfStudy || '',
      hostelName: user.hostelName || '',
      roomNumber: user.roomNumber || '',
      department: user.department || '',
      designation: user.designation || '',
      hostelAssigned: user.hostelAssigned || '',
      shift: user.shift || '',
      gateAssigned: user.gateAssigned || '',
      adminId: user.adminId || '',
      permissionLevel: user.permissionLevel || 'MODERATOR'
    });
  };

  const handleUpdate = async (e) => {
  e.preventDefault();
  if (!isAdmin) {
    alert('You need ADMIN or higher permissions to edit users.');
    return;
  }

  try {
    setLoading(true);
    setError('');
    
    const updateData = {
      fullName: editFormData.fullName,
      email: editFormData.email,
      mobileNumber: editFormData.mobileNumber
    };

    // Add role-specific fields
    if (activeTab === 'students') {
      updateData.course = editFormData.course;
      updateData.yearOfStudy = editFormData.yearOfStudy;
      updateData.hostelName = editFormData.hostelName;
      updateData.roomNumber = editFormData.roomNumber;
    } else if (activeTab === 'wardens') {
      updateData.department = editFormData.department;
      updateData.designation = editFormData.designation;
      updateData.hostelAssigned = editFormData.hostelAssigned;
    } else if (activeTab === 'security') {
      updateData.shift = editFormData.shift;
      updateData.gateAssigned = editFormData.gateAssigned;
    } else if (activeTab === 'admins' && isSuperAdmin) {
      updateData.department = editFormData.department;
      updateData.designation = editFormData.designation;
      updateData.permissionLevel = editFormData.permissionLevel;
    }

    console.log('🔄 Updating user ID:', editingUser.id);
    console.log('🔄 Update data:', updateData);
    
    // Call the update service
    const result = await adminService.updateUser(editingUser.id, updateData);
    
    console.log('✅ Update service result:', result);
    
    // SIMPLIFIED SUCCESS CHECK - just check if we got a result without error
    if (result) {
      const successMessage = result.message || 'User updated successfully!';
      console.log('✅ Update successful:', successMessage);
      
      alert(successMessage);
      
      // Force refresh the user list
      await fetchUsers(activeTab);
      
      // Close the edit modal
      setEditingUser(null);
      setEditFormData({});
    } else {
      throw new Error('No response received from server');
    }
    
  } catch (err) {
    console.error('❌ Update error:', err);
    const errorMessage = err.message || 'Failed to update user. Please try again.';
    setError(errorMessage);
    alert(`Error: ${errorMessage}`);
  } finally {
    setLoading(false);
  }
};

  const handleDelete = async (userId) => {
    if (!isAdmin) {
      alert('You need ADMIN or higher permissions to delete users.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        setLoading(true);
        setError('');
        
        const response = await adminService.deleteUser(userId);
        
        if (response && response.success) {
          await fetchUsers(activeTab);
          alert('User deleted successfully!');
        } else {
          throw new Error(response?.message || 'Failed to delete user');
        }
        
      } catch (err) {
        console.error('❌ Delete error:', err);
        setError(err.message || 'Failed to delete user. Please try again.');
        alert(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleStatus = async (userId) => {
  if (!isAdmin) {
    alert('You need ADMIN or higher permissions to change user status.');
    return;
  }

  try {
    setLoading(true);
    setError('');
    
    const user = users.find(u => u.id === userId);
    const newStatus = !user.active;
    
    console.log('🔄 Toggling status for user:', userId, 'to:', newStatus);
    
    const result = await adminService.toggleUserStatus(userId, newStatus);
    
    console.log('✅ Toggle status result:', result);
    
    // SIMPLIFIED SUCCESS CHECK
    if (result) {
      const successMessage = result.message || `User ${newStatus ? 'activated' : 'deactivated'} successfully!`;
      console.log('✅ Status toggle successful:', successMessage);
      
      alert(successMessage);
      await fetchUsers(activeTab);
    } else {
      throw new Error('No response received from server');
    }
    
  } catch (err) {
    console.error('❌ Toggle status error:', err);
    const errorMessage = err.message || 'Failed to update user status. Please try again.';
    setError(errorMessage);
    alert(`Error: ${errorMessage}`);
  } finally {
    setLoading(false);
  }
};
  // Define available tabs based on permission
  const availableTabs = [
    { id: 'students', label: 'Students', count: userCounts.students, color: 'blue' },
    { id: 'wardens', label: 'Wardens', count: userCounts.wardens, color: 'green' },
    { id: 'security', label: 'Security', count: userCounts.security, color: 'orange' },
  ];

  // Add admins tab only for SUPER_ADMIN
  if (isSuperAdmin) {
    availableTabs.push({ id: 'admins', label: 'Admins', count: userCounts.admins, color: 'purple' });
  }

  const getTabColor = (color) => {
    const colors = {
      blue: 'bg-blue-600 text-white',
      green: 'bg-green-600 text-white',
      orange: 'bg-orange-600 text-white',
      purple: 'bg-purple-600 text-white'
    };
    return colors[color] || 'bg-gray-600 text-white';
  };

  const renderStudentTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Info</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academic</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hostel</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            {isAdmin && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredUsers.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    <FiUser className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                    <div className="text-sm text-gray-500 font-mono">{user.rollNumber || 'N/A'}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{user.email}</div>
                <div className="text-sm text-gray-500">{user.mobileNumber || 'N/A'}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{user.course || 'N/A'}</div>
                <div className="text-sm text-gray-500">Year {user.yearOfStudy || 'N/A'}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{user.hostelName || 'N/A'}</div>
                <div className="text-sm text-gray-500">Room {user.roomNumber || 'N/A'}</div>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.active ? 'Active' : 'Inactive'}
                </span>
              </td>
              {isAdmin && (
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(user)} className="text-blue-600 hover:text-blue-900" disabled={loading}>
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleToggleStatus(user.id)} className="text-orange-600 hover:text-orange-900" disabled={loading}>
                      <FiUser className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900" disabled={loading}>
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderWardenTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warden Info</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Professional</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            {isAdmin && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredUsers.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    <FiBriefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                    <div className="text-sm text-gray-500 font-mono">{user.employeeId || 'N/A'}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{user.email}</div>
                <div className="text-sm text-gray-500">{user.mobileNumber || 'N/A'}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{user.department || 'N/A'}</div>
                <div className="text-sm text-gray-500">{user.designation || 'N/A'}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{user.hostelAssigned || 'N/A'}</div>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.active ? 'Active' : 'Inactive'}
                </span>
              </td>
              {isAdmin && (
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(user)} className="text-blue-600 hover:text-blue-900" disabled={loading}>
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleToggleStatus(user.id)} className="text-orange-600 hover:text-orange-900" disabled={loading}>
                      <FiUser className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900" disabled={loading}>
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderSecurityTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Security Info</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gate</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            {isAdmin && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredUsers.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    <FiShield className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                    <div className="text-sm text-gray-500 font-mono">{user.securityId || 'N/A'}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{user.email}</div>
                <div className="text-sm text-gray-500">{user.mobileNumber || 'N/A'}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{user.shift || 'N/A'}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{user.gateAssigned || 'N/A'}</div>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.active ? 'Active' : 'Inactive'}
                </span>
              </td>
              {isAdmin && (
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(user)} className="text-blue-600 hover:text-blue-900" disabled={loading}>
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleToggleStatus(user.id)} className="text-orange-600 hover:text-orange-900" disabled={loading}>
                      <FiUser className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900" disabled={loading}>
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderAdminTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin Info</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permission</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            {isSuperAdmin && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredUsers.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    <FiUser className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                    <div className="text-sm text-gray-500 font-mono">{user.adminId || 'N/A'}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{user.email}</div>
                <div className="text-sm text-gray-500">{user.mobileNumber || 'N/A'}</div>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  user.permissionLevel === 'SUPER_ADMIN' ? 'bg-red-100 text-red-800' :
                  user.permissionLevel === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                  user.permissionLevel === 'MODERATOR' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {user.permissionLevel || 'MODERATOR'}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.active ? 'Active' : 'Inactive'}
                </span>
              </td>
              {isSuperAdmin && (
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(user)} className="text-blue-600 hover:text-blue-900" disabled={loading}>
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleToggleStatus(user.id)} className="text-orange-600 hover:text-orange-900" disabled={loading}>
                      <FiUser className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900" disabled={loading}>
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderEditModal = () => {
    if (!editingUser) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">
              Edit {activeTab.slice(0, -1)}: {editingUser.fullName}
            </h3>
            <button 
              onClick={() => setEditingUser(null)}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
            >
              ✕
            </button>
          </div>
          
          <form onSubmit={handleUpdate} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={editFormData.fullName}
                  onChange={(e) => setEditFormData({...editFormData, fullName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                <input
                  type="tel"
                  value={editFormData.mobileNumber}
                  onChange={(e) => setEditFormData({...editFormData, mobileNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {activeTab === 'students' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Roll Number</label>
                    <input
                      type="text"
                      value={editFormData.rollNumber}
                      onChange={(e) => setEditFormData({...editFormData, rollNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                    <input
                      type="text"
                      value={editFormData.course}
                      onChange={(e) => setEditFormData({...editFormData, course: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year of Study</label>
                    <input
                      type="number"
                      value={editFormData.yearOfStudy}
                      onChange={(e) => setEditFormData({...editFormData, yearOfStudy: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hostel Name</label>
                    <input
                      type="text"
                      value={editFormData.hostelName}
                      onChange={(e) => setEditFormData({...editFormData, hostelName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Room Number</label>
                    <input
                      type="text"
                      value={editFormData.roomNumber}
                      onChange={(e) => setEditFormData({...editFormData, roomNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </>
              )}

              {activeTab === 'wardens' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <input
                      type="text"
                      value={editFormData.department}
                      onChange={(e) => setEditFormData({...editFormData, department: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                    <input
                      type="text"
                      value={editFormData.designation}
                      onChange={(e) => setEditFormData({...editFormData, designation: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hostel Assigned</label>
                    <input
                      type="text"
                      value={editFormData.hostelAssigned}
                      onChange={(e) => setEditFormData({...editFormData, hostelAssigned: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </>
              )}

              {activeTab === 'security' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Shift</label>
                    <input
                      type="text"
                      value={editFormData.shift}
                      onChange={(e) => setEditFormData({...editFormData, shift: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gate Assigned</label>
                    <input
                      type="text"
                      value={editFormData.gateAssigned}
                      onChange={(e) => setEditFormData({...editFormData, gateAssigned: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </>
              )}

              {activeTab === 'admins' && isSuperAdmin && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Admin ID</label>
                    <input
                      type="text"
                      value={editFormData.adminId}
                      onChange={(e) => setEditFormData({...editFormData, adminId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Permission Level</label>
                    <select
                      value={editFormData.permissionLevel}
                      onChange={(e) => setEditFormData({...editFormData, permissionLevel: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="MODERATOR">Moderator</option>
                      <option value="ADMIN">Admin</option>
                      <option value="SUPER_ADMIN">Super Admin</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button 
                type="button" 
                onClick={() => setEditingUser(null)}
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
                {loading ? 'Updating...' : 'Update User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600 mt-2">
                Manage system users - {isSuperAdmin ? 'Full Access' : isAdmin ? 'Admin Access' : 'View Only'}
                {!isAdmin && <span className="ml-2 text-sm text-orange-600">(Edit permissions required)</span>}
              </p>
            </div>
            <button
              onClick={() => fetchUsers(activeTab)}
              disabled={loading}
              className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-red-600">⚠️ {error}</span>
              </div>
              <button 
                onClick={() => fetchUsers(activeTab)} 
                className="ml-4 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Tabs and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between p-6 border-b border-gray-200">
            <div className="flex space-x-1 mb-4 md:mb-0">
              {availableTabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? getTabColor(tab.color)
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label} 
                  <span className="ml-2 bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span>🔍</span>
              </div>
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64 transition-colors"
              />
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                <span className="text-gray-600">Loading {activeTab}...</span>
              </div>
            ) : (
              <>
                {activeTab === 'students' && renderStudentTable()}
                {activeTab === 'wardens' && renderWardenTable()}
                {activeTab === 'security' && renderSecurityTable()}
                {activeTab === 'admins' && renderAdminTable()}
                
                {filteredUsers.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-4xl mb-4">👥</div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No {activeTab} found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchTerm ? 'Try adjusting your search terms' : `No ${activeTab} available in the system`}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {renderEditModal()}
    </div>
  );
};

export default UserManagement;
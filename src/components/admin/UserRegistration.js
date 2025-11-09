// src/components/admin/UserRegistration.js
import React, { useState } from 'react';
import { adminService } from '../../services/adminService';

const UserRegistration = ({ onUserRegistered, permissionLevel }) => {
  const [formData, setFormData] = useState({
    userType: 'student',
    // Common fields
    fullName: '',
    email: '',
    mobileNumber: '',
    // Student fields
    rollNumber: '',
    course: '',
    degree: '',
    yearOfStudy: '',
    hostelName: '',
    roomNumber: '',
    address: '',
    guardianName: '',
    guardianMobile: '',
    guardianRelation: '',
    // Warden fields
    employeeId: '',
    department: '',
    designation: '',
    hostelAssigned: '',
    yearsOfExperience: '',
    officeLocation: '',
    officeHours: '',
    // Security fields
    securityId: '',
    shift: '',
    gateAssigned: '',
    supervisorName: '',
    supervisorContact: '',
    yearsOfService: '',
    securityClearanceLevel: '',
    // Admin fields
    adminId: '',
    permissionLevel: 'MODERATOR'
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const isSuperAdmin = permissionLevel === 'SUPER_ADMIN';

  // Enhanced options with all required fields
  const degreeOptions = [
    'B.Tech', 'M.Tech', 'B.Sc', 'M.Sc', 'BBA', 'MBA', 'PhD', 'B.Arch', 'M.Arch', 'B.Com', 'M.Com'
  ];

  const hostelOptions = [
    'Dr Kalam Hostel', 'Raman Hostel', 'Marutham Hostel', 'Kurinji Hostel', 
    'Brilla Hostel', 'Thamirabarani Hostel', 'Bhavani Hostel', 'Kavery Hostel'
  ];

  const courseOptions = [
    'Computer Science & Engineering', 'Mechanical Engineering', 'Electrical Engineering', 
    'Civil Engineering', 'Electronics & Communication', 'Information Technology',
    'Artificial Intelligence', 'Data Science', 'Business Administration', 'Computer Applications'
  ];

  const yearOptions = ['1', '2', '3', '4', '5'];
  const shiftOptions = ['Morning (6 AM - 2 PM)', 'Evening (2 PM - 10 PM)', 'Night (10 PM - 6 AM)'];
  const gateOptions = ['Main Gate', 'North Gate', 'South Gate', 'East Gate', 'West Gate'];
  const departmentOptions = ['Computer Science', 'Mechanical', 'Electrical', 'Civil', 'Electronics', 'Administration'];
  const designationOptions = ['Chief Warden', 'Deputy Warden', 'Assistant Warden', 'Warden'];
  const permissionOptions = ['MODERATOR', 'ADMIN', 'SUPER_ADMIN'];
  const securityClearanceOptions = ['Level 1 - Basic', 'Level 2 - Intermediate', 'Level 3 - Advanced', 'Level 4 - Top Secret'];

  const validateForm = () => {
    const errors = {};

    // Common validations
    if (!formData.fullName?.trim()) errors.fullName = 'Full name is required';
    if (!formData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    if (!formData.mobileNumber?.trim()) {
      errors.mobileNumber = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      errors.mobileNumber = 'Mobile number must be 10 digits';
    }

    // Student specific validations
    if (formData.userType === 'student') {
      if (!formData.rollNumber?.trim()) errors.rollNumber = 'Roll number is required';
      if (!formData.degree?.trim()) errors.degree = 'Degree is required';
      if (!formData.course?.trim()) errors.course = 'Course is required';
      if (!formData.hostelName?.trim()) errors.hostelName = 'Hostel name is required';
      if (!formData.roomNumber?.trim()) errors.roomNumber = 'Room number is required';
    }

    // Warden specific validations
    if (formData.userType === 'warden') {
      if (!formData.employeeId?.trim()) errors.employeeId = 'Employee ID is required';
      if (!formData.department?.trim()) errors.department = 'Department is required';
      if (!formData.designation?.trim()) errors.designation = 'Designation is required';
    }

    // Security specific validations
    if (formData.userType === 'security') {
      if (!formData.securityId?.trim()) errors.securityId = 'Security ID is required';
      if (!formData.shift?.trim()) errors.shift = 'Shift is required';
    }

    // Admin specific validations
    if (formData.userType === 'admin') {
      if (!formData.adminId?.trim()) errors.adminId = 'Admin ID is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    setValidationErrors({});

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      let response;
      
      switch (formData.userType) {
        case 'student':
          response = await adminService.registerStudent({
            fullName: formData.fullName.trim(),
            email: formData.email.trim(),
            mobileNumber: formData.mobileNumber.trim(),
            rollNumber: formData.rollNumber.trim(),
            course: formData.course.trim(),
            degree: formData.degree.trim(),
            yearOfStudy: formData.yearOfStudy ? parseInt(formData.yearOfStudy) : 1,
            hostelName: formData.hostelName.trim(),
            roomNumber: formData.roomNumber.trim(),
            address: formData.address?.trim() || '',
            guardianName: formData.guardianName?.trim() || '',
            guardianMobile: formData.guardianMobile?.trim() || '',
            guardianRelation: formData.guardianRelation?.trim() || ''
          });
          break;
          
        case 'warden':
          response = await adminService.registerWarden({
            fullName: formData.fullName.trim(),
            email: formData.email.trim(),
            mobileNumber: formData.mobileNumber.trim(),
            employeeId: formData.employeeId.trim(),
            department: formData.department.trim(),
            designation: formData.designation.trim(),
            hostelAssigned: formData.hostelAssigned?.trim() || '',
            yearsOfExperience: formData.yearsOfExperience ? parseInt(formData.yearsOfExperience) : 0,
            officeLocation: formData.officeLocation?.trim() || '',
            officeHours: formData.officeHours?.trim() || ''
          });
          break;
          
        case 'security':
          response = await adminService.registerSecurity({
            fullName: formData.fullName.trim(),
            email: formData.email.trim(),
            mobileNumber: formData.mobileNumber.trim(),
            securityId: formData.securityId.trim(),
            shift: formData.shift.trim(),
            gateAssigned: formData.gateAssigned?.trim() || '',
            supervisorName: formData.supervisorName?.trim() || '',
            supervisorContact: formData.supervisorContact?.trim() || '',
            yearsOfService: formData.yearsOfService ? parseInt(formData.yearsOfService) : 0,
            securityClearanceLevel: formData.securityClearanceLevel?.trim() || ''
          });
          break;
          
        case 'admin':
          if (!isSuperAdmin) {
            throw new Error('Only Super Admin can register new administrators');
          }
          response = await adminService.createAdmin({
            fullName: formData.fullName.trim(),
            email: formData.email.trim(),
            mobileNumber: formData.mobileNumber.trim(),
            adminId: formData.adminId.trim(),
            permissionLevel: formData.permissionLevel,
            department: formData.department?.trim() || '',
            designation: formData.designation?.trim() || ''
          });
          break;
          
        default:
          throw new Error('Invalid user type');
      }

      if (response && (response.success || response.status === 200 || response.status === 201)) {
        const successMessage = response.message || 
          `${formData.userType.charAt(0).toUpperCase() + formData.userType.slice(1)} registered successfully with temporary password!`;
        setMessage(successMessage);
        
        // Reset form
        setFormData({
          userType: 'student',
          fullName: '',
          email: '',
          mobileNumber: '',
          rollNumber: '',
          course: '',
          degree: '',
          yearOfStudy: '',
          hostelName: '',
          roomNumber: '',
          address: '',
          guardianName: '',
          guardianMobile: '',
          guardianRelation: '',
          employeeId: '',
          department: '',
          designation: '',
          hostelAssigned: '',
          yearsOfExperience: '',
          officeLocation: '',
          officeHours: '',
          securityId: '',
          shift: '',
          gateAssigned: '',
          supervisorName: '',
          supervisorContact: '',
          yearsOfService: '',
          securityClearanceLevel: '',
          adminId: '',
          permissionLevel: 'MODERATOR'
        });
        
        if (onUserRegistered) {
          onUserRegistered();
        }
      } else {
        throw new Error(response?.data?.message || response?.message || 'Registration failed');
      }
      
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Network error. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (error) setError('');
    if (message) setMessage('');
  };

  // Auto-generate roll number
  const generateRollNumber = () => {
    const currentYear = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 900) + 100;
    const rollNumber = `MIT${currentYear}${randomNum}`;
    setFormData(prev => ({
      ...prev,
      rollNumber
    }));
    if (validationErrors.rollNumber) {
      setValidationErrors(prev => ({...prev, rollNumber: ''}));
    }
  };

  // Auto-fill room number based on hostel
  const handleHostelChange = (e) => {
    const hostelName = e.target.value;
    setFormData(prev => ({
      ...prev,
      hostelName
    }));
    
    if (hostelName && !formData.roomNumber) {
      let roomPrefix = '';
      if (hostelName.includes('Kalam')) roomPrefix = 'K-';
      else if (hostelName.includes('Raman')) roomPrefix = 'R-';
      else if (hostelName.includes('Marutham')) roomPrefix = 'M-';
      else if (hostelName.includes('Kurinji')) roomPrefix = 'KU-';
      else if (hostelName.includes('Brilla')) roomPrefix = 'B-';
      else if (hostelName.includes('Thamirabarani')) roomPrefix = 'T-';
      else if (hostelName.includes('Bhavani')) roomPrefix = 'BH-';
      else if (hostelName.includes('Kavery')) roomPrefix = 'KV-';
      
      const roomNum = Math.floor(Math.random() * 50) + 101;
      setFormData(prev => ({
        ...prev,
        roomNumber: `${roomPrefix}${roomNum}`
      }));
    }
    
    if (validationErrors.hostelName) {
      setValidationErrors(prev => ({...prev, hostelName: ''}));
    }
  };

  const userTypes = [
    { value: 'student', label: 'Student', icon: '🎓', color: 'blue' },
    { value: 'warden', label: 'Warden', icon: '👨‍🏫', color: 'green' },
    { value: 'security', label: 'Security', icon: '🛡️', color: 'orange' },
    ...(isSuperAdmin ? [{ value: 'admin', label: 'Admin', icon: '⚙️', color: 'purple' }] : [])
  ];

  const getSectionColor = (type) => {
    const userType = userTypes.find(t => t.value === type);
    return userType ? userType.color : 'blue';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-3xl mb-4 shadow-lg">
              <span className="text-3xl">👥</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Register New User</h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {isSuperAdmin 
                ? 'Create accounts for students, wardens, security personnel, and administrators'
                : 'Create accounts for students, wardens, and security personnel'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* User Type Selection */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 rounded-2xl border border-gray-200">
              <label className="block text-xl font-bold text-gray-900 mb-6">
                Select User Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {userTypes.map(type => (
                  <label key={type.value} className="cursor-pointer group">
                    <input
                      type="radio"
                      name="userType"
                      value={type.value}
                      checked={formData.userType === type.value}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <div className={`p-6 rounded-2xl text-center transition-all duration-300 transform group-hover:scale-105 border-2 ${
                      formData.userType === type.value 
                        ? `bg-${type.color}-500 text-white shadow-lg border-${type.color}-600` 
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}>
                      <div className="text-3xl mb-3">{type.icon}</div>
                      <div className="font-semibold text-lg">{type.label}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Common Fields */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                      validationErrors.fullName ? 'border-red-400 bg-red-50' : 'border-gray-300'
                    }`}
                    required
                  />
                  {validationErrors.fullName && (
                    <p className="text-red-500 text-sm mt-2 font-medium">{validationErrors.fullName}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="user@mit.edu"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                      validationErrors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'
                    }`}
                    required
                  />
                  {validationErrors.email && (
                    <p className="text-red-500 text-sm mt-2 font-medium">{validationErrors.email}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="9876543210"
                    pattern="[0-9]{10}"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                      validationErrors.mobileNumber ? 'border-red-400 bg-red-50' : 'border-gray-300'
                    }`}
                    required
                  />
                  {validationErrors.mobileNumber && (
                    <p className="text-red-500 text-sm mt-2 font-medium">{validationErrors.mobileNumber}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Student Specific Fields */}
            {formData.userType === 'student' && (
              <div className={`bg-gradient-to-r from-blue-50 to-${getSectionColor(formData.userType)}-50 p-8 rounded-2xl border border-${getSectionColor(formData.userType)}-200`}>
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="text-2xl mr-3">🎓</span> 
                  Student Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Roll Number */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Roll Number *
                    </label>
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        name="rollNumber"
                        value={formData.rollNumber}
                        onChange={handleChange}
                        placeholder="MIT2024001"
                        className={`flex-1 px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                          validationErrors.rollNumber ? 'border-red-400 bg-red-50' : 'border-gray-300'
                        }`}
                        required
                      />
                      <button
                        type="button"
                        onClick={generateRollNumber}
                        className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium shadow-md"
                      >
                        Generate
                      </button>
                    </div>
                    {validationErrors.rollNumber && (
                      <p className="text-red-500 text-sm mt-2 font-medium">{validationErrors.rollNumber}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">Format: MITYYYY### (e.g., MIT2024001)</p>
                  </div>
                  
                  {/* Degree */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Degree *
                    </label>
                    <select
                      name="degree"
                      value={formData.degree}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        validationErrors.degree ? 'border-red-400 bg-red-50' : 'border-gray-300'
                      }`}
                      required
                    >
                      <option value="">Select Degree</option>
                      {degreeOptions.map(degree => (
                        <option key={degree} value={degree}>{degree}</option>
                      ))}
                    </select>
                    {validationErrors.degree && (
                      <p className="text-red-500 text-sm mt-2 font-medium">{validationErrors.degree}</p>
                    )}
                  </div>
                  
                  {/* Course */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Course/Department *
                    </label>
                    <select
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        validationErrors.course ? 'border-red-400 bg-red-50' : 'border-gray-300'
                      }`}
                      required
                    >
                      <option value="">Select Course/Department</option>
                      {courseOptions.map(course => (
                        <option key={course} value={course}>{course}</option>
                      ))}
                    </select>
                    {validationErrors.course && (
                      <p className="text-red-500 text-sm mt-2 font-medium">{validationErrors.course}</p>
                    )}
                  </div>
                  
                  {/* Year of Study */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Year of Study
                    </label>
                    <select
                      name="yearOfStudy"
                      value={formData.yearOfStudy}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    >
                      <option value="">Select Year</option>
                      {yearOptions.map(year => (
                        <option key={year} value={year}>Year {year}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Hostel Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Hostel Name *
                    </label>
                    <select
                      name="hostelName"
                      value={formData.hostelName}
                      onChange={handleHostelChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        validationErrors.hostelName ? 'border-red-400 bg-red-50' : 'border-gray-300'
                      }`}
                      required
                    >
                      <option value="">Select Hostel</option>
                      {hostelOptions.map(hostel => (
                        <option key={hostel} value={hostel}>{hostel}</option>
                      ))}
                    </select>
                    {validationErrors.hostelName && (
                      <p className="text-red-500 text-sm mt-2 font-medium">{validationErrors.hostelName}</p>
                    )}
                  </div>
                  
                  {/* Room Number */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Room Number *
                    </label>
                    <input
                      type="text"
                      name="roomNumber"
                      value={formData.roomNumber}
                      onChange={handleChange}
                      placeholder="K-101, R-201, etc."
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        validationErrors.roomNumber ? 'border-red-400 bg-red-50' : 'border-gray-300'
                      }`}
                      required
                    />
                    {validationErrors.roomNumber && (
                      <p className="text-red-500 text-sm mt-2 font-medium">{validationErrors.roomNumber}</p>
                    )}
                  </div>
                </div>
                
                {/* Address Field */}
                <div className="mt-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter permanent address..."
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
                
                {/* Guardian Information */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Guardian Information (Optional)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Guardian Name
                      </label>
                      <input
                        type="text"
                        name="guardianName"
                        value={formData.guardianName}
                        onChange={handleChange}
                        placeholder="Guardian's name"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Guardian Mobile
                      </label>
                      <input
                        type="tel"
                        name="guardianMobile"
                        value={formData.guardianMobile}
                        onChange={handleChange}
                        placeholder="9876543210"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Relation
                      </label>
                      <input
                        type="text"
                        name="guardianRelation"
                        value={formData.guardianRelation}
                        onChange={handleChange}
                        placeholder="Father/Mother"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Warden Specific Fields */}
            {formData.userType === 'warden' && (
              <div className={`bg-gradient-to-r from-green-50 to-${getSectionColor(formData.userType)}-50 p-8 rounded-2xl border border-${getSectionColor(formData.userType)}-200`}>
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="text-2xl mr-3">👨‍🏫</span> 
                  Warden Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Employee ID *
                    </label>
                    <input
                      type="text"
                      name="employeeId"
                      value={formData.employeeId}
                      onChange={handleChange}
                      placeholder="EMP001"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                        validationErrors.employeeId ? 'border-red-400 bg-red-50' : 'border-gray-300'
                      }`}
                      required
                    />
                    {validationErrors.employeeId && (
                      <p className="text-red-500 text-sm mt-2 font-medium">{validationErrors.employeeId}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Department *
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                        validationErrors.department ? 'border-red-400 bg-red-50' : 'border-gray-300'
                      }`}
                      required
                    >
                      <option value="">Select Department</option>
                      {departmentOptions.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                    {validationErrors.department && (
                      <p className="text-red-500 text-sm mt-2 font-medium">{validationErrors.department}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Designation *
                    </label>
                    <select
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                        validationErrors.designation ? 'border-red-400 bg-red-50' : 'border-gray-300'
                      }`}
                      required
                    >
                      <option value="">Select Designation</option>
                      {designationOptions.map(designation => (
                        <option key={designation} value={designation}>{designation}</option>
                      ))}
                    </select>
                    {validationErrors.designation && (
                      <p className="text-red-500 text-sm mt-2 font-medium">{validationErrors.designation}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Hostel Assigned
                    </label>
                    <select
                      name="hostelAssigned"
                      value={formData.hostelAssigned}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    >
                      <option value="">Select Hostel</option>
                      {hostelOptions.map(hostel => (
                        <option key={hostel} value={hostel}>{hostel}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      name="yearsOfExperience"
                      value={formData.yearsOfExperience}
                      onChange={handleChange}
                      placeholder="5"
                      min="0"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Office Location
                    </label>
                    <input
                      type="text"
                      name="officeLocation"
                      value={formData.officeLocation}
                      onChange={handleChange}
                      placeholder="Building A, Room 101"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Office Hours
                  </label>
                  <input
                    type="text"
                    name="officeHours"
                    value={formData.officeHours}
                    onChange={handleChange}
                    placeholder="9:00 AM - 5:00 PM"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Security Specific Fields */}
            {formData.userType === 'security' && (
              <div className={`bg-gradient-to-r from-orange-50 to-${getSectionColor(formData.userType)}-50 p-8 rounded-2xl border border-${getSectionColor(formData.userType)}-200`}>
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="text-2xl mr-3">🛡️</span> 
                  Security Personnel Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Security ID *
                    </label>
                    <input
                      type="text"
                      name="securityId"
                      value={formData.securityId}
                      onChange={handleChange}
                      placeholder="SEC001"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all ${
                        validationErrors.securityId ? 'border-red-400 bg-red-50' : 'border-gray-300'
                      }`}
                      required
                    />
                    {validationErrors.securityId && (
                      <p className="text-red-500 text-sm mt-2 font-medium">{validationErrors.securityId}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Shift *
                    </label>
                    <select
                      name="shift"
                      value={formData.shift}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all ${
                        validationErrors.shift ? 'border-red-400 bg-red-50' : 'border-gray-300'
                      }`}
                      required
                    >
                      <option value="">Select Shift</option>
                      {shiftOptions.map(shift => (
                        <option key={shift} value={shift}>{shift}</option>
                      ))}
                    </select>
                    {validationErrors.shift && (
                      <p className="text-red-500 text-sm mt-2 font-medium">{validationErrors.shift}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Gate Assigned
                    </label>
                    <select
                      name="gateAssigned"
                      value={formData.gateAssigned}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    >
                      <option value="">Select Gate</option>
                      {gateOptions.map(gate => (
                        <option key={gate} value={gate}>{gate}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Supervisor Name
                    </label>
                    <input
                      type="text"
                      name="supervisorName"
                      value={formData.supervisorName}
                      onChange={handleChange}
                      placeholder="Supervisor's name"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Supervisor Contact
                    </label>
                    <input
                      type="text"
                      name="supervisorContact"
                      value={formData.supervisorContact}
                      onChange={handleChange}
                      placeholder="9876543210"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Years of Service
                    </label>
                    <input
                      type="number"
                      name="yearsOfService"
                      value={formData.yearsOfService}
                      onChange={handleChange}
                      placeholder="3"
                      min="0"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Security Clearance Level
                  </label>
                  <select
                    name="securityClearanceLevel"
                    value={formData.securityClearanceLevel}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  >
                    <option value="">Select Clearance Level</option>
                    {securityClearanceOptions.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Admin Specific Fields */}
            {formData.userType === 'admin' && (
              <div className={`bg-gradient-to-r from-purple-50 to-${getSectionColor(formData.userType)}-50 p-8 rounded-2xl border border-${getSectionColor(formData.userType)}-200`}>
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="text-2xl mr-3">⚙️</span> 
                  Administrator Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Admin ID *
                    </label>
                    <input
                      type="text"
                      name="adminId"
                      value={formData.adminId}
                      onChange={handleChange}
                      placeholder="ADM001"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all ${
                        validationErrors.adminId ? 'border-red-400 bg-red-50' : 'border-gray-300'
                      }`}
                      required
                    />
                    {validationErrors.adminId && (
                      <p className="text-red-500 text-sm mt-2 font-medium">{validationErrors.adminId}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Permission Level *
                    </label>
                    <select
                      name="permissionLevel"
                      value={formData.permissionLevel}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      required
                    >
                      {permissionOptions.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Department
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    >
                      <option value="">Select Department</option>
                      {departmentOptions.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Designation
                    </label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      placeholder="System Administrator"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            {error && (
              <div className="p-6 bg-red-50 border-2 border-red-200 rounded-2xl flex items-start space-x-4 animate-pulse">
                <div className="flex-shrink-0 w-6 h-6 text-red-500 mt-0.5">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-red-800">Registration Failed</h4>
                  <p className="text-red-600 mt-1">{error}</p>
                </div>
              </div>
            )}

            {message && (
              <div className="p-6 bg-green-50 border-2 border-green-200 rounded-2xl flex items-start space-x-4 animate-bounce">
                <div className="flex-shrink-0 w-6 h-6 text-green-500 mt-0.5">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-green-800">Success!</h4>
                  <p className="text-green-600 mt-1">{message}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-${getSectionColor(formData.userType)}-600 to-${getSectionColor(formData.userType)}-700 text-white py-5 px-8 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Registering {formData.userType.charAt(0).toUpperCase() + formData.userType.slice(1)}...</span>
                </div>
              ) : (
                `Register ${formData.userType.charAt(0).toUpperCase() + formData.userType.slice(1)}`
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;
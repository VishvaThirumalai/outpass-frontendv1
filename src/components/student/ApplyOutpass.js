import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/studentService';
import { MapPin, Calendar, Clock, Car, Home, FileText, CheckCircle, AlertCircle, User, Building2, Hash, Send, Phone } from 'lucide-react';

const ApplyOutpass = ({ onSuccess }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    destination: '',
    reason: '',
    fromDate: '',
    toDate: '',
    departureTime: '09:00',
    emergencyContact: '',
    modeOfTravel: '',
    addressDuringLeave: '',
    parentContact: ''
  });

  // Initialize dates
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    
    setFormData(prev => ({
      ...prev,
      fromDate: today,
      toDate: tomorrow
    }));
  }, []);

  // Fetch profile from backend if some fields are missing in context user
  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        if ((!user?.rollNumber || !user?.hostel) && localStorage.getItem('token')) {
          const resp = await studentService.getProfile();
          if (mounted && resp && resp.success && resp.data) {
            setProfile(resp.data);
          }
        }
      } catch (err) {
        console.warn('Could not fetch profile:', err?.message || err);
      }
    };

    loadProfile();
    return () => { mounted = false; };
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }

    if (!formData.reason || formData.reason === 'Select reason') {
      newErrors.reason = 'Please select a valid reason';
    }

    if (!formData.fromDate) {
      newErrors.fromDate = 'From date is required';
    }

    if (!formData.toDate) {
      newErrors.toDate = 'To date is required';
    }

    if (formData.fromDate && formData.toDate) {
      const fromDate = new Date(formData.fromDate);
      const toDate = new Date(formData.toDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (fromDate < today) {
        newErrors.fromDate = 'From date cannot be in the past';
      }

      if (toDate < fromDate) {
        newErrors.toDate = 'Return date must be after leave date';
      }
    }

    if (!formData.emergencyContact.trim()) {
      newErrors.emergencyContact = 'Emergency contact is required';
    } else if (!/^[0-9]{10}$/.test(formData.emergencyContact)) {
      newErrors.emergencyContact = 'Emergency contact must be 10 digits';
    }

    if (formData.parentContact && !/^[0-9]{10}$/.test(formData.parentContact)) {
      newErrors.parentContact = 'Parent contact must be 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await studentService.applyOutpass({
        ...formData,
        rollNumber: user?.rollNumber || profile?.rollNumber,
        hostel: user?.hostel || profile?.hostelName || profile?.hostel,
        studentName: user?.name || user?.username || profile?.fullName
      });

      if (response.success) {
        setMessage({ 
          type: 'success', 
          text: 'Outpass application submitted successfully!' 
        });
        
        // Reset form
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
        
        setFormData({
          destination: '',
          reason: '',
          fromDate: today,
          toDate: tomorrow,
          departureTime: '09:00',
          emergencyContact: '',
          modeOfTravel: '',
          addressDuringLeave: '',
          parentContact: ''
        });

        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 2000);
      } else {
        throw new Error(response.message || 'Failed to submit outpass');
      }

    } catch (error) {
      console.error('Error submitting outpass:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to submit outpass. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8 font-poppins">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl text-left text-gray-700 mb-2">Fill out the form below to request permission to leave campus</h1>
        </div>

        {/* Alert Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl shadow-sm ${
            message.type === 'success' 
              ? 'bg-green-50 border-l-4 border-green-500 text-green-800' 
              : 'bg-red-50 border-l-4 border-red-500 text-red-800'
          }`}>
            <div className="flex items-center">
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              )}
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Student Information Card */}
          <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex items-center mb-2">
                  <Hash className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-gray-600">Roll Number</span>
                </div>
                <p className="text-gray-900 font-semibold text-lg">
                  {(user?.rollNumber || profile?.rollNumber) || 'Not available'}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex items-center mb-2">
                  <User className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-gray-600">Name</span>
                </div>
                <p className="text-gray-900 font-semibold text-lg">
                  {user?.name || user?.username || profile?.fullName || 'Not available'}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex items-center mb-2">
                  <Building2 className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-gray-600">Hostel</span>
                </div>
                <p className="text-gray-900 font-semibold text-lg">
                  {(user?.hostel || profile?.hostelName || profile?.hostel) || 'Not available'}
                </p>
              </div>
            </div>
          </div>

          {/* Main Form Card */}
          <div className="p-8">
            <div className="space-y-8">
              {/* Complete Form Section */}
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-2xl mb-4">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">Outpass Application Details</h3>
                  <p className="text-gray-600 mt-2">Please provide all the necessary information for your outpass request</p>
                </div>

                {/* First Row - Three Fields */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Destination */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                      Destination <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                      placeholder="Where are you going?"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        errors.destination ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {errors.destination && (
                      <p className="text-red-500 text-sm flex items-center mt-1">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.destination}
                      </p>
                    )}
                  </div>

                  {/* Reason */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                      <FileText className="w-4 h-4 mr-2 text-blue-600" />
                      Reason <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        errors.reason ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select a reason</option>
                      <option value="Home Visit">Home Visit</option>
                      <option value="Medical Emergency">Medical Emergency</option>
                      <option value="Medical Checkup">Medical Checkup</option>
                      <option value="Personal Work">Personal Work</option>
                      <option value="College Event">College Event</option>
                      <option value="Interview">Interview</option>
                      <option value="Family Function">Family Function</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.reason && (
                      <p className="text-red-500 text-sm flex items-center mt-1">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.reason}
                      </p>
                    )}
                  </div>

                  {/* Mode of Travel */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                      <Car className="w-4 h-4 mr-2 text-blue-600" />
                      Mode of Travel
                    </label>
                    <select
                      name="modeOfTravel"
                      value={formData.modeOfTravel}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    >
                      <option value="">Select travel mode</option>
                      <option value="Bus">Bus</option>
                      <option value="Train">Train</option>
                      <option value="Flight">Flight</option>
                      <option value="Personal Vehicle">Personal Vehicle</option>
                      <option value="Taxi/Cab">Taxi/Cab</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Second Row - Three Fields */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* From Date */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                      From Date <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="date"
                      name="fromDate"
                      value={formData.fromDate}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        errors.fromDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    {errors.fromDate && (
                      <p className="text-red-500 text-sm flex items-center mt-1">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.fromDate}
                      </p>
                    )}
                  </div>

                  {/* To Date */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                      To Date <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="date"
                      name="toDate"
                      value={formData.toDate}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        errors.toDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      min={formData.fromDate}
                    />
                    {errors.toDate && (
                      <p className="text-red-500 text-sm flex items-center mt-1">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.toDate}
                      </p>
                    )}
                  </div>

                  {/* Departure Time */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                      <Clock className="w-4 h-4 mr-2 text-blue-600" />
                      Departure Time
                    </label>
                    <input
                      type="time"
                      name="departureTime"
                      value={formData.departureTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                {/* Third Row - Three Fields */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Emergency Contact */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                      <Phone className="w-4 h-4 mr-2 text-blue-600" />
                      Emergency Contact <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="tel"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        errors.emergencyContact ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {errors.emergencyContact && (
                      <p className="text-red-500 text-sm flex items-center mt-1">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.emergencyContact}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                      <Phone className="w-3 h-3 mr-1" />
                      Your mobile number for emergencies
                    </p>
                  </div>

                  {/* Parent Contact */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                      <Phone className="w-4 h-4 mr-2 text-blue-600" />
                      Parent/Guardian Contact
                    </label>
                    <input
                      type="tel"
                      name="parentContact"
                      value={formData.parentContact}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        errors.parentContact ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {errors.parentContact && (
                      <p className="text-red-500 text-sm flex items-center mt-1">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.parentContact}
                      </p>
                    )}
                  </div>

                  {/* Empty spacer for alignment */}
                  <div className="space-y-2">
                    {/* This empty div maintains 3-column layout */}
                  </div>
                </div>

                {/* Address During Leave - Full Width */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <Home className="w-4 h-4 mr-2 text-blue-600" />
                    Address During Leave
                  </label>
                  <textarea
                    name="addressDuringLeave"
                    value={formData.addressDuringLeave}
                    onChange={handleChange}
                    placeholder="Complete address where you'll be staying during your leave period..."
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Submit Outpass Application</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyOutpass;
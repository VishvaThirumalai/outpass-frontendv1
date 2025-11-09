import React, { useState } from 'react';
import { studentService } from '../../services/studentService';
import { MapPin, Calendar, Clock, Car, Home, FileText, CheckCircle, AlertCircle, User, Building2, Hash, Send, Phone, X } from 'lucide-react';

const EditOutpassModal = ({ outpass, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    destination: outpass.destination || '',
    reason: outpass.reason || '',
    fromDate: outpass.leaveStartDate ? new Date(outpass.leaveStartDate).toISOString().split('T')[0] : '',
    toDate: outpass.expectedReturnDate ? new Date(outpass.expectedReturnDate).toISOString().split('T')[0] : '',
    departureTime: outpass.leaveStartDate ? new Date(outpass.leaveStartDate).toTimeString().slice(0, 5) : '09:00',
    emergencyContact: outpass.emergencyContactNumber || outpass.emergencyContact || '',
    modeOfTravel: outpass.modeOfTravel || '',
    addressDuringLeave: outpass.addressDuringLeave || '',
    parentContact: outpass.parentContact || ''
  });

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
      // Transform data to match backend expectations
      const requestData = {
        reason: formData.reason,
        leaveStartDate: new Date(`${formData.fromDate}T${formData.departureTime}`).toISOString(),
        expectedReturnDate: new Date(`${formData.toDate}T23:59`).toISOString(),
        destination: formData.destination,
        emergencyContactName: 'Self',
        emergencyContactNumber: formData.emergencyContact,
        emergencyContactRelation: 'Self',
        modeOfTravel: formData.modeOfTravel,
        addressDuringLeave: formData.addressDuringLeave,
        parentContact: formData.parentContact
      };

      console.log('🔄 Sending edit request:', requestData);

      const response = await studentService.editOutpass(outpass.id, requestData);
      
      if (response.success) {
        setMessage({ 
          type: 'success', 
          text: 'Outpass updated successfully!' 
        });
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        throw new Error(response.message || 'Failed to update outpass');
      }

    } catch (error) {
      console.error('❌ Edit error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update outpass';
      setMessage({ 
        type: 'error', 
        text: errorMessage 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 font-poppins">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Outpass Application</h2>
              <p className="text-gray-600">Update your outpass details</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Alert Message */}
        {message.text && (
          <div className={`mx-6 mt-6 p-4 rounded-xl shadow-sm ${
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

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="p-6">
            {/* Student Information Card */}
            <div className="mb-8 p-6 border border-gray-200 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                  <div className="flex items-center mb-2">
                    <Hash className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-gray-600">Roll Number</span>
                  </div>
                  <p className="text-gray-900 font-semibold text-lg">
                    {outpass.rollNumber || 'Not available'}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                  <div className="flex items-center mb-2">
                    <User className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-gray-600">Name</span>
                  </div>
                  <p className="text-gray-900 font-semibold text-lg">
                    {outpass.studentName || 'Not available'}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                  <div className="flex items-center mb-2">
                    <Building2 className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-gray-600">Hostel</span>
                  </div>
                  <p className="text-gray-900 font-semibold text-lg">
                    {outpass.hostel || 'Not available'}
                  </p>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-2xl mb-4">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">Outpass Application Details</h3>
                <p className="text-gray-600 mt-2">Update the necessary information for your outpass request</p>
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
          </div>

          {/* Footer Actions */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 disabled:opacity-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Update Outpass</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOutpassModal;
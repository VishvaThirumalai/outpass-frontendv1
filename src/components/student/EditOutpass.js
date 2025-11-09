// src/components/student/EditOutpass.js
import React, { useState } from 'react';
import { studentService } from '../../services/studentService';

const EditOutpass = ({ outpass, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    reason: outpass.reason || '',
    leaveStartDate: outpass.leaveStartDate ? new Date(outpass.leaveStartDate).toISOString().slice(0, 16) : '',
    expectedReturnDate: outpass.expectedReturnDate ? new Date(outpass.expectedReturnDate).toISOString().slice(0, 16) : '',
    destination: outpass.destination || '',
    emergencyContactName: outpass.emergencyContactName || '',
    emergencyContactNumber: outpass.emergencyContactNumber || '',
    emergencyContactRelation: outpass.emergencyContactRelation || ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const submissionData = {
        ...formData,
        leaveStartDate: new Date(formData.leaveStartDate).toISOString(),
        expectedReturnDate: new Date(formData.expectedReturnDate).toISOString()
      };

      const response = await studentService.editOutpass(outpass.id, submissionData);
      
      if (response.success) {
        setMessage({ type: 'success', text: 'Outpass updated successfully!' });
        setTimeout(() => onSuccess(), 1500);
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to update outpass' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="edit-outpass">
      <h2>Edit Outpass Application</h2>
      
      <form onSubmit={handleSubmit} className="outpass-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="reason">Reason for Leave *</label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Enter reason for outpass"
              required
              rows="3"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="leaveStartDate">Leave Start Date & Time *</label>
            <input
              type="datetime-local"
              id="leaveStartDate"
              name="leaveStartDate"
              value={formData.leaveStartDate}
              onChange={handleChange}
              min={getCurrentDateTime()}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="expectedReturnDate">Expected Return Date & Time *</label>
            <input
              type="datetime-local"
              id="expectedReturnDate"
              name="expectedReturnDate"
              value={formData.expectedReturnDate}
              onChange={handleChange}
              min={formData.leaveStartDate || getCurrentDateTime()}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="destination">Destination</label>
            <input
              type="text"
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="Enter destination"
            />
          </div>
        </div>

        <h3>Emergency Contact Information</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="emergencyContactName">Contact Person Name</label>
            <input
              type="text"
              id="emergencyContactName"
              name="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={handleChange}
              placeholder="Enter contact person name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="emergencyContactNumber">Contact Number</label>
            <input
              type="tel"
              id="emergencyContactNumber"
              name="emergencyContactNumber"
              value={formData.emergencyContactNumber}
              onChange={handleChange}
              placeholder="Enter 10-digit mobile number"
              pattern="[0-9]{10}"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="emergencyContactRelation">Relation</label>
            <select
              id="emergencyContactRelation"
              name="emergencyContactRelation"
              value={formData.emergencyContactRelation}
              onChange={handleChange}
            >
              <option value="">Select Relation</option>
              <option value="Father">Father</option>
              <option value="Mother">Mother</option>
              <option value="Guardian">Guardian</option>
              <option value="Brother">Brother</option>
              <option value="Sister">Sister</option>
              <option value="Uncle">Uncle</option>
              <option value="Aunt">Aunt</option>
              <option value="Friend">Friend</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Updating...' : 'Update Outpass'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditOutpass;
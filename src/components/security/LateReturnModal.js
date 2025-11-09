// src/components/security/LateReturnModal.js
import React, { useState } from 'react';
// In LateReturnModal.js - Show appropriate message based on expired/overdue
const LateReturnModal = ({ isOpen, onClose, onConfirm, studentName, rollNumber, expectedReturn, actualDepartureTime, isExpired, isOverdue }) => {
  const [lateReturnReason, setLateReturnReason] = useState('');
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!lateReturnReason.trim()) {
      alert('Please provide a reason for late return');
      return;
    }

    setSubmitting(true);
    try {
      await onConfirm(lateReturnReason, comments);
      handleClose();
    } catch (error) {
      console.error('Error marking late return:', error);
      alert('Failed to mark return: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setLateReturnReason('');
    setComments('');
    onClose();
  };

  if (!isOpen) return null;

  // Calculate how late/expired
  const now = new Date();
  const expectedReturnDate = new Date(expectedReturn);
  const departureDate = new Date(actualDepartureTime);
  
  let statusMessage = '';
  let statusColor = 'yellow';
  
  if (isExpired) {
    const hoursExpired = Math.round((now - (departureDate.getTime() + 24 * 60 * 60 * 1000)) / (1000 * 60 * 60));
    statusMessage = `EXPIRED - Returned ${hoursExpired} hours after 24h departure window`;
    statusColor = 'red';
  } else if (isOverdue) {
    const hoursLate = Math.round((now - expectedReturnDate) / (1000 * 60 * 60));
    statusMessage = `OVERDUE - Returned ${hoursLate} hours after expected return`;
    statusColor = 'orange';
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {isExpired ? '🚨 Mark Expired Return' : '⚠️ Mark Late Return'}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {isExpired ? 'Student returned after 24h departure window expired' : 'Student returned after expected time'}
          </p>
        </div>

        {/* Student Info */}
        <div className={`px-6 py-4 ${isExpired ? 'bg-red-50 border-red-100' : 'bg-yellow-50 border-yellow-100'} border-b`}>
          <div className="text-sm">
            <div className="font-medium text-gray-900">{studentName}</div>
            <div className="text-gray-600">Roll No: {rollNumber}</div>
            <div className={`font-medium mt-1 ${isExpired ? 'text-red-600' : 'text-orange-600'}`}>
              {statusMessage}
            </div>
            {!isExpired && (
              <div className="text-red-600 mt-1">
                Expected Return: {formatDate(expectedReturn)}
              </div>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="px-6 py-4 space-y-4">
          {/* Late Return Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for {isExpired ? 'Expired Return' : 'Late Return'} *
            </label>
            <textarea
              value={lateReturnReason}
              onChange={(e) => setLateReturnReason(e.target.value)}
              placeholder={isExpired ? 
                "Please explain why the student returned after the 24h departure window expired..." : 
                "Please provide the reason why the student returned late..."}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              required
            />
          </div>

          {/* Additional Comments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Comments (Optional)
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Any additional observations..."
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={handleClose}
            disabled={submitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !lateReturnReason.trim()}
            className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed ${
              isExpired 
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
                : 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500'
            }`}
          >
            {submitting ? 'Processing...' : `Mark ${isExpired ? 'Expired' : 'Late'} Return`}
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function to format date (you might already have this in your utils)
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default LateReturnModal;
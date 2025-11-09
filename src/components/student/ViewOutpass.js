// src/components/student/ViewOutpass.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { studentService } from '../../services/studentService';

const ViewOutpass = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [outpass, setOutpass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    fetchOutpass();
  }, [id]);

  const fetchOutpass = async () => {
    try {
      setLoading(true);
      const response = await studentService.getOutpass(id);
      const outpassData = response.data || response;
      setOutpass(outpassData);
    } catch (error) {
      console.error('Error fetching outpass:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this outpass?')) {
      return;
    }

    try {
      setCanceling(true);
      await studentService.cancelOutpass(id);
      alert('Outpass cancelled successfully');
      navigate('/student/history');
    } catch (error) {
      console.error('Error canceling outpass:', error);
      alert('Failed to cancel outpass');
    } finally {
      setCanceling(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    return status.toLowerCase();
  };

  const getHostelBadgeClass = (hostel) => {
    const hostelType = hostel?.toLowerCase() || '';
    if (hostelType.includes('boys')) return 'boys';
    if (hostelType.includes('girls')) return 'girls';
    if (hostelType.includes('postgrad') || hostelType.includes('pg')) return 'postgrad';
    if (hostelType.includes('faculty')) return 'faculty';
    return 'boys';
  };

  if (loading) {
    return (
      <div className="dashboard-home">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading outpass details...</p>
        </div>
      </div>
    );
  }

  if (!outpass) {
    return (
      <div className="dashboard-home">
        <div className="no-data">
          <p>Outpass not found</p>
          <Link to="/student/history" className="btn btn-primary">
            Back to History
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-home">
      <div className="dashboard-header">
        <h1>Outpass Details</h1>
        <div className="welcome-message">
          <p>Outpass #{outpass.id} - Complete information</p>
        </div>
      </div>

      <div className="outpasses-grid" style={{ gridTemplateColumns: '1fr' }}>
        <div className="outpass-card">
          <div className="card-header">
            <div className="student-info">
              <h3>{outpass.studentName || 'Unknown Student'}</h3>
              <p className="roll-number">
                {outpass.rollNumber} 
                {outpass.hostel && (
                  <span className={`hostel-badge ${getHostelBadgeClass(outpass.hostel)}`}>
                    {outpass.hostel}
                  </span>
                )}
              </p>
            </div>
            <div className={`status-badge ${getStatusBadgeClass(outpass.status)}`}>
              {outpass.status}
            </div>
          </div>

          <div className="card-content">
            <div className="info-row">
              <span className="label">Destination:</span>
              <span>{outpass.destination}</span>
            </div>
            
            <div className="info-row">
              <span className="label">Reason:</span>
              <span>{outpass.reason}</span>
            </div>
            
            <div className="info-row">
              <span className="label">From Date:</span>
              <span>{new Date(outpass.fromDate).toLocaleDateString()}</span>
            </div>
            
            <div className="info-row">
              <span className="label">To Date:</span>
              <span>{new Date(outpass.toDate).toLocaleDateString()}</span>
            </div>
            
            <div className="info-row">
              <span className="label">Departure Time:</span>
              <span>{outpass.departureTime || 'Not specified'}</span>
            </div>
            
            <div className="info-row">
              <span className="label">Mode of Travel:</span>
              <span>{outpass.modeOfTravel || 'Not specified'}</span>
            </div>
            
            <div className="info-row">
              <span className="label">Emergency Contact:</span>
              <span>{outpass.emergencyContact || 'Not provided'}</span>
            </div>
            
            <div className="info-row">
              <span className="label">Parent Contact:</span>
              <span>{outpass.parentContact || 'Not provided'}</span>
            </div>

            {outpass.addressDuringLeave && (
              <div className="info-row">
                <span className="label">Address During Leave:</span>
                <span>{outpass.addressDuringLeave}</span>
              </div>
            )}

            {outpass.comments && (
              <div className="comments">
                <span className="label">Warden Comments:</span>
                <p>{outpass.comments}</p>
              </div>
            )}

            <div className="info-row">
              <span className="label">Applied On:</span>
              <span>{new Date(outpass.createdAt).toLocaleString()}</span>
            </div>

            {outpass.updatedAt && outpass.updatedAt !== outpass.createdAt && (
              <div className="info-row">
                <span className="label">Last Updated:</span>
                <span>{new Date(outpass.updatedAt).toLocaleString()}</span>
              </div>
            )}
          </div>

          <div className="card-actions">
            <Link 
              to="/student/history" 
              className="btn btn-secondary"
            >
              Back to History
            </Link>
            
            {(outpass.status === 'PENDING' || outpass.status === 'pending') && (
              <button
                onClick={handleCancel}
                disabled={canceling}
                className="btn btn-danger"
              >
                {canceling ? 'Canceling...' : 'Cancel Outpass'}
              </button>
            )}
            
            {(outpass.status === 'APPROVED' || outpass.status === 'approved') && (
              <button className="btn btn-success">
                Download Outpass
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOutpass;
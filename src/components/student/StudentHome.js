  // src/components/student/StudentHome.js
  import React, { useState, useEffect } from 'react';
  import { useAuth } from '../../context/AuthContext';
  import { studentService } from '../../services/studentService';
  import '../../styles/student.css';

  const StudentHome = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
      total: 0,
      pending: 0,
      approved: 0,
      active: 0,
      completed: 0,
      rejected: 0
    });
    const [recentOutpasses, setRecentOutpasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsResponse, outpassesResponse] = await Promise.all([
          studentService.getStats(),
          studentService.getMyOutpasses()
        ]);

        console.log('📊 Stats Response:', statsResponse);
        console.log('📋 Outpasses Response:', outpassesResponse);

        // Handle different response formats
        let statsData = {};
        if (statsResponse.data) {
          // If response has data property
          statsData = {
            total: statsResponse.data.totalOutpasses || 0,
            pending: statsResponse.data.pendingOutpasses || 0,
            approved: statsResponse.data.approvedOutpasses || 0,
            active: statsResponse.data.activeOutpasses || 0,
            completed: statsResponse.data.completedOutpasses || 0,
            rejected: statsResponse.data.rejectedOutpasses || 0
          };
        } else {
          // If response is direct
          statsData = {
            total: statsResponse.totalOutpasses || statsResponse.total || 0,
            pending: statsResponse.pendingOutpasses || statsResponse.pending || 0,
            approved: statsResponse.approvedOutpasses || statsResponse.approved || 0,
            active: statsResponse.activeOutpasses || statsResponse.active || 0,
            completed: statsResponse.completedOutpasses || statsResponse.completed || 0,
            rejected: statsResponse.rejectedOutpasses || statsResponse.rejected || 0
          };
        }

        const outpassesData = outpassesResponse.data || outpassesResponse || [];

        setStats(statsData);
        setRecentOutpasses(outpassesData.slice(0, 6)); // Get last 6 outpasses
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set default stats on error
        setStats({
          total: 0,
          pending: 0,
          approved: 0,
          active: 0,
          completed: 0,
          rejected: 0
        });
        setRecentOutpasses([]);
      } finally {
        setLoading(false);
      }
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
            <p>Loading your dashboard...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="dashboard-home">
        <div className="dashboard-header">
          <h1>Student Dashboard</h1>
          <div className="welcome-message">
            <p>Welcome back, <strong>{user?.name || user?.username}</strong>! 
              {user?.hostel && (
                <span className={`hostel-badge ${getHostelBadgeClass(user.hostel)}`}>
                  {user.hostel}
                </span>
              )}
            </p>
            <p>Here's your outpass activity summary</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="student-stats">
          <div className="student-stat-card total">
            <h3>Total Outpasses</h3>
            <div className="student-stat-number">{stats.total}</div>
            <p className="stat-desc">All time applications</p>
          </div>
          
          <div className="student-stat-card pending">
            <h3>Pending</h3>
            <div className="student-stat-number">{stats.pending}</div>
            <p className="stat-desc">Awaiting approval</p>
          </div>
          
          <div className="student-stat-card approved">
            <h3>Approved</h3>
            <div className="student-stat-number">{stats.approved}</div>
            <p className="stat-desc">Ready to use</p>
          </div>
          
          <div className="student-stat-card active">
            <h3>Active</h3>
            <div className="student-stat-number">{stats.active}</div>
            <p className="stat-desc">Currently outside</p>
          </div>
          
          <div className="student-stat-card completed">
            <h3>Completed</h3>
            <div className="student-stat-number">{stats.completed}</div>
            <p className="stat-desc">Returned safely</p>
          </div>
          
          <div className="student-stat-card rejected">
            <h3>Rejected</h3>
            <div className="student-stat-number">{stats.rejected}</div>
            <p className="stat-desc">Not approved</p>
          </div>
        </div>

        <div className="student-recent-outpasses">
          <h3>Recent Outpass Applications</h3>
          {recentOutpasses.length > 0 ? (
            <div className="compact-outpass-grid">
              {recentOutpasses.map((outpass) => (
                <div key={outpass.id} className="compact-outpass-card">
                  <div className="card-header-compact">
                    <div className="card-id-compact">Outpass #{outpass.id}</div>
                    <span className={`status-badge-compact status-${outpass.status?.toLowerCase()}`}>
                      {outpass.status}
                    </span>
                  </div>

                  <div className="card-body-compact">
                    <div className="info-row-compact">
                      <span className="info-label">Destination:</span>
                      <span className="info-value">{outpass.destination}</span>
                    </div>
                    
                    <div className="info-row-compact">
                      <span className="info-label">Reason:</span>
                      <span className="info-value">{outpass.reason}</span>
                    </div>

                    <div className="info-row-compact">
                      <span className="info-label">From:</span>
                      <span className="info-value">
                        {new Date(outpass.leaveStartDate || outpass.fromDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="info-row-compact">
                      <span className="info-label">To:</span>
                      <span className="info-value">
                        {new Date(outpass.expectedReturnDate || outpass.toDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="info-row-compact">
                      <span className="info-label">Roll No:</span>
                      <span className="info-value">{outpass.studentRollNumber || user?.rollNumber || 'N/A'}</span>
                    </div>

                    <div className="info-row-compact">
                      <span className="info-label">Hostel:</span>
                      <span className="info-value">{outpass.hostelName || user?.hostel || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No outpasses found</h3>
              <p>You haven't applied for any outpasses yet.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  export default StudentHome;
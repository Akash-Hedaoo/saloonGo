import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/ShopkeeperDashboard.css';

const ShopkeeperDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Dummy data for salon owner
  const dummyData = {
    todayAppointments: [
      { id: 1, customerName: 'John Doe', service: 'Haircut', time: '10:00 AM', status: 'confirmed' },
      { id: 2, customerName: 'Jane Smith', service: 'Hair Coloring', time: '2:00 PM', status: 'confirmed' },
      { id: 3, customerName: 'Mike Johnson', service: 'Facial', time: '4:30 PM', status: 'pending' }
    ],
    upcomingAppointments: [
      { id: 4, customerName: 'Sarah Wilson', service: 'Manicure', date: '2024-01-15', time: '11:00 AM' },
      { id: 5, customerName: 'David Brown', service: 'Haircut', date: '2024-01-16', time: '3:00 PM' },
      { id: 6, customerName: 'Lisa Davis', service: 'Pedicure', date: '2024-01-17', time: '1:00 PM' }
    ],
    revenue: {
      today: 450,
      thisWeek: 2800,
      thisMonth: 12000
    },
    services: [
      { name: 'Haircut', price: 45, duration: '45 min' },
      { name: 'Hair Coloring', price: 120, duration: '2 hours' },
      { name: 'Facial Treatment', price: 75, duration: '60 min' },
      { name: 'Manicure', price: 35, duration: '30 min' },
      { name: 'Pedicure', price: 45, duration: '45 min' }
    ],
    // Admin panel data
    allSalons: [
      { id: 1, name: 'Elite Beauty Salon', owner: 'John Smith', status: 'active', appointments: 45, revenue: 2500 },
      { id: 2, name: 'Glamour Studio', owner: 'Sarah Johnson', status: 'active', appointments: 32, revenue: 1800 },
      { id: 3, name: 'Modern Cuts', owner: 'Mike Davis', status: 'pending', appointments: 0, revenue: 0 },
      { id: 4, name: 'Beauty Paradise', owner: 'Lisa Wilson', status: 'suspended', appointments: 12, revenue: 800 }
    ],
    allUsers: [
      { id: 1, name: 'John Doe', email: 'john@example.com', type: 'customer', status: 'active', joinDate: '2024-01-01' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', type: 'customer', status: 'active', joinDate: '2024-01-05' },
      { id: 3, name: 'Mike Johnson', email: 'mike@example.com', type: 'salonOwner', status: 'active', joinDate: '2024-01-10' },
      { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', type: 'customer', status: 'inactive', joinDate: '2024-01-15' }
    ],
    systemStats: {
      totalSalons: 156,
      totalUsers: 2847,
      totalAppointments: 1245,
      totalRevenue: 45600,
      activeSalons: 142,
      pendingSalons: 8,
      suspendedSalons: 6
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSalonAction = (salonId, action) => {
    alert(`${action} action for salon ${salonId} would be performed here.`);
  };

  const handleUserAction = (userId, action) => {
    alert(`${action} action for user ${userId} would be performed here.`);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="shopkeeper-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Welcome back, {user.name}!</h1>
          <p>Manage your salon and appointments</p>
        </div>
        <div className="header-actions">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="sidebar">
          <nav className="dashboard-nav">
            <button 
              className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => handleTabChange('overview')}
            >
              Overview
            </button>
            <button 
              className={`nav-item ${activeTab === 'appointments' ? 'active' : ''}`}
              onClick={() => handleTabChange('appointments')}
            >
              Appointments
            </button>
            <button 
              className={`nav-item ${activeTab === 'services' ? 'active' : ''}`}
              onClick={() => handleTabChange('services')}
            >
              Services
            </button>
            <button 
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => handleTabChange('profile')}
            >
              Profile
            </button>
            {user.userType === 'salonOwner' && (
              <button 
                className={`nav-item ${activeTab === 'admin' ? 'active' : ''}`}
                onClick={() => handleTabChange('admin')}
              >
                Admin Panel
              </button>
            )}
          </nav>
        </div>

        <div className="main-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Today's Revenue</h3>
                  <p className="stat-value">${dummyData.revenue.today}</p>
                </div>
                <div className="stat-card">
                  <h3>This Week</h3>
                  <p className="stat-value">${dummyData.revenue.thisWeek}</p>
                </div>
                <div className="stat-card">
                  <h3>This Month</h3>
                  <p className="stat-value">${dummyData.revenue.thisMonth}</p>
                </div>
                <div className="stat-card">
                  <h3>Today's Appointments</h3>
                  <p className="stat-value">{dummyData.todayAppointments.length}</p>
                </div>
              </div>

              <div className="today-appointments">
                <h2>Today's Appointments</h2>
                <div className="appointments-list">
                  {dummyData.todayAppointments.map(appointment => (
                    <div key={appointment.id} className="appointment-card">
                      <div className="appointment-info">
                        <h4>{appointment.customerName}</h4>
                        <p>{appointment.service}</p>
                        <span className="time">{appointment.time}</span>
                      </div>
                      <div className={`status ${appointment.status}`}>
                        {appointment.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="appointments-tab">
              <h2>All Appointments</h2>
              <div className="appointments-section">
                <h3>Today's Appointments</h3>
                <div className="appointments-list">
                  {dummyData.todayAppointments.map(appointment => (
                    <div key={appointment.id} className="appointment-card">
                      <div className="appointment-info">
                        <h4>{appointment.customerName}</h4>
                        <p>{appointment.service}</p>
                        <span className="time">{appointment.time}</span>
                      </div>
                      <div className={`status ${appointment.status}`}>
                        {appointment.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="appointments-section">
                <h3>Upcoming Appointments</h3>
                <div className="appointments-list">
                  {dummyData.upcomingAppointments.map(appointment => (
                    <div key={appointment.id} className="appointment-card">
                      <div className="appointment-info">
                        <h4>{appointment.customerName}</h4>
                        <p>{appointment.service}</p>
                        <span className="time">{appointment.date} at {appointment.time}</span>
                      </div>
                      <div className="status confirmed">
                        confirmed
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="services-tab">
              <h2>Your Services</h2>
              <div className="services-grid">
                {dummyData.services.map((service, index) => (
                  <div key={index} className="service-card">
                    <h3>{service.name}</h3>
                    <p className="price">${service.price}</p>
                    <p className="duration">{service.duration}</p>
                    <button className="edit-btn">Edit</button>
                  </div>
                ))}
              </div>
              <button className="add-service-btn">Add New Service</button>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="profile-tab">
              <h2>Salon Profile</h2>
              <div className="profile-info">
                <div className="info-group">
                  <label>Salon Name</label>
                  <p>{user.name}</p>
                </div>
                <div className="info-group">
                  <label>Email</label>
                  <p>{user.email}</p>
                </div>
                <div className="info-group">
                  <label>Phone</label>
                  <p>{user.phone}</p>
                </div>
                <div className="info-group">
                  <label>Address</label>
                  <p>123 Beauty Street, Downtown</p>
                </div>
                <div className="info-group">
                  <label>Working Hours</label>
                  <p>Monday - Saturday: 9:00 AM - 8:00 PM</p>
                </div>
              </div>
              <button className="edit-profile-btn">Edit Profile</button>
            </div>
          )}

          {activeTab === 'admin' && (
            <div className="admin-tab">
              <h2>Admin Panel</h2>
              
              {/* System Statistics */}
              <div className="admin-stats">
                <h3>System Overview</h3>
                <div className="stats-grid">
                  <div className="stat-card">
                    <h4>Total Salons</h4>
                    <p className="stat-value">{dummyData.systemStats.totalSalons}</p>
                  </div>
                  <div className="stat-card">
                    <h4>Total Users</h4>
                    <p className="stat-value">{dummyData.systemStats.totalUsers}</p>
                  </div>
                  <div className="stat-card">
                    <h4>Total Appointments</h4>
                    <p className="stat-value">{dummyData.systemStats.totalAppointments}</p>
                  </div>
                  <div className="stat-card">
                    <h4>Total Revenue</h4>
                    <p className="stat-value">${dummyData.systemStats.totalRevenue}</p>
                  </div>
                </div>
              </div>

              {/* Salon Management */}
              <div className="admin-section">
                <h3>Salon Management</h3>
                <div className="table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Salon Name</th>
                        <th>Owner</th>
                        <th>Status</th>
                        <th>Appointments</th>
                        <th>Revenue</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dummyData.allSalons.map(salon => (
                        <tr key={salon.id}>
                          <td>{salon.name}</td>
                          <td>{salon.owner}</td>
                          <td>
                            <span className={`status-badge ${salon.status}`}>
                              {salon.status}
                            </span>
                          </td>
                          <td>{salon.appointments}</td>
                          <td>${salon.revenue}</td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                className="action-btn approve"
                                onClick={() => handleSalonAction(salon.id, 'Approve')}
                              >
                                Approve
                              </button>
                              <button 
                                className="action-btn suspend"
                                onClick={() => handleSalonAction(salon.id, 'Suspend')}
                              >
                                Suspend
                              </button>
                              <button 
                                className="action-btn delete"
                                onClick={() => handleSalonAction(salon.id, 'Delete')}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* User Management */}
              <div className="admin-section">
                <h3>User Management</h3>
                <div className="table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Join Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dummyData.allUsers.map(user => (
                        <tr key={user.id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`type-badge ${user.type}`}>
                              {user.type}
                            </span>
                          </td>
                          <td>
                            <span className={`status-badge ${user.status}`}>
                              {user.status}
                            </span>
                          </td>
                          <td>{user.joinDate}</td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                className="action-btn approve"
                                onClick={() => handleUserAction(user.id, 'Activate')}
                              >
                                Activate
                              </button>
                              <button 
                                className="action-btn suspend"
                                onClick={() => handleUserAction(user.id, 'Deactivate')}
                              >
                                Deactivate
                              </button>
                              <button 
                                className="action-btn delete"
                                onClick={() => handleUserAction(user.id, 'Delete')}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopkeeperDashboard;

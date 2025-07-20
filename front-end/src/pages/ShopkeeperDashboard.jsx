import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/ShopkeeperDashboard.css';

const ShopkeeperDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('appointments');

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
    ]
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

          </nav>
        </div>

        <div className="main-content">
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


        </div>
      </div>
    </div>
  );
};

export default ShopkeeperDashboard;

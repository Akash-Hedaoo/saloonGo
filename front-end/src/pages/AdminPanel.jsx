import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TodaysAppointments from '../components/TodaysAppointments';
import AdminProfile from '../components/AdminProfile';
// import UpcomingAppointments from '../components/UpcomingAppointments';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar setShowProfile={setShowProfile} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', height: '100vh' }}>
        <div style={{ flex: 1, width: '100%' }}>
          {showProfile ? <AdminProfile /> : <TodaysAppointments />}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 
import React from 'react';
import '../styles/UpcomingAppointments.css';

const UpcomingAppointments = () => {
  return (
    <div className="upcoming-appointments-root">
      <h2 className="upcoming-appointments-heading">Upcoming Appointments</h2>
      <div className="upcoming-appointments-list">
        {/* Appointment items will go here */}
        <div className="upcoming-appointments-empty">No upcoming appointments.</div>
      </div>
    </div>
  );
};

export default UpcomingAppointments; 
import React from 'react';
import '../styles/AppointmentBooking.css';
import FilterSidebar from '../components/FilterSidebar';

const AppointmentBooking = () => {
  return (
    <div className="appointment-booking-root">
      <FilterSidebar />
      <div className="appointment-booking-container">
        {/* Empty appointment booking page */}
      </div>
    </div>
  );
};

export default AppointmentBooking; 
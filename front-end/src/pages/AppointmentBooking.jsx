import React from 'react';
import '../styles/AppointmentBooking.css';
import FilterSidebar from '../components/FilterSidebar';
import SalonDetails from '../components/SalonDetails';

const AppointmentBooking = () => {
  return (
    <div className="appointment-booking-root">
      <div className="booking-header-row">
        <input
          type="text"
          className="booking-search-bar"
          placeholder="Search for salons or services..."
        />
        <FilterSidebar inlineToggle />
      </div>
      <div className="appointment-booking-container">
        <SalonDetails />
      </div>
    </div>
  );
};

export default AppointmentBooking; 
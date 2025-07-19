import React from 'react';
import '../styles/TodaysAppointments.css';
import Appointment from './Appointment';

const TodaysAppointments = () => {
  const handleCancel = (queueNumber, name) => {
    console.log(`Appointment cancelled for ${name} (Queue #${queueNumber})`);
    // TODO: Add actual cancellation logic
  };

  return (
    <div className="todays-appointments-root">
      <h2 className="todays-appointments-heading">Today's Appointments</h2>
      <div className="todays-appointments-list">
        <Appointment 
          queueNumber={1} 
          name="Amit Sharma" 
          time="10:00 AM" 
          service="Haircut" 
          status="upcoming" 
          onCancel={() => handleCancel(1, "Amit Sharma")}
        />
        <Appointment 
          queueNumber={2} 
          name="Priya Singh" 
          time="11:30 AM" 
          service="Facial" 
          status="completed" 
        />
        <Appointment 
          queueNumber={3} 
          name="Rahul Verma" 
          time="1:00 PM" 
          service="Shave" 
          status="cancelled" 
        />
        {/* Add more Appointment components or map over data here */}
      </div>
    </div>
  );
};

export default TodaysAppointments; 
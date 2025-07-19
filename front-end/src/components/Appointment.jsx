import React from 'react';
import '../styles/Appointment.css';

const Appointment = ({ queueNumber, name, time, service, status, onCancel }) => {
  return (
    <div className={`appointment-root${status ? ' appointment-' + status : ''}`}>
      <div className="appointment-info">
        <div className="appointment-header">
          <div className="appointment-queue">#{queueNumber}</div>
          <div className="appointment-name">{name}</div>
        </div>
        <div className="appointment-service">{service}</div>
      </div>
      <div className="appointment-meta">
        <div className="appointment-time">{time}</div>
        {status && <div className={`appointment-status appointment-status-${status}`}>{status}</div>}
        {status === 'upcoming' && (
          <button className="appointment-cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default Appointment; 
import React, { useState } from 'react';
import '../styles/AdminProfile.css';

const AdminProfile = ({ 
  fullName = 'Admin User', 
  email = 'admin@saloonGo.com', 
  salonName = 'My Salon',
  salonAddress = '123 Main Street, City, State',
  phoneNumber = '+91 98765 43210',
  servicesOffered = 'Haircut, Shave, Facial, Manicure',
  openHours = '10:00 AM - 8:00 PM',
  profileImage 
}) => {
  const [isLive, setIsLive] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Editable form state
  const [formData, setFormData] = useState({
    fullName: fullName,
    email: email,
    salonName: salonName,
    salonAddress: salonAddress,
    phoneNumber: phoneNumber,
    servicesOffered: servicesOffered,
    openHours: openHours,
    profileImage: profileImage
  });

  const handleGoLive = () => {
    setIsLive(true);
    // TODO: Add backend call to set shop as live
    console.log('Shop is now LIVE');
  };

  const handleEndLive = () => {
    setIsLive(false);
    // TODO: Add backend call to set shop as offline
    console.log('Shop is now OFFLINE');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // TODO: Add backend call to save updated profile
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      fullName: fullName,
      email: email,
      salonName: salonName,
      salonAddress: salonAddress,
      phoneNumber: phoneNumber,
      servicesOffered: servicesOffered,
      openHours: openHours,
      profileImage: profileImage
    });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="admin-profile-root">
      {/* Remove heading, replace avatar with full-width image */}
      <div className="admin-profile-image-container">
        {formData.profileImage ? (
          <img
            src={formData.profileImage}
            alt="Profile"
            className="admin-profile-full-image"
          />
        ) : (
          <div className="admin-profile-image-placeholder">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-2.5 3.5-4 8-4s8 1.5 8 4"/></svg>
          </div>
        )}
      </div>

      <div className="admin-profile-details">
        <div className="admin-profile-section">
          <h3 className="admin-profile-section-title">Live Status</h3>
          <div className="admin-profile-live-status">
            <div className={`admin-profile-status-indicator ${isLive ? 'live' : 'offline'}`}>
              <span className="admin-profile-status-dot"></span>
              <span className="admin-profile-status-text">{isLive ? 'LIVE' : 'OFFLINE'}</span>
            </div>
            <div className="admin-profile-live-buttons">
              {!isLive ? (
                <button className="admin-profile-go-live-btn" onClick={handleGoLive}>
                  Go Live
                </button>
              ) : (
                <button className="admin-profile-end-live-btn" onClick={handleEndLive}>
                  End Live
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="admin-profile-section">
          <h3 className="admin-profile-section-title">Personal Information</h3>
          <div className="admin-profile-field">
            <span className="admin-profile-label">Full Name:</span>
            {isEditing ? (
              <input
                type="text"
                className="admin-profile-input"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
              />
            ) : (
              <span className="admin-profile-value">{formData.fullName}</span>
            )}
          </div>
          <div className="admin-profile-field">
            <span className="admin-profile-label">Email:</span>
            {isEditing ? (
              <input
                type="email"
                className="admin-profile-input"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            ) : (
              <span className="admin-profile-value">{formData.email}</span>
            )}
          </div>
          <div className="admin-profile-field">
            <span className="admin-profile-label">Phone:</span>
            {isEditing ? (
              <input
                type="tel"
                className="admin-profile-input"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              />
            ) : (
              <span className="admin-profile-value">{formData.phoneNumber}</span>
            )}
          </div>
        </div>

        <div className="admin-profile-section">
          <h3 className="admin-profile-section-title">Business Information</h3>
          <div className="admin-profile-field">
            <span className="admin-profile-label">Salon Name:</span>
            {isEditing ? (
              <input
                type="text"
                className="admin-profile-input"
                value={formData.salonName}
                onChange={(e) => handleInputChange('salonName', e.target.value)}
              />
            ) : (
              <span className="admin-profile-value">{formData.salonName}</span>
            )}
          </div>
          <div className="admin-profile-field">
            <span className="admin-profile-label">Address:</span>
            {isEditing ? (
              <textarea
                className="admin-profile-textarea"
                value={formData.salonAddress}
                onChange={(e) => handleInputChange('salonAddress', e.target.value)}
                rows="2"
              />
            ) : (
              <span className="admin-profile-value">{formData.salonAddress}</span>
            )}
          </div>
          <div className="admin-profile-field">
            <span className="admin-profile-label">Open Hours:</span>
            {isEditing ? (
              <input
                type="text"
                className="admin-profile-input"
                value={formData.openHours}
                onChange={(e) => handleInputChange('openHours', e.target.value)}
                placeholder="e.g., 10:00 AM - 8:00 PM"
              />
            ) : (
              <span className="admin-profile-value">{formData.openHours}</span>
            )}
          </div>
          <div className="admin-profile-field">
            <span className="admin-profile-label">Services:</span>
            {isEditing ? (
              <textarea
                className="admin-profile-textarea"
                value={formData.servicesOffered}
                onChange={(e) => handleInputChange('servicesOffered', e.target.value)}
                placeholder="e.g., Haircut, Shave, Facial, Manicure"
                rows="2"
              />
            ) : (
              <span className="admin-profile-value">{formData.servicesOffered}</span>
            )}
          </div>
        </div>
      </div>

      <div className="admin-profile-actions">
        {isEditing ? (
          <>
            <button className="admin-profile-save-btn" onClick={handleSave}>
              Save Changes
            </button>
            <button className="admin-profile-cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          </>
        ) : (
          <button className="admin-profile-settings-btn" onClick={handleEdit}>
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminProfile; 
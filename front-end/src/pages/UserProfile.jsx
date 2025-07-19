import React, { useState } from 'react';
import '../styles/UserProfile.css';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  // User data state
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91-9876543210',
    joinDate: 'January 2024',
    avatar: 'https://i.pravatar.cc/150?img=3',
    totalBookings: 12,
    favoriteServices: ['Haircut', 'Shave', 'Facial']
  });

  // Editable form state
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Update user data with form data
    setUserData(prev => ({
      ...prev,
      ...formData
    }));
    setIsEditing(false);
    console.log('Profile saved:', formData);
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
    });
    setIsEditing(false);
  };

  const handleSignout = () => {
    // Handle signout logic
    console.log('User signed out');
    // Add navigation to login page or clear session
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="user-profile-container">
      <div className="user-profile-card">
        {/* Profile Image */}
        <div className="user-profile-image-container">
          <img src={userData.avatar} alt="User Avatar" className="user-profile-avatar" />
        </div>

        {/* User Info */}
        <div className="user-profile-info">
          <h2 className="user-profile-name">{userData.name}</h2>
          <p className="user-profile-email">{userData.email}</p>
          <p className="user-profile-join-date">Member since {userData.joinDate}</p>
        </div>

        {/* Profile Details */}
        <div className="user-profile-details">
          <div className="user-profile-section">
            <h3 className="user-profile-section-title">Personal Information</h3>
            <div className="user-profile-field">
              <span className="user-profile-label">Full Name:</span>
              {isEditing ? (
                <input
                  type="text"
                  className="user-profile-input"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              ) : (
                <span className="user-profile-value">{userData.name}</span>
              )}
            </div>
            <div className="user-profile-field">
              <span className="user-profile-label">Email:</span>
              {isEditing ? (
                <input
                  type="email"
                  className="user-profile-input"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              ) : (
                <span className="user-profile-value">{userData.email}</span>
              )}
            </div>
            <div className="user-profile-field">
              <span className="user-profile-label">Phone:</span>
              {isEditing ? (
                <input
                  type="tel"
                  className="user-profile-input"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              ) : (
                <span className="user-profile-value">{userData.phone}</span>
              )}
            </div>
          </div>

          <div className="user-profile-section">
            <h3 className="user-profile-section-title">Account Statistics</h3>
            <div className="user-profile-field">
              <span className="user-profile-label">Total Bookings:</span>
              <span className="user-profile-value">{userData.totalBookings}</span>
            </div>
            <div className="user-profile-field">
              <span className="user-profile-label">Favorite Services:</span>
              <span className="user-profile-value">{userData.favoriteServices.join(', ')}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="user-profile-actions">
          {isEditing ? (
            <>
              <button className="user-profile-save-btn" onClick={handleSave}>
                Save Changes
              </button>
              <button className="user-profile-cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <button className="user-profile-edit-btn" onClick={handleEdit}>
                Edit Profile
              </button>
              <button className="user-profile-signout-btn" onClick={handleSignout}>
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

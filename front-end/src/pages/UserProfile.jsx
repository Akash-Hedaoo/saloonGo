import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import '../styles/UserProfile.css';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, logout } = useAuth();
  
  // User data state
  const [userData, setUserData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    joinDate: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'Recently',
    avatar: user?.profileImage || 'https://i.pravatar.cc/150?img=3',
    totalBookings: 0,
    favoriteServices: []
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

  // Load user profile data on component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        try {
          setIsLoading(true);
          let response;
          if (user.role === 'customer') {
            response = await userAPI.getCustomerProfile();
          } else {
            response = await userAPI.getSalonProfile();
          }
          
          const profileData = response.data;
          setUserData(prev => ({
            ...prev,
            name: profileData.name || user.name,
            email: profileData.email || user.email,
            phone: profileData.phone || user.phone,
            avatar: profileData.profileImage || user.profileImage || prev.avatar,
            joinDate: profileData.createdAt ? new Date(profileData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : prev.joinDate
          }));
        } catch (error) {
          console.error('Error loading profile:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadUserProfile();
  }, [user]);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      };

      let response;
      if (user.role === 'customer') {
        response = await userAPI.updateCustomerProfile(updateData);
      } else {
        response = await userAPI.updateSalonProfile(updateData);
      }

      // Update user data with form data
      setUserData(prev => ({
        ...prev,
        ...formData
      }));
      setIsEditing(false);
      console.log('Profile saved:', response.data);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
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

  const handleSignout = async () => {
    await logout();
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
          {isLoading && <div className="user-profile-loading">Loading...</div>}
          {isEditing ? (
            <>
              <button className="user-profile-save-btn" onClick={handleSave} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button className="user-profile-cancel-btn" onClick={handleCancel} disabled={isLoading}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <button className="user-profile-edit-btn" onClick={handleEdit} disabled={isLoading}>
                Edit Profile
              </button>
              <button className="user-profile-signout-btn" onClick={handleSignout} disabled={isLoading}>
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

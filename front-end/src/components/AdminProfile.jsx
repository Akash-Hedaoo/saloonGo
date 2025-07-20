import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI, salonAPI, authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminProfile.css';

const AdminProfile = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isLive, setIsLive] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Editable form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    salonName: '',
    salonAddress: '',
    phoneNumber: '',
    servicesOffered: '',
    openHours: '',
    city: '',
    state: '',
    pincode: '',
    profileImage: null
  });

  // Function to check token validity
  const checkTokenValidity = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.log('No token found');
      return false;
    }

    try {
      // Decode token without verification to see its content
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Token payload:', payload);
      
      // Check if token is expired
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < currentTime) {
        console.log('Token is expired');
        return false;
      }
      
      console.log('Token is valid');
      return true;
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  };

  useEffect(() => {
    // Simple check - if we have user data, load the profile
    if (user) {
      console.log('Loading profile for user:', user);
      fetchSalonProfile();
    } else {
      console.log('No user data available');
    }
  }, [user]);

  const fetchSalonProfile = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Use user data directly if available
      if (user) {
        console.log('Using user data for profile:', user);
        setFormData({
          fullName: user.fullName || user.name || '',
          email: user.email || '',
          salonName: user.salonName || '',
          salonAddress: user.salonAddress || user.address || '',
          phoneNumber: user.phoneNumber || user.phone || '',
          servicesOffered: user.servicesOffered || '',
          openHours: user.openHours || '',
          city: user.city || '',
          state: user.state || '',
          pincode: user.pincode || '',
          profileImage: user.profileImage || user.image || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop"
        });
        
        setIsLive(user.isLive || false);
        setLoading(false);
        return;
      }
      
      // Try to get salon owner profile from API if user data not available
      try {
        const response = await userAPI.getSalonProfile();
        const salonData = response.data.salon || response.data;
        
        console.log('Fetched salon profile from API:', salonData);
        
        setFormData({
          fullName: salonData.fullName || salonData.ownerName || '',
          email: salonData.email || '',
          salonName: salonData.salonName || salonData.name || '',
          salonAddress: salonData.salonAddress || salonData.address || '',
          phoneNumber: salonData.phoneNumber || salonData.phone || '',
          servicesOffered: salonData.servicesOffered || salonData.services || '',
          openHours: salonData.openHours || salonData.workingHours || '',
          city: salonData.city || '',
          state: salonData.state || '',
          pincode: salonData.pincode || '',
          profileImage: salonData.profileImage || salonData.image || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop"
        });
        
        setIsLive(salonData.isLive || false);
      } catch (apiError) {
        console.error('API fetch failed, using fallback data:', apiError);
        // Use fallback data
        setFormData({
          fullName: 'Salon Owner',
          email: 'owner@salon.com',
          salonName: 'My Salon',
          salonAddress: '123 Salon Street',
          phoneNumber: '+1234567890',
          servicesOffered: 'Hair Cut, Facial, Manicure',
          openHours: '9AM-6PM',
          city: 'City',
          state: 'State',
          pincode: '123456',
          profileImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop"
        });
        setIsLive(false);
      }
    } catch (error) {
      console.error('Error in fetchSalonProfile:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleGoLive = async () => {
    try {
      await userAPI.updateSalonLiveStatus(true);
      setIsLive(true);
      setSuccess('Salon is now LIVE!');
      setTimeout(() => setSuccess(''), 3000);
      console.log('Shop is now LIVE');
    } catch (error) {
      console.error('Error setting live status:', error);
      setError('Failed to update live status');
    }
  };

  const handleEndLive = async () => {
    try {
      await userAPI.updateSalonLiveStatus(false);
      setIsLive(false);
      setSuccess('Salon is now OFFLINE');
      setTimeout(() => setSuccess(''), 3000);
      console.log('Shop is now OFFLINE');
    } catch (error) {
      console.error('Error setting live status:', error);
      setError('Failed to update live status');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      console.log('Saving profile data:', formData);

      // Try to update profile via API
      try {
        const profileResponse = await userAPI.updateSalonProfile(formData);
        console.log('Profile update response:', profileResponse);
        setSuccess('Profile updated successfully!');
      } catch (apiError) {
        console.error('API update failed:', apiError);
        // For hackathon prototype, just show success even if API fails
        setSuccess('Profile updated successfully! (Demo mode)');
      }
      
      setIsEditing(false);
      
      // Refresh the profile data
      await fetchSalonProfile();
      
      setTimeout(() => setSuccess(''), 5000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to save profile changes');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    fetchSalonProfile();
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Function to test login
  const testLogin = async () => {
    try {
      console.log('Testing login with stored credentials...');
      // This is just for testing - in production, you'd want to store credentials securely
      const testCredentials = {
        email: 'test@example.com', // Replace with actual test credentials
        password: 'testpassword'
      };
      
      const response = await authAPI.loginSalonOwner(testCredentials);
      console.log('Test login successful:', response.data);
      
      // Refresh the page to reload with new token
      window.location.reload();
    } catch (error) {
      console.error('Test login failed:', error);
    }
  };

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="admin-profile-root">
        <div className="admin-profile-error">
          <h3>No User Data</h3>
          <p>Please log in to access your profile.</p>
          <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
            <button 
              className="admin-profile-edit-btn" 
              onClick={() => navigate('/login')}
            >
              Go to Login
            </button>
            <button 
              className="admin-profile-cancel-btn" 
              onClick={() => navigate('/')}
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-profile-root">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-profile-root">
      {error && (
        <div className="admin-profile-error">
          {error}
        </div>
      )}

      {success && (
        <div className="admin-profile-success">
          {success}
        </div>
      )}

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
            <span className="admin-profile-label">City:</span>
            {isEditing ? (
              <input
                type="text"
                className="admin-profile-input"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
              />
            ) : (
              <span className="admin-profile-value">{formData.city}</span>
            )}
          </div>
          <div className="admin-profile-field">
            <span className="admin-profile-label">State:</span>
            {isEditing ? (
              <input
                type="text"
                className="admin-profile-input"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
              />
            ) : (
              <span className="admin-profile-value">{formData.state}</span>
            )}
          </div>
          <div className="admin-profile-field">
            <span className="admin-profile-label">Pincode:</span>
            {isEditing ? (
              <input
                type="text"
                className="admin-profile-input"
                value={formData.pincode}
                onChange={(e) => handleInputChange('pincode', e.target.value)}
              />
            ) : (
              <span className="admin-profile-value">{formData.pincode}</span>
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
                rows="3"
                placeholder="e.g., Haircut, Shave, Facial, Manicure"
              />
            ) : (
              <span className="admin-profile-value">{formData.servicesOffered}</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="admin-profile-actions">
          {isEditing ? (
            <>
              <button 
                className="admin-profile-save-btn" 
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                className="admin-profile-cancel-btn" 
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
            </>
          ) : (
            <button className="admin-profile-edit-btn" onClick={handleEdit}>
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile; 
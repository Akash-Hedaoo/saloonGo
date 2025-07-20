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
    // Wait for AuthContext to finish loading
    if (authLoading) {
      console.log('Waiting for AuthContext to load...');
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      navigate('/login');
      return;
    }

    console.log('User authenticated:', user);
    console.log('Auth token:', localStorage.getItem('accessToken'));
    
    // Only proceed if we have user data
    if (user) {
      fetchSalonProfile();
      
      // Test authentication (but don't redirect on failure - let interceptor handle it)
      const testAuth = async () => {
        try {
          console.log('Testing authentication...');
          const response = await authAPI.testAuth();
          console.log('Auth test successful:', response.data);
        } catch (error) {
          console.error('Auth test failed:', error);
          console.error('Auth test error details:', error.response?.data);
          // Don't redirect here - let the API interceptor handle authentication issues
          // The interceptor will automatically refresh tokens or redirect if needed
        }
      };
      
      testAuth();
    }
  }, [authLoading, isAuthenticated, user, navigate]);

  const fetchSalonProfile = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Try to get salon owner profile first
      const response = await userAPI.getSalonProfile();
      const salonData = response.data.salon || response.data;
      
      console.log('Fetched salon profile:', salonData);
      
      setFormData({
        fullName: salonData.fullName || salonData.ownerName || user?.fullName || '',
        email: salonData.email || user?.email || '',
        salonName: salonData.salonName || salonData.name || '',
        salonAddress: salonData.salonAddress || salonData.address || '',
        phoneNumber: salonData.phoneNumber || salonData.phone || '',
        servicesOffered: salonData.servicesOffered || salonData.services || '',
        openHours: salonData.openHours || salonData.workingHours || '',
        city: salonData.city || '',
        state: salonData.state || '',
        pincode: salonData.pincode || '',
        profileImage: salonData.profileImage || salonData.image || null
      });
      
      setIsLive(salonData.isLive || false);
    } catch (error) {
      console.error('Error fetching salon profile:', error);
      setError('Failed to load profile data');
      
      // Use user data as fallback if available
      if (user) {
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
          profileImage: user.profileImage || user.image || null
        });
      }
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

      // Check if user is authenticated
      if (!user) {
        setError('You must be logged in to update your profile');
        return;
      }

      // Check if tokens exist
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!accessToken) {
        setError('No access token found. Please log in again.');
        navigate('/login');
        return;
      }

      console.log('Saving profile data:', formData);
      console.log('Current user:', user);
      console.log('Auth token exists:', !!accessToken);
      console.log('Refresh token exists:', !!refreshToken);

      // First, update the salon owner profile (this now automatically syncs with salon search data)
      const profileResponse = await userAPI.updateSalonProfile(formData);
      console.log('Profile update response:', profileResponse);
      
      console.log('Profile saved successfully');
      setIsEditing(false);
      setSuccess('Profile updated successfully! Your salon details have been automatically updated in the search results.');
      
      // Refresh the profile data
      await fetchSalonProfile();
      
      // Show a longer success message with instructions
      setTimeout(() => {
        setSuccess('Profile updated! Your salon details are now live in the search results.');
      }, 5000);
      
      setTimeout(() => setSuccess(''), 10000);
    } catch (error) {
      console.error('Error saving profile:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      
      // Don't redirect to login here - let the interceptor handle it
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to save profile changes';
      setError(errorMessage);
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
  if (!authLoading && (!isAuthenticated || !user)) {
    return (
      <div className="admin-profile-root">
        <div className="admin-profile-error">
          <h3>Authentication Required</h3>
          <p>You need to be logged in to access your profile.</p>
          <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
            <button 
              className="admin-profile-edit-btn" 
              onClick={() => navigate('/login')}
            >
              Go to Login
            </button>
            <button 
              className="admin-profile-cancel-btn" 
              onClick={testLogin}
            >
              Test Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading || authLoading) {
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
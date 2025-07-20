import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import '../styles/ShopRegistration.css';

const ShopRegistration = () => {
  const { signupSalonOwner } = useAuth();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    salonName: '',
    salonAddress: '',
    phoneNumber: '',
    servicesOffered: '',
    openHours: '',
    city: '',
    state: '',
    pincode: '',
    role: 'salonOwner',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Test server connectivity
    const testServerConnection = async () => {
      try {
        console.log('Testing server connectivity...');
        const response = await fetch('http://localhost:3001/api/auth/health');
        const data = await response.json();
        console.log('Server health check:', data);
      } catch (error) {
        console.error('Server connectivity test failed:', error);
        setError('Cannot connect to server. Please check if the backend is running.');
      }
    };

    testServerConnection();
  }, []);

  const handleChange = e => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (!form.fullName || !form.email || !form.salonName || !form.salonAddress || !form.phoneNumber) {
      setError('Please fill in all required fields');
      return false;
    }
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Prepare the data for registration
      const registrationData = {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        salonName: form.salonName,
        salonAddress: form.salonAddress,
        phoneNumber: form.phoneNumber,
        servicesOffered: form.servicesOffered,
        openHours: form.openHours,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        role: form.role
      };

      console.log('Submitting registration data:', registrationData);

      // Validate required fields on frontend
      const requiredFields = ['fullName', 'email', 'password', 'salonName', 'salonAddress', 'phoneNumber'];
      const missingFields = requiredFields.filter(field => !registrationData[field]);
      
      if (missingFields.length > 0) {
        setError(`Missing required fields: ${missingFields.join(', ')}`);
        return;
      }

      console.log('Calling signupSalonOwner with data:', registrationData);
      const response = await signupSalonOwner(registrationData);
      console.log('Signup response:', response);

      setSuccess('Shop registration successful! Redirecting to your admin panel...');
      
      // Clear form after successful registration
      setForm({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        salonName: '',
        salonAddress: '',
        phoneNumber: '',
        servicesOffered: '',
        openHours: '',
        city: '',
        state: '',
        pincode: '',
        role: 'salonOwner',
      });

      // Redirect to admin panel after 2 seconds
      setTimeout(() => {
        window.location.href = '/admin';
      }, 2000);

    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      
      // Handle specific error types
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData.errors) {
          // Validation errors
          const errorMessages = Object.values(errorData.errors).join(', ');
          setError(`Validation errors: ${errorMessages}`);
        } else if (errorData.error) {
          setError(errorData.error);
        } else {
          setError('Invalid registration data. Please check your information.');
        }
      } else if (error.response?.status === 409) {
        setError('A salon with this email already exists. Please use a different email.');
      } else if (error.response?.status === 500) {
        const errorData = error.response.data;
        if (errorData.details) {
          setError(`Server error: ${errorData.details}`);
        } else {
          setError('Server error during registration. Please try again later.');
        }
      } else if (error.code === 'NETWORK_ERROR') {
        setError('Network error. Please check your internet connection and try again.');
      } else {
        const errorMessage = error.response?.data?.error || 
                            error.response?.data?.details || 
                            error.response?.data?.message || 
                            error.message ||
                            'Registration failed. Please try again.';
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const createTestRegistration = async () => {
    try {
      const testData = {
        fullName: 'Test Owner',
        email: `testowner${Date.now()}@example.com`,
        password: 'Test123!',
        salonName: 'Test Salon',
        salonAddress: '123 Test St, Test City, TS 12345',
        phoneNumber: '+1234567890',
        servicesOffered: 'Haircut, Hair Coloring, Hair Styling',
        openHours: '10AM-6PM',
        city: 'Test City',
        state: 'TS',
        pincode: '12345',
        role: 'salonOwner'
      };

      console.log('Creating test registration record...');
      const response = await signupSalonOwner(testData);
      console.log('Test registration response:', response);
      setSuccess('Test registration record created successfully!');
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Error creating test registration record:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.details || 
                          error.response?.data?.message || 
                          error.message ||
                          'Failed to create test registration record.';
      setError(errorMessage);
    }
  };

  return (
    <div className="shopreg-root">
      <div className="shopreg-container">
        <h1 className="shopreg-heading">Register Your Salon</h1>
        
        {error && (
          <div className="shopreg-error">
            {error}
          </div>
        )}
        
        {success && (
          <div className="shopreg-success">
            {success}
          </div>
        )}

        <form className="shopreg-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Owner Information</h3>
            <input
              type="text"
              name="fullName"
              placeholder="Owner's Full Name *"
              value={form.fullName}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email *"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password (min 6 chars) *"
              value={form.password}
              onChange={handleChange}
              minLength={6}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password *"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-section">
            <h3>Salon Information</h3>
            <input
              type="text"
              name="salonName"
              placeholder="Salon Name *"
              value={form.salonName}
              onChange={handleChange}
              required
            />
            <textarea
              name="salonAddress"
              placeholder="Salon Address *"
              value={form.salonAddress}
              onChange={handleChange}
              required
              rows="3"
            />
            <div className="form-row">
              <input
                type="text"
                name="city"
                placeholder="City *"
                value={form.city}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="state"
                placeholder="State *"
                value={form.state}
                onChange={handleChange}
                required
              />
            </div>
            <input
              type="text"
              name="pincode"
              placeholder="Pincode *"
              value={form.pincode}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number (with country code) *"
              value={form.phoneNumber}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="servicesOffered"
              placeholder="Services Offered (comma separated) *"
              value={form.servicesOffered}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="openHours"
              placeholder="Open Hours (e.g., 10AM–8PM)"
              value={form.openHours}
              onChange={handleChange}
            />
          </div>

          <input
            type="hidden"
            name="role"
            value="salonOwner"
            readOnly
          />
          
          <button 
            className="shopreg-btn" 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register Shop'}
          </button>
        </form>
        
        <div className="shopreg-login-link">
          Already registered? <a href="/login">Login here</a>
        </div>
        
        {/* Test button for creating registration record */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button 
            onClick={createTestRegistration}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Test Create Registration Record
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopRegistration; 
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/ShopRegistration.css';

const ShopRegistration = () => {
  const { signupSalonOwner } = useAuth();
  const navigate = useNavigate();
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
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // Phone validation (basic)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(form.phoneNumber.replace(/\s/g, ''))) {
      setError('Please enter a valid phone number');
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

      setSuccess('Shop registration successful! Redirecting to your dashboard...');
      
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

      // Redirect to shopkeeper dashboard after 2 seconds
      setTimeout(() => {
        navigate('/shopkeeper-dashboard');
      }, 2000);

    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle error from AuthContext
      if (error.error) {
        setError(error.error);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
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
        
        <div className="shopreg-demo-section">
          <p>Want to try it out? Use our demo registration:</p>
          <button 
            className="shopreg-demo-btn"
            onClick={() => {
              setForm({
                fullName: 'Demo Salon Owner',
                email: `demo${Date.now()}@salon.com`,
                password: 'demo123',
                confirmPassword: 'demo123',
                salonName: 'Demo Beauty Salon',
                salonAddress: '123 Demo Street, Demo City',
                phoneNumber: '+1234567890',
                servicesOffered: 'Haircut, Hair Coloring, Facial, Manicure',
                openHours: '9:00 AM - 8:00 PM',
                city: 'Demo City',
                state: 'DC',
                pincode: '12345',
                role: 'salonOwner',
              });
            }}
          >
            Fill Demo Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopRegistration; 
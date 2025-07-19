import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

const Auth = ({ initialMode = 'login', standalone }) => {
  const [rightPanelActive, setRightPanelActive] = useState(initialMode === 'register');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    userType: 'customer' // 'customer' or 'salonOwner'
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  const { signupCustomer, signupSalonOwner, loginCustomer, loginSalonOwner, error, clearError } = useAuth();

  // Clear error when component mounts or form changes
  useEffect(() => {
    clearError();
  }, [clearError, rightPanelActive]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    // Check password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(formData.password)) {
      alert('Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number');
      setIsLoading(false);
      return;
    }

    try {
      let userData;
      if (formData.userType === 'customer') {
        userData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone
        };
      } else {
        userData = {
          fullName: formData.name,
          email: formData.email,
          password: formData.password,
          salonName: formData.name + "'s Salon", // Default salon name
          salonAddress: "Address to be updated",
          phoneNumber: formData.phone,
          servicesOffered: ["Haircut", "Styling"], // Default services
          role: 'salonOwner'
        };
      }

      let result;
      if (formData.userType === 'customer') {
        result = await signupCustomer(userData);
      } else {
        result = await signupSalonOwner(userData);
      }

      if (result.success) {
        // Redirect to appropriate page based on user type
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const credentials = {
        email: formData.email,
        password: formData.password
      };

      let result;
      if (formData.userType === 'customer') {
        result = await loginCustomer(credentials);
      } else {
        result = await loginSalonOwner(credentials);
      }

      if (result.success) {
        // Redirect to appropriate page based on user type
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <div className={`auth-container${rightPanelActive ? ' right-panel-active' : ''}`}> 
        {standalone && (
          <button className="auth-close-btn" onClick={() => navigate(-1)} title="Close">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#232336" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
        
        {/* Error Display */}
        {error && (
          <div className="auth-error-message">
            {error}
            <button onClick={clearError} className="auth-error-close">×</button>
          </div>
        )}

        <div className="auth-form-container auth-sign-up-container">
          <form className="auth-form" onSubmit={handleSignup}>
            {/* User Type Selection */}
            <label>
              <input
                type="radio"
                name="userType"
                value="customer"
                checked={formData.userType === 'customer'}
                onChange={handleInputChange}
              />
              Customer
            </label>
            <label>
              <input
                type="radio"
                name="userType"
                value="salonOwner"
                checked={formData.userType === 'salonOwner'}
                onChange={handleInputChange}
              />
              Salon Owner
            </label>

            <span>Create your account</span>
            
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <small className="auth-password-hint">
              Password must contain at least 6 characters with uppercase, lowercase, and number
            </small>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
            <button type="submit" className="auth-btn" disabled={isLoading}>
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
        </div>
        
        <div className="auth-form-container auth-sign-in-container">
          <form className="auth-form" onSubmit={handleLogin}>
            {/* User Type Selection */}
            <label>
              <input
                type="radio"
                name="userType"
                value="customer"
                checked={formData.userType === 'customer'}
                onChange={handleInputChange}
              />
              Customer
            </label>
            <label>
              <input
                type="radio"
                name="userType"
                value="salonOwner"
                checked={formData.userType === 'salonOwner'}
                onChange={handleInputChange}
              />
              Salon Owner
            </label>

            <span>Sign in to your account</span>
            
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <a href="#">Forgot your password?</a>
            <button type="submit" className="auth-btn" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
        
        <div className="auth-overlay-container">
          <div className="auth-overlay">
            <div className="auth-overlay-panel auth-overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="ghost auth-slider-btn" onClick={() => setRightPanelActive(false)}>Sign In</button>
            </div>
            <div className="auth-overlay-panel auth-overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button className="ghost auth-slider-btn" onClick={() => setRightPanelActive(true)}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth; 
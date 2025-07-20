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
  const { login, signup, error, clearError } = useAuth();

  // Dummy users for demo
  const dummyUsers = {
    customers: [
      { email: 'john@example.com', password: 'Password123', name: 'John Doe', phone: '+1234567890', id: 'cust1' },
      { email: 'jane@example.com', password: 'Password123', name: 'Jane Smith', phone: '+1234567891', id: 'cust2' },
      { email: 'demo@customer.com', password: 'demo123', name: 'Demo Customer', phone: '+1234567892', id: 'cust3' }
    ],
    salonOwners: [
      { email: 'salon@elite.com', password: 'Password123', name: 'Elite Beauty Salon', phone: '+1234567893', id: 'salon1' },
      { email: 'glamour@studio.com', password: 'Password123', name: 'Glamour Studio', phone: '+1234567894', id: 'salon2' },
      { email: 'demo@salon.com', password: 'demo123', name: 'Demo Salon', phone: '+1234567895', id: 'salon3' }
    ]
  };

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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user already exists
      const existingUsers = formData.userType === 'customer' ? dummyUsers.customers : dummyUsers.salonOwners;
      const existingUser = existingUsers.find(user => user.email === formData.email);
      
      if (existingUser) {
        alert('User with this email already exists. Please use a different email or try logging in.');
        setIsLoading(false);
        return;
      }

      // Create new user
      const newUser = {
        id: `${formData.userType === 'customer' ? 'cust' : 'salon'}${Date.now()}`,
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
        userType: formData.userType,
        createdAt: new Date().toISOString()
      };

      // Add to dummy users (in real app, this would be saved to database)
      if (formData.userType === 'customer') {
        dummyUsers.customers.push(newUser);
      } else {
        dummyUsers.salonOwners.push(newUser);
      }

      // Login the new user
      const loginResult = await login({
        email: formData.email,
        password: formData.password,
        userType: formData.userType
      });

      if (loginResult.success) {
        alert(`Welcome ${formData.name}! Your account has been created successfully.`);
        // Redirect based on user type
        let redirectPath = location.state?.from?.pathname || '/';
        if (loginResult.user.userType === 'salonOwner') {
          redirectPath = '/shopkeeper-dashboard';
        }
        navigate(redirectPath, { replace: true });
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const credentials = {
        email: formData.email,
        password: formData.password,
        userType: formData.userType
      };

      const result = await login(credentials);

      if (result.success) {
        alert(`Welcome back, ${result.user.name}!`);
        // Redirect based on user type
        let redirectPath = location.state?.from?.pathname || '/';
        if (result.user.userType === 'salonOwner') {
          redirectPath = '/shopkeeper-dashboard';
        }
        navigate(redirectPath, { replace: true });
      } else {
        alert('Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (userType) => {
    const demoUsers = userType === 'customer' ? dummyUsers.customers : dummyUsers.salonOwners;
    const demoUser = demoUsers.find(user => user.email.includes('demo'));
    
    if (demoUser) {
      setFormData({
        ...formData,
        userType: userType,
        email: demoUser.email,
        password: demoUser.password
      });
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
            <h2>Create Account</h2>
            
            {/* User Type Selection */}
            <div className="user-type-selection">
              <label className="radio-label">
                <input
                  type="radio"
                  name="userType"
                  value="customer"
                  checked={formData.userType === 'customer'}
                  onChange={handleInputChange}
                />
                <span className="radio-custom"></span>
                Customer
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="userType"
                  value="salonOwner"
                  checked={formData.userType === 'salonOwner'}
                  onChange={handleInputChange}
                />
                <span className="radio-custom"></span>
                Salon Owner
              </label>
            </div>

            <span>Create your account</span>
            
            <input
              type="text"
              name="name"
              placeholder={formData.userType === 'customer' ? "Full Name" : "Salon Name"}
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

            {/* Demo Login Buttons */}
            <div className="demo-login-section">
              <p>Try demo accounts:</p>
              <button 
                type="button" 
                className="demo-btn customer"
                onClick={() => handleDemoLogin('customer')}
              >
                Demo Customer
              </button>
              <button 
                type="button" 
                className="demo-btn salon"
                onClick={() => handleDemoLogin('salonOwner')}
              >
                Demo Salon
              </button>
            </div>
          </form>
        </div>
        
        <div className="auth-form-container auth-sign-in-container">
          <form className="auth-form" onSubmit={handleLogin}>
            <h2>Sign In</h2>
            
            {/* User Type Selection */}
            <div className="user-type-selection">
              <label className="radio-label">
                <input
                  type="radio"
                  name="userType"
                  value="customer"
                  checked={formData.userType === 'customer'}
                  onChange={handleInputChange}
                />
                <span className="radio-custom"></span>
                Customer
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="userType"
                  value="salonOwner"
                  checked={formData.userType === 'salonOwner'}
                  onChange={handleInputChange}
                />
                <span className="radio-custom"></span>
                Salon Owner
              </label>
            </div>

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
            <button type="submit" className="auth-btn" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>

            {/* Demo Login Buttons */}
            <div className="demo-login-section">
              <p>Try demo accounts:</p>
              <button 
                type="button" 
                className="demo-btn customer"
                onClick={() => handleDemoLogin('customer')}
              >
                Demo Customer
              </button>
              <button 
                type="button" 
                className="demo-btn salon"
                onClick={() => handleDemoLogin('salonOwner')}
              >
                Demo Salon
              </button>
            </div>
          </form>
        </div>

        <div className="auth-overlay-container">
          <div className="auth-overlay">
            <div className="auth-overlay-panel auth-overlay-left">
              <h2>Welcome Back!</h2>
              <p>To keep connected with us please login with your personal info</p>
              <button 
                className="auth-ghost auth-btn" 
                onClick={() => setRightPanelActive(false)}
              >
                Sign In
              </button>
            </div>
            <div className="auth-overlay-panel auth-overlay-right">
              <h2>Hello, Friend!</h2>
              <p>Enter your personal details and start journey with us</p>
              <button 
                className="auth-ghost auth-btn" 
                onClick={() => setRightPanelActive(true)}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth; 
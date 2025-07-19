import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';
import googleLogo from '../assets/images/icons8-google-logo-48.png';

const Auth = ({ initialMode = 'login', standalone }) => {
  const [rightPanelActive, setRightPanelActive] = useState(initialMode === 'register');
  const navigate = useNavigate();

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
        <div className="auth-form-container auth-sign-up-container">
          <form className="auth-form">
            <h1 className="auth-heading">Create Account</h1>
            <div className="auth-social-container">
              <a href="#" className="social" title="Google">
                <img src={googleLogo} alt="Google logo" className="auth-google-logo" />
              </a>
            </div>
            <span>or use your email for registration</span>
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <input type="password" placeholder="Confirm Password" />
            <button className="auth-btn">Sign Up</button>
          </form>
        </div>
        <div className="auth-form-container auth-sign-in-container">
          <form className="auth-form">
            <h1 className="auth-heading">Sign in</h1>
            <div className="auth-social-container">
              <a href="#" className="social" title="Google">
                <img src={googleLogo} alt="Google logo" className="auth-google-logo" />
              </a>
            </div>
            <span>or use your account</span>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <a href="#">Forgot your password?</a>
            <button className="auth-btn">Sign In</button>
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
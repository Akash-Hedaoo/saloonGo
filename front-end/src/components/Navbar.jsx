
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar premium-navbar">
      <div className="navbar-logo gradient-text">SaloonGo</div>
      <div className={`navbar-links${open ? ' open' : ''}`}>
        <Link to="/" onClick={() => setOpen(false)}>Home</Link>
        <Link to="/contact" onClick={() => setOpen(false)}>Contact</Link>
        <div className="navbar-auth-group">
          <Link to="/login" className="navbar-login-btn" onClick={() => setOpen(false)}>
            Login
          </Link>
          <Link to="/register" className="navbar-register-btn" onClick={() => setOpen(false)}>
            Register
          </Link>
          <Link to="/user-profile" className="navbar-profile-icon" onClick={() => setOpen(false)} title="Profile">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-2.5 3.5-4 8-4s8 1.5 8 4" />
            </svg>
          </Link>
        </div>
      </div>
      <div className={`navbar-hamburger${open ? ' open' : ''}`} onClick={() => setOpen(!open)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
};

export default Navbar;

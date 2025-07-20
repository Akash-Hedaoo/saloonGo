
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setOpen(false);
  };

  return (
    <nav className="navbar premium-navbar">
      <div className="navbar-logo gradient-text">SaloonGo</div>
      <div className={`navbar-links${open ? ' open' : ''}`}>
        <Link to="/" onClick={() => setOpen(false)}>Home</Link>
        <Link to="/appointment-booking" onClick={() => setOpen(false)}>Find Salons</Link>
        <Link to="/contact" onClick={() => setOpen(false)}>Contact</Link>
        {isAuthenticated && (user?.userType === 'salonOwner' || user?.role === 'salonOwner') && (
          <Link to="/shopkeeper-dashboard" className="navbar-management-btn" onClick={() => setOpen(false)}>
            Manage Salon
          </Link>
        )}
        {(user?.userType === 'admin' || user?.role === 'admin') && (
          <Link to="/admin" className="navbar-admin-btn" onClick={() => setOpen(false)}>
            Admin Panel
          </Link>
        )}
        <div className="navbar-auth-group">
          <button 
            className="navbar-theme-toggle" 
            onClick={toggleTheme}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
          {!isAuthenticated ? (
            <Link to="/login" className="navbar-login-btn" onClick={() => setOpen(false)}>
              Login
            </Link>
          ) : (
            <>
              <span className="navbar-welcome">Welcome, {user?.name}</span>
              <Link to="/user-profile" className="navbar-profile-icon" onClick={() => setOpen(false)} title="Profile">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-2.5 3.5-4 8-4s8 1.5 8 4" />
                </svg>
              </Link>
              <button className="navbar-logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
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

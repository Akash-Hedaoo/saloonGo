
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
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
        {isAuthenticated && user?.role === 'salonOwner' && (
          <Link to="/admin" className="navbar-management-btn" onClick={() => setOpen(false)}>
            Manage Salon
          </Link>
        )}
        {user?.role === 'admin' && (
          <Link to="/admin" className="navbar-admin-btn" onClick={() => setOpen(false)}>
            Admin Panel
          </Link>
        )}
        <div className="navbar-auth-group">
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

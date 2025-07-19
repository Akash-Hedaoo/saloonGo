
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-logo">SaloonGo</div>
      <div className={`navbar-links${open ? ' open' : ''}`}>
        <Link to="/" onClick={() => setOpen(false)}>Home</Link>
        <Link to="/contact" onClick={() => setOpen(false)}>Contact</Link>
        <Link to="/user-profile" onClick={() => setOpen(false)}>User Profile</Link>
        <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
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

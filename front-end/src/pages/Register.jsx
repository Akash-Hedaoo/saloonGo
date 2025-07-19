
import React from 'react';
import '../styles/Register.css';
import googleLogo from '../assets/images/icons8-google-logo-48.png';

const Register = () => {
  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-title">Register</div>
        <form className="login-form">
          <input type="text" placeholder="Name" required />
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <input type="password" placeholder="Confirm Password" required />
          <button type="submit">Register</button>
        </form>
        <div className="divider">or</div>
        <button className="google-btn">
          <img src={googleLogo} alt="Google logo" />
          Sign up with Google
        </button>
      </div>
    </div>
  );
};

export default Register;

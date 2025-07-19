
import React, { useState, useEffect } from 'react';
import '../styles/Login.css';
import googleLogo from '../assets/images/icons8-google-logo-48.png';

const Login = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mq.matches);
    const handler = (e) => setIsDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add login logic here
    alert(`Email: ${email}\nPassword: ${password}`);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-title">Login</div>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder="Password"
          />
          <button type="submit">Login</button>
        </form>
        <div className="divider">or</div>
        <button className="google-btn">
          <img src={googleLogo} alt="Google logo" />
          Sign in with Google
        </button>
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <span>Don't have an account?</span>
          <br />
          <a href="#signup" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 500 }}>
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};


export default Login;
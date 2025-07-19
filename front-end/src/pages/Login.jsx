import React, { useState, useEffect } from 'react';
import './login.css';

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
    <div className={`login-bg${isDark ? ' dark' : ''}`}>
      <div className="login-container">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label className="login-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="login-input"
            />
          </div>
          <div className="login-field">
            <label className="login-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="login-input"
            />
          </div>
          <button
            type="submit"
            className="login-btn"
          >
            Login
          </button>
        </form>
        <div className="login-signup">
          <span>Don't have an account?</span>
          <br />
          <a
            href="#signup"
            className="signup-link"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};


export default Login;
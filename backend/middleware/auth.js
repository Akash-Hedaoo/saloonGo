const jwt = require('jsonwebtoken');
const { db } = require('../config/firebaseAdmin');
const config = require('../config/config');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  console.log('Auth middleware - Headers:', req.headers);
  console.log('Auth middleware - Token:', token ? token.substring(0, 20) + '...' : 'No token');

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    console.log('Auth middleware - JWT Secret:', config.jwtSecret ? 'Secret exists' : 'No secret');
    const decoded = jwt.verify(token, config.jwtSecret);
    console.log('Auth middleware - Decoded token:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    console.error('Token verification error details:', error);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Middleware to check if user is a customer
const isCustomer = async (req, res, next) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ error: 'Customer access required' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
};

// Middleware to check if user is a salon owner
const isSalonOwner = async (req, res, next) => {
  try {
    if (req.user.role !== 'salonOwner') {
      return res.status(403).json({ error: 'Salon owner access required' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
};

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  authenticateToken,
  isCustomer,
  isSalonOwner,
  isAdmin
}; 
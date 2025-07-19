const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { admin, db } = require('../config/firebaseAdmin');
const { generateToken, generateRefreshToken } = require('../utils/jwt');
const { validateSignup, validateLogin, validateSalonRegistration } = require('../utils/validation');
const { authenticateToken } = require('../middleware/auth');
const jwt = require('jsonwebtoken'); // Added missing import for jwt

// ✅ 1. Customer Signup
router.post('/signup/customer', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Validate input
    const validation = validateSignup({ name, email, password });
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    // Check if user already exists
    const existingUser = await db.collection('customers').where('email', '==', email.trim()).get();
    if (!existingUser.empty) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user document
    const userData = {
      name: name.trim(),
      email: email.trim(),
      password: hashedPassword,
      phone: phone || null,
      address: address || null,
      role: 'customer',
      isActive: true,
      profileImage: null,
      preferences: {
        notifications: true,
        emailUpdates: true
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const userRef = await db.collection('customers').add(userData);
    
    // Generate tokens
    const tokenPayload = {
      userId: userRef.id,
      email: userData.email,
      role: userData.role,
      name: userData.name
    };

    const token = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Store refresh token
    await db.collection('refreshTokens').add({
      userId: userRef.id,
      token: refreshToken,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({
      message: 'Customer registered successfully',
      user: {
        id: userRef.id,
        name: userData.name,
        email: userData.email,
        role: userData.role
      },
      token,
      refreshToken
    });

  } catch (error) {
    console.error('Customer signup error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// ✅ 2. Salon Owner Signup
router.post('/signup/salonOwner', async (req, res) => {
  try {
    const { 
      fullName, 
      email, 
      password, 
      salonName, 
      salonAddress, 
      phoneNumber, 
      servicesOffered, 
      openHours, 
      role 
    } = req.body;

    // Validate input
    const validation = validateSalonRegistration({ 
      salonName, 
      email, 
      password, 
      salonAddress, 
      phoneNumber, 
      servicesOffered 
    });
    
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    // Check if salon already exists
    const existingSalon = await db.collection('salonOwners').where('email', '==', email.trim()).get();
    if (!existingSalon.empty) {
      return res.status(400).json({ error: 'Salon with this email already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create salon owner document
    const salonData = {
      fullName: fullName.trim(),
      email: email.trim(),
      password: hashedPassword,
      salonName: salonName.trim(),
      salonAddress: salonAddress.trim(),
      phoneNumber: phoneNumber.trim(),
      servicesOffered: Array.isArray(servicesOffered) ? servicesOffered : [],
      openHours: openHours || null,
      role: role || 'salonOwner',
      isActive: true,
      isLive: false,
      profileImage: null,
      rating: 0,
      totalRatings: 0,
      location: {
        latitude: null,
        longitude: null
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const salonRef = await db.collection('salonOwners').add(salonData);
    
    // Generate tokens
    const tokenPayload = {
      userId: salonRef.id,
      email: salonData.email,
      role: salonData.role,
      salonName: salonData.salonName
    };

    const token = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Store refresh token
    await db.collection('refreshTokens').add({
      userId: salonRef.id,
      token: refreshToken,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({
      message: 'Salon owner registered successfully',
      salon: {
        id: salonRef.id,
        salonName: salonData.salonName,
        email: salonData.email,
        role: salonData.role
      },
      token,
      refreshToken
    });

  } catch (error) {
    console.error('Salon owner signup error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// ✅ 3. Customer Login
router.post('/login/customer', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    const validation = validateLogin({ email, password });
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    // Find user
    const userSnapshot = await db.collection('customers').where('email', '==', email.trim()).get();
    if (userSnapshot.empty) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    // Check if user is active
    if (!userData.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate tokens
    const tokenPayload = {
      userId: userDoc.id,
      email: userData.email,
      role: userData.role,
      name: userData.name
    };

    const token = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Store refresh token
    await db.collection('refreshTokens').add({
      userId: userDoc.id,
      token: refreshToken,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Update last login
    await userDoc.ref.update({
      lastLogin: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({
      message: 'Login successful',
      user: {
        id: userDoc.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        phone: userData.phone,
        address: userData.address
      },
      token,
      refreshToken
    });

  } catch (error) {
    console.error('Customer login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// ✅ 4. Salon Owner Login
router.post('/login/salonOwner', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    const validation = validateLogin({ email, password });
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    // Find salon owner
    const salonSnapshot = await db.collection('salonOwners').where('email', '==', email.trim()).get();
    if (salonSnapshot.empty) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const salonDoc = salonSnapshot.docs[0];
    const salonData = salonDoc.data();

    // Check if salon is active
    if (!salonData.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, salonData.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate tokens
    const tokenPayload = {
      userId: salonDoc.id,
      email: salonData.email,
      role: salonData.role,
      salonName: salonData.salonName
    };

    const token = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Store refresh token
    await db.collection('refreshTokens').add({
      userId: salonDoc.id,
      token: refreshToken,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Update last login
    await salonDoc.ref.update({
      lastLogin: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({
      message: 'Login successful',
      salon: {
        id: salonDoc.id,
        salonName: salonData.salonName,
        email: salonData.email,
        role: salonData.role,
        isLive: salonData.isLive,
        rating: salonData.rating
      },
      token,
      refreshToken
    });

  } catch (error) {
    console.error('Salon owner login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// ✅ 5. Refresh Token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Check if refresh token exists in database
    const tokenSnapshot = await db.collection('refreshTokens')
      .where('userId', '==', decoded.userId)
      .where('token', '==', refreshToken)
      .get();

    if (tokenSnapshot.empty) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Generate new tokens
    const newToken = generateToken({
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name || decoded.salonName
    });

    const newRefreshToken = generateRefreshToken({
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name || decoded.salonName
    });

    // Update refresh token in database
    await tokenSnapshot.docs[0].ref.update({
      token: newRefreshToken,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({
      token: newToken,
      refreshToken: newRefreshToken
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// ✅ 6. Logout
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Remove refresh token from database
      const tokenSnapshot = await db.collection('refreshTokens')
        .where('userId', '==', req.user.userId)
        .where('token', '==', refreshToken)
        .get();

      if (!tokenSnapshot.empty) {
        await tokenSnapshot.docs[0].ref.delete();
      }
    }

    res.json({ message: 'Logged out successfully' });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Server error during logout' });
  }
});

// ✅ 7. Get Current User
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const { userId, role } = req.user;

    let userData;
    if (role === 'customer') {
      const userDoc = await db.collection('customers').doc(userId).get();
      if (!userDoc.exists) {
        return res.status(404).json({ error: 'User not found' });
      }
      userData = userDoc.data();
    } else if (role === 'salonOwner') {
      const salonDoc = await db.collection('salonOwners').doc(userId).get();
      if (!salonDoc.exists) {
        return res.status(404).json({ error: 'Salon not found' });
      }
      userData = salonDoc.data();
    }

    // Remove sensitive data
    delete userData.password;

    res.json({
      user: {
        id: userId,
        ...userData
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

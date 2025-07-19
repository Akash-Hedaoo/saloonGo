const express = require('express');
const router = express.Router();
const { admin, db } = require('../config/firebaseAdmin');


// 🔁 Input validation function
const validateInput = (username, email, password) => {
  if (!username || !email || !password) return 'All fields are required';
  if (username.length < 3) return 'Username must be at least 3 characters';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Invalid email format';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
};

// ✅ 1. Signup route for Normal Users
router.post('/signup/customer', async (req, res) => {
  try {
    let { username, email, password } = req.body;
    username = username.trim();
    email = email.trim();
    password = password.trim();

    const error = validateInput(username, email, password);
    if (error) return res.status(400).json({ error });

    const existingUser = await db.collection('users').where('email', '==', email).get();
    if (!existingUser.empty) return res.status(400).json({ error: 'User already exists' });

    await db.collection('customers').add({
      username,
      email,
      password,
      role: 'user',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// ✅ 2. Signup route for Salon Owners
router.post('/signup/salonOwner', async (req, res) => {
  try {
    let { salonName, email, password } = req.body;
    salonName = salonName.trim();
    email = email.trim();
    password = password.trim();

    const error = validateInput(salonName, email, password);
    if (error) return res.status(400).json({ error });

    const existingSalon = await db.collection('salonOwners').where('email', '==', email).get();
    if (!existingSalon.empty) return res.status(400).json({ error: 'Salon already exists' });

    await db.collection('salonOwners').add({
      salonName,
      email,
      password,
      role: 'salon',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.status(201).json({ message: 'Salon owner registered successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

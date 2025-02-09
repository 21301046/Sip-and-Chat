const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Admin Login
router.post('/admin/login', async (req, res) => {
  try {
    console.log('Admin login attempt:', { email: req.body.email });
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verify admin role
    if (!user.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    // Create admin token with special flag
    const token = jwt.sign(
      { userId: user._id, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set admin cookie
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Send response
    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      role: 'admin'
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// Admin Session Check
router.get('/admin/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!user.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    const userData = user.toObject();
    userData.role = 'admin';
    delete userData.isAdmin;
    
    res.json(userData);
  } catch (err) {
    console.error('Get admin error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin Logout
router.post('/admin/logout', (req, res) => {
  res.clearCookie('adminToken');
  res.json({ message: 'Admin logged out successfully' });
});

// Regular User Login
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt:', { email: req.body.email });
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Send response
    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      role: 'user'
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      isAdmin: false // Ensure new registrations are not admin
    });

    await user.save();

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Send response
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: 'user'
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const userData = user.toObject();
    userData.role = userData.isAdmin ? 'admin' : 'user';
    delete userData.isAdmin;
    
    res.json(userData);
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// User Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
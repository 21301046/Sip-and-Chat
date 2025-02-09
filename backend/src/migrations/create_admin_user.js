require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');

// MongoDB connection URI from environment variable
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/coffee-haven';

async function createAdminUser() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@brewhaven.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = new User({
      name: 'Admin',
      email: 'admin@brewhaven.com',
      password: hashedPassword,
      isAdmin: true // Make sure this is set to true
    });

    await adminUser.save();
    console.log('Admin user created successfully');
  } catch (err) {
    console.error('Error creating admin user:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createAdminUser();
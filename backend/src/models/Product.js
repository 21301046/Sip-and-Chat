const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['beans', 'equipment', 'accessories']
  },
  weight: String,
  origin: String,
  roastLevel: {
    type: String,
    enum: ['light', 'medium', 'dark']
  },
  details: {
    flavor: [String],
    process: String,
    altitude: String,
    brewingTips: [String],
    storageInstructions: String
  },
  rating: {
    type: Number,
    default: 0
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
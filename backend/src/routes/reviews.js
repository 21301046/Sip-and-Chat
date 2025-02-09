const express = require('express');
const auth = require('../middleware/auth');
const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

const router = express.Router();

// Create a review
router.post('/:productId', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.productId;

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      user: req.userId,
      product: productId
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    // Check if user has purchased the product
    const hasOrdered = await Order.findOne({
      user: req.userId,
      'items.product._id': productId,
      status: 'delivered'
    });

    const review = new Review({
      user: req.userId,
      product: productId,
      rating,
      comment,
      verified: !!hasOrdered
    });

    await review.save();

    // Update product rating
    const reviews = await Review.find({ product: productId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    await Product.findByIdAndUpdate(productId, {
      rating: avgRating,
      $push: { reviews: review._id }
    });

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name')
      .populate('product', 'name');

    res.status(201).json(populatedReview);
  } catch (err) {
    console.error('Review creation error:', err);
    res.status(500).json({ message: 'Error creating review' });
  }
});

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name')
      .sort('-createdAt');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

// Mark review as helpful
router.post('/:reviewId/helpful', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const hasMarked = review.helpful.users.includes(req.userId);
    
    if (hasMarked) {
      review.helpful.count--;
      review.helpful.users.pull(req.userId);
    } else {
      review.helpful.count++;
      review.helpful.users.push(req.userId);
    }

    await review.save();
    res.json({ helpful: review.helpful.count });
  } catch (err) {
    res.status(500).json({ message: 'Error updating review' });
  }
});

// Delete a review (admin or owner only)
router.delete('/:reviewId', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.userId && !req.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await review.remove();
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting review' });
  }
});

module.exports = router;
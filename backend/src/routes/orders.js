const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const auth = require('../middleware/auth');

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create order
router.post('/create', auth, async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, paymentMethod } = req.body;

    // For COD orders, create order directly
    if (paymentMethod === 'cod') {
      const order = new Order({
        user: req.userId,
        items: items.map(item => ({
          product: {
            _id: item.product._id, // Store the product ID
            name: item.product.name,
            price: item.product.price,
            image: item.product.image
          },
          quantity: item.quantity
        })),
        totalAmount,
        shippingAddress,
        status: 'pending',
        paymentMethod: 'cod'
      });

      await order.save();
      return res.json({ success: true });
    }

    // For online payment, create Razorpay order
    const options = {
      amount: Math.round(totalAmount * 100), // Convert to paise
      currency: 'INR',
      receipt: 'order_' + Date.now()
    };

    const razorpayOrder = await razorpay.orders.create(options);

    const order = new Order({
      user: req.userId,
      items: items.map(item => ({
        product: {
          _id: item.product._id, // Store the product ID
          name: item.product.name,
          price: item.product.price,
          image: item.product.image
        },
        quantity: item.quantity
      })),
      totalAmount,
      shippingAddress,
      status: 'pending',
      orderId: razorpayOrder.id,
      paymentMethod: 'online'
    });

    await order.save();

    res.json({
      orderId: razorpayOrder.id,
      amount: options.amount,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ message: 'Error creating order' });
  }
});

// Verify payment
router.post('/verify', auth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    const text = razorpay_order_id + '|' + razorpay_payment_id;
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      await Order.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { 
          status: 'paid',
          paymentId: razorpay_payment_id
        }
      );
      res.json({ success: true });
    } else {
      res.status(400).json({ message: 'Invalid signature' });
    }
  } catch (err) {
    console.error('Payment verification error:', err);
    res.status(500).json({ message: 'Error verifying payment' });
  }
});

// Get user's orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

module.exports = router;
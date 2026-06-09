const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Movie = require('../models/Movie');

// Middleware to check for Admin status
const adminAuth = (req, res, next) => {
  const token = req.headers.authorization;
  if (token && token === 'mock-jwt-admin-token-12345') {
    next();
  } else {
    res.status(403).json({ message: 'Access Denied: Admin authorization required' });
  }
};

// @route   POST /api/orders
// @desc    Place a new order
router.post('/', async (req, res) => {
  try {
    const { userEmail, items, totalAmount } = req.body;

    if (!userEmail) {
      return res.status(400).json({ message: 'User email is required' });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Verify stock availability and decrement
    for (const item of items) {
      const movie = await Movie.findById(item.movieId);
      if (!movie) {
        return res.status(404).json({ message: `Movie with ID ${item.movieId} not found` });
      }

      if (movie.countInStock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for movie: ${movie.title}` });
      }
    }

    // Decrement stock
    for (const item of items) {
      await Movie.findByIdAndUpdate(item.movieId, {
        $inc: { countInStock: -item.quantity }
      });
    }

    // Create the order
    const newOrder = new Order({
      userEmail,
      items,
      totalAmount,
      status: 'Completed'
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server Error processing order', error: error.message });
  }
});

// @route   GET /api/orders
// @desc    Get all orders (Admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching orders', error: error.message });
  }
});

module.exports = router;

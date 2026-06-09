const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// Middleware to check for Admin status (for creating/deleting movies)
const adminAuth = (req, res, next) => {
  const token = req.headers.authorization;
  if (token && token === 'mock-jwt-admin-token-12345') {
    next();
  } else {
    res.status(403).json({ message: 'Access Denied: Admin authorization required' });
  }
};

// @route   GET /api/movies
// @desc    Get all movies (with search and genre filter)
router.get('/', async (req, res) => {
  try {
    const { search, genre } = req.query;
    let query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (genre && genre !== 'All') {
      query.genre = { $regex: genre, $options: 'i' };
    }

    const movies = await Movie.find(query);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching movies', error: error.message });
  }
});

// @route   GET /api/movies/:id
// @desc    Get movie by ID
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching movie details', error: error.message });
  }
});

// @route   POST /api/movies
// @desc    Create a new movie (Admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { title, description, posterUrl, price, rating, releaseYear, genre, countInStock } = req.body;

    if (!title || !description || !posterUrl || !price || !releaseYear || !genre) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const newMovie = new Movie({
      title,
      description,
      posterUrl,
      price,
      rating: rating || 0,
      releaseYear,
      genre,
      countInStock: countInStock || 10
    });

    const savedMovie = await newMovie.save();
    res.status(201).json(savedMovie);
  } catch (error) {
    res.status(500).json({ message: 'Server Error creating movie', error: error.message });
  }
});

// @route   DELETE /api/movies/:id
// @desc    Delete a movie (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: 'Movie removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error deleting movie', error: error.message });
  }
});

module.exports = router;

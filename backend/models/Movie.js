const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  posterUrl: {
    type: String,
    required: true
  },
  trailerUrl: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  releaseYear: {
    type: Number,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  countInStock: {
    type: Number,
    default: 10,
    min: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Movie', movieSchema);

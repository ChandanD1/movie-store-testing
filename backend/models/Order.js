const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    trim: true
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'Completed',
    enum: ['Pending', 'Completed', 'Cancelled']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);

console.log('Server bootstrapping...');
console.log('>>> [SERVER] Loading express...');
const express = require('express');
console.log('>>> [SERVER] Loading cors...');
const cors = require('cors');
console.log('>>> [SERVER] Loading morgan...');
const morgan = require('morgan');
console.log('>>> [SERVER] Loading dotenv...');
const dotenv = require('dotenv');
console.log('>>> [SERVER] Loading connectDB...');
const connectDB = require('./config/db');
console.log('>>> [SERVER] Dependencies loaded successfully.');


// Load environment variables
dotenv.config();

// Connect to MongoDB database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/movies', require('./routes/movies'));
app.use('/api/orders', require('./routes/orders'));

// Base route
app.get('/', (req, res) => {
  res.send('Movie Store API is running...');
});

// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'API Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Server Error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

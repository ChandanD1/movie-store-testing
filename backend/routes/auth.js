const express = require('express');
const router = express.Router();

// Mock Auth endpoint
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Admin login credentials
  if (email === 'admin@example.com' && password === 'admin123') {
    return res.status(200).json({
      name: 'Admin User',
      email: 'admin@example.com',
      isAdmin: true,
      token: 'mock-jwt-admin-token-12345'
    });
  }

  // Standard user credentials
  if (email === 'user@example.com' && password === 'password') {
    return res.status(200).json({
      name: 'Standard User',
      email: 'user@example.com',
      isAdmin: false,
      token: 'mock-jwt-user-token-67890'
    });
  }

  return res.status(401).json({ message: 'Invalid email or password' });
});

module.exports = router;

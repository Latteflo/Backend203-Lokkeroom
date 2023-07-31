const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const router = express.Router();
// const verifyToken = require('../middleware/authMiddleware');
const connection = require('../../db');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';


// Register endpoint
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  connection.query(
    'INSERT INTO Users (email, password) VALUES (?, ?)',
    [email, hashedPassword],
    (error) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
      } else {
        res.json({ message: 'User has been created' });
      }
    }
  );
});

// Login endpoint
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  connection.query('SELECT * FROM Users WHERE email = ?', [email], async (error, results) => {
    if (error || results.length === 0) {
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // Generate a JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid login credentials' });
    }
  });
});

module.exports = router;

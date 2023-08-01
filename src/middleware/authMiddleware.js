const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const JWT_SECRET = process.env.JWT_SECRET;
const verify = promisify(jwt.verify);

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Authentication token is required' });
    }

    const decodedToken = await verify(token, JWT_SECRET);
    req.userId = decodedToken.userId; 
    next(); 
  } catch (error) {
    console.error(error);
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;

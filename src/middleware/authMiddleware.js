// Middleware to verify JWT
const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
      const bearerToken = bearerHeader.split(' ')[1];
      jwt.verify(bearerToken, JWT_SECRET, (err, authData) => {
        if (err) {
          res.status(403).json({ error: 'Forbidden' });
        } else {
          req.authData = authData;
          next();    
             }
      });
    } else {
      res.status(403).json({ error: 'Forbidden' });                                                                                                                                                                 
    }
  }

  
    module.exports = verifyToken;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
const jwt = require('jsonwebtoken');
const config = require('../config');

const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, config.SECRET_KEY, {
      expiresIn: '1h', // Set the maximum lifetime of the token to 1 hour
    });
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired.' });
    }

    // Other errors
    res.status(403).json({ message: 'Invalid token.' });
  }
};

module.exports =  authenticateJWT;
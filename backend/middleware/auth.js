const jwt = require('jsonwebtoken');
const Artist = require('../models/Artist');

// Verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Access denied. No token provided.',
        code: 'NO_TOKEN'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const artist = await Artist.findById(decoded.userId).select('-password');
    if (!artist) {
      return res.status(401).json({ 
        error: 'Invalid token. User not found.',
        code: 'INVALID_TOKEN'
      });
    }

    req.user = artist;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Invalid token.',
        code: 'INVALID_TOKEN'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired.',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      error: 'Internal server error during authentication.',
      code: 'AUTH_ERROR'
    });
  }
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const artist = await Artist.findById(decoded.userId).select('-password');
      if (artist) {
        req.user = artist;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};

// Check if user owns the resource
const checkOwnership = (resourceField = 'artistId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required.',
        code: 'AUTH_REQUIRED'
      });
    }

    const resourceId = req.params[resourceField] || req.body[resourceField];
    if (resourceId && resourceId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        error: 'Access denied. You can only access your own resources.',
        code: 'ACCESS_DENIED'
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  optionalAuth,
  checkOwnership
};

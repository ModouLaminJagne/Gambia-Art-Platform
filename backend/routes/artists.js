const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Artist = require('../models/Artist');
const { upload, optimizeImage } = require('../middleware/upload');
const { authenticateToken } = require('../middleware/auth');
const { validateArtistRegistration, validateArtistLogin } = require('../middleware/validation');
const { logger } = require('../middleware/logger');

// Register new artist
router.post('/register', 
  upload.single('profilePhoto'), 
  optimizeImage,
  validateArtistRegistration,
  async (req, res) => {
    try {
      const { name, surname, email, password, address } = req.body;
      
      // Check if artist already exists
      const existingArtist = await Artist.findOne({ email });
      if (existingArtist) {
        logger.warn('Registration attempt with existing email', { email });
        return res.status(400).json({ 
          error: 'Artist with this email already exists',
          code: 'EMAIL_EXISTS'
        });
      }

      const artistData = {
        name,
        surname,
        email,
        password,
        address,
        profilePhoto: req.file ? req.file.filename : null
      };

      const artist = new Artist(artistData);
      await artist.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: artist._id, email: artist.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      logger.info('New artist registered', { 
        artistId: artist._id, 
        email: artist.email 
      });

      res.status(201).json({ 
        message: 'Artist registered successfully', 
        token,
        artist: {
          id: artist._id,
          name: artist.name,
          surname: artist.surname,
          email: artist.email,
          address: artist.address,
          profilePhoto: artist.profilePhoto,
          isVerified: artist.isVerified
        }
      });
    } catch (error) {
      logger.error('Error registering artist', { error: error.message, stack: error.stack });
      
      if (error.code === 11000) {
        return res.status(400).json({ 
          error: 'Email already exists',
          code: 'DUPLICATE_EMAIL'
        });
      }
      
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          error: 'Validation failed',
          details: Object.values(error.errors).map(err => ({
            field: err.path,
            message: err.message
          }))
        });
      }
      
      res.status(500).json({ 
        error: 'Internal server error during registration',
        code: 'REGISTRATION_ERROR'
      });
    }
  }
);

// Login artist
router.post('/login', validateArtistLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find artist and include password for comparison
    const artist = await Artist.findOne({ email }).select('+password');
    if (!artist) {
      logger.warn('Login attempt with non-existent email', { email });
      return res.status(401).json({ 
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Check password
    const isPasswordValid = await artist.comparePassword(password);
    if (!isPasswordValid) {
      logger.warn('Login attempt with invalid password', { email });
      return res.status(401).json({ 
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Update last login
    artist.lastLogin = new Date();
    await artist.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: artist._id, email: artist.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    logger.info('Artist logged in successfully', { 
      artistId: artist._id, 
      email: artist.email 
    });

    res.json({
      message: 'Login successful',
      token,
      artist: {
        id: artist._id,
        name: artist.name,
        surname: artist.surname,
        email: artist.email,
        address: artist.address,
        profilePhoto: artist.profilePhoto,
        isVerified: artist.isVerified,
        lastLogin: artist.lastLogin
      }
    });
  } catch (error) {
    logger.error('Error during login', { error: error.message, stack: error.stack });
    res.status(500).json({ 
      error: 'Internal server error during login',
      code: 'LOGIN_ERROR'
    });
  }
});

// Get current artist profile (protected route)
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      artist: req.user
    });
  } catch (error) {
    logger.error('Error fetching artist profile', { error: error.message });
    res.status(500).json({ 
      error: 'Internal server error',
      code: 'PROFILE_ERROR'
    });
  }
});

// Update artist profile (protected route)
router.put('/profile', authenticateToken, upload.single('profilePhoto'), optimizeImage, async (req, res) => {
  try {
    const { name, surname, address } = req.body;
    const updateData = { name, surname, address };
    
    if (req.file) {
      updateData.profilePhoto = req.file.filename;
    }

    const artist = await Artist.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    logger.info('Artist profile updated', { artistId: artist._id });

    res.json({
      message: 'Profile updated successfully',
      artist
    });
  } catch (error) {
    logger.error('Error updating artist profile', { error: error.message });
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation failed',
        details: Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }
    
    res.status(500).json({ 
      error: 'Internal server error',
      code: 'UPDATE_ERROR'
    });
  }
});

// Get artist by email (legacy endpoint for backward compatibility)
router.get('/by-email/:email', async (req, res) => {
  try {
    const artist = await Artist.findOne({ email: req.params.email });
    if (!artist) {
      return res.status(404).json({ 
        error: 'Artist not found',
        code: 'ARTIST_NOT_FOUND'
      });
    }
    res.json(artist);
  } catch (error) {
    logger.error('Error finding artist by email', { error: error.message });
    res.status(500).json({ 
      error: 'Internal server error',
      code: 'FETCH_ERROR'
    });
  }
});

// Get all artists (public endpoint)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    
    const artists = await Artist.find()
      .select('-__v')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Artist.countDocuments();
    
    res.json({
      artists,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    logger.error('Error fetching artists', { error: error.message });
    res.status(500).json({ 
      error: 'Internal server error',
      code: 'FETCH_ERROR'
    });
  }
});

module.exports = router;
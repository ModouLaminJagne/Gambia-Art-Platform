const express = require('express');
const router = express.Router();
const Artwork = require('../models/Artwork');
const Artist = require('../models/Artist');
const { upload, optimizeImage } = require('../middleware/upload');
const { authenticateToken, checkOwnership } = require('../middleware/auth');
const { validateArtwork, validateSearchQuery } = require('../middleware/validation');
const { logger } = require('../middleware/logger');

// Upload new artwork (protected route)
router.post('/upload', 
  authenticateToken,
  upload.single('artworkImage'), 
  optimizeImage,
  validateArtwork,
  async (req, res) => {
    try {
      const { title, description, copiesAvailable, tags } = req.body;
      
      if (!req.file) {
        return res.status(400).json({ 
          error: 'Artwork image is required',
          code: 'IMAGE_REQUIRED'
        });
      }

      // Parse tags if provided
      const artworkTags = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

      const artwork = new Artwork({
        artistId: req.user._id,
        title,
        description,
        image: req.file.filename,
        copiesAvailable: parseInt(copiesAvailable),
        tags: artworkTags
      });

      await artwork.save();
      
      // Populate artist data for response
      await artwork.populate('artistId', 'name surname profilePhoto');

      logger.info('New artwork uploaded', { 
        artworkId: artwork._id, 
        artistId: req.user._id,
        title: artwork.title
      });

      res.status(201).json({ 
        message: 'Artwork uploaded successfully', 
        artwork 
      });
    } catch (error) {
      logger.error('Error uploading artwork', { 
        error: error.message, 
        stack: error.stack,
        artistId: req.user?._id 
      });
      
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
        error: 'Internal server error during upload',
        code: 'UPLOAD_ERROR'
      });
    }
  }
);

// Search and filter artworks
router.get('/search', validateSearchQuery, async (req, res) => {
  try {
    const { q, artist, tags, sort = 'newest', page = 1, limit = 12 } = req.query;
    
    // Build query
    const query = { isActive: true };
    
    // Text search
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ];
    }
    
    // Artist filter
    if (artist) {
      const artistDoc = await Artist.findOne({ 
        $or: [
          { name: { $regex: artist, $options: 'i' } },
          { surname: { $regex: artist, $options: 'i' } }
        ]
      });
      if (artistDoc) {
        query.artistId = artistDoc._id;
      } else {
        // If artist not found, return empty results
        return res.json({
          artworks: [],
          pagination: { current: 1, pages: 0, total: 0 }
        });
      }
    }
    
    // Tags filter
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }
    
    // Sort options
    let sortOption = { createdAt: -1 };
    switch (sort) {
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'popular':
        sortOption = { views: -1, likes: -1 };
        break;
      case 'title':
        sortOption = { title: 1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }
    
    // Pagination
    const skip = (page - 1) * limit;
    
    const artworks = await Artwork.find(query)
      .populate('artistId', 'name surname profilePhoto')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Artwork.countDocuments(query);
    
    logger.info('Artwork search performed', { 
      query: { q, artist, tags, sort },
      results: artworks.length,
      total
    });
    
    res.json({
      artworks,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    logger.error('Error searching artworks', { error: error.message });
    res.status(500).json({ 
      error: 'Internal server error during search',
      code: 'SEARCH_ERROR'
    });
  }
});

// Get single artwork by ID
router.get('/:id', async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id)
      .populate('artistId', 'name surname profilePhoto email address');
    
    if (!artwork) {
      return res.status(404).json({ 
        error: 'Artwork not found',
        code: 'ARTWORK_NOT_FOUND'
      });
    }
    
    // Increment view count
    artwork.views += 1;
    await artwork.save();
    
    res.json({ artwork });
  } catch (error) {
    logger.error('Error fetching artwork', { error: error.message, artworkId: req.params.id });
    res.status(500).json({ 
      error: 'Internal server error',
      code: 'FETCH_ERROR'
    });
  }
});

// Get artworks by artist
router.get('/artist/:artistId', async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * limit;
    
    const artworks = await Artwork.find({ 
      artistId: req.params.artistId,
      isActive: true 
    })
      .populate('artistId', 'name surname profilePhoto')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Artwork.countDocuments({ 
      artistId: req.params.artistId,
      isActive: true 
    });
    
    res.json({
      artworks,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    logger.error('Error fetching artworks by artist', { 
      error: error.message, 
      artistId: req.params.artistId 
    });
    res.status(500).json({ 
      error: 'Internal server error',
      code: 'FETCH_ERROR'
    });
  }
});

// Get current artist's artworks (protected route)
router.get('/my/artworks', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * limit;
    
    const artworks = await Artwork.find({ artistId: req.user._id })
      .populate('artistId', 'name surname profilePhoto')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Artwork.countDocuments({ artistId: req.user._id });
    
    res.json({
      artworks,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    logger.error('Error fetching artist artworks', { 
      error: error.message, 
      artistId: req.user._id 
    });
    res.status(500).json({ 
      error: 'Internal server error',
      code: 'FETCH_ERROR'
    });
  }
});

// Update artwork (protected route - owner only)
router.put('/:id', authenticateToken, checkOwnership('artistId'), async (req, res) => {
  try {
    const { title, description, copiesAvailable, tags, isActive } = req.body;
    
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (copiesAvailable !== undefined) updateData.copiesAvailable = parseInt(copiesAvailable);
    if (tags) updateData.tags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    if (isActive !== undefined) updateData.isActive = isActive;
    
    const artwork = await Artwork.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('artistId', 'name surname profilePhoto');
    
    if (!artwork) {
      return res.status(404).json({ 
        error: 'Artwork not found',
        code: 'ARTWORK_NOT_FOUND'
      });
    }
    
    logger.info('Artwork updated', { 
      artworkId: artwork._id, 
      artistId: req.user._id 
    });
    
    res.json({
      message: 'Artwork updated successfully',
      artwork
    });
  } catch (error) {
    logger.error('Error updating artwork', { 
      error: error.message, 
      artworkId: req.params.id,
      artistId: req.user._id 
    });
    
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

// Delete artwork (protected route - owner only)
router.delete('/:id', authenticateToken, checkOwnership('artistId'), async (req, res) => {
  try {
    const artwork = await Artwork.findByIdAndDelete(req.params.id);
    
    if (!artwork) {
      return res.status(404).json({ 
        error: 'Artwork not found',
        code: 'ARTWORK_NOT_FOUND'
      });
    }
    
    logger.info('Artwork deleted', { 
      artworkId: artwork._id, 
      artistId: req.user._id 
    });
    
    res.json({
      message: 'Artwork deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting artwork', { 
      error: error.message, 
      artworkId: req.params.id,
      artistId: req.user._id 
    });
    res.status(500).json({ 
      error: 'Internal server error',
      code: 'DELETE_ERROR'
    });
  }
});

// Get all artworks (public endpoint with pagination)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * limit;
    
    const artworks = await Artwork.find({ isActive: true })
      .populate('artistId', 'name surname profilePhoto')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Artwork.countDocuments({ isActive: true });
    
    res.json({
      artworks,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    logger.error('Error fetching artworks', { error: error.message });
    res.status(500).json({ 
      error: 'Internal server error',
      code: 'FETCH_ERROR'
    });
  }
});

module.exports = router;
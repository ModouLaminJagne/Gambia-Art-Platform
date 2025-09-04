const express = require('express');
const router = express.Router();
const Artwork = require('../models/Artwork');
const Artist = require('../models/Artist');
const upload = require('../middleware/upload');
const fs = require('fs');

// Ensure upload directory exists
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

ensureDirectoryExists('uploads/artworks');

// Upload new artwork
router.post('/upload', upload.single('artworkImage'), async (req, res) => {
  try {
    const { artistId, title, description, copiesAvailable } = req.body;
    
    // Verify artist exists
    const artist = await Artist.findById(artistId);
    if (!artist) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Artwork image is required' });
    }

    const artwork = new Artwork({
      artistId,
      title,
      description,
      image: req.file.filename,
      copiesAvailable: parseInt(copiesAvailable)
    });

    await artwork.save();

    res.status(201).json({ 
      message: 'Artwork uploaded successfully', 
      artwork 
    });
  } catch (error) {
    console.error('Error uploading artwork:', error);
    res.status(500).json({ error: 'Error uploading artwork' });
  }
});

// Get artworks by artist
router.get('/artist/:artistId', async (req, res) => {
  try {
    const artworks = await Artwork.find({ artistId: req.params.artistId })
      .populate('artistId', 'name surname')
      .sort({ createdAt: -1 });
    res.json(artworks);
  } catch (error) {
    console.error('Error fetching artworks:', error);
    res.status(500).json({ error: 'Error fetching artworks' });
  }
});

// Get all artworks
router.get('/', async (req, res) => {
  try {
    const artworks = await Artwork.find()
      .populate('artistId', 'name surname profilePhoto')
      .sort({ createdAt: -1 });
    res.json(artworks);
  } catch (error) {
    console.error('Error fetching artworks:', error);
    res.status(500).json({ error: 'Error fetching artworks' });
  }
});

module.exports = router;
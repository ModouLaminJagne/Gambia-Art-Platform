const express = require('express');
const router = express.Router();
const Artist = require('../models/Artist');
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

// Ensure upload directories exist
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

ensureDirectoryExists('uploads/profiles');

// Register new artist
router.post('/register', upload.single('profilePhoto'), async (req, res) => {
  try {
    const { name, surname, email, address } = req.body;
    
    // Check if artist already exists
    const existingArtist = await Artist.findOne({ email });
    if (existingArtist) {
      return res.status(400).json({ error: 'Artist with this email already exists' });
    }

    const artistData = {
      name,
      surname,
      email,
      address,
      profilePhoto: req.file ? req.file.filename : null
    };

    const artist = new Artist(artistData);
    await artist.save();

    res.status(201).json({ 
      message: 'Artist registered successfully', 
      artist: {
        id: artist._id,
        name: artist.name,
        surname: artist.surname,
        email: artist.email,
        address: artist.address,
        profilePhoto: artist.profilePhoto
      }
    });
  } catch (error) {
    console.error('Error registering artist:', error);
    res.status(500).json({ error: 'Error registering artist' });
  }
});

// Get artist by email
router.get('/by-email/:email', async (req, res) => {
  try {
    const artist = await Artist.findOne({ email: req.params.email });
    if (!artist) {
      return res.status(404).json({ error: 'Artist not found' });
    }
    res.json(artist);
  } catch (error) {
    console.error('Error finding artist:', error);
    res.status(500).json({ error: 'Error finding artist' });
  }
});

// Get all artists
router.get('/', async (req, res) => {
  try {
    const artists = await Artist.find().select('-__v');
    res.json(artists);
  } catch (error) {
    console.error('Error fetching artists:', error);
    res.status(500).json({ error: 'Error fetching artists' });
  }
});

module.exports = router;
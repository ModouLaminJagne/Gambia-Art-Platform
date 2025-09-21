const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

// Ensure upload directories exist
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

ensureDirectoryExists('uploads/profiles');
ensureDirectoryExists('uploads/artworks');

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'profilePhoto') {
      cb(null, 'uploads/profiles/');
    } else if (file.fieldname === 'artworkImage') {
      cb(null, 'uploads/artworks/');
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter with more strict validation
const fileFilter = (req, file, cb) => {
  // Check file type
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed!'), false);
  }

  // Check specific image types
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Only JPEG, PNG, and WebP images are allowed!'), false);
  }

  cb(null, true);
};

// Image optimization middleware
const optimizeImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const inputPath = req.file.path;
    const outputPath = inputPath.replace(path.extname(inputPath), '.webp');
    
    // Optimize image based on type
    if (req.file.fieldname === 'profilePhoto') {
      // Profile photos: 300x300, high quality
      await sharp(inputPath)
        .resize(300, 300, { 
          fit: 'cover',
          position: 'center'
        })
        .webp({ quality: 90 })
        .toFile(outputPath);
    } else if (req.file.fieldname === 'artworkImage') {
      // Artwork images: max 1200px width, good quality
      await sharp(inputPath)
        .resize(1200, null, { 
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ quality: 85 })
        .toFile(outputPath);
    }

    // Remove original file and update req.file.path
    fs.unlinkSync(inputPath);
    req.file.path = outputPath;
    req.file.filename = path.basename(outputPath);
    req.file.mimetype = 'image/webp';

    next();
  } catch (error) {
    console.error('Image optimization error:', error);
    // If optimization fails, continue with original file
    next();
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit (will be optimized down)
    files: 1 // Only one file at a time
  }
});

module.exports = {
  upload,
  optimizeImage
};
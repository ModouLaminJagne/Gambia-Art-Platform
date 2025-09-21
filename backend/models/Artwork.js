const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
  artistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: [true, 'Artist ID is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  image: {
    type: String,
    required: [true, 'Image is required']
  },
  copiesAvailable: {
    type: Number,
    required: [true, 'Copies available is required'],
    min: [0, 'Copies available cannot be negative'],
    max: [1000, 'Copies available cannot exceed 1000']
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, 'Tag cannot exceed 20 characters']
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Add indexes for better performance
artworkSchema.index({ artistId: 1, createdAt: -1 });
artworkSchema.index({ title: 'text', description: 'text' });
artworkSchema.index({ tags: 1 });
artworkSchema.index({ views: -1 });
artworkSchema.index({ likes: -1 });
artworkSchema.index({ isActive: 1 });

// Virtual for total interactions
artworkSchema.virtual('totalInteractions').get(function() {
  return this.views + this.likes;
});

// Ensure virtual fields are serialized
artworkSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Artwork', artworkSchema);
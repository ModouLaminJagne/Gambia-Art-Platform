import { useState } from 'react';
import axios from 'axios';
// import Link from 'next/link';

export default function ArtworkUpload({ artistId, onUploadSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    copiesAvailable: ''
  });
  const [artworkImage, setArtworkImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleFileChange = (file) => {
    setArtworkImage(file);
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage('❌ Please select a valid image file');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('❌ File size must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setMessage('');
    } else {
      setImagePreview(null);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.copiesAvailable || formData.copiesAvailable < 1) {
      newErrors.copiesAvailable = 'Please enter a valid number of copies';
    }
    if (!artworkImage) newErrors.image = 'Please select an artwork image';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      submitData.append('artworkImage', artworkImage);

      const response = await axios.post('http://localhost:5000/api/artworks/upload', submitData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      setMessage('🎉 Artwork uploaded successfully! Your masterpiece is now live!');
      setFormData({ title: '', description: '', copiesAvailable: '' });
      setArtworkImage(null);
      setImagePreview(null);
      
      if (onUploadSuccess) {
        setTimeout(() => {
          onUploadSuccess(response.data.artwork);
        }, 2000);
      }
    } catch (error) {
      setMessage(error.response?.data?.error || '❌ Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-secondary mb-6 shadow-lg">
          <span className="text-3xl">🖼️</span>
        </div>
        <h2 className="text-4xl font-bold text-gradient-secondary mb-4">
          Share Your Masterpiece
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Upload your artwork and share your creativity with art lovers around the world
        </p>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`mb-8 p-6 rounded-2xl shadow-lg border-l-4 animate-slide-up ${
          message.includes('successful') || message.includes('🎉')
            ? 'alert-success border-green-500' 
            : 'alert-error border-red-500'
        }`}>
          <div className="flex items-center">
            <span className="text-2xl mr-3">
              {message.includes('successful') || message.includes('🎉') ? '✅' : '❌'}
            </span>
            <p className="font-semibold">{message}</p>
          </div>
        </div>
      )}

      <div className="card-featured p-8 md:p-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload Section */}
          <div className="space-y-4">
            <label className="form-label flex items-center space-x-2 text-lg">
              <span>🖼️</span>
              <span>Artwork Image *</span>
            </label>
            
            {imagePreview ? (
              <div className="relative">
                <div className="relative overflow-hidden rounded-2xl shadow-xl">
                  <img
                    src={imagePreview}
                    alt="Artwork Preview"
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  
                  {/* Preview Actions */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div className="text-white">
                      <p className="font-bold text-lg">Preview</p>
                      <p className="text-sm opacity-90">Looking great! ✨</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setArtworkImage(null);
                        setImagePreview(null);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-colors duration-200 shadow-lg"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer group ${
                  dragActive 
                    ? 'border-gambian-blue bg-blue-50 scale-105' 
                    : 'border-gray-300 hover:border-gambian-red hover:bg-red-50'
                } ${errors.image ? 'border-red-500 bg-red-50' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('artwork-upload').click()}
              >
                <input
                  id="artwork-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e.target.files[0])}
                  className="hidden"
                />
                
                <div className="space-y-4">
                  <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${
                    dragActive ? 'bg-blue-200' : 'bg-gray-100 group-hover:bg-red-100'
                  }`}>
                    <span className="text-4xl">
                      {dragActive ? '📥' : '🎨'}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {dragActive ? 'Drop your artwork here!' : 'Upload Your Artwork'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Drag and drop your image here, or click to browse
                    </p>
                    <div className="inline-flex items-center px-6 py-3 bg-gradient-primary text-white rounded-full font-semibold shadow-lg transform group-hover:scale-105 transition-all duration-300">
                      <span className="mr-2">📁</span>
                      Choose File
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500">
                    Supported formats: JPG, PNG, WebP • Max size: 5MB
                  </p>
                </div>
              </div>
            )}
            
            {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <label className="form-label flex items-center space-x-2">
                  <span>✨</span>
                  <span>Artwork Title *</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`form-input text-lg ${errors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Give your artwork a captivating title"
                  required
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                <p className="text-sm text-gray-500">
                  💡 Make it memorable and descriptive
                </p>
              </div>

              {/* Copies Available */}
              <div className="space-y-2">
                <label className="form-label flex items-center space-x-2">
                  <span>🔢</span>
                  <span>Copies Available *</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="copiesAvailable"
                    value={formData.copiesAvailable}
                    onChange={handleInputChange}
                    className={`form-input text-lg ${errors.copiesAvailable ? 'border-red-500 focus:ring-red-500' : ''}`}
                    min="1"
                    max="999"
                    placeholder="How many copies?"
                    required
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <span className="text-sm font-semibold">copies</span>
                  </div>
                </div>
                {errors.copiesAvailable && <p className="text-red-500 text-sm">{errors.copiesAvailable}</p>}
                <p className="text-sm text-gray-500">
                  🖨️ Limited editions are more valuable
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Description */}
              <div className="space-y-2">
                <label className="form-label flex items-center space-x-2">
                  <span>📝</span>
                  <span>Description *</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`form-textarea text-lg ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}`}
                  rows="6"
                  placeholder="Tell the story behind your artwork... What inspired you? What techniques did you use? What emotions does it evoke?"
                  required
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    🎭 Share your artistic journey and inspiration
                  </p>
                  <span className="text-xs text-gray-400">
                    {formData.description.length}/500
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Artwork Tips */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center">
                <span className="text-xl">💡</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Tips for Great Artwork Uploads</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Use high-quality, well-lit photos</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Write engaging descriptions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Share your artistic process</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Consider limited editions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 btn-secondary text-lg py-4 ${loading ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-2xl'}`}
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-3">
                  <div className="loading-spinner"></div>
                  <span>Uploading Your Masterpiece...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-3">
                  <span>🚀</span>
                  <span>Share with the World</span>
                  <span className="animate-bounce">→</span>
                </span>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => {
                setFormData({ title: '', description: '', copiesAvailable: '' });
                setArtworkImage(null);
                setImagePreview(null);
                setErrors({});
                setMessage('');
              }}
              className="btn-outline px-8 py-4"
              disabled={loading}
            >
              <span className="flex items-center space-x-2">
                <span>🔄</span>
                <span>Reset</span>
              </span>
            </button>
          </div>

          {/* Upload Progress Indicator */}
          {loading && (
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center">
                  <div className="loading-spinner border-white"></div>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Processing your artwork...</p>
                  <p className="text-sm text-gray-600">This may take a moment for high-quality images</p>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

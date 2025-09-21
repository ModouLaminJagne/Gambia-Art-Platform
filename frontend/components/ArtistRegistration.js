import { useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button"

export default function ArtistRegistration({ onRegistrationSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePhoto(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setProfilePhotoPreview(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.surname.trim()) newErrors.surname = 'Surname is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setMessage('');

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      
      if (profilePhoto) {
        submitData.append('profilePhoto', profilePhoto);
      }

      const response = await axios.post('http://localhost:5000/api/artists/register', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage('🎉 Registration successful! Welcome to our community!');
      setFormData({ name: '', surname: '', email: '', password: '', confirmPassword: '', address: '' });
      setProfilePhoto(null);
      setProfilePhotoPreview(null);
      
      // Store token and user data
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('currentArtist', JSON.stringify(response.data.artist));
      }
      
      if (onRegistrationSuccess) {
        setTimeout(() => {
          onRegistrationSuccess(response.data.artist);
        }, 2000);
      }
    } catch (error) {
      setMessage(error.response?.data?.error || '❌ Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-primary mb-6 shadow-lg">
          <span className="text-3xl">🎨</span>
        </div>
        <h2 className="text-4xl font-bold text-gradient-primary mb-4">
          Join Our Artist Community
        </h2>
        <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
          Share your creativity with the world and connect with art lovers across the globe
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

      {/* Registration Form */}
      <div className="card-featured p-8 md:p-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Photo Upload */}
          <div className="text-center">
            <div className="relative inline-block">
              {profilePhotoPreview ? (
                <div className="relative">
                  <img
                    src={profilePhotoPreview}
                    alt="Profile Preview"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setProfilePhoto(null);
                      setProfilePhotoPreview(null);
                    }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200 shadow-lg"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-4 border-dashed border-gray-300 hover:border-gambian-red transition-all duration-300">
                  <span className="text-4xl">📷</span>
                </div>
              )}
              
              <label className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-200 shadow-lg">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span className="text-white text-xl">📸</span>
              </label>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Upload your profile photo (optional)
            </p>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="form-label flex items-center space-x-2">
                <span>👤</span>
                <span>First Name *</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`form-input ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Enter your first name"
                required
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Surname */}
            <div className="space-y-2">
              <label className="form-label flex items-center space-x-2">
                <span>👤</span>
                <span>Last Name *</span>
              </label>
              <input
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleInputChange}
                className={`form-input ${errors.surname ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Enter your last name"
                required
              />
              {errors.surname && <p className="text-red-500 text-sm mt-1">{errors.surname}</p>}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="form-label flex items-center space-x-2">
              <span>📧</span>
              <span>Email Address *</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`form-input ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="your.email@example.com"
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="form-label flex items-center space-x-2">
              <span>🔒</span>
              <span>Password *</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`form-input ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Enter a secure password"
              required
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="form-label flex items-center space-x-2">
              <span>🔒</span>
              <span>Confirm Password *</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`form-input ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Confirm your password"
              required
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="form-label flex items-center space-x-2">
              <span>📍</span>
              <span>Address *</span>
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className={`form-textarea ${errors.address ? 'border-red-500 focus:ring-red-500' : ''}`}
              rows="3"
              placeholder="Your location in The Gambia"
              required
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            <p className="text-sm text-gray-500">
              💡 This helps art lovers find local artists in their area
            </p>
          </div>

          {/* Terms Agreement */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center mt-0.5">
                <span className="text-white text-sm">ℹ️</span>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                <p className="mb-2 font-semibold">By registering, you agree to:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Showcase only original artwork</li>
                  <li>• Respect community guidelines</li>
                  <li>• Promote Gambian art and culture</li>
                  <li>• Connect with fellow artists and art lovers</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full btn-primary text-lg py-4 relative ${loading ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-2xl'}`}
          >
            {loading ? (
              <span className="flex items-center justify-center space-x-3">
                <div className="loading-spinner"></div>
                <span>Creating Your Account...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center space-x-3">
                <span>🚀</span>
                <span>Join the Community</span>
                <span className="animate-bounce">→</span>
              </span>
            )}
          </button>
            
          {/* Additional Info */}
          <div className="text-center pt-4">
            <p className="text-sm text-gray-500">
              Already a member?{' '}
              <a href="/dashboard" className="text-gambian-red hover:text-gambian-blue font-semibold transition-colors duration-200">
                Access your dashboard
              </a>
            </p>
          </div>
        </form>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="text-center p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20 hover:shadow-lg transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎯</span>
          </div>
          <h3 className="font-bold text-gray-800 mb-2">Showcase Your Work</h3>
          <p className="text-sm text-gray-600">Upload unlimited artworks and reach a global audience</p>
        </div>

        <div className="text-center p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20 hover:shadow-lg transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🌍</span>
          </div>
          <h3 className="font-bold text-gray-800 mb-2">Global Reach</h3>
          <p className="text-sm text-gray-600">Connect with art lovers and collectors worldwide</p>
        </div>

        <div className="text-center p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20 hover:shadow-lg transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🤝</span>
          </div>
          <h3 className="font-bold text-gray-800 mb-2">Artist Network</h3>
          <p className="text-sm text-gray-600">Join a supportive community of Gambian artists</p>
        </div>
      </div>
    </div>
  );
}
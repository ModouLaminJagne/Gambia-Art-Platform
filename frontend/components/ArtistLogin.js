import { useState } from 'react';
import axios from 'axios';

export default function ArtistLogin({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/artists/login', formData);

      setMessage('🎉 Login successful! Welcome back!');
      
      // Store token and user data
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('currentArtist', JSON.stringify(response.data.artist));
      }
      
      if (onLoginSuccess) {
        setTimeout(() => {
          onLoginSuccess(response.data.artist);
        }, 1500);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || '❌ Login failed. Please check your credentials.';
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-4 shadow-lg">
          <span className="text-2xl">🔑</span>
        </div>
        <h2 className="text-3xl font-bold text-gradient-primary mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-600">
          Sign in to access your artist dashboard
        </p>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-xl shadow-lg border-l-4 animate-slide-up ${
          message.includes('successful') || message.includes('🎉')
            ? 'alert-success border-green-500' 
            : 'alert-error border-red-500'
        }`}>
          <div className="flex items-center">
            <span className="text-xl mr-3">
              {message.includes('successful') || message.includes('🎉') ? '✅' : '❌'}
            </span>
            <p className="font-semibold">{message}</p>
          </div>
        </div>
      )}

      {/* Login Form */}
      <div className="card p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <label className="form-label flex items-center space-x-2">
              <span>📧</span>
              <span>Email Address</span>
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
              <span>Password</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`form-input ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Enter your password"
              required
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full btn-primary text-lg py-3 relative ${loading ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-2xl'}`}
          >
            {loading ? (
              <span className="flex items-center justify-center space-x-3">
                <div className="loading-spinner"></div>
                <span>Signing In...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center space-x-3">
                <span>🚀</span>
                <span>Sign In</span>
                <span className="animate-bounce">→</span>
              </span>
            )}
          </button>
        </form>

        {/* Additional Info */}
        <div className="text-center pt-6 border-t border-gray-200 mt-6">
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <a href="/register" className="text-gambian-red hover:text-gambian-blue font-semibold transition-colors duration-200">
              Register as Artist
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

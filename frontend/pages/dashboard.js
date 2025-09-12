import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ArtworkUpload from '../components/ArtworkUpload';
import axios from 'axios';

export default function Dashboard() {
  const [artist, setArtist] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [email, setEmail] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalArtworks: 0,
    totalViews: 0,
    availableCopies: 0
  });
  const router = useRouter();

  useEffect(() => {
    // Try to get artist from localStorage first
    const storedArtist = localStorage.getItem('currentArtist');
    if (storedArtist) {
      try {
        const artistData = JSON.parse(storedArtist);
        setArtist(artistData);
        fetchArtworks(artistData.id || artistData._id);
      } catch (error) {
        console.error('Error parsing stored artist:', error);
        localStorage.removeItem('currentArtist');
      }
    }
  }, []);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.get(`http://localhost:5000/api/artists/by-email/${email}`);
      const artistData = response.data;
      setArtist(artistData);
      localStorage.setItem('currentArtist', JSON.stringify(artistData));
      fetchArtworks(artistData._id);
    } catch (error) {
      alert('Artist not found. Please register first or check your email.');
      router.push('/register');
    } finally {
      setLoading(false);
    }
  };

  const fetchArtworks = async (artistId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/artworks/artist/${artistId}`);
      const artworkData = response.data;
      setArtworks(artworkData);
      
      // Calculate stats
      const totalCopies = artworkData.reduce((sum, artwork) => sum + artwork.copiesAvailable, 0);
      setStats({
        totalArtworks: artworkData.length,
        totalViews: Math.floor(Math.random() * 1000) + 100, // Mock data
        availableCopies: totalCopies
      });
    } catch (error) {
      console.error('Error fetching artworks:', error);
    }
  };

  const handleUploadSuccess = (newArtwork) => {
    setArtworks([newArtwork, ...artworks]);
    setShowUploadForm(false);
    // Update stats
    setStats(prev => ({
      ...prev,
      totalArtworks: prev.totalArtworks + 1,
      availableCopies: prev.availableCopies + newArtwork.copiesAvailable
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('currentArtist');
    setArtist(null);
    setArtworks([]);
    setEmail('');
    setStats({ totalArtworks: 0, totalViews: 0, availableCopies: 0 });
  };

  // Login Form for non-authenticated users
  if (!artist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50/30 px-4">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-primary mb-6 shadow-lg">
              <span className="text-3xl">🎯</span>
            </div>
            <h1 className="text-4xl font-bold text-gradient-primary mb-4">
              Artist Dashboard
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Access your personal artist dashboard to manage your artworks and profile
            </p>
          </div>

          {/* Login Form */}
          <div className="card-featured p-8">
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="form-label flex items-center space-x-2">
                  <span>📧</span>
                  <span>Your Email Address</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input text-lg"
                  placeholder="artist@example.com"
                  required
                />
                <p className="text-sm text-gray-500">
                  Enter the email you used to register as an artist
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full btn-primary text-lg py-4 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-3">
                    <div className="loading-spinner"></div>
                    <span>Accessing Dashboard...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center space-x-3">
                    <span>🚀</span>
                    <span>Access Dashboard</span>
                    <span className="animate-bounce">→</span>
                  </span>
                )}
              </button>
            </form>

            {/* Help Text */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600 mb-4">
                Don't have an account yet?
              </p>
              <button
                onClick={() => router.push('/register')}
                className="w-full btn-outline"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>✨</span>
                  <span>Register as Artist</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/30">
      <div className="container mx-auto px-6 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            {/* Artist Info */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                {artist.profilePhoto ? (
                  <img
                    src={`http://localhost:5000/uploads/profiles/${artist.profilePhoto}`}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {artist.name?.charAt(0)}{artist.surname?.charAt(0)}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-gold rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-sm">🎨</span>
                </div>
              </div>
              
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Welcome back, <span className="text-gradient-primary">{artist.name}</span>!
                </h1>
                <p className="text-lg text-gray-600">
                  {artist.address} • Joined {new Date().toLocaleDateString()}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-semibold">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                    Active Artist
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowUploadForm(!showUploadForm)}
                className="btn-secondary px-6 py-3"
              >
                <span className="flex items-center space-x-2">
                  <span>{showUploadForm ? '❌' : '📸'}</span>
                  <span>{showUploadForm ? 'Cancel Upload' : 'Upload Artwork'}</span>
                </span>
              </button>
              
              <button
                onClick={handleLogout}
                className="btn-outline px-6 py-3 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
              >
                <span className="flex items-center space-x-2">
                  <span>🚪</span>
                  <span>Logout</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card group hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Artworks</p>
                <p className="text-3xl font-bold text-gambian-red mt-1">{stats.totalArtworks}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🎨</span>
              </div>
            </div>
          </div>

          <div className="card group hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Available Copies</p>
                <p className="text-3xl font-bold text-gambian-green mt-1">{stats.availableCopies}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">📦</span>
              </div>
            </div>
          </div>

          <div className="card group hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Profile Views</p>
                <p className="text-3xl font-bold text-gambian-blue mt-1">{stats.totalViews}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">👁️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <div className="mb-12 animate-slide-up">
            <ArtworkUpload 
              artistId={artist._id || artist.id} 
              onUploadSuccess={handleUploadSuccess}
            />
          </div>
        )}

        {/* Artworks Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gradient-secondary mb-2">Your Art Collection</h2>
              <p className="text-lg text-gray-600">Manage and showcase your creative masterpieces</p>
            </div>
            
            {artworks.length > 0 && (
              <div className="text-sm text-gray-500">
                Showing {artworks.length} artwork{artworks.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
          
          {artworks.length === 0 ? (
            <div className="card text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-6xl opacity-50">🎨</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-400 mb-4">No artworks yet</h3>
                <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                  Ready to share your creativity with the world? Upload your first masterpiece and start building your digital gallery!
                </p>
                <button
                  onClick={() => setShowUploadForm(true)}
                  className="btn-primary px-8 py-4"
                >
                  <span className="flex items-center space-x-3">
                    <span>✨</span>
                    <span>Upload Your First Artwork</span>
                    <span className="animate-bounce">→</span>
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {artworks.map((artwork, index) => (
                <div
                  key={artwork._id}
                  className="card-artwork group animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative overflow-hidden rounded-t-2xl">
                    <img
                      src={`http://localhost:5000/uploads/artworks/${artwork.image}`}
                      alt={artwork.title}
                      className="w-full h-64 object-cover transition-all duration-700 group-hover:scale-110"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-6">
                      <div className="text-white">
                        <p className="font-bold text-lg mb-1">View Details</p>
                        <p className="text-sm opacity-90">Click to explore</p>
                      </div>
                    </div>

                    {/* Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-bold text-gray-800">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                        {artwork.copiesAvailable} available
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gambian-red transition-colors duration-300">
                        {artwork.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                        {artwork.description}
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-500">
                        Uploaded {new Date(artwork.createdAt).toLocaleDateString()}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="p-2 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-600 transition-colors duration-200">
                          <span>✏️</span>
                        </button>
                        <button className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-200">
                          <span>👁️</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready for more?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Keep building your artistic presence. Upload more artworks, connect with other artists, and grow your audience.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowUploadForm(true)}
                className="btn-primary px-8 py-3"
              >
                <span className="flex items-center space-x-2">
                  <span>🚀</span>
                  <span>Upload Another Artwork</span>
                </span>
              </button>
              
              <button
                onClick={() => router.push('/')}
                className="btn-outline px-8 py-3"
              >
                <span className="flex items-center space-x-2">
                  <span>🌍</span>
                  <span>View Public Gallery</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
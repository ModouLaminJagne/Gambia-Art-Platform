import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function Home() {
  const [artworks, setArtworks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredArtwork, setFeaturedArtwork] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  // Single function that fetches both artworks and artists.
const fetchData = async () => {
  try {
    setLoading(true);
    
    // Fetch both artworks and artists simultaneously
    const [artworksResponse, artistsResponse] = await Promise.all([
      axios.get('http://localhost:5000/api/artworks'),
      axios.get('http://localhost:5000/api/artists')
    ]);

    // Set artworks
    setArtworks(artworksResponse.data);
    if (artworksResponse.data.length > 0) {
      setFeaturedArtwork(artworksResponse.data[0]);
    }

    // Set artists (assuming you have setArtists state)
    setArtists(artistsResponse.data);

    console.log(`✅ Loaded ${artworksResponse.data.length} artworks and ${artistsResponse.data.length} artists`);
    
  } catch (error) {
    console.error('Error fetching data:', error);
    // You might want to set error states here
    setError('Failed to load data. Please try again.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-primary rounded-full opacity-10 float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-secondary rounded-full opacity-10 float-delayed"></div>
          <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-gradient-accent rounded-full opacity-10 float"></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <div className="animate-fade-in">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-sm font-semibold text-gray-700 mb-6">
                <span className="animate-pulse mr-2">🌟</span>
                Celebrating Gambian Heritage Through Art
              </span>
            </div>
            
            <h1 className="hero-title animate-slide-up text-4xl font-bold text-gray-900 mb-4">
              Discover the Soul of Gambian Art
              <span className="relative inline-block">
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-gold rounded-full animate-pulse">
                </div>
              </span>
            </h1>
            
            <p className="hero-subtitle animate-slide-up text-gray-600 text-lg mb-6">
              Where tradition meets creativity. Explore breathtaking artworks from talented Gambian artists 
              and immerse yourself in the rich cultural tapestry of West Africa.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-scale-in">
              <Link href="/register" className="btn-primary text-lg px-10 py-4">
                <span className="flex items-center space-x-3">
                  <span>🎨</span>
                  <span>Join as Artist</span>
                  <span className="animate-bounce">→</span>
                </span>
              </Link>
              <Link href="#gallery" className="btn-outline text-lg px-10 py-4">
                <span className="flex items-center space-x-3">
                  <span>🖼️</span>
                  <span>Explore Gallery</span>
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/50 to-transparent"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="group">
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 transform group-hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="text-3xl font-bold text-gambian-red mb-2">{artworks.length}+</h3>
                <p className="text-gray-600 font-medium">Unique Artworks</p>
              </div>
            </div>
            <div className="group">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 transform group-hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                <div className="text-4xl mb-4">👨‍🎨</div>
                <h3 className="text-3xl font-bold text-gambian-blue mb-2">{artists.length}+</h3>
                <p className="text-gray-600 font-medium">Talented Artists</p>
              </div>
            </div>
            <div className="group">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 transform group-hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                <div className="text-4xl mb-4">🌍</div>
                <h3 className="text-3xl font-bold text-gambian-green mb-2">Global</h3>
                <p className="text-gray-600 font-medium">Reach & Impact</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Artwork */}
      {featuredArtwork && (
        <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-red-50/30">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-gradient-primary mb-4">
                Featured Masterpiece
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover the artwork that captures the essence of Gambian culture and creativity
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="card-featured p-0 overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative group">
                    <img
                      src={`http://localhost:5000/uploads/artworks/${featuredArtwork.image}`}
                      alt={featuredArtwork.title}
                      className="w-full h-96 md:h-full object-cover transition-all duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="badge-featured">
                      ⭐ Featured Artwork
                    </div>
                  </div>
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <h3 className="text-4xl font-bold mb-4 text-gray-900">
                      {featuredArtwork.title}
                    </h3>
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                      {featuredArtwork.description}
                    </p>
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                          {featuredArtwork.artistId?.name?.charAt(0) || '🎨'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {featuredArtwork.artistId?.name} {featuredArtwork.artistId?.surname}
                          </p>
                          <p className="text-sm text-gray-500">Featured Artist</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gambian-green">
                          {featuredArtwork.copiesAvailable}
                        </p>
                        <p className="text-sm text-gray-500">copies available</p>
                      </div>
                    </div>
                    <Link href="/dashboard" className="btn-primary w-full justify-center">
                      <span className="flex items-center space-x-2">
                        <span>💎</span>
                        <span>Explore More</span>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gradient-secondary mb-4">
              Art Gallery
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Immerse yourself in a curated collection of extraordinary artworks that tell the story of Gambia's rich cultural heritage
            </p>
          </div>
          
          {loading ? (
            <div className="gallery-grid">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="card animate-pulse">
                  <div className="skeleton w-full h-64 mb-4"></div>
                  <div className="skeleton h-6 mb-2"></div>
                  <div className="skeleton h-4 mb-4"></div>
                  <div className="flex justify-between">
                    <div className="skeleton h-4 w-24"></div>
                    <div className="skeleton h-4 w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : artworks.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-8xl mb-6">🎨</div>
              <h3 className="text-3xl font-bold text-gray-400 mb-4">No Artworks Yet</h3>
              <p className="text-lg text-gray-500 mb-8 max-w-md mx-auto">
                Be the first to showcase your beautiful Gambian artwork on our platform!
              </p>
              <Link href="/register" className="btn-primary">
                <span className="flex items-center space-x-2">
                  <span>✨</span>
                  <span>Upload First Artwork</span>
                </span>
              </Link>
            </div>
          ) : (
            <div className="gallery-grid">
              {artworks.slice(0, 6).map((artwork, index) => (
                <div
                  key={artwork._id}
                  className="card-artwork group animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={`http://localhost:5000/uploads/artworks/${artwork.image}`}
                      alt={artwork.title}
                      className="artwork-image"
                    />
                    <div className="artwork-overlay">
                      <div className="text-white">
                        <p className="font-bold text-lg mb-1">{artwork.title}</p>
                        <p className="text-sm opacity-90">Click to learn more</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-gambian-red transition-colors duration-300">
                      {artwork.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {artwork.description}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-bold">
                          {artwork.artistId?.name?.charAt(0) || '🎨'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700">
                            {artwork.artistId?.name} {artwork.artistId?.surname}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                            {artwork.copiesAvailable} available
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {artworks.length > 6 && (
            <div className="text-center mt-12">
              <Link href="/dashboard" className="btn-secondary">
                <span className="flex items-center space-x-2">
                  <span>🎯</span>
                  <span>View All Artworks</span>
                  <span className="animate-bounce">→</span>
                </span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-br from-gambian-red via-warm-orange to-gambian-blue relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto text-white">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Share Your Art with the World
            </h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
              Join our vibrant community of Gambian artists and showcase your creativity to a global audience. 
              Your art deserves to be seen and celebrated.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/register" className="bg-white text-gambian-red hover:bg-gray-100 font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl">
                <span className="flex items-center space-x-3">
                  <span>🚀</span>
                  <span>Start Your Journey</span>
                </span>
              </Link>
              <Link href="/dashboard" className="border-2 border-white text-white hover:bg-white hover:text-gambian-red font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105">
                <span className="flex items-center space-x-3">
                  <span>👁️</span>
                  <span>Browse Artists</span>
                </span>
              </Link>
            </div>
            
            <div className="mt-12 text-sm opacity-75">
              <p>✨ Free to join • 🌍 Global reach • 🎨 Full creative control</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                  <span className="text-white font-bold">🎨</span>
                </div>
                <h3 className="text-2xl font-bold text-gradient-primary">Gambian Art Platform</h3>
              </div>
              <p className="text-gray-400 leading-relaxed mb-4">
                Celebrating and preserving Gambian artistic heritage through a digital platform 
                that connects artists with art lovers worldwide.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gradient-primary transition-all duration-300 cursor-pointer">
                  <span>📘</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gradient-primary transition-all duration-300 cursor-pointer">
                  <span>📷</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gradient-primary transition-all duration-300 cursor-pointer">
                  <span>🐦</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-white transition-colors duration-300">Home</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors duration-300">Join Artists</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors duration-300">Dashboard</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors duration-300">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-500">
            <p>&copy; 2024 Gambian Art Platform. Made with ❤️ for Gambian artists and culture.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
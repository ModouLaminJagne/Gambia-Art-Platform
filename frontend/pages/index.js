import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import ModernHeader from '../components/ModernHeader';
import ModernHero from '../components/ModernHero';
import ModernGallery from '../components/ModernGallery';
import ModernFooter from '../components/ModernFooter';

export default function Home() {
  const [artworks, setArtworks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredArtwork, setFeaturedArtwork] = useState(null);
  const [error, setError] = useState(null);

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

    // Handle new API response structure for artworks
    const artworksData = artworksResponse.data.artworks || artworksResponse.data;
    setArtworks(Array.isArray(artworksData) ? artworksData : []);
    
    if (Array.isArray(artworksData) && artworksData.length > 0) {
      setFeaturedArtwork(artworksData[0]);
    }

    // Handle new API response structure for artists
    const artistsData = artistsResponse.data.artists || artistsResponse.data;
    setArtists(Array.isArray(artistsData) ? artistsData : []);

    console.log(`✅ Loaded ${artworksData.length} artworks and ${artistsData.length} artists`);
    
  } catch (error) {
    console.error('Error fetching data:', error);
    // Set empty arrays on error to prevent crashes
    setArtworks([]);
    setArtists([]);
    setError('Failed to load data. Please try again.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen">
      <ModernHeader />
      <ModernHero artworks={artworks} artists={artists} />


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

      <ModernGallery artworks={artworks} loading={loading} error={error} />

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

      <ModernFooter />
    </div>
  );
}
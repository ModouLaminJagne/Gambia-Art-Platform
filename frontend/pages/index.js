import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function Home() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/artworks');
      setArtworks(response.data);
    } catch (error) {
      console.error('Error fetching artworks:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gambian-red mb-4">
          Welcome to Gambian Art Platform
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Discover and celebrate the rich artistic heritage of The Gambia
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/register" className="btn-primary">
            Register as Artist
          </Link>
          <Link href="/dashboard" className="btn-secondary">
            Artist Dashboard
          </Link>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gambian-blue mb-6">Featured Artworks</h2>
        
        {loading ? (
          <div className="text-center">Loading artworks...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artworks.map((artwork) => (
              <div key={artwork._id} className="card">
                <div className="aspect-w-16 aspect-h-12 mb-4">
                  <img
                    src={`http://localhost:5000/uploads/artworks/${artwork.image}`}
                    alt={artwork.title}
                    className="w-full h-48 object-cover rounded-md"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2">{artwork.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{artwork.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    by {artwork.artistId?.name} {artwork.artistId?.surname}
                  </span>
                  <span className="text-sm font-medium text-gambian-green">
                    {artwork.copiesAvailable} copies available
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
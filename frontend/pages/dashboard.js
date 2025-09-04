import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ArtworkUpload from '../components/ArtworkUpload';
import axios from 'axios';

export default function Dashboard() {
  const [artist, setArtist] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [email, setEmail] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Try to get artist from localStorage first
    const storedArtist = localStorage.getItem('currentArtist');
    if (storedArtist) {
      const artistData = JSON.parse(storedArtist);
      setArtist(artistData);
      fetchArtworks(artistData.id);
    }
  }, []);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:5000/api/artists/by-email/${email}`);
      const artistData = response.data;
      setArtist(artistData);
      localStorage.setItem('currentArtist', JSON.stringify(artistData));
      fetchArtworks(artistData._id);
    } catch (error) {
      alert('Artist not found. Please register first.');
      router.push('/register');
    }
  };

  const fetchArtworks = async (artistId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/artworks/artist/${artistId}`);
      setArtworks(response.data);
    } catch (error) {
      console.error('Error fetching artworks:', error);
    }
  };

  const handleUploadSuccess = (newArtwork) => {
    setArtworks([newArtwork, ...artworks]);
    setShowUploadForm(false);
  };

  if (!artist) {
    return (
      <div className="max-w-md mx-auto">
        <div className="card">
          <h1 className="text-2xl font-bold text-center mb-6 text-gambian-red">Artist Dashboard</h1>
          <p className="text-gray-600 mb-4">Enter your email to access your dashboard:</p>
          
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                required
              />
            </div>
            <button type="submit" className="w-full btn-primary">
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gambian-red mb-2">
            Welcome, {artist.name} {artist.surname}
          </h1>
          <p className="text-gray-600">Manage your artworks and profile</p>
        </div>
        <div className="flex items-center space-x-4">
          {artist.profilePhoto && (
            <img
              src={`http://localhost:5000/uploads/profiles/${artist.profilePhoto}`}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover"
            />
          )}
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="btn-secondary"
          >
            {showUploadForm ? 'Cancel Upload' : 'Upload New Artwork'}
          </button>
        </div>
      </div>

      {showUploadForm && (
        <div className="mb-8">
          <ArtworkUpload 
            artistId={artist._id || artist.id} 
            onUploadSuccess={handleUploadSuccess}
          />
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-gambian-blue mb-6">Your Artworks</h2>
        
        {artworks.length === 0 ? (
          <div className="card text-center">
            <p className="text-gray-600">You haven't uploaded any artworks yet.</p>
            <button
              onClick={() => setShowUploadForm(true)}
              className="btn-primary mt-4"
            >
              Upload Your First Artwork
            </button>
          </div>
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
                  <span className="text-sm font-medium text-gambian-green">
                    {artwork.copiesAvailable} copies available
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(artwork.createdAt).toLocaleDateString()}
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
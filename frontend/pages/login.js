import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ArtistLogin from '../components/ArtistLogin';
import Layout from '../components/Layout';

export default function Login() {
  const [artist, setArtist] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    const storedArtist = localStorage.getItem('currentArtist');
    
    if (token && storedArtist) {
      try {
        const artistData = JSON.parse(storedArtist);
        setArtist(artistData);
        // Redirect to dashboard if already logged in
        router.push('/dashboard');
      } catch (error) {
        console.error('Error parsing stored artist:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentArtist');
      }
    }
  }, [router]);

  const handleLoginSuccess = (artistData) => {
    setArtist(artistData);
    router.push('/dashboard');
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-red-50/30 px-4">
        <ArtistLogin onLoginSuccess={handleLoginSuccess} />
      </div>
    </Layout>
  );
}

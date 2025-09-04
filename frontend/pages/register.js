import { useState } from 'react';
import { useRouter } from 'next/router';
import ArtistRegistration from '../components/ArtistRegistration';

export default function Register() {
  const router = useRouter();

  const handleRegistrationSuccess = (artist) => {
    // Store artist info in localStorage for demo purposes
    localStorage.setItem('currentArtist', JSON.stringify(artist));
    // Redirect to dashboard after successful registration
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gambian-red mb-4">Join Our Community</h1>
        <p className="text-lg text-gray-600">
          Register as an artist and start showcasing your work
        </p>
      </div>
      
      <ArtistRegistration onRegistrationSuccess={handleRegistrationSuccess} />
    </div>
  );
}
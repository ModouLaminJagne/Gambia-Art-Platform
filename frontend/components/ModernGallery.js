import { useState } from 'react';
import Link from 'next/link';
import { ModernCard, ModernCardContent, ModernCardHeader, ModernCardTitle, ModernCardDescription } from './ui/ModernCard';

export default function ModernGallery({ artworks = [], loading = false, error = null }) {
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Art Gallery</h2>
            <p className="text-lg text-gray-600">Loading beautiful artworks...</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <ModernCard key={index} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-t-xl"></div>
                <ModernCardContent>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </ModernCardContent>
              </ModernCard>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Gallery</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!Array.isArray(artworks) || artworks.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🎨</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Artworks Yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Be the first to showcase your beautiful Gambian artwork on our platform!
            </p>
            <Link
              href="/register"
              className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              <span className="mr-2">✨</span>
              Upload First Artwork
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Art Gallery</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Immerse yourself in a curated collection of extraordinary artworks that tell the story of Gambia's rich cultural heritage
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artworks.slice(0, 6).map((artwork, index) => (
            <ModernCard 
              key={artwork._id} 
              className="group cursor-pointer overflow-hidden"
              onClick={() => setSelectedArtwork(artwork)}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={`http://localhost:5000/uploads/artworks/${artwork.image}`}
                  alt={artwork.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <ModernCardContent>
                <ModernCardTitle className="mb-2">{artwork.title}</ModernCardTitle>
                <ModernCardDescription className="line-clamp-2 mb-4">
                  {artwork.description}
                </ModernCardDescription>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {artwork.artistId?.name?.charAt(0) || '🎨'}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {artwork.artistId?.name} {artwork.artistId?.surname}
                    </span>
                  </div>
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                    {artwork.copiesAvailable} available
                  </span>
                </div>
              </ModernCardContent>
            </ModernCard>
          ))}
        </div>

        {/* View More Button */}
        {artworks.length > 6 && (
          <div className="text-center mt-12">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 border border-gray-300 hover:border-red-300 text-gray-700 hover:text-red-600 font-semibold rounded-lg transition-colors duration-200"
            >
              View All Artworks
            </Link>
          </div>
        )}
      </div>

      {/* Artwork Modal */}
      {selectedArtwork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-gray-900">{selectedArtwork.title}</h3>
                <button
                  onClick={() => setSelectedArtwork(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <img
                src={`http://localhost:5000/uploads/artworks/${selectedArtwork.image}`}
                alt={selectedArtwork.title}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <p className="text-gray-600 mb-4">{selectedArtwork.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {selectedArtwork.artistId?.name?.charAt(0) || '🎨'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {selectedArtwork.artistId?.name} {selectedArtwork.artistId?.surname}
                    </p>
                    <p className="text-sm text-gray-500">Artist</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                  {selectedArtwork.copiesAvailable} copies available
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

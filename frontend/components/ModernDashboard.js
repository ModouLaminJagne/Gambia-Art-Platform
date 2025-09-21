import { useState } from 'react';
import { ModernCard, ModernCardContent, ModernCardHeader, ModernCardTitle, ModernCardDescription } from './ui/ModernCard';

export default function ModernDashboard({ artist, artworks = [], stats, onUploadSuccess, onLogout }) {
  const [showUploadForm, setShowUploadForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">GA</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {artist?.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowUploadForm(true)}
                className="btn-primary-modern"
              >
                <span className="mr-2">📤</span>
                Upload Artwork
              </button>
              <button
                onClick={onLogout}
                className="btn-secondary-modern"
              >
                <span className="mr-2">🚪</span>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ModernCard>
            <ModernCardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🎨</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Artworks</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalArtworks}</p>
                </div>
              </div>
            </ModernCardContent>
          </ModernCard>

          <ModernCard>
            <ModernCardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">👁️</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
                </div>
              </div>
            </ModernCardContent>
          </ModernCard>

          <ModernCard>
            <ModernCardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📦</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Available Copies</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.availableCopies}</p>
                </div>
              </div>
            </ModernCardContent>
          </ModernCard>
        </div>

        {/* Artworks Section */}
        <ModernCard>
          <ModernCardHeader>
            <div className="flex justify-between items-center">
              <div>
                <ModernCardTitle>Your Art Collection</ModernCardTitle>
                <ModernCardDescription>
                  Manage and showcase your creative masterpieces
                </ModernCardDescription>
              </div>
              {Array.isArray(artworks) && artworks.length > 0 && (
                <span className="text-sm text-gray-500">
                  {artworks.length} artwork{artworks.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </ModernCardHeader>
          <ModernCardContent>
            {!Array.isArray(artworks) || artworks.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🎨</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">No Artworks Yet</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Start building your portfolio by uploading your first masterpiece!
                </p>
                <button
                  onClick={() => setShowUploadForm(true)}
                  className="btn-primary-modern"
                >
                  <span className="mr-2">✨</span>
                  Upload Your First Artwork
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {artworks.map((artwork, index) => (
                  <div key={artwork._id} className="group">
                    <div className="aspect-square overflow-hidden rounded-lg mb-4">
                      <img
                        src={`http://localhost:5000/uploads/artworks/${artwork.image}`}
                        alt={artwork.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{artwork.title}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {artwork.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                          {artwork.copiesAvailable} available
                        </span>
                        <div className="flex space-x-2">
                          <button className="text-gray-400 hover:text-red-600 transition-colors duration-200">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button className="text-gray-400 hover:text-red-600 transition-colors duration-200">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ModernCardContent>
        </ModernCard>
      </div>

      {/* Upload Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Upload New Artwork</h3>
                <button
                  onClick={() => setShowUploadForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Upload Form Component would go here */}
              <div className="text-center py-8">
                <p className="text-gray-600">Upload form component will be integrated here</p>
                <button
                  onClick={() => setShowUploadForm(false)}
                  className="btn-primary-modern mt-4"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import Link from 'next/link';

export default function ModernHero({ artworks = [], artists = [] }) {
  return (
    <section className="relative bg-gradient-to-br from-gray-50 via-white to-red-50/30 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23CE1126' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-50 border border-red-200 text-red-700 text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
            Celebrating Gambian Heritage Through Art
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Discover the Soul of
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-blue-600">
              Gambian Art
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Where tradition meets creativity. Explore breathtaking artworks from talented Gambian artists 
            and immerse yourself in the rich cultural tapestry of West Africa.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/register"
              className="inline-flex items-center px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <span className="mr-2">🎨</span>
              Join as Artist
            </Link>
            <Link
              href="#gallery"
              className="inline-flex items-center px-8 py-4 border border-gray-300 hover:border-red-300 text-gray-700 hover:text-red-600 font-semibold rounded-lg transition-colors duration-200"
            >
              <span className="mr-2">🖼️</span>
              Explore Gallery
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">{artworks.length}+</div>
              <div className="text-sm text-gray-600 font-medium">Unique Artworks</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">{artists.length}+</div>
              <div className="text-sm text-gray-600 font-medium">Talented Artists</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">Global</div>
              <div className="text-sm text-gray-600 font-medium">Reach & Impact</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

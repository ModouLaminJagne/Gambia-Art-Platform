import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`header-main fixed w-full top-0 z-50 transition-all duration-500 ${
        isScrolled ? 'shadow-2xl bg-white/95' : 'bg-white/80'
      }`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <span className="text-white font-bold text-xl">🎨</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-gold rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="logo-text text-2xl md:text-3xl">
                  Gambian Art
                </h1>
                <p className="text-xs text-gray-500 font-medium tracking-widest uppercase">
                  Platform
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              <Link href="/" className="nav-link group">
                <span className="flex items-center space-x-2">
                  <span>🏠</span>
                  <span>Home</span>
                </span>
              </Link>
              <Link href="/register" className="nav-link group">
                <span className="flex items-center space-x-2">
                  <span>✨</span>
                  <span>Join Artists</span>
                </span>
              </Link>
              <Link href="/dashboard" className="nav-link group">
                <span className="flex items-center space-x-2">
                  <span>🎯</span>
                  <span>Dashboard</span>
                </span>
              </Link>
              
              {/* CTA Button */}
              <div className="ml-6">
                <Link href="/register" className="btn-primary text-sm px-6 py-2">
                  <span className="flex items-center space-x-2">
                    <span>🚀</span>
                    <span>Get Started</span>
                  </span>
                </Link>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden relative w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className={`w-6 h-0.5 bg-white absolute transition-all duration-300 ${
                isMobileMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-1'
              }`}></div>
              <div className={`w-6 h-0.5 bg-white absolute transition-all duration-300 ${
                isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}></div>
              <div className={`w-6 h-0.5 bg-white absolute transition-all duration-300 ${
                isMobileMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-1'
              }`}></div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-white/95 backdrop-blur-md border-t border-gray-200/50 px-6 py-4 space-y-2">
            <Link href="/" className="block nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="flex items-center space-x-3 py-2">
                <span className="text-xl">🏠</span>
                <span>Home</span>
              </span>
            </Link>
            <Link href="/register" className="block nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="flex items-center space-x-3 py-2">
                <span className="text-xl">✨</span>
                <span>Join Artists</span>
              </span>
            </Link>
            <Link href="/dashboard" className="block nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="flex items-center space-x-3 py-2">
                <span className="text-xl">🎯</span>
                <span>Dashboard</span>
              </span>
            </Link>
            <div className="pt-4">
              <Link href="/register" className="btn-primary w-full justify-center text-sm" onClick={() => setIsMobileMenuOpen(false)}>
                <span className="flex items-center space-x-2">
                  <span>🚀</span>
                  <span>Get Started</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-20"></div>
    </>
  );
}
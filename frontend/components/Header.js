import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b-4 border-gambian-red">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gambian-red">
            Gambian Art Platform
          </Link>
          <nav className="flex space-x-6">
            <Link href="/" className="text-gray-700 hover:text-gambian-red transition-colors">
              Home
            </Link>
            <Link href="/register" className="text-gray-700 hover:text-gambian-red transition-colors">
              Register
            </Link>
            <Link href="/dashboard" className="text-gray-700 hover:text-gambian-red transition-colors">
              Dashboard
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
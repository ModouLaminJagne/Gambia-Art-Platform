import Header from './Header';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <nav className="mb-8">
          <Header />
        </nav>
        {children}
      </main>
    </div>
  );
}
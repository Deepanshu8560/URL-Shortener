import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isLandingPage = router.pathname === '/';

  const isActive = (path: string) => router.pathname === path;

  return (
    <div className="min-h-screen flex flex-col">
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isLandingPage
          ? 'glass border-b border-white/20'
          : 'bg-white shadow-sm border-b border-gray-200'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/"
              className={`text-2xl font-bold transition-colors ${isLandingPage
                  ? 'text-white hover:text-white/80'
                  : 'text-blue-600 hover:text-blue-700'
                }`}
            >
              <span className={isLandingPage ? '' : 'gradient-text'}>
                URL Shortener
              </span>
            </Link>
            <nav className="flex space-x-4">
              <Link
                href="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/')
                    ? isLandingPage
                      ? 'bg-white/20 text-white'
                      : 'bg-blue-100 text-blue-700'
                    : isLandingPage
                      ? 'text-white/90 hover:bg-white/10 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/dashboard')
                    ? isLandingPage
                      ? 'bg-white/20 text-white'
                      : 'bg-blue-100 text-blue-700'
                    : isLandingPage
                      ? 'text-white/90 hover:bg-white/10 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
              >
                Dashboard
              </Link>
              <Link
                href="/health"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/health')
                    ? isLandingPage
                      ? 'bg-white/20 text-white'
                      : 'bg-blue-100 text-blue-700'
                    : isLandingPage
                      ? 'text-white/90 hover:bg-white/10 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
              >
                Health
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className={`flex-1 ${isLandingPage ? '' : 'pt-16'}`}>{children}</main>
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white border-t border-gray-700 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            <div>
              <h3 className="text-xl font-bold mb-3 gradient-text-secondary">URL Shortener</h3>
              <p className="text-gray-400 text-sm">
                The modern way to shorten links and track performance.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="/health" className="hover:text-white transition-colors">Health</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6 text-center">
            <p className="text-sm text-gray-400">
              © 2024 URL Shortener. Built with Next.js & Neon Postgres.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}


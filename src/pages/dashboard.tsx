import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import LinkForm from '@/components/LinkForm';
import LinksTable from '@/components/LinksTable';
import { Link } from '@/types';

export default function Dashboard() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const fetchLinks = async (searchTerm: string = '') => {
    try {
      setLoading(true);
      setError(null);
      const url = searchTerm
        ? `/api/links?search=${encodeURIComponent(searchTerm)}`
        : '/api/links';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch links');
      const data = await res.json();
      setLinks(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load links');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer
    debounceTimer.current = setTimeout(() => {
      fetchLinks(search);
    }, search ? 300 : 0); // Immediate fetch if search is empty

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleLinkCreated = () => {
    fetchLinks();
  };

  const handleLinkDeleted = () => {
    fetchLinks();
  };

  return (
    <>
      <Head>
        <title>Dashboard - URL Shortener</title>
      </Head>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Create and manage your shortened URLs</p>
        </div>

        <div className="mb-6">
          <LinkForm onSuccess={handleLinkCreated} />
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl font-semibold text-gray-900">All Links</h2>
              <div className="flex-1 sm:max-w-xs">
                <input
                  type="text"
                  placeholder="Search by code or URL..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {loading && (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading links...</p>
            </div>
          )}

          {error && (
            <div className="p-6">
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800">{error}</p>
                <button
                  onClick={() => fetchLinks()}
                  className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {!loading && !error && (
            <LinksTable
              links={links}
              onDelete={handleLinkDeleted}
            />
          )}
        </div>
      </div>
    </>
  );
}


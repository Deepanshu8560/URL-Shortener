import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

interface LinkStats {
  code: string;
  target_url: string;
  clicks: number;
  created_at: string;
  last_clicked_at: string | null;
}

export default function StatsPage() {
  const router = useRouter();
  const { code } = router.query;
  const [stats, setStats] = useState<LinkStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (code && typeof code === 'string') {
      fetch(`/api/stats/${code}`)
        .then((res) => {
          if (!res.ok) {
            if (res.status === 404) {
              throw new Error('Link not found');
            }
            throw new Error('Failed to fetch stats');
          }
          return res.json();
        })
        .then((data) => {
          setStats(data);
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [code]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const shortUrl = stats
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/${stats.code}`
    : '';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <>
      <Head>
        <title>Stats - {code} | URL Shortener</title>
      </Head>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>

        {loading && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading stats...</p>
          </div>
        )}

        {error && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
              <p className="text-red-600">{error}</p>
              <Link
                href="/"
                className="mt-4 inline-block text-sm text-red-600 hover:text-red-700 underline"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        )}

        {stats && !loading && !error && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900">Link Statistics</h1>
              <p className="text-gray-600 mt-1">Detailed information for code: <span className="font-mono font-semibold">{stats.code}</span></p>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Short Code</label>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-mono text-gray-900">{stats.code}</span>
                  <button
                    onClick={() => copyToClipboard(shortUrl)}
                    className="text-gray-400 hover:text-gray-600"
                    title="Copy short URL"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1 break-all">{shortUrl}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Target URL</label>
                <div className="flex items-center gap-2">
                  <a
                    href={stats.target_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 break-all"
                  >
                    {stats.target_url}
                  </a>
                  <button
                    onClick={() => copyToClipboard(stats.target_url)}
                    className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                    title="Copy target URL"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Total Clicks</label>
                  <p className="text-3xl font-bold text-gray-900">{stats.clicks}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Created At</label>
                  <p className="text-sm text-gray-900">{formatDate(stats.created_at)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Last Clicked</label>
                  <p className="text-sm text-gray-900">{formatDate(stats.last_clicked_at)}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Test Redirect
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}


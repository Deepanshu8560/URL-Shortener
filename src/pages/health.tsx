import { useState, useEffect } from 'react';
import Head from 'next/head';

interface HealthData {
  status: string;
  timestamp: string;
  uptime: string;
  uptimeSeconds: number;
  database: string;
  version: string;
  error?: string;
}

export default function HealthPage() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setHealth(data);
      })
      .catch((err) => {
        setHealth({
          status: 'error',
          timestamp: new Date().toISOString(),
          uptime: '0s',
          uptimeSeconds: 0,
          database: 'unknown',
          version: '1.0.0',
          error: err.message,
        });
      })
      .finally(() => {
        setLoading(false);
      });

    // Refresh every 5 seconds
    const interval = setInterval(() => {
      fetch('/api/health')
        .then((res) => res.json())
        .then((data) => {
          setHealth(data);
        })
        .catch(() => {
          // Silently fail on refresh
        });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Head>
        <title>Health Check - URL Shortener</title>
      </Head>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">System Health</h1>

        {loading && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Checking system health...</p>
          </div>
        )}

        {health && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded-full ${
                    health.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                ></div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Status: <span className="capitalize">{health.status}</span>
                </h2>
              </div>
            </div>

            <div className="p-6">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Version</dt>
                  <dd className="mt-1 text-lg text-gray-900">{health.version}</dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">Database</dt>
                  <dd className="mt-1 text-lg text-gray-900 capitalize">{health.database}</dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">Uptime</dt>
                  <dd className="mt-1 text-lg text-gray-900">{health.uptime}</dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">Timestamp</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(health.timestamp).toLocaleString()}
                  </dd>
                </div>
              </dl>

              {health.error && (
                <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-sm text-red-800">{health.error}</p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Health status is automatically refreshed every 5 seconds.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}


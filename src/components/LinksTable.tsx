import { useState } from 'react';
import Link from 'next/link';
import { Link as LinkType } from '@/types';

interface LinksTableProps {
  links: LinkType[];
  onDelete: () => void;
}

export default function LinksTable({ links, onDelete }: LinksTableProps) {
  const [deletingCode, setDeletingCode] = useState<string | null>(null);

  const handleDelete = async (code: string) => {
    if (!confirm('Are you sure you want to delete this link?')) {
      return;
    }

    setDeletingCode(code);
    try {
      const res = await fetch(`/api/links/${code}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete link');
      }

      onDelete();
    } catch (err) {
      alert('Failed to delete link. Please try again.');
    } finally {
      setDeletingCode(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const truncateUrl = (url: string, maxLength: number = 50) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  if (links.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-gray-500">No links found. Create your first short link above!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Short Code
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Target URL
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Clicks
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Clicked
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {links.map((link) => {
            const shortUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${link.code}`;
            return (
              <tr key={link.code} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/code/${link.code}`}
                      className="text-blue-600 hover:text-blue-700 font-mono text-sm"
                    >
                      {link.code}
                    </Link>
                    <button
                      onClick={() => copyToClipboard(shortUrl)}
                      className="text-gray-400 hover:text-gray-600"
                      title="Copy short URL"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 max-w-md">
                    <span className="text-sm text-gray-900 truncate" title={link.target_url}>
                      {truncateUrl(link.target_url)}
                    </span>
                    <button
                      onClick={() => copyToClipboard(link.target_url)}
                      className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                      title="Copy target URL"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {link.clicks}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(link.last_clicked_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/code/${link.code}`}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      View Stats
                    </Link>
                    <button
                      onClick={() => handleDelete(link.code)}
                      disabled={deletingCode === link.code}
                      className="text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingCode === link.code ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}


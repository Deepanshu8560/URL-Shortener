import type { NextApiRequest, NextApiResponse } from 'next';
import pool, { initDatabase } from '@/lib/db';

const startTime = Date.now();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    // Ensure database is initialized and test connection
    await initDatabase();
    await pool.query('SELECT 1');
    
    const uptime = Math.floor((Date.now() - startTime) / 1000);
    const uptimeFormatted = formatUptime(uptime);

    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: uptimeFormatted,
      uptimeSeconds: uptime,
      database: 'connected',
      version: '1.0.0',
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: 'Database connection failed',
    });
  }
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(' ');
}


import type { NextApiRequest, NextApiResponse } from 'next';
import pool, { initDatabase } from '@/lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Ensure database is initialized
  await initDatabase();
  
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const { code } = req.query;

  if (typeof code !== 'string') {
    return res.status(400).json({ error: 'Invalid code' });
  }

  try {
    const result = await pool.query(
      `SELECT code, target_url, clicks, created_at, last_clicked_at
       FROM links
       WHERE code = $1 AND deleted_at IS NULL`,
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Link not found' });
    }

    const link = result.rows[0];
    res.status(200).json(link);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
}


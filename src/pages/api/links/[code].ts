import type { NextApiRequest, NextApiResponse } from 'next';
import pool, { initDatabase } from '@/lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Ensure database is initialized
  await initDatabase();
  
  const { code } = req.query;

  if (typeof code !== 'string') {
    return res.status(400).json({ error: 'Invalid code' });
  }

  if (req.method === 'GET') {
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

      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching link:', error);
      res.status(500).json({ error: 'Failed to fetch link' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const result = await pool.query(
        `UPDATE links 
         SET deleted_at = CURRENT_TIMESTAMP
         WHERE code = $1 AND deleted_at IS NULL
         RETURNING code`,
        [code]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Link not found' });
      }

      res.status(200).json({ message: 'Link deleted successfully' });
    } catch (error) {
      console.error('Error deleting link:', error);
      res.status(500).json({ error: 'Failed to delete link' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'DELETE']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}


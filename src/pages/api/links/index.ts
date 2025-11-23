import type { NextApiRequest, NextApiResponse } from 'next';
import pool, { initDatabase } from '@/lib/db';
import { generateShortCode, isValidUrl } from '@/lib/utils';
import { createLinkSchema } from '@/lib/validations';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Ensure database is initialized
  await initDatabase();
  if (req.method === 'GET') {
    try {
      const { search } = req.query;
      let query = `
        SELECT code, target_url, clicks, created_at, last_clicked_at
        FROM links
        WHERE deleted_at IS NULL
        ORDER BY created_at DESC
      `;
      const params: any[] = [];

      if (search && typeof search === 'string') {
        query = `
          SELECT code, target_url, clicks, created_at, last_clicked_at
          FROM links
          WHERE deleted_at IS NULL
          AND (code ILIKE $1 OR target_url ILIKE $1)
          ORDER BY created_at DESC
        `;
        params.push(`%${search}%`);
      }

      const result = await pool.query(query, params);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching links:', error);
      res.status(500).json({ error: 'Failed to fetch links' });
    }
  } else if (req.method === 'POST') {
    try {
      const body = createLinkSchema.parse(req.body);
      const { url, code: customCode } = body;

      // Validate URL
      if (!isValidUrl(url)) {
        return res.status(400).json({ error: 'Invalid URL format' });
      }

      // Generate or use custom code
      let code = customCode || generateShortCode();
      
      // Ensure code is unique
      if (customCode) {
        const existing = await pool.query(
          'SELECT id FROM links WHERE code = $1 AND deleted_at IS NULL',
          [code]
        );
        if (existing.rows.length > 0) {
          return res.status(409).json({ error: 'This code is already taken' });
        }
      } else {
        // If generated code exists, generate a new one (max 10 attempts)
        let attempts = 0;
        while (attempts < 10) {
          const existing = await pool.query(
            'SELECT id FROM links WHERE code = $1 AND deleted_at IS NULL',
            [code]
          );
          if (existing.rows.length === 0) break;
          code = generateShortCode();
          attempts++;
        }
        if (attempts >= 10) {
          return res.status(500).json({ error: 'Failed to generate unique code' });
        }
      }

      // Insert new link
      const result = await pool.query(
        `INSERT INTO links (code, target_url) 
         VALUES ($1, $2) 
         RETURNING code, target_url, clicks, created_at, last_clicked_at`,
        [code, url]
      );

      res.status(201).json(result.rows[0]);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors[0].message });
      }
      if (error.code === '23505') { // Unique constraint violation
        return res.status(409).json({ error: 'This code is already taken' });
      }
      console.error('Error creating link:', error);
      res.status(500).json({ error: 'Failed to create link' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}


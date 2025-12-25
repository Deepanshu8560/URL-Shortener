import { Pool } from 'pg';

const isLocalhost = process.env.DATABASE_URL?.includes('localhost') || 
                    process.env.DATABASE_URL?.includes('127.0.0.1') ||
                    !process.env.DATABASE_URL?.includes('neon.tech');

const poolConfig: any = {
  connectionString: process.env.DATABASE_URL,
};


if (!isLocalhost && !process.env.DATABASE_URL?.includes('sslmode')) {
  poolConfig.ssl = { rejectUnauthorized: false };
} else if (isLocalhost) {
  poolConfig.ssl = false;
}

const pool = new Pool(poolConfig);

let dbInitialized = false;

export async function initDatabase() {
  if (dbInitialized) return;
  
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS links (
        id SERIAL PRIMARY KEY,
        code VARCHAR(255) UNIQUE NOT NULL,
        target_url TEXT NOT NULL,
        clicks INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_clicked_at TIMESTAMP,
        deleted_at TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_links_code ON links(code) WHERE deleted_at IS NULL;
      CREATE INDEX IF NOT EXISTS idx_links_deleted ON links(deleted_at);
    `);
    dbInitialized = true;
  } finally {
    client.release();
  }
}

if (typeof window === 'undefined') {
  initDatabase().catch(console.error);
}

export default pool;


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
CREATE INDEX IF NOT EXISTS idx_links_created_at ON links(created_at DESC);


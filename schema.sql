-- URL Shortener Database Schema for Neon PostgreSQL
-- Run this in Neon's SQL Editor to create the tables

-- Create the links table
CREATE TABLE IF NOT EXISTS links (
  id SERIAL PRIMARY KEY,
  code VARCHAR(255) UNIQUE NOT NULL,
  target_url TEXT NOT NULL,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_clicked_at TIMESTAMP,
  deleted_at TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_links_code ON links(code) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_links_deleted ON links(deleted_at);
CREATE INDEX IF NOT EXISTS idx_links_created_at ON links(created_at DESC);

-- Optional: Create a function to automatically update last_clicked_at
-- (This is handled in application code, but can be useful for direct DB operations)


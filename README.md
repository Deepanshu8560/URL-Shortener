# URL Shortener

A modern URL shortener web application built with Next.js, TypeScript, and PostgreSQL (Neon). Similar to bit.ly, this app allows users to create short links, track click statistics, and manage their links.

## Features

- ✅ Create short links with optional custom codes
- ✅ URL validation before saving
- ✅ Globally unique custom codes
- ✅ HTTP 302 redirects to original URLs
- ✅ Click tracking and statistics
- ✅ Delete links (returns 404 after deletion)
- ✅ Dashboard with search/filter functionality
- ✅ Individual link statistics page
- ✅ System health check page
- ✅ Clean, responsive UI with Tailwind CSS
- ✅ Loading, error, and success states
- ✅ Copy-to-clipboard functionality

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Neon)
- **Styling**: Tailwind CSS
- **Validation**: Zod

## Prerequisites

- Node.js 18+ installed
- A Neon PostgreSQL database (free tier available at [neon.tech](https://neon.tech))

## Setup Instructions

1. **Clone or navigate to the project directory**
   ```bash
   cd URL-shortener
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up your Neon database**
   - Sign up at [neon.tech](https://neon.tech) (free)
   - Create a new project
   - Copy your connection string (it will look like: `postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require`)

4. **Initialize the database schema**
   
   **Option 1: Automatic (Recommended)**
   - The schema will be automatically created when you first run the app
   - Just start the dev server and make your first API call
   
   **Option 2: Manual (Using Neon SQL Editor)**
   - Open your Neon project dashboard
   - Go to the SQL Editor
   - Copy and paste the contents of `schema.sql` file
   - Run the SQL script

5. **Configure environment variables**
   - Copy `.env.example` to `.env`
   ```bash
   cp .env.example .env
   ```
   - Add your Neon database connection string:
   ```
   DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
URL-shortener/
├── src/
│   ├── components/          # React components
│   │   ├── Layout.tsx      # Main layout with header/footer
│   │   ├── LinkForm.tsx    # Form for creating links
│   │   └── LinksTable.tsx  # Table displaying all links
│   ├── lib/                # Utility functions
│   │   ├── db.ts          # Database connection and schema
│   │   ├── utils.ts       # Helper functions
│   │   └── validations.ts # Zod schemas
│   ├── pages/              # Next.js pages
│   │   ├── api/           # API routes
│   │   │   ├── links/     # Link CRUD operations
│   │   │   ├── redirect/  # Redirect handler
│   │   │   ├── stats/     # Statistics endpoint
│   │   │   └── health.ts  # Health check endpoint
│   │   ├── [code].tsx     # Redirect page (302)
│   │   ├── code/[code].tsx # Stats page
│   │   ├── health.tsx     # Health check page
│   │   └── index.tsx      # Dashboard
│   ├── scripts/            # Utility scripts
│   │   └── test-db.ts     # Database connection test script
│   └── styles/             # Global styles
│       └── globals.css    # Tailwind CSS imports
├── schema.sql          # Database schema (for manual setup)
└── public/             # Static assets
```

## API Endpoints

- `GET /api/links` - List all links (supports `?search=query`)
- `POST /api/links` - Create a new link
- `GET /api/links/[code]` - Get a specific link
- `DELETE /api/links/[code]` - Delete a link
- `GET /api/stats/[code]` - Get link statistics
- `GET /api/health` - System health check
- `GET /[code]` - Redirect to original URL (302)

## Usage

1. **Create a Short Link**
   - Enter a long URL in the dashboard
   - Optionally provide a custom code
   - Click "Create Short Link"

2. **View Statistics**
   - Click "View Stats" on any link in the dashboard
   - Or visit `/code/[code]` directly

3. **Delete a Link**
   - Click "Delete" on any link in the dashboard
   - The link will return 404 after deletion

4. **Search Links**
   - Use the search box to filter by code or URL

## Database Schema

```sql
CREATE TABLE links (
  id SERIAL PRIMARY KEY,
  code VARCHAR(255) UNIQUE NOT NULL,
  target_url TEXT NOT NULL,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_clicked_at TIMESTAMP,
  deleted_at TIMESTAMP
);
```

## Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Set environment variables in your hosting platform

3. Deploy to Vercel, Railway, or your preferred platform

## License

MIT


# Code Explanation - URL Shortener

This document provides a detailed explanation of every file in the URL Shortener project, including their purpose, structure, and key functions.

---

## Table of Contents

1. [Configuration Files](#configuration-files)
2. [Library Files (lib/)](#library-files-lib)
3. [Components (components/)](#components-components)
4. [Pages (pages/)](#pages-pages)
5. [API Routes (pages/api/)](#api-routes-pagesapi)
6. [Styles](#styles)
7. [Scripts](#scripts)
8. [Database Schema](#database-schema)

---

## Configuration Files

### `package.json`
**Purpose**: Defines project dependencies, scripts, and metadata.

**Key Sections**:
- **Scripts**: 
  - `dev`: Starts Next.js development server
  - `build`: Creates production build
  - `start`: Runs production server
  - `test-db`: Tests database connection and initializes schema
- **Dependencies**: Core packages (Next.js, React, PostgreSQL driver, Zod)
- **DevDependencies**: Development tools (TypeScript, Tailwind, type definitions)

### `tsconfig.json`
**Purpose**: TypeScript configuration for the project.

**Key Settings**:
- Enables strict type checking
- Configures path aliases (`@/*` maps to root)
- Sets up Next.js TypeScript plugin
- Targets ES5 for browser compatibility

### `next.config.js`
**Purpose**: Next.js framework configuration.

**Key Settings**:
- Enables React strict mode for better development experience
- Configures build and runtime settings

### `tailwind.config.js`
**Purpose**: Tailwind CSS configuration.

**Key Settings**:
- Defines content paths for Tailwind to scan
- Configures which files Tailwind should process (`.tsx`, `.jsx`, etc.)

### `postcss.config.js`
**Purpose**: PostCSS configuration for processing CSS.

**Key Settings**:
- Integrates Tailwind CSS and Autoprefixer plugins
- Processes CSS files during build

### `.gitignore`
**Purpose**: Specifies files and directories to exclude from version control.

**Excluded**:
- `node_modules/`
- `.next/` (Next.js build output)
- `.env` (environment variables with secrets)
- Build artifacts and logs

---

## Library Files (lib/)

### `lib/db.ts`
**Purpose**: Database connection and schema initialization.

**Key Components**:

1. **Connection Pool Setup**:
   - Creates PostgreSQL connection pool using `pg` library
   - Automatically detects if connection is to Neon (cloud) or localhost
   - Configures SSL settings based on connection type
   - Uses `DATABASE_URL` environment variable

2. **`initDatabase()` Function**:
   - Creates the `links` table if it doesn't exist
   - Sets up indexes for performance:
     - `idx_links_code`: Index on code column (only for non-deleted links)
     - `idx_links_deleted`: Index on deleted_at for soft delete queries
   - Uses a flag to prevent multiple initializations
   - Automatically runs on server-side imports

3. **Exports**:
   - `pool`: The database connection pool (default export)
   - `initDatabase`: Function to manually initialize schema

**Database Schema**:
```sql
CREATE TABLE links (
  id SERIAL PRIMARY KEY,
  code VARCHAR(255) UNIQUE NOT NULL,
  target_url TEXT NOT NULL,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_clicked_at TIMESTAMP,
  deleted_at TIMESTAMP  -- Soft delete flag
);
```

### `lib/utils.ts`
**Purpose**: Utility functions used throughout the application.

**Functions**:

1. **`generateShortCode()`**:
   - Generates a random 6-character alphanumeric code
   - Uses characters: a-z, A-Z, 0-9
   - Used when user doesn't provide a custom code

2. **`isValidUrl(url: string)`**:
   - Validates if a string is a valid HTTP/HTTPS URL
   - Uses JavaScript's `URL` constructor
   - Returns `true` only for `http://` or `https://` protocols

3. **`isValidCode(code: string)`**:
   - Validates custom short codes
   - Allows alphanumeric characters and hyphens
   - Length must be between 3-50 characters
   - Uses regex: `/^[a-zA-Z0-9-]{3,50}$/`

### `lib/validations.ts`
**Purpose**: Zod schema definitions for input validation.

**Schemas**:

1. **`createLinkSchema`**:
   - Validates link creation requests
   - `url`: Must be a valid URL string
   - `code`: Optional, must match regex pattern (3-50 alphanumeric/hyphens)
   - Provides user-friendly error messages

2. **`CreateLinkInput` Type**:
   - TypeScript type inferred from Zod schema
   - Ensures type safety across the application

---

## Components (components/)

### `components/Layout.tsx`
**Purpose**: Main layout wrapper for all pages.

**Features**:
- Provides consistent header and footer across all pages
- Navigation menu with active state highlighting
- Responsive design using Tailwind CSS
- Uses Next.js `Link` component for client-side navigation

**Structure**:
- **Header**: Logo and navigation links (Dashboard, Health)
- **Main**: Wraps page content (flexible height)
- **Footer**: Copyright and attribution

**Key Functions**:
- `isActive(path)`: Determines if a navigation link is currently active
- Uses `useRouter` hook to get current route

### `components/LinkForm.tsx`
**Purpose**: Form component for creating new short links.

**State Management**:
- `url`: The long URL to shorten
- `code`: Optional custom short code
- `loading`: Loading state during API call
- `error`: Error message display
- `success`: Success message display
- `showCustomCode`: Toggle for showing/hiding custom code input

**Key Functions**:

1. **`handleSubmit(e)`**:
   - Prevents default form submission
   - Validates URL format
   - Validates custom code if provided
   - Makes POST request to `/api/links`
   - Handles success/error states
   - Clears form on success
   - Calls `onSuccess` callback to refresh link list

**Validation**:
- Checks if URL is not empty
- Validates URL format using `isValidUrl()`
- Validates custom code format using `isValidCode()`
- Shows inline error messages

**UI Features**:
- Toggle button to show/hide custom code field
- Loading state disables form during submission
- Success message auto-dismisses after 3 seconds
- Error messages displayed in red alert box

### `components/LinksTable.tsx`
**Purpose**: Displays all links in a table format.

**Props**:
- `links`: Array of link objects to display
- `onDelete`: Callback function when a link is deleted

**State Management**:
- `deletingCode`: Tracks which link is currently being deleted

**Key Functions**:

1. **`handleDelete(code)`**:
   - Shows confirmation dialog
   - Makes DELETE request to `/api/links/[code]`
   - Calls `onDelete` callback to refresh list
   - Handles errors with alert

2. **`copyToClipboard(text)`**:
   - Uses browser Clipboard API to copy text
   - Copies short URL or target URL

3. **`formatDate(dateString)`**:
   - Formats timestamp to localized string
   - Returns "Never" if date is null

4. **`truncateUrl(url, maxLength)`**:
   - Truncates long URLs with ellipsis
   - Default max length: 50 characters
   - Shows full URL in tooltip

**Table Columns**:
1. **Short Code**: Clickable link to stats page + copy button
2. **Target URL**: Truncated URL + copy button
3. **Clicks**: Total click count
4. **Last Clicked**: Formatted timestamp
5. **Actions**: View Stats link + Delete button

**Empty State**:
- Shows friendly message when no links exist

---

## Pages (pages/)

### `pages/_app.tsx`
**Purpose**: Next.js app wrapper component.

**Functionality**:
- Wraps all pages with the `Layout` component
- Imports global CSS styles
- Provides consistent layout across entire application
- Receives `Component` and `pageProps` from Next.js

**Key Points**:
- This is the root component that wraps every page
- Perfect place for global providers, themes, etc.

### `pages/index.tsx` (Dashboard)
**Purpose**: Main dashboard page showing all links and creation form.

**State Management**:
- `links`: Array of all links
- `loading`: Loading state for data fetch
- `error`: Error message state
- `search`: Search query string
- `debounceTimer`: Reference for debouncing search

**Key Functions**:

1. **`fetchLinks(searchTerm)`**:
   - Fetches links from `/api/links`
   - Supports optional search parameter
   - Handles loading and error states
   - Updates `links` state

2. **`useEffect` for Search**:
   - Debounces search input (300ms delay)
   - Prevents excessive API calls while typing
   - Clears timer on unmount

3. **`handleLinkCreated()`**:
   - Refreshes link list after new link creation
   - Called by `LinkForm` component

4. **`handleLinkDeleted()`**:
   - Refreshes link list after deletion
   - Called by `LinksTable` component

**UI Structure**:
- Page header with title and description
- `LinkForm` component for creating links
- Search input with debouncing
- `LinksTable` component displaying all links
- Loading spinner during data fetch
- Error message with retry button

### `pages/[code].tsx` (Redirect Page)
**Purpose**: Handles URL redirection using server-side rendering.

**How It Works**:
- Uses Next.js `getServerSideProps` for server-side logic
- This runs on the server before page render
- Performs database lookup and redirect

**`getServerSideProps` Function**:

1. **Extracts Code**:
   - Gets `code` from URL parameters
   - Validates it's a string

2. **Database Lookup**:
   - Initializes database if needed
   - Queries for link with matching code
   - Only finds non-deleted links (`deleted_at IS NULL`)

3. **Click Tracking**:
   - Increments `clicks` counter
   - Updates `last_clicked_at` timestamp
   - Error handling doesn't fail redirect

4. **Redirect**:
   - Returns Next.js redirect object
   - `permanent: false` = HTTP 302 (temporary redirect)
   - Returns 404 if link not found

**Client Component**:
- Shows loading spinner while redirect happens
- Never actually renders (redirects immediately)

### `pages/code/[code].tsx` (Stats Page)
**Purpose**: Displays detailed statistics for a single link.

**State Management**:
- `stats`: Link statistics data
- `loading`: Loading state
- `error`: Error message

**Key Functions**:

1. **`useEffect` Hook**:
   - Fetches stats from `/api/stats/[code]` when component mounts
   - Handles 404 errors (link not found)
   - Updates loading/error states

2. **`formatDate(dateString)`**:
   - Formats timestamps to readable format
   - Returns "Never" for null dates

3. **`copyToClipboard(text)`**:
   - Copies text to clipboard
   - Shows alert confirmation

**UI Sections**:
1. **Header**: Back button to dashboard
2. **Short Code**: Display with copy button
3. **Target URL**: Clickable link with copy button
4. **Statistics Cards**:
   - Total Clicks (large number)
   - Created At (timestamp)
   - Last Clicked (timestamp)
5. **Test Redirect Button**: Opens short URL in new tab

**Error Handling**:
- Shows error message if link not found
- Provides link back to dashboard

### `pages/health.tsx` (Health Check Page)
**Purpose**: Displays system health and status information.

**State Management**:
- `health`: Health data from API
- `loading`: Initial loading state

**Key Features**:

1. **Auto-Refresh**:
   - Fetches health data every 5 seconds
   - Uses `setInterval` in `useEffect`
   - Cleans up interval on unmount

2. **Health Data Display**:
   - Status indicator (green/red dot)
   - Version number
   - Database connection status
   - Uptime (formatted as days, hours, minutes, seconds)
   - Current timestamp

3. **Error Handling**:
   - Shows error message if health check fails
   - Displays "unhealthy" status

**UI**:
- Status badge with color coding
- Grid layout for health metrics
- Auto-refresh indicator

---

## API Routes (pages/api/)

### `pages/api/links/index.ts`
**Purpose**: Handles listing and creating links.

**GET `/api/links`**:
- **Query Parameters**: `?search=query` (optional)
- **Functionality**:
  - Fetches all non-deleted links
  - Supports case-insensitive search by code or URL
  - Orders by creation date (newest first)
  - Returns array of link objects

**POST `/api/links`**:
- **Request Body**: `{ url: string, code?: string }`
- **Functionality**:
  1. Validates input using Zod schema
  2. Validates URL format
  3. Generates or uses custom code
  4. Ensures code uniqueness:
     - For custom codes: Checks if exists, returns 409 if taken
     - For generated codes: Retries up to 10 times if collision
  5. Inserts new link into database
  6. Returns created link object

**Error Handling**:
- 400: Invalid input (Zod validation errors)
- 409: Code already exists
- 500: Server/database errors

### `pages/api/links/[code].ts`
**Purpose**: Handles getting and deleting individual links.

**GET `/api/links/[code]`**:
- **Functionality**:
  - Fetches single link by code
  - Only returns non-deleted links
  - Returns 404 if not found
  - Returns link object with all fields

**DELETE `/api/links/[code]`**:
- **Functionality**:
  - Performs soft delete (sets `deleted_at` timestamp)
  - Doesn't actually delete from database
  - Returns 404 if link not found or already deleted
  - Returns success message

**Error Handling**:
- 400: Invalid code parameter
- 404: Link not found
- 405: Method not allowed
- 500: Server errors

### `pages/api/stats/[code].ts`
**Purpose**: Returns statistics for a specific link.

**GET `/api/stats/[code]`**:
- **Functionality**:
  - Fetches link by code
  - Only returns non-deleted links
  - Returns same data as GET `/api/links/[code]`
  - Used by stats page for consistency

**Error Handling**:
- 400: Invalid code
- 404: Link not found
- 405: Method not allowed

### `pages/api/health.ts`
**Purpose**: System health check endpoint.

**GET `/api/health`**:
- **Functionality**:
  1. Tests database connection with `SELECT 1`
  2. Calculates uptime since server start
  3. Formats uptime as human-readable string
  4. Returns health status object

**Response Format**:
```json
{
  "status": "healthy" | "unhealthy",
  "timestamp": "ISO string",
  "uptime": "1d 2h 3m 4s",
  "uptimeSeconds": 93784,
  "database": "connected" | "disconnected",
  "version": "1.0.0"
}
```

**Helper Function**:
- `formatUptime(seconds)`: Converts seconds to "Xd Xh Xm Xs" format

**Error Handling**:
- 503: Returns unhealthy status if database connection fails
- 405: Method not allowed

### `pages/api/init-db.ts`
**Purpose**: Manual database initialization endpoint.

**POST `/api/init-db`**:
- **Functionality**:
  - Manually triggers database schema initialization
  - Useful for testing or manual setup
  - Returns success/error message

**Note**: Schema auto-initializes on first API call, so this is optional.

---

## Styles

### `styles/globals.css`
**Purpose**: Global CSS styles for the application.

**Contents**:
- Tailwind CSS directives (`@tailwind base/components/utilities`)
- Global body styling
- Base typography and color settings

**Usage**:
- Imported in `_app.tsx` to apply globally
- Tailwind processes this file during build

---

## Scripts

### `scripts/test-db.ts`
**Purpose**: Standalone script to test database connection and initialize schema.

**Functionality**:

1. **Connection Test**:
   - Tests database connection with `SELECT NOW()`
   - Displays PostgreSQL version
   - Shows current database time

2. **Schema Initialization**:
   - Calls `initDatabase()` function
   - Creates tables and indexes

3. **Verification**:
   - Checks if `links` table exists
   - Displays table structure (columns and types)
   - Confirms database is ready

4. **Error Handling**:
   - Provides helpful error messages
   - Suggests troubleshooting steps

**Usage**:
```bash
npm run test-db
```

**Output**:
- Success messages with checkmarks
- Database connection details
- Table structure information
- Error messages with troubleshooting tips

---

## Database Schema

### `schema.sql`
**Purpose**: Standalone SQL file for manual database setup.

**Contents**:
- Complete `CREATE TABLE` statement for `links` table
- Index creation statements
- Can be run directly in Neon SQL Editor

**Usage**:
- Alternative to automatic initialization
- Useful for production deployments
- Can be version controlled and reviewed

---

## Data Flow Examples

### Creating a Link:
1. User fills form in `LinkForm.tsx`
2. Form validates input client-side
3. POST request to `/api/links`
4. API validates with Zod schema
5. Database checks code uniqueness
6. Inserts into `links` table
7. Returns created link
8. Dashboard refreshes list

### Redirecting:
1. User visits `/{code}`
2. Next.js calls `getServerSideProps`
3. Database queries for link
4. Increments click counter
5. Returns 302 redirect to target URL
6. Browser follows redirect

### Deleting a Link:
1. User clicks delete in `LinksTable.tsx`
2. Confirmation dialog appears
3. DELETE request to `/api/links/[code]`
4. Database sets `deleted_at` timestamp
5. Link no longer appears in queries
6. Dashboard refreshes list

---

## Key Design Patterns

1. **Soft Deletes**: Links are marked as deleted, not removed from database
2. **Server-Side Rendering**: Redirect page uses SSR for better performance
3. **Debouncing**: Search input debounced to reduce API calls
4. **Connection Pooling**: Database uses connection pool for efficiency
5. **Auto-Initialization**: Database schema creates automatically
6. **Type Safety**: TypeScript + Zod for end-to-end type checking
7. **Error Boundaries**: Comprehensive error handling at all levels

---

## Security Considerations

1. **Input Validation**: All inputs validated with Zod schemas
2. **SQL Injection Prevention**: Uses parameterized queries (`$1`, `$2`)
3. **URL Validation**: Only allows HTTP/HTTPS protocols
4. **Code Uniqueness**: Enforced at database level (UNIQUE constraint)
5. **Environment Variables**: Sensitive data in `.env` (not committed)

---

This completes the code explanation for all files in the URL Shortener project. Each file has been documented with its purpose, key functions, and how it fits into the overall application architecture.


# ⚙️ api/ — Backend Serverless Functions

## Overview
All API endpoints are now consolidated into a **single serverless function** (`index.js`) to comply with Vercel's free tier limit of 12 functions.

## Usage
To call any API endpoint, send requests to `/api` with a `route` parameter specifying the desired endpoint.

### Example:
```javascript
// GET request
fetch('/api?route=products')

// POST request
fetch('/api', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ route: 'products', ...data })
})
```

## Available Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `products` | GET, POST, PUT, DELETE | Manage products catalog |
| `bulk-products` | PATCH | Bulk update products |
| `collections` | GET, POST, PUT, DELETE | Manage product collections |
| `contact-requests` | GET, POST, PUT, DELETE | Handle contact form submissions |
| `inquiry` | GET, POST, PUT, DELETE | Manage price inquiries |
| `portfolio` | GET, POST, PUT, DELETE | Manage portfolio projects |
| `standards` | GET, POST, PUT, DELETE | Manage standards documentation |
| `homepage-content` | GET, PUT | Manage homepage content |
| `export-products` | GET | Export products as CSV |
| `import-preview` | POST | Preview CSV import |
| `import-commit` | POST | Commit CSV import |
| `import-rollback` | POST | Rollback import |
| `bulk-upload-preview` | POST | Preview bulk image upload |
| `bulk-upload-commit` | POST | Commit bulk image upload |
| `sitemap` | GET | Generate XML sitemap |

## 📁 Key Files
- `index.js`: Unified API handler for all routes (840 lines)
- `db-client.js`: Shared Supabase Postgres client with auto-reconnecting resilience
- `db-wake.js`: Database wake-up trigger for cold starts
- `security-middleware.js`: OWASP HTTP headers & IP rate-limiter helper

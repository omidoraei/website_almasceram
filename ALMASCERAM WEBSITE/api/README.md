# ⚙️ api/ — Backend Serverless Functions

This directory contains Node.js Serverless API Functions executed on Vercel Edge Network.

## 📁 Key Files
- `db-client.js`: Shared Supabase Postgres client with auto-reconnecting resilience.
- `products.js`: Product CRUD & filtering API (`GET`, `POST`, `PUT`, `DELETE`).
- `bulk-products.js`: Batch inline sheet editing API (`PATCH`).
- `export-products.js`: Downloads products as CSV with UTF-8 BOM encoding for Microsoft Excel.
- `import-preview.js`: Dry-run Excel parser & validation report (`POST`).
- `import-commit.js`: Commits approved import rows and saves snapshot (`POST`).
- `import-rollback.js`: Reverts import operation by restoring previous snapshot (`POST`).
- `bulk-upload-preview.js`: Auto-matches multi-file image uploads to product codes (`POST`).
- `bulk-upload-commit.js`: Updates product image URLs in database (`POST`).
- `inquiry.js`: Price quote requests API (`GET`, `POST`, `PUT`, `DELETE`).
- `contact-requests.js`: Contact Us form API with honeypot & rate limiter (`GET`, `POST`, `PUT`, `DELETE`).
- `homepage-content.js`: Dynamic homepage CMS settings API (`GET`, `PUT`).
- `standards.js`: ISO/INSO certificates API (`GET`, `POST`, `PUT`, `DELETE`).
- `portfolio.js`: Completed projects gallery API (`GET`, `POST`, `PUT`, `DELETE`).
- `sitemap.js`: Dynamic XML Sitemap generator for Google SEO (`GET`).
- `security-middleware.js`: OWASP HTTP headers & IP rate-limiter helper.

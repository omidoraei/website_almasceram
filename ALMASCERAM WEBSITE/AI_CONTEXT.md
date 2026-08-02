# 🤖 AI_CONTEXT.md — Comprehensive Context Reference for LLMs

## 📌 Architecture Summary
ALMAS CERAM is a production-grade web application with a **Serverless Node.js API** backend hosted on Vercel Edge Network, connecting to a **Supabase Postgres (PostgreSQL)** database.

### Data Flow Diagram
```
Client Browser (React 19)
    │
    ├──> LanguageContext (i18n fa/en/ar state)
    ├──> Custom Hooks (useProducts, useInquiryBasket, useTileCompare)
    │
    ▼ AJAX Fetch
API Routes (api/*.js on Vercel Serverless)
    │
    ├──> Security Middleware (Rate Limiter, OWASP Headers, Honeypot)
    ├──> Supabase DB Client (api/db-client.js - Self-healing)
    │
    ▼ PostgreSQL Query
Supabase Postgres Database
    ├──> products
    ├──> inquiries
    ├──> contact_requests
    ├──> homepage_content
    ├──> collections
    └──> import_history
```

---

## 🗄️ Database Schemas
- **`products`**: `id`, `code` (unique SKU), `title_fa`, `title_en`, `title_ar`, `size` (`30x30` to `100x100`), `surface_finish`, `body_type`, `faces_count`, `thickness_mm`, `water_absorption`, `rectified`, `image_url`, `face_images`, `ambiance_images`, `description`, `featured`.
- **`inquiries`**: `id`, `customer_name`, `phone`, `company`, `email`, `items` (jsonb), `notes`, `status`, `created_at`.
- **`contact_requests`**: `id`, `name`, `phone`, `email`, `subject`, `message`, `status`, `created_at`.
- **`homepage_content`**: `id`, `hero_title`, `hero_subtitle`, `hero_description`, `hero_image_url`, `about_title`, `about_description`, `cta_title`, `cta_description`, `cta_button_text`, `featured_product_ids`.
- **`import_history`**: `id`, `filename`, `admin_user`, `new_count`, `updated_count`, `previous_state_json`, `status`, `created_at`.

---

## 🎯 Key Design & Functional Rules
1. **Tile Sizes Constraint:** Exactly 7 mandatory sizes (`30x30`, `40x40`, `60x60`, `60x120`, `80x80`, `100x100`, `30x90`).
2. **Excel Import Dry-Run:** `POST /api/import-preview` must NEVER mutate DB. Dry run previews diffs first, then `POST /api/import-commit` executes the upserts.
3. **Empty Cell Retention:** Empty cells in Excel import mean "KEEP EXISTING VALUE", not clear value.

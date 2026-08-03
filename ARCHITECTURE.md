# 🏛️ ARCHITECTURE.md — System Architecture & Data Flow

## 📌 Architectural Overview
ALMAS CERAM is built on a **Decoupled Serverless Full-Stack Architecture**:

- **Presentation Layer (Frontend):** React 19 + TypeScript 5.9 + Vite 7 + Tailwind CSS v4.
- **API Layer (Backend):** Vercel Serverless Functions (`api/*.js`) in Node.js.
- **Persistence Layer (Database):** Supabase Postgres (PostgreSQL) managed via Supabase Client (`api/db-client.js`).
- **Edge Security & CDN:** Vercel Global Edge Network + Cloudflare WAF.
- **Current Version:** `4.0.0` (Luxury Minimal Redesign)

---

## 🔄 Data Flow
```
User Action (e.g. Filter by size 60x120 or Submit Quote)
       │
       ▼
React Hook (`useProducts` / `useInquiryBasket`)
       │
       ▼ Fetch Request
Vercel Serverless Function (`api/products.js` or `api/inquiry.js`)
       │
       ├──> OWASP Security Headers & Rate Limiting Check
       │
       ▼ Supabase Query Builder
Supabase Postgres Database (`products` / `inquiries`)
       │
       ▼ JSON Response
React View Update (Zero full-page reloads)
```

---

## 🎨 Design System Architecture
- **Theme:** Dark Slate (`#090D16`), Surface Card (`#0F172A`), Border (`#1E293B`), Accent Gold (`#F59E0B`).
- **Typography:** `Peyda` / `Yekan Bakh` for Headings, `Vazirmatn` for Persian Body, `Plus Jakarta Sans` for English.
- **Grid:** Responsive Bento Grid for 7 production sizes.

---

## 🧩 Component Architecture

### Luxury UI Components (v4.0)
Located in `src/components/ui/`:
- `AnimatedSection` - Scroll-triggered reveal animations using Intersection Observer
- `FadeIn` - Directional fade-in effects
- `LuxuryButton` - Premium buttons with 4 variants (primary, secondary, glass, outline)
- `LuxuryCard` - Glass morphism cards with multiple hover effects
- `LuxuryDivider` - Animated gradient gold dividers
- `StatBadge` - Luxury stat display badges

### Section Components
Located in `src/components/sections/`:
- `SkillsShowcase` - Technical skills showcase inspired by 21st.dev

### Admin Components
Located in `src/components/admin/`:
- `AdminAuthModal` - 2FA secure login
- `AdminDashboard` - KPI overview and management
- `BulkEditorSheet` - Inline Excel-like editor
- `BulkImportModal` - 3-step import with dry-run preview
- `BulkImageUploadModal` - Batch image upload and matching
- `ProductFormModal` - Multi-lingual product CRUD
- `HomepageContentEditor` - CMS for homepage content

---

## 🔒 Security Architecture

### OWASP Top 10 Protection
1. **Rate Limiting:** 15 requests per 15 seconds per IP
2. **XSS Sanitization:** Input cleaning on all text fields
3. **Security Headers:** `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`
4. **Honeypot Field:** Spam bot detection in contact forms
5. **2FA Authentication:** Admin panel protection with brute-force lockout

### Authentication Flow
```
Admin Login Request
       │
       ▼
Validate Credentials (email/password)
       │
       ▼
Generate 2FA Code (demo: 123456)
       │
       ▼
Verify 2FA Code
       │
       ▼
Create Session Token
       │
       ▼
Grant Admin Access
```

---

## 📊 Database Schema Relationships

```
products (1) ──────< inquiries (N)
    │                    │
    │                    └── items (jsonb array of product references)
    │
    └── featured_product_ids (jsonb) ──────> homepage_content
```

### Core Tables
| Table | Purpose | Key Fields |
|-------|---------|------------|
| `products` | Product catalog | code, title_fa/en/ar, size, surface_finish, image_url, face_images |
| `inquiries` | Price quote requests | customer_name, phone, items (jsonb), status |
| `contact_requests` | Contact form submissions | name, phone, message, status |
| `homepage_content` | Dynamic homepage CMS | hero_title, about_description, featured_product_ids |
| `import_history` | Bulk import audit trail | filename, admin_user, previous_state_json, status |

---

## 🚀 Deployment Pipeline

### Vercel Configuration
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/$1" },
    { "src": "/(.*)", "dest": "/$1" }
  ]
}
```

### Environment Variables
| Variable | Scope | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Client | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client | Public anon key for RLS queries |
| `SUPABASE_SERVICE_ROLE_KEY` | Server | Admin key for serverless functions |
| `VITE_WHATSAPP_NUMBER` | Client | WhatsApp business number |
| `VITE_CONTACT_EMAIL` | Client | Contact email address |

---

## 📈 Performance Optimization

### Frontend
- Code splitting with Vite dynamic imports
- Lazy loading for images and modals
- Skeleton loaders for perceived performance
- CSS containment for isolated components

### Backend
- Connection pooling via Supabase client
- Self-healing database connections
- Cached API responses where applicable

### CDN & Edge
- Global edge caching via Vercel
- Static asset optimization
- Brotli compression

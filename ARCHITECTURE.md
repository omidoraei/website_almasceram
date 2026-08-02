# 🏛️ ARCHITECTURE.md — System Architecture & Data Flow

## 📌 Architectural Overview
ALMAS CERAM is built on a **Decoupled Serverless Full-Stack Architecture**:

- **Presentation Layer (Frontend):** React 19 + TypeScript + Vite 7 + Tailwind CSS v4.
- **API Layer (Backend):** Vercel Serverless Functions (`api/*.js`) in Node.js.
- **Persistence Layer (Database):** Supabase Postgres (PostgreSQL) managed via Supabase Client (`api/db-client.js`).
- **Edge Security & CDN:** Vercel Global Edge Network + Cloudflare WAF.

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

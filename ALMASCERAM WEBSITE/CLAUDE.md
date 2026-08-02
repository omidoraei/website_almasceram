# 🤖 CLAUDE.md — Context & Rules for Claude Code & AI Coding Agents

## 📌 Project Overview
**ALMAS CERAM** is an architectural luxury porcelain tile catalog & CMS application.
- **Tech Stack:** React 19, TypeScript, Vite 7, Tailwind CSS v4, Node.js Serverless API (`api/*.js`), Supabase Postgres, Vercel Edge Network.
- **Languages:** Multi-lingual (Persian `fa` default, English `en`, Arabic `ar`) with dynamic RTL/LTR direction switching.
- **Primary Domain:** Architectural Porcelain Tiles (`30x30`, `40x40`, `60x60`, `60x120`, `80x80`, `100x100`, `30x90`).

---

## ⚡ Build & Test Commands
```bash
# Start local dev server
npm run dev

# TypeScript typecheck & production build
npm run build

# Preview production build locally
npm run preview
```

---

## 🚫 CRITICAL DO'S AND DON'TS FOR AI AGENTS

### 🔴 DON'TS (STRICTLY FORBIDDEN):
1. **NEVER modify `.env` or hardcode API keys/secrets.** Always use `process.env` in serverless API routes or `import.meta.env` in Vite.
2. **NEVER change visual UI / Design System tokens without explicit user instruction.** The Dark Slate theme (`#090D16`), Almas Gold (`#F59E0B`), and fonts (`Peyda`, `Vazirmatn`) must remain consistent.
3. **NEVER delete existing Supabase database columns or drop tables.**
4. **NEVER bypass input validation or security headers in API routes.**
5. **NEVER remove the 7 mandatory production tile sizes (`30x30`, `40x40`, `60x60`, `60x120`, `80x80`, `100x100`, `30x90`).**

### 🟢 DO'S (REQUIRED CONVENTIONS):
1. **Use Serverless API Routes (`api/*.js`)** importing `supabase` from `./db-client.js`.
2. **Include CORS & OWASP Security Headers** in every API handler (`res.setHeader('X-Content-Type-Options', 'nosniff')`).
3. **Use Barrel Imports** from `./components` and `./hooks`.
4. **Use Custom Hooks** (`useProducts`, `useInquiryBasket`, `useTileCompare`) for React state management instead of clogging view components.
5. **Use UTF-8 BOM (`\uFEFF`)** for any generated CSV/Excel exports to preserve Persian fonts in Microsoft Excel.

---

## 📁 Key File Mapping
- **App Root & Navigation Router:** `src/App.tsx`
- **Main Header & Navigation Bar:** `src/components/Header.tsx`
- **Product Card Item:** `src/components/ProductCard.tsx`
- **Product Detail Modal & Lightbox:** `src/components/ProductDetailModal.tsx`
- **Admin Panel Portal:** `src/components/admin/AdminDashboard.tsx`
- **Inline Excel Sheet Editor:** `src/components/admin/BulkEditorSheet.tsx`
- **Bulk Import Dry-Run Modal:** `src/components/admin/BulkImportModal.tsx`
- **Bulk Image Upload Modal:** `src/components/admin/BulkImageUploadModal.tsx`
- **Central Constants:** `src/constants/index.ts`
- **Database Schemas & API Spec:** `Document.md`
- **Design System Tokens:** `design.md`

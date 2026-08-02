# 📘 سند مرجع جامع فنی و معماری نرم‌افزار پروژه الماس سرام (ALMAS CERAM)
### Master Technical Documentation & Architecture Reference
**نام فایل:** `Document.md`  
**نسخه:** `3.5.0`  
**تاریخ بروزرسانی:** سال ۲۰۲۵  
**استک فنی:** React 19 + TypeScript + Vite + Tailwind CSS v4 + Node.js Serverless API + Supabase Postgres (PostgreSQL)  
**میزبانی:** Vercel Global Edge Network + Cloudflare Security WAF  

---

## 📋 فهرست مندرجات
1. [بخش ۱: نمای کلی پروژه (Project Overview)](#بخش-۱-نمای-کلی-پروژه)
2. [بخش ۲: ساختار پوشه‌بندی کامل (Project Folder Tree)](#بخش-۲-ساختار-پوشه‌بندی-کامل)
3. [بخش ۳: معماری فرانت‌اند و سیستم طراحی (Frontend Architecture & Design System)](#بخش-۳-معماری-فرانت‌اند)
4. [بخش ۴: معماری بک‌اند و APIها (Backend Architecture & Database Schemas)](#بخش-۴-معماری-بک‌اند)
5. [بخش ۵: پنل مدیریت، CMS و عملیات گروهی (Admin Panel & Bulk Operations)](#بخش-۵-پنل-مدیریت)
6. [بخش ۶: امنیت و مقاوم‌سازی OWASP (Security & Hardening)](#بخش-۶-امنیت)
7. [بخش ۷: یکپارچگی محتوا و وضعیت داده‌ها (Content Integration & Placeholders)](#بخش-۷-یکپارچگی-محتوا)
8. [بخش ۸: سئوی فنی و بهینه‌سازی (Technical SEO Package)](#بخش-۸-سئوی-فنی)
9. [بخش ۹: زیرساخت چندزبانه (i18n Multi-Lingual Architecture)](#بخش-۹-زیرساخت-چندزبانه)
10. [بخش ۱۰: راهنمای استقرار و متغیرهای محیطی (Deployment Guide)](#بخش-۱۰-استقرار)
11. [بخش ۱۱: راهنمای توسعه‌دهندگان جدید (Developer Extension Guide)](#بخش-۱۱-راهنمای-توسعه‌دهندگان)
12. [بخش ۱۲: واژه‌نامه فنی (Technical Glossary)](#بخش-۱۲-واژه‌نامه-فنی)

---

## 🏛️ بخش ۱: نمای کلی پروژه (Project Overview)

### ۱.۱. هدف پروژه و کسب‌وکار
وب‌سایت **الماس سرام (ALMAS CERAM)** یک پلتفرم کاتالوگ آنلاین لوکس معمارانه و سیستم ثبت استعلام قیمت پروژه‌ای برای محصولات کاشی و سرامیک پرسلان (اسلب، فول‌بادی و لعاب‌دار) است. این پلتفرم امکان مشاهده محصولات در ۷ سایز اصلی استاندارد، تست تعاملی چیدمان در شبیه‌ساز آنلاین (Room Visualizer)، سوییچ الگوهای متغیر فیس‌ها (Random Faces)، مقایسه فنی ۴ محصول کنار هم، و ثبت درخواست پیش‌فاکتور برای معماران و سازندگان برج‌های فاخر را فراهم می‌سازد.

### ۱.۲. Stack فنی کامل (Tech Stack)
* **Frontend Framework:** React 19.2 + TypeScript 5.9 + Vite 7
* **CSS Framework:** Tailwind CSS v4 + @tailwindcss/vite
* **Icons & UI Chrome:** Lucide React Icons (`lucide-react`)
* **Animation Engine:** Framer Motion (`framer-motion`) + CSS Smooth Transitions
* **Backend:** Node.js Serverless API Routes (در محیط Vercel Edge Functions)
* **Database:** Supabase Postgres (PostgreSQL) با لایه خودتریمی `api/db-client.js`
* **Hosting & CDN:** Vercel Global Edge Network + Cloudflare Proxy / Security WAF

### ۱.۳. نمودار متنی جریان داده (System Architecture Data Flow)
```
[کاربر / معمار در مرورگر] 
       │
       ▼ (درخواست امن HTTPS)
[Vercel Global Edge Network / Cloudflare] ── (اعمال هدرهای امنیتی OWASP + Rate Limiter)
       │
       ├──► [React 19 Frontend Web App] 
       │         │ (مدیریت تعاملی زبان i18n، شبیه‌ساز چیدمان، مدال‌ها)
       │         ▼ (درخواست‌های AJAX JSON)
       └──► [Node.js Serverless API (`api/*.js`)] 
                 │ (اعتبارسنجی ورودی‌ها + فیلتر Honeypot)
                 ▼
            [Supabase Postgres DB] (ذخیره‌سازی پایداری محصولات، استعلام‌ها و پیام‌ها)
```

---

## 📁 بخش ۲: ساختار پوشه‌بندی کامل (Project Folder Tree)

```
almas-ceram-catalog/
├── Document.md                  # [این فایل] سند مرجع جامع فنی پروژه
├── design.md                    # سند مرجع سیستم طراحی و هویت بصری
├── README.md                    # راهنمای سریع راه‌اندازی و نقشه سایت
├── api/                         # لایه بک‌اند Serverless Node.js (Vercel Functions)
│   ├── db-client.js             # کلاینت دیتابیس Supabase با خودتریمی (Self-Healing Connection)
│   ├── db-wake.js               # سرویس بیدارباش دیتابیس
│   ├── products.js              # APIهای GET (فیلتر بر اساس سایز/سطح)، POST، PUT، DELETE محصولات
│   ├── bulk-products.js         # API ویرایش گروهی محصولات (PATCH Batch Save)
│   ├── export-products.js       # API تولید و دانلود خروجی فایل اکسل
│   ├── import-preview.js        # API پردازش و پیش‌نمایش فایل اکسل (Dry-Run Preview)
│   ├── import-commit.js         # API ثبت نهایی تغییرات واردسازی در دیتابیس
│   ├── import-rollback.js       # API بازگردانی عملیات واردسازی (Rollback Engine)
│   ├── bulk-upload-preview.js   # API انطباق خودکار تصاویر گروهی بر اساس کد محصول
│   ├── bulk-upload-commit.js    # API ثبت تصاویر گروهی در دیتابیس
│   ├── collections.js           # API دریافت لیست کالکشن‌ها
│   ├── inquiry.js               # API ثبت پیش‌فاکتور مشتری و دریافت برای ادمین
│   ├── contact-requests.js      # API فرم تماس با ما با ضد اسپم
│   ├── homepage-content.js      # API مدیریت محتوای پویا (CMS)
│   ├── sitemap.js               # API تولید پویا و اتوماتیک Sitemap XML
│   └── security-middleware.js   # ماژول Rate Limiting و هدرهای امنیتی HTTP
├── public/                      # فایل‌های استاتیک عمومی
│   ├── favicon.svg              # لوگوی برداری برند الماس سرام
│   └── robots.txt               # قوانین دسترسی کراولرهای گوگل
├── src/
│   ├── components/              # کامپوننت‌های فرانت‌اند قابل استفاده مجدد
│   │   ├── Header.tsx           # هدر با مگامنو، سرچ، سوئیچر زبان و فیلتر سایزها
│   │   ├── Hero.tsx             # استیج معمارانه اصلی هوم‌پیدج
│   │   ├── SizeGridShowcase.tsx # شبکه‌بندی بصری ۷ سایز استاندارد کارخانه
│   │   ├── AboutSnippet.tsx     # بخش معرفی برند و استانداردهای کیفی
│   │   ├── FeaturedProductsShowcase.tsx # ویترین بنتو گرید محصولات شاخص
│   │   ├── FinalCtaSection.tsx  # بخش فراخوان نهایی دعوت به استعلام
│   │   ├── ProductCard.tsx      # کارت لوکس محصول با زوم، نشان فیس‌ها و استعلام
│   │   ├── ProductDetailModal.tsx # مدال جزئیات کامل، سوییچ فیس‌ها و کاتالوگ PDF
│   │   ├── ProductSkeleton.tsx  # کارت‌های انیمیشن‌دار لودینگ اسکلتون
│   │   ├── FilterSidebar.tsx    # فیلترهای پیشرفته سایز، سطح و بدنه
│   │   ├── CompareModal.tsx     # جدول مقایسه فنی ۴ محصول
│   │   ├── InquiryBasketModal.tsx # سبد پیش‌فاکتور و استعلام قیمت
│   │   ├── RoomVisualizer.tsx   # شبیه‌ساز چیدمان آنلاین
│   │   ├── ContactModal.tsx     # مدال فرم تماس + نقشه گوگل
│   │   ├── WhatsAppButton.tsx   # دکمه شناور واتساپ با پیام پویا
│   │   ├── LanguageSwitcher.tsx # دکمه سوئیچر ۳ زبانه (FA, EN, AR)
│   │   ├── SeoSchema.tsx        # ماژول تزریق اسکیماهای JSON-LD و OpenGraph
│   │   ├── ArchitectureView.tsx # مستندات معماری نرم‌افزار
│   │   ├── Footer.tsx           # پاورقی با استانداردهای کیفی ISO
│   │   └── admin/               # کامپوننت‌های پنل مدیریت
│   │       ├── AdminAuthModal.tsx    # ورود ایمن ادمین با 2FA و Rate-Limiter
│   │       ├── AdminDashboard.tsx    # داشبورد آماری، مدیریت و لاگ‌های امنیتی
│   │       ├── BulkEditorSheet.tsx   # ویرایشگر مستقیم اکسل (Sheet Editor)
│   │       ├── BulkImportModal.tsx   # مدال ۳ مرحله‌ای واردسازی اکسل و Rollback
│   │       ├── BulkImageUploadModal.tsx # مدال آپلود و انطباق گروهی تصاویر
│   │       ├── ProductFormModal.tsx  # فرم چندزبانه افزودن/ویرایش محصول
│   │       └── HomepageContentEditor.tsx # ویرایشگر محتوای صفحه اصلی (CMS)
│   ├── i18n/                    # سیستم چندزبانه
│   │   ├── translations.ts      # دیکشنری جامع ترجمه فارسی، انگلیسی و عربی
│   │   └── LanguageContext.tsx  # مدیریت Context پویا و جهت RTL/LTR
│   ├── pages/                   # صفحات محتوایی مستقل
│   │   ├── ContactPage.tsx      # صفحه کامل تماس با ما
│   │   ├── AboutPage.tsx        # صفحه درباره ما و کیفیت
│   │   ├── PortfolioPage.tsx    # صفحه نمونه‌کارهای اجراشده
│   │   ├── FaqPage.tsx          # صفحه سوالات متداول با سرچ زنده
│   │   ├── NotFoundPage.tsx     # صفحه اختصاصی ۴۰۴
│   │   ├── PrivacyPolicyPage.tsx# سند حریم خصوصی
│   │   └── TermsPage.tsx        # سند شرایط و قوانین
│   ├── hooks/                   # هوک‌های اختصاصی منطق فرانت‌اند
│   │   ├── useProducts.ts       # هوک لودینگ و فیلتر محصولات
│   │   ├── useInquiryBasket.ts  # هوک مدیریت سبد پیش‌فاکتور
│   │   └── useTileCompare.ts    # هوک مدیریت مقایسه محصولات
│   ├── constants/               # فایل متمرکز ثابت‌ها (Single Source of Truth)
│   │   └── index.ts
│   ├── tests/                   # تست‌های اتوماتیک QA
│   │   └── phase6.test.ts       # Test Suite اتوماتیک فاز ۶
│   ├── types/
│   │   └── tile.ts              # مدل‌های TypeScript تخصصی کاشی و سرامیک
│   ├── lib/
│   │   ├── supabase.js          # کلاینت فرانت‌اند Supabase
│   │   └── analytics.ts         # رصد رویدادهای Google Analytics
│   ├── App.tsx                  # کامپوننت اصلی ناوبری و گالری
│   ├── main.tsx                 # نقطه‌ورودی React
│   └── index.css                # استایل‌های Tailwind v4 و Accessibility
└── vercel.json                  # کانفیگ دپلوی Vercel Serverless
```

---

## 🎨 بخش ۳: معماری فرانت‌اند و سیستم طراحی (Frontend Architecture & Design System)

### ۳.۱. Design System Tokens (پالت رنگی، تایپوگرافی و فاصله‌گذاری)

* **پالت رنگی (Architectural Dark Palette):**
  * `Primary Background` (پس‌زمینه اصلی): `#090D16` (`Slate 950`)
  * `Surface Card` (پس‌زمینه کارت‌ها و مدال‌ها): `#0F172A` (`Slate 900`)
  * `Subtle Border` (خطوط تفکیک و فریم‌ها): `#1E293B` (`Slate 800`)
  * `Almas Gold` (رنگ برندینگ و دکمه‌های اصلی): `#F59E0B` (`Amber 500`) / `#FBBF24` (`Amber 400`)
  * `Success State` (واتساپ و استعلام‌های موفق): `#10B981` (`Emerald 500`)
  * `Text Heading` (متون اصلی با کنتراست بالا): `#F8FAFC` (`Slate 50`)
  * `Text Muted` (کدها و برچسب‌های فنی): `#94A3B8` (`Slate 400`)

* **سیستم تایپوگرافی:**
  * **فارسی و عربی (`RTL`):** فونت‌های معمارانه `Peyda` / `Yekan Bakh` برای تیترها و `Vazirmatn` برای متون و جداول.
  * **انگلیسی (`LTR`):** فونت‌های مدرن `Plus Jakarta Sans` / `Inter`.

---

## ⚙️ بخش ۴: معماری بک‌اند و APIها (Backend Architecture & Database Schemas)

### ۴.۱. مشخصات کامل API Endpoints

| متد | مسیر (Route) | پارامترهای ورودی | خروجی (Response) | کاربرد |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | `search, size, finish, body, collection, id` | `Product[]` یا `Product` | دریافت و فیلتر محصولات کاتالوگ |
| `POST` | `/api/products` | `productData` (JSON) | `Product` | افزودن محصول جدید به کاتالوگ |
| `PUT` | `/api/products` | `id, updates` (JSON) | `Product` | ویرایش مشخصات و متون چندزبانه |
| `DELETE` | `/api/products` | `id` | `{ success: true }` | حذف محصول از دیتابیس |
| `PATCH` | `/api/bulk-products` | `updates` یا `action, productIds` | `{ success, updatedCount }` | ویرایش و به‌روزرسانی گروهی محصولات |
| `GET` | `/api/export-products` | `size` (اختیاری) | `CSV Text (\uFEFF BOM)` | خروجی فایل اکسل محصولات |
| `POST` | `/api/import-preview` | `csvData, filename` | `{ summary, rows }` | پیش‌نمایش تغییرات اکسل (Dry Run) |
| `POST` | `/api/import-commit` | `rows, filename, adminUser` | `{ success, importId }` | ثبت نهایی تغییرات و ذخیره Snapshot |
| `POST` | `/api/import-rollback` | `importId` | `{ success, message }` | بازگردانی کامل تغییرات یک Import |
| `POST` | `/api/bulk-upload-preview` | `files` (Base64) | `{ summary, matched, unmatched }` | انطباق خودکار تصاویر با کد محصولات |
| `POST` | `/api/bulk-upload-commit` | `items` (JSON) | `{ success, updatedCount }` | بروزرسانی آدرس تصاویر گالری محصولات |
| `GET` | `/api/inquiry` | - | `Inquiry[]` | دریافت تمام درخواست‌های استعلام برای ادمین |
| `POST` | `/api/inquiry` | `customer_name, phone, items` | `{ success, inquiry }` | ثبت درخواست پیش‌فاکتور جدید |
| `POST` | `/api/contact-requests`| `name, phone, message` | `{ success, data }` | ثبت فرم تماس با ما (با فیلتر اسپم) |
| `GET/PUT` | `/api/homepage-content`| `updates` (JSON) | `HomepageContent` | مدیریت پویای متون و تصاویر صفحه اصلی |
| `GET` | `/api/sitemap` | - | `XML Sitemap` | تولید خودکار فایل XML Sitemap برای گوگل |

### ۴.۲. طرح‌بندی کامل جداول دیتابیس (Supabase Postgres Schemas)

```sql
-- ۱. جدول محصولات (products)
CREATE TABLE products (
  id serial PRIMARY KEY,
  code text UNIQUE NOT NULL,
  title_fa text NOT NULL,
  title_en text,
  title_ar text,
  collection_code text,
  collection_name text,
  size text CHECK (size IN ('30x30','40x40','60x60','60x120','80x80','100x100','30x90')),
  surface_finish text,
  body_type text,
  faces_count integer DEFAULT 8,
  thickness_mm numeric(4,1),
  water_absorption text,
  rectified boolean DEFAULT true,
  applications jsonb,
  color_family text,
  image_url text NOT NULL,
  face_images jsonb,
  ambiance_images jsonb,
  description text,
  description_fa text,
  description_en text,
  description_ar text,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- ۲. جدول سوابق واردسازی و بازگردانی (import_history)
CREATE TABLE import_history (
  id serial PRIMARY KEY,
  filename text,
  admin_user text,
  new_count integer DEFAULT 0,
  updated_count integer DEFAULT 0,
  previous_state_json jsonb,
  status text DEFAULT 'completed', -- 'completed', 'rolled_back'
  created_at timestamptz DEFAULT now()
);

-- ۳. جدول پیش‌فاکتورها و استعلام‌ها (inquiries)
CREATE TABLE inquiries (
  id serial PRIMARY KEY,
  customer_name text NOT NULL,
  phone text NOT NULL,
  company text,
  email text,
  items jsonb NOT NULL,
  notes text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- ۴. جدول درخواست‌های فرم تماس (contact_requests)
CREATE TABLE contact_requests (
  id serial PRIMARY KEY,
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  subject text,
  message text NOT NULL,
  product_code text,
  product_title text,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

-- ۵. جدول تنظیمات صفحه اصلی (homepage_content)
CREATE TABLE homepage_content (
  id serial PRIMARY KEY,
  hero_title text,
  hero_subtitle text,
  hero_description text,
  hero_image_url text,
  about_title text,
  about_description text,
  cta_title text,
  cta_description text,
  cta_button_text text,
  featured_product_ids jsonb
);
```

---

## 🔒 بخش ۵ و ۶: پنل مدیریت و امنیت (Admin Panel & OWASP Security)

### ۵.۱. سیستم ورود دو مرحله‌ای ادمین (2FA)
* **نام کاربری دمو:** `admin@almasceram.com`
* **کلمه عبور دمو:** `admin123`
* **کد تایید دو مرحله‌ای (2FA OTP):** `123456`
* **مکانیزم Brute-Force:** در صورت ۵ بار ورود اشتباه متوالی، اکانت به مدت ۳۰ ثانیه قفل می‌شود.

### ۶.۱. اقدامات امنیتی OWASP Top 10
1. **Rate Limiting بر اساس IP:** محدودیت ۱۵ درخواست در ۱۵ ثانیه روی APIها جهت جلوگیری از DoS.
2. **پاک‌سازی ورودی‌ها (XSS Sanitization):** حذف کاراکترهای `<>` از ورودی‌های متنی.
3. **هدرهای امنیتی HTTP:** ارسال هدرهای `X-Content-Type-Options: nosniff` و `X-Frame-Options: DENY`.
4. **فیلد مخفی Honeypot:** مسدودسازی اتوماتیک ربات‌های اسپمر در فرم تماس.

---

## 🚀 بخش ۱۰: راهنمای استقرار و دپلوی (Deployment Guide)

### ۱۰.۱. متغیرهای محیطی (Environment Variables)
این متغیرها باید در پنل **Vercel Settings $\rightarrow$ Environment Variables** تنظیم شوند:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=public-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=service-role-key-here
VITE_WHATSAPP_NUMBER=989121112233
VITE_CONTACT_EMAIL=info@almasceram.com
```

### ۱۰.۲. دستورات بیلد پروژه
```bash
# نصب وابستگی‌ها
npm install

# ساخت نسخه تولیدی (Production Build)
npm run build
```

---

## 🛠️ بخش ۱۱: راهنمای توسعه‌دهندگان جدید (Developer Extension Guide)

### نحوه افزودن یک فیلد جدید به محصول (مثلا: وزن هر کارتن):
1. **دیتابیس:** در Supabase ستون `box_weight_kg numeric` را به جدول `products` اضافه کنید.
2. **TypeScript:** در `src/types/tile.ts` فیلد `box_weight_kg?: number` را به اینترفیس `Product` بیفزایید.
3. **فرانت‌اند:** در `ProductDetailModal.tsx` مقدار `product.box_weight_kg` را در جدول مشخصات فنی رندر کنید.
4. **پنل مدیریت:** در `ProductFormModal.tsx` یک ورودی جدید برای `box_weight_kg` قرار دهید.

---

## 📖 بخش ۱۲: واژه‌نامه فنی (Technical Glossary)

* **پرسلان (Porcelain Tile):** کاشی فوق‌العاده متراکم با جذب آب زیر ۰.۵٪ که در دمای بالای ۱۲۰۰ درجه سانتی‌گراد پخته می‌شود.
* **رکتیفاید (Rectified):** برش لیزری دقیق لبه‌های کاشی پس از پخت جهت نصب بدون بند.
* **فیس متغیر (Random Faces):** تنوع الگوهای رگه سنگ بر روی کاشی‌ها تا پروژه جلوه‌ای طبیعی داشته باشد.
* **Serverless Function:** توابع بک‌اند Node.js که بدون نیاز به سرور همیشه روشن، تنها با فراخوانی اجرا می‌شوند.
* **RLS (Row Level Security):** سیاست‌های امنیتی سطح سطر در دیتابیس PostgreSQL.

---

**تاییدیه نهایی:** تمام اسناد مرجع پروژه شامل `Document.md` (مستندات فنی)، `design.md` (سیستم طراحی) و `README.md` (نقشه راهنمای سریع) با کامل‌ترین جزئیات بازنویسی و به‌روزرسانی گردیدند.

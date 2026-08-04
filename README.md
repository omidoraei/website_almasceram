# 💎 وب‌سایت کاتالوگ آنلاین و سیستم مدیریت الماس سرام (ALMAS CERAM)
### Almas Ceram Architectural Porcelain Tiles Catalog & CMS
**نسخه:** `4.0.0` (بازطراحی کامل لوکس مینیمال + تمام فازهای ۱ تا ۶)  
**تاریخ بروزرسانی:** ۲۰۲۵  
**استک فنی:** React 19 + TypeScript 5.9 + Vite 7 + Tailwind CSS v4 + Supabase Postgres  
**میزبانی:** Vercel Global Edge Network + Cloudflare Security WAF  

[![React 19](https://img.shields.io/badge/React-19.2-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![TailwindCSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8)](https://tailwindcss.com/)
[![Supabase Postgres](https://img.shields.io/badge/Database-Supabase_Postgres-emerald)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deployment-Vercel_Edge-black)](https://vercel.com/)

این مخزن شامل سورس‌کد کامل **پلتفرم کاتالوگ آنلاین لوکس معمارانه**، سیستم شبیه‌ساز چیدمان (Room Visualizer)، سیستم فیس‌های متغیر (Random Faces)، سیستم استعلام قیمت پروژه‌ای، سیستم چندزبانه (فارسی، انگلیسی، عربی)، عملیات گروهی اکسل (Bulk Import/Export/Sheet Editor)، و پنل مدیریت امنیتی برند **الماس سرام (ALMAS CERAM)** است.

---

## 📌 پیش‌نیازها (Prerequisites)

برای اجرای پروژه روی سیستم محلی، ابزارهای زیر نیاز است:

* **Node.js:** نسخه `v18.0.0` یا بالاتر (`v20+` پیشنهاد می‌شود)
* **npm:** نسخه `v9+` یا **pnpm** / **yarn**
* **پروژه Supabase PostgreSQL:** متصل به جداول `products`, `inquiries`, `contact_requests`, `homepage_content`, `collections`, `import_history`.

---

## ⚡ راهنمای سریع راه‌اندازی (Quick Start)

### ۱. نصب وابستگی‌ها
```bash
npm install
```

### ۲. تنظیم متغیرهای محیطی (`.env`)
یک فایل `.env` در ریشه پروژه ایجاد کرده و متغیرهای زیر را تنظیم نمایید:

```env
# کلیدهای عمومی و اختصاصی دیتابیس Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# تنظیمات ارتباطی و هدرها
VITE_WHATSAPP_NUMBER=989121112233
VITE_CONTACT_EMAIL=info@almasceram.com
```

### ۳. اجرای سرور توسعه محلی (Development Server)
```bash
npm run dev
```
سایت در آدرس `http://localhost:5173` اجرا خواهد شد.

### ۴. ساخت نسخه تولیدی (Production Build)
```bash
# بررسی تایپ اسکریپت و بیلد نهایی
npm run build

# پیش‌نمایش بیلد تولیدی
npm run preview
```

---

## 🗺️ نقشه کامل سایت و ساختار ناوبری (Complete Site Architecture Map)

### ۱. صفحات عمومی و محتوایی سایت (Public Views & Pages)
* 🏠 **صفحه اصلی (`/` - Homepage):**
  1. **Hero Stage:** استیج معمارانه با بیانیه برند، عکس اسلب ۱۰۰x۱۰۰ اونیکس رویال، شاخص‌های آزمایشگاهی ISO 10545 و آمار زنده دیتابیس.
  2. **Size Grid Showcase:** شبکه تصویری بنتو گرید ۷ سایز تولیدی کارخانه (`30x30`, `40x40`, `60x60`, `60x120`, `80x80`, `100x100`, `30x90`).
  3. **About Snippet:** معرفی تکنولوژی خطوط تولید ایتالیایی و کیفیت پرسلان.
  4. **Featured Products Showcase:** ویترین محصولات شاخص انتخاب‌شده از ادمین.
  5. **Catalog Gallery & Filters:** گالری کاتالوگ با فیلتر هوشمند سایزها، نوع سطح و بدنه همراه با لودینگ اسکلتون.
  6. **Skills Showcase:** نمایش مهارت‌ها و تخصص‌های فنی با الهام از 21st.dev.
  7. **Final CTA Section:** بخش فراخوان نهایی ثبت استعلام و دریافت نمونه فیزیکی کاشی.
* 🏢 **درباره ما (`/?page=about`):** داستان برند، تکنولوژی تولید، و استانداردهای کیفی.
* 🏗️ **نمونه‌کارها (`/?page=portfolio`):** گالری تصویری پروژه‌های شاخص اجراشده با فیلتر موضوعی (مسکونی، هتلی، تجاری، نما).
* ❓ **سوالات متداول (`/?page=faq`):** آکاردئون پاسخ به سوالات فنی به همراه نوار جستجوی زنده.
* 📞 **تماس با ما (`/?page=contact`):** فرم تماس با فیلتر ضد اسپم + نقشه گوگل مپس + مشخصات دفتر فروش ملاصدرا.
* 🔒 **حریم خصوصی (`/?page=privacy`):** سند حقوقی حریم خصوصی و حفاظت از داده‌ها.
* ⚖️ **شرایط و قوانین (`/?page=terms`):** سند حقوقی شرایط و ضوابط استفاده.
* 🚫 **صفحه ۴۰۴ اختصاصی (`/?page=404`):** صفحه خطا با میانبرهای سایزهای پرکاربرد.

---

### ۲. مدال‌ها و ابزارهای تعاملی (Interactive Modals & Tools)
* 💎 **مدال جزئیات محصول (Product Detail Modal):**
  * نمایش تصویر اصلی با قابلیت **زوم/بزرگنمایی بافت کاشی**.
  * سوییچر **فیس‌های متغیر (Random Face Variations #1..N)**.
  * سوییچر **رندر دکوراسیون داخلی (Room Ambiance)**.
  * جدول کامل **مشخصات فنی آزمایشگاهی ISO 10545**.
  * تولید **کاتالوگ قابل پرینت PDF**.
  * لینک مستقیم **چت واتساپ با پیام پیش‌فرض اختصاصی همان محصول**.
* 🛒 **سبد پیش‌فاکتور و استعلام قیمت (Inquiry Basket Drawer):** مدیریت اقلام، تعیین متراژ (m²)، ثبت مشخصات و ارسال مستقیم به دیتابیس.
* 🎨 **شبیه‌ساز آنلاین چیدمان (Room Visualizer):** تست تعاملی کاشی‌ها در سالن پذیرایی، سرویس مستر، لابی و نما.
* ⚖️ **جدول مقایسه فنی (Comparison Matrix):** مقایسه کنار هم ۴ محصول از نظر سایز، ضخامت، بدنه و جذب آب.
* 🌐 **سوئیچر زبان (Language Switcher):** سوییچ زنده بین 🇮🇷 فارسی (`RTL`)، 🇬🇧 English (`LTR`) و 🇸🇦 العربية (`RTL`).

---

### ۳. پنل مدیریت ادمین (Admin Management Portal - `/admin`)
* 🔐 **ورود ۲ مرحله‌ای ایمن (2FA Auth Modal):**
  * ایمیل دمو: `admin@almasceram.com` | رمز عبور: `admin123` | کد ۲FA دمو: `123456`
  * قفل خودکار ۳۰ ثانیه‌ای در صورت ۵ بار ورود نادرست متوالی (Brute-force protection).
* 📊 **داشبورد آماری (Overview KPIs):** نمایش متراژ درخواستی، تعداد محصولات، پیام‌ها و استعلام‌ها.
* 📊 **ویرایشگر اکسل مستقیم (Sheet Editor):** ویرایش مستقیم سلول‌های جدول، Find & Replace متون و اعمال تغییرات گروهی (Batch Save).
* 🎨 **مدیریت صفحه اصلی (Homepage CMS):** تغییر متن‌های Hero، عکس هدر، متون درباره ما و انتخاب محصولات ویژه ویترین.
* 📦 **مدیریت محصولات چندزبانه (Multi-lingual Catalog CRUD):** افزودن و ویرایش محصولات به ۳ زبان (FA, EN, AR) با بج‌های وضعیت تکمیل ترجمه.
* 📊 **عملیات گروهی اکسل (Bulk Export & 3-Step Import):**
  * خروجی مستقیم اکسل با انکودینگ UTF-8 BOM جهت بازشدن بدون به‌هم‌ریختگی در Microsoft Excel.
  * ورود ۳ مرحله‌ای فایل اکسل/CSV همراه با پیش‌نمایش تغییرات (Dry Run) و امکان بازگردانی (Rollback).
  * آپلود و انطباق گروهی تصاویر بر اساس کد محصول (`code_face1.jpg`).
* 📑 **مدیریت استعلام‌ها (Inquiry Orders):** مشاهده پیش‌فاکتورها و تغییر وضعیت به Pending / Contacted / Completed.
* 💬 **مدیریت فرم‌های تماس (Contact Requests):** مشاهده پیام‌های دریافتی، پاسخ‌دهی و آرشیو.
* 🛡️ **لاگ‌های امنیتی (Security Audit Logs):** تاریخچه نشست‌ها و ورودهای ادمین همراه با IP و زمان.

---

### ۴. سرویس‌های بک‌اند Serverless (`api/*.js`)
* `GET/POST/PUT/DELETE /api/products` — CRUD محصولات کاتالوگ با اعتبارسنجی سایزهای مجاز.
* `PATCH /api/bulk-products` — بهینه‌سازی و ویرایش گروهی محصولات.
* `GET /api/export-products` — تولید و دانلود خروجی فایل اکسل.
* `POST /api/import-preview` — پردازش اولیه فایل اکسل/CSV و پیش‌نمایش Diffs بدون تغییر دیتابیس.
* `POST /api/import-commit` — ثبت نهایی تغییرات واردسازی در دیتابیس و ذخیره Snapshot.
* `POST /api/import-rollback` — بازگردانی عملیات واردسازی بر اساس Snapshot.
* `POST /api/bulk-upload-preview` — انطباق خودکار تصاویر گروهی بر اساس کد محصول.
* `POST /api/bulk-upload-commit` — بروزرسانی آدرس تصاویر گالری محصولات.
* `GET/POST/PUT/DELETE /api/inquiry` — ثبت و مدیریت درخواست‌های استعلام قیمت.
* `GET/POST/PUT/DELETE /api/contact-requests` — ثبت فرم تماس با فیلتر Honeypot و Rate Limiter.
* `GET/PUT /api/homepage-content` — مدیریت پویای متون و تصاویر صفحه اصلی.
* `GET /api/sitemap` — تولید خودکار فایل XML Sitemap برای گوگل.

---

## 📚 اسناد مرجع پروژه (Core Documentation Files)

برای مطالعه جزئیات کامل معماری و سیستم طراحی، فایل‌های مرجع زیر در پروژه موجود است:

| فایل | توضیحات |
|------|---------|
| **`Document.md`** 📘 | سند مرجع فنی و معماری کامل پروژه شامل تمام مشخصات لایه فرانت‌اند، دیتابیس Supabase، APIها، تدابیر امنیتی OWASP Top 10، سئوی فنی، عملیات گروهی، و راهنمای توسعه‌دهندگان. |
| **`design.md`** 🎨 | سند سیستم طراحی و هویت بصری شامل کدهای HEX دقیق رنگ‌ها، فونت‌های چندزبانه، فاصله‌گذاری‌ها، و مشخصات بصری تمام کامپوننت‌ها (Porcelanosa / Atlas Concorde style). |
| **`ARCHITECTURE.md`** 🏛️ | نمودارهای جریان داده، معماری لایه‌ها، و دیاگرام‌های سیستم. |
| **`AI_CONTEXT.md`** 🤖 | زمینه جامع برای مدل‌های هوش مصنوعی شامل خلاصه معماری، اسکیماهای دیتابیس، و قوانین کلیدی. |
| **`CLAUDE.md`** 🤖 | دستورالعمل‌های خاص برای Claude Code و ایجنت‌های هوش مصنوعی شامل بایدها و نبایدها. |
| **`CONTRIBUTING.md`** 🤝 | راهنمای مشارکت در پروژه شامل فرمت commit message، استراتژی branching، و چک‌لیست PR. |
| **`SUMMARY.md`** 📝 | خلاصه تغییرات اخیر، کامپوننت‌های جدید اضافه شده، و مراحل بعدی پیشنهادی. |

---

## 🎨 ویژگی‌های طراحی لوکس و مینیمال (نسخه ۴.۰)

### کامپوننت‌های UI جدید
- ✨ `AnimatedSection` - انیمیشن reveal با Intersection Observer
- ✨ `FadeIn` - افکت fade-in با جهت‌های مختلف
- ✨ `LuxuryButton` - دکمه‌های لوکس با ۴ variant و افکت shine
- ✨ `LuxuryCard` - کارت شیشه‌ای با افکت‌های hover متنوع
- ✨ `LuxuryDivider` - جداکننده گرادینت طلایی
- ✨ `StatBadge` - بج نمایش آمار با استایل لوکس

### بخش‌های جدید
- ✨ `SkillsShowcase` - نمایش مهارت‌ها و تخصص‌ها با الهام از 21st.dev

### افکت‌های CSS پیشرفته
- 🎨 Glass Morphism با backdrop-blur
- 🎨 Gradient Text با clip
- 🎨 Glow Effects با سایه‌های رنگی
- 🎨 Animated Borders با gradient flow
- 🎨 Floating Animation
- 🎨 Shimmer Effect
- 🎨 Ambient Orbs برای پس‌زمینه

---

© ۲۰۲۵ کلیه حقوق برای صنایع کاشی و سرامیک الماس سرام محفوظ است.

---

## 🚨 رفع مشکل پایگاه داده

اگر پس از استقرار روی Vercel محصولات نمایش داده نمی‌شوند:

### راه‌حل سریع (۳ دقیقه):

1. به [Supabase](https://supabase.com) وارد شوید
2. پروژه خود را انتخاب کنید
3. به **SQL Editor** بروید
4. فایل `database-schema.sql` را کپی و اجرا کنید
5. تمام! ✅

📄 راهنمای کامل: فایل‌های `QUICK_FIX.md` و `DATABASE_SETUP.md` را مطالعه کنید.

### پوشه db-setup:
ابزارهای تست و راه‌اندازی پایگاه داده در پوشه `db-setup/` قرار دارند.

```bash
cd db-setup
npm install
npm run test-connection  # تست اتصال به Supabase
```

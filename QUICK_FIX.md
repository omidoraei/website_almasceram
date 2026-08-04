# 🔧 رفع سریع مشکل نمایش محصولات

## مشکل
پس از استقرار روی Vercel، هیچ محصولی نمایش داده نمی‌شود و امکان افزودن محصول وجود ندارد.

## علت
**جداول پایگاه داده در Supabase ایجاد نشده‌اند.**

---

## ✅ راه‌حل (۳ دقیقه)

### مرحله ۱: ورود به Supabase
1. به https://supabase.com بروید
2. وارد اکانت خود شوید
3. پروژه الماس سرام را انتخاب کنید

### مرحله ۲: اجرای SQL
1. از منوی سمت چپ، روی **SQL Editor** کلیک کنید
2. دکمه **New Query** را بزنید
3. به پوشه پروژه بروید و فایل `database-schema.sql` را باز کنید
4. تمام محتوای فایل را کپی کرده و در ادیتور SQL قرار دهید
5. دکمه **Run** (یا Ctrl+Enter) را بزنید

### مرحله ۳: تأیید
باید پیام موفقیت ببینید و جداول زیر ایجاد شوند:
- products ✅
- collections ✅
- portfolio ✅
- standards ✅
- contact_requests ✅
- inquiries ✅
- homepage_content ✅
- admin_users ✅
- activity_logs ✅

---

## 🧪 تست نهایی

1. به وبسایت Vercel خود بروید
2. صفحه اصلی را رفرش کنید → باید محصولات نمونه را ببینید
3. به پنل ادمین بروید → باید بتوانید محصول جدید اضافه کنید

---

## ⚠️ اگر هنوز مشکل دارید

### ۱. بررسی Environment Variables در Vercel
به داشبورد Vercel بروید:
- Project Settings → Environment Variables
- مطمئن شوید این متغیرها تنظیم شده‌اند:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (کلید کامل)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc... (کلید عمومی)
```

### ۲. دریافت کلیدها از Supabase
- Settings → API
- کپی کردن:
  - Project URL
  - service_role key (مخفی)
  - anon public key

### ۳. Deploy مجدد در Vercel
پس از تنظیم متغیرها:
- Deployments → Redeploy

---

## 📁 فایل‌های کمکی

در پوشه `db-setup/`:
- `README.md` - راهنمای کامل
- `test-db-connection.js` - تست اتصال
- `setup-database.js` - اسکریپت خودکار (اختیاری)

اجرای تست:
```bash
cd db-setup
npm install
npm run test-connection
```

---

## 📞 نیاز به کمک بیشتر؟

فایل `DATABASE_SETUP.md` را مطالعه کنید.

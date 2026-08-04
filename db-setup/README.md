# 🗄️ راهنمای راه‌اندازی پایگاه داده الماس سرام

این پوشه شامل ابزارهای لازم برای راه‌اندازی و تست پایگاه داده Supabase است.

---

## 🔧 پیش‌نیازها

1. نصب Node.js (نسخه 18 یا بالاتر)
2. داشتن اکانت Supabase و پروژه فعال
3. کلیدهای API از پنل Supabase

---

## 📦 نصب

```bash
cd db-setup
npm install
```

---

## ⚙️ تنظیم متغیرهای محیطی

یک فایل `.env` در همین پوشه ایجاد کنید:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### نحوه دریافت کلیدها:

1. به پنل Supabase بروید
2. پروژه خود را انتخاب کنید
3. به **Settings** → **API** بروید
4. مقادیر زیر را کپی کنید:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

---

## 🚀 مراحل راه‌اندازی

### روش ۱: اجرای خودکار (توصیه نمی‌شود - محدودیت دارد)

```bash
npm run setup-db
```

⚠️ توجه: این روش ممکن است به دلیل محدودیت‌های Supabase کار نکند.

### روش ۲: اجرای دستی در SQL Editor (توصیه شده) ✅

1. به آدرس https://supabase.com وارد شوید
2. پروژه خود را انتخاب کنید
3. از منوی سمت چپ به **SQL Editor** بروید
4. روی **New Query** کلیک کنید
5. محتوای فایل `../database-schema.sql` را کپی کرده و در ادیتور قرار دهید
6. روی دکمه **Run** کلیک کنید

---

## 🧪 تست اتصال

پس از ایجاد جداول، اتصال را تست کنید:

```bash
npm run test-connection
```

خروجی موفق:
```
✅ Connection successful!
✅ Found tables:
   - products
   - collections
   - portfolio
   ...
✅ Found 1 products:
   - ALM-001: پرسلان مرمر سفید (80x80)
```

---

## 📋 جداول ایجادشده

| جدول | توضیحات |
|------|---------|
| `products` | محصولات کاشی و سرامیک |
| `collections` | کالکشن‌های محصولات |
| `portfolio` | پروژه‌ها و نمونه کارها |
| `standards` | استانداردها و گواهینامه‌ها |
| `contact_requests` | درخواست‌های تماس |
| `inquiries` | استعلام‌های قیمت |
| `homepage_content` | محتوای صفحه اصلی |
| `admin_users` | کاربران ادمین |
| `activity_logs` | لاگ فعالیت‌ها |

---

## ❌ رفع مشکل

### خطای "relation does not exist"
- جداول ایجاد نشده‌اند
- راه‌حل: فایل SQL را در Supabase SQL Editor اجرا کنید

### خطای "permission denied"
- کلید Service Role اشتباه است
- راه‌حل: کلید صحیح را از Settings → API کپی کنید

### خطای "Invalid API key"
- کلید API منقضی یا اشتباه است
- راه‌حل: کلیدها را دوباره از پنل Supabase دریافت کنید

---

## 📞 پشتیبانی

برای اطلاعات بیشتر به فایل `../DATABASE_SETUP.md` مراجعه کنید.

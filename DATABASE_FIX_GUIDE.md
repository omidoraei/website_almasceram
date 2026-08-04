# راهنمای رفع مشکل پایگاه داده Supabase

## 🔍 مشکل شناسایی شده

تابع `update_updated_at_column` در پایگاه داده Supabase فاقد `search_path` ثابت بود که باعث ایجاد خطای امنیتی و عدم عملکرد صحیح جداول می‌شد.

### جزئیات فنی مشکل:
- **Entity**: `public.update_updated_at_column`
- **مشکل**: تابع دارای `search_path` متغیر است (mutable search_path)
- **خطر**: 
  - رفتار غیرقابل پیش‌بینی وقتی `search_path` فراخوان متفاوت باشد
  - ریسک امنیتی به ویژه اگر از `SECURITY DEFINER` استفاده شود
  - امکان resolve نادرست نام‌های unqualified

---

## ✅ راه‌حل اجرا شده

فایل `supabase-schema-fixed.sql` ایجاد شده است که شامل:

### 1. رفع مشکل search_path
```sql
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = pg_catalog, public;  -- 🔧 CRITICAL FIX
```

### 2. جداول ایجاد شده:
- `products` - محصولات
- `collections` - کالکشن‌ها
- `portfolio_items` - آیتم‌های پورتفولیو
- `standards` - استانداردها
- `homepage_content` - محتوای صفحه اصلی
- `contact_requests` - درخواست‌های تماس
- `admin_logs` - لاگ مدیریت

### 3. تریگرهای خودکار برای updated_at
برای تمام جداول تریگرهایی ایجاد شده که به صورت خودکار `updated_at` را آپدیت می‌کنند.

### 4. سیاست‌های RLS (Row Level Security)
سیاست‌های امنیتی برای محیط توسعه تنظیم شده‌اند (دسترسی کامل).

### 5. داده‌های نمونه
داده‌های اولیه برای تست اضافه شده است.

---

## 📋 دستورالعمل اجرا

### مرحله 1: ورود به پنل Supabase
1. به آدرس https://supabase.com وارد شوید
2. پروژه **الماس سرام** را انتخاب کنید
3. از منوی سمت چپ روی **SQL Editor** کلیک کنید

### مرحله 2: اجرای اسکریپت
1. روی دکمه **"New Query"** کلیک کنید
2. تمام محتوای فایل `/workspace/supabase-schema-fixed.sql` را کپی کرده و در ادیتور قرار دهید
3. روی دکمه **"Run"** کلیک کنید

### مرحله 3: تأیید موفقیت
پس از اجرا باید پیام `"Success. No rows returned"` را ببینید.

برای اطمینان بیشتر، این کوئری را اجرا کنید:
```sql
SELECT proname, proconfig 
FROM pg_proc 
WHERE proname = 'update_updated_at_column';
```
باید خروجی زیر را ببینید:
```
{update_updated_at_column} | {search_path=pg_catalog,public}
```

### مرحله 4: بررسی جداول
به بخش **Table Editor** بروید و تأیید کنید جداول زیر وجود دارند:
- ✅ products
- ✅ collections
- ✅ portfolio_items
- ✅ standards
- ✅ homepage_content
- ✅ contact_requests
- ✅ admin_logs

### مرحله 5: تست وب‌سایت
1. به Vercel بروید و پروژه را **Redeploy** کنید
2. وب‌سایت را باز کنید - باید محصول نمونه نمایش داده شود
3. به پنل ادمین بروید و سعی کنید محصول جدید اضافه کنید

---

## ⚠️ نکات مهم

### هشدارها:
- ⚠️ این اسکریپت ابتدا تمام جداول قدیمی را حذف می‌کند (`DROP ... CASCADE`)
- ⚠️ اگر داده مهمی دارید، قبل از اجرا backup بگیرید

### برای محیط تولید:
- سیاست‌های RLS فعلی برای **محیط توسعه** باز هستند (Allow all operations)
- برای محیط تولید حتماً باید:
  1. Supabase Auth را تنظیم کنید
  2. سیاست‌های RLS را محدودتر کنید
  3. فقط به کاربران احراز هویت شده دسترسی بدهید

### نمونه سیاست RLS برای تولید:
```sql
-- فقط کاربران authenticated بتوانند بخوانند
CREATE POLICY "Authenticated users can view products"
    ON public.products
    FOR SELECT
    TO authenticated
    USING (true);

-- فقط ادمین‌ها بتوانند تغییر دهند
CREATE POLICY "Admins can modify products"
    ON public.products
    FOR ALL
    TO authenticated
    USING (auth.jwt()->>'role' = 'admin');
```

---

## 🔧 عیب‌یابی

### اگر خطا دریافت کردید:

#### خطای "permission denied for schema public"
```sql
-- بررسی کنید که نقش فعلی دسترسی دارد
GRANT USAGE ON SCHEMA public TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
```

#### خطای "function already exists"
```sql
-- حذف دستی تابع
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
-- سپس دوباره اسکریپت را اجرا کنید
```

#### جداول نمایش داده نمی‌شوند
1. در SQL Editor این کوئری را اجرا کنید:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

2. اگر جداول خالی هستند، داده‌های نمونه را مجدداً insert کنید.

---

## 📞 پشتیبانی

اگر پس از اجرای مراحل همچنان مشکل داشتید:
1. اسکرین‌شات از خطا بگیرید
2. خروجی کوئری verification را بررسی کنید
3. لاگ‌های Vercel را چک کنید

---

**تاریخ ایجاد**: 2024
**نسخه**: 1.0

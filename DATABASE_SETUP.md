# 🚀 راهنمای راه‌اندازی پایگاه داده Supabase برای الماس سرام

## مشکل شناسایی‌شده
پس از استقرار روی Vercel، هیچ محصولی نمایش داده نمی‌شود و امکان افزودن محصول وجود ندارد. علت این است که **جداول پایگاه داده در Supabase ایجاد نشده‌اند**.

---

## ✅ راه‌حل سریع (۳ مرحله)

### مرحله ۱: ورود به پنل Supabase
1. به آدرس https://supabase.com وارد شوید
2. پروژه الماس سرام خود را انتخاب کنید
3. به بخش **SQL Editor** بروید (از منوی سمت چپ)

### مرحله ۲: اجرای فایل Schema
1. روی دکمه **"New Query"** کلیک کنید
2. محتوای کامل فایل `database-schema.sql` را کپی کرده و در ادیتور قرار دهید
3. روی دکمه **"Run"** کلیک کنید

### مرحله ۳: تأیید ایجاد جداول
پس از اجرای موفق، باید پیام زیر را ببینید:
```
✅ Database schema created successfully!
✅ All tables, indexes, triggers, and policies are ready!
✅ Sample data inserted for testing!
```

---

## 📋 جداول ایجادشده

پس از اجرای اسکریپت، جداول زیر در پایگاه داده شما ایجاد می‌شوند:

| نام جدول | توضیحات | تعداد رکورد پیش‌فرض |
|----------|---------|---------------------|
| `products` | محصولات کاشی و سرامیک | ۱ نمونه |
| `collections` | کالکشن‌های محصولات | ۱ نمونه |
| `portfolio` | پروژه‌ها و نمونه کارها | ۰ |
| `standards` | استانداردها و گواهینامه‌ها | ۰ |
| `contact_requests` | درخواست‌های تماس | ۰ |
| `inquiries` | استعلام‌های قیمت | ۰ |
| `homepage_content` | محتوای صفحه اصلی | ۳ بخش |
| `admin_users` | کاربران ادمین | ۰ |
| `activity_logs` | لاگ فعالیت‌ها | ۰ |

---

## 🔍 بررسی صحت عملکرد API

پس از ایجاد جداول، APIهای زیر باید کار کنند:

### تست API محصولات:
```bash
# دریافت لیست محصولات
GET https://your-project.vercel.app/api?route=products

# دریافت یک محصول خاص
GET https://your-project.vercel.app/api?route=products&id=1

# افزودن محصول جدید (نیاز به احراز هویت)
POST https://your-project.vercel.app/api?route=products
Body: { "code": "TEST-001", "title_fa": "محصول تست", "size": "80x80" }
```

### تست API کالکشن‌ها:
```bash
GET https://your-project.vercel.app/api?route=collections
```

---

## ⚙️ تنظیمات Environment Variables

مطمئن شوید متغیرهای زیر در **Vercel Environment Variables** تنظیم شده‌اند:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### نحوه دریافت کلیدها از Supabase:
1. به پنل Supabase بروید
2. پروژه خود را انتخاب کنید
3. به **Settings** → **API** بروید
4. مقادیر زیر را کپی کنید:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL` و `VITE_SUPABASE_URL`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (مخفی نگه دارید!)
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`

---

## 🧪 تست نهایی

پس از انجام مراحل بالا:

1. **صفحه اصلی** را باز کنید → باید محصولات نمونه را ببینید
2. **پنل ادمین** را باز کنید → باید بتوانید محصول جدید اضافه کنید
3. **پنل Supabase** را چک کنید → باید جداول را با داده‌ها ببینید

---

## ❌ رفع خطاهای رایج

### خطای "relation does not exist"
- علت: جداول ایجاد نشده‌اند
- راه‌حل: فایل `database-schema.sql` را اجرا کنید

### خطای "permission denied"
- علت: کلید Service Role تنظیم نشده است
- راه‌حل: متغیر `SUPABASE_SERVICE_ROLE_KEY` را در Vercel تنظیم کنید

### خطای "CORS error"
- علت: تنظیمات CORS در Supabase
- راه‌حل: در پنل Supabase به **Settings** → **API** → **Allowed Origins** بروید و دامنه Vercel خود را اضافه کنید

---

## 📞 پشتیبانی

در صورت بروز مشکل:
1. لاگ‌های Vercel را بررسی کنید (**Dashboard** → **Project** → **Deployments** → **View Logs**)
2. لاگ‌های Supabase را بررسی کنید (**Dashboard** → **Logs**)
3. مطمئن شوید تمام متغیرهای محیطی درست تنظیم شده‌اند

---

## 📝 نکات مهم

- ✅ فایل `database-schema.sql` فقط یک بار نیاز به اجرا دارد
- ✅ داده‌های نمونه (Sample Data) به صورت خودکار Insert می‌شوند
- ✅ Row Level Security (RLS) فعال است تا دسترسی‌ها کنترل شود
- ✅ ایندکس‌های لازم برای جستجوی سریع ایجاد شده‌اند
- ✅ Triggerهای auto-update برای فیلد `updated_at` تنظیم شده‌اند

---

**تهیه‌شده برای پروژه الماس سرام - ALMAS CERAM**

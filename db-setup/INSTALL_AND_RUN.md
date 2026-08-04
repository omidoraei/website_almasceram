# 🚀 دستورالعمل نصب و اجرای سریع

## مشکل فعلی
- ❌ هیچ محصولی در وبسایت نمایش داده نمی‌شود
- ❌ امکان افزودن محصول از پنل ادمین وجود ندارد
- ❌ در Supabase هیچ جدولی موجود نیست

## علت
پایگاه داده Supabase خالی است و جداول مورد نیاز ایجاد نشده‌اند.

---

## ✅ راه‌حل گام به گام

### گام ۱: ورود به Supabase (۳۰ ثانیه)
```
1. باز کردن https://supabase.com
2. لاگین با اکانت خود
3. انتخاب پروژه الماس سرام
```

### گام ۲: اجرای فایل SQL (۲ دقیقه)
```
1. کلیک روی "SQL Editor" از منوی سمت چپ
2. کلیک روی "New Query"
3. باز کردن فایل database-schema.sql از پروژه
4. کپی تمام محتوای فایل
5. پیست کردن در ادیتور SQL
6. کلیک روی دکمه "Run" یا فشار Ctrl+Enter
```

### گام ۳: تأیید موفقیت (۳۰ ثانیه)
باید پیام زیر را ببینید:
```
✅ Database schema created successfully!
✅ All tables, indexes, triggers, and policies are ready!
✅ Sample data inserted for testing!
```

و در بخش Table Editor جداول زیر را مشاهده کنید:
- products (۱ رکورد نمونه)
- collections (۱ رکورد نمونه)
- homepage_content (۳ رکورد)
- و سایر جداول...

### گام ۴: تست وبسایت (۱ دقیقه)
```
1. باز کردن وبسایت در Vercel
2. رفرش صفحه اصلی
3. باید محصولات نمونه را ببینید
4. ورود به پنل ادمین
5. تست افزودن محصول جدید
```

---

## 🧪 تست اختیاری با Node.js

اگر می‌خواهید اتصال را با اسکریپت تست کنید:

```bash
# رفتن به پوشه db-setup
cd db-setup

# نصب وابستگی‌ها
npm install

# کپی فایل .env.example به .env
cp .env.example .env

# ویرایش .env و وارد کردن کلیدهای Supabase
# NEXT_PUBLIC_SUPABASE_URL=...
# SUPABASE_SERVICE_ROLE_KEY=...

# اجرای تست
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

## ⚠️ رفع خطاهای رایج

### خطای "relation does not exist"
- جداول هنوز ایجاد نشده‌اند
- راه‌حل: گام ۲ را انجام دهید

### خطای "permission denied for table"
- کلید Service Role اشتباه است
- راه‌حل: از Settings → API کلید صحیح را کپی کنید

### خطای "Invalid API key"
- کلید API منقضی یا ناقص است
- راه‌حل: کلید کامل را از Supabase کپی کنید

### محصولات هنوز نمایش داده نمی‌شوند
- متغیرهای محیطی Vercel تنظیم نشده‌اند
- راه‌حل:
  1. به داشبورد Vercel بروید
  2. Project Settings → Environment Variables
  3. افزودن متغیرهای زیر:
     - NEXT_PUBLIC_SUPABASE_URL
     - SUPABASE_SERVICE_ROLE_KEY
     - VITE_SUPABASE_URL
     - VITE_SUPABASE_ANON_KEY
  4. Redeploy پروژه

---

## 📞 دریافت کمک بیشتر

- مطالعه فایل `QUICK_FIX.md` برای راهنمای فوری
- مطالعه فایل `DATABASE_SETUP.md` برای جزئیات کامل
- مطالعه فایل `db-setup/README.md` برای ابزارهای تست

---

**زمان کل مورد نیاز: حدود ۵ دقیقه**

-- ============================================================
-- الماس سرام - پایگاه داده تمیز و مهندسی شده (نسخه نهایی)
-- تاریخ: 2024
-- توضیحات: بازسازی کامل ساختار دیتابیس، امنیت RLS، و داده‌های نمونه
-- ============================================================

-- 1. پاکسازی ساختار قبلی (برای شروع تمیز)
-- توجه: این دستور تمام جداول و توابع قدیمی را حذف می‌کند.
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP TABLE IF EXISTS admin_logs CASCADE;
DROP TABLE IF EXISTS contact_requests CASCADE;
DROP TABLE IF EXISTS homepage_settings CASCADE;
DROP TABLE IF EXISTS portfolio_items CASCADE;
DROP TABLE IF EXISTS standards CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS collections CASCADE;
DROP TABLE IF EXISTS sliders CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;

-- ============================================================
-- 2. توابع کمکی (Helpers)
-- ============================================================

-- تابع امن برای آپدیت خودکار فیلد updated_at
-- رفع مشکل search_path با تعیین صریح مسیر
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = pg_catalog, public; -- حیاتی برای امنیت و عملکرد صحیح

-- ============================================================
-- 3. جداول اصلی (Core Tables)
-- ============================================================

-- جدول: تنظیمات کلی سایت (Site Settings)
-- نگهداری اطلاعاتی مثل لوگو، فوتر، شبکه‌های اجتماعی و متن‌های ثابت
CREATE TABLE public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL, -- مثلاً 'site_title', 'footer_phone'
    value TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول: اسلایدر صفحه اصلی (Sliders)
CREATE TABLE public.sliders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    image_url TEXT NOT NULL,
    link_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول: کالکشن‌ها / دسته‌بندی‌ها (Collections)
CREATE TABLE public.collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_fa VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول: محصولات (Products)
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collection_id UUID REFERENCES public.collections(id) ON DELETE SET NULL,
    name_fa VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    price DECIMAL(15, 0), -- قیمت به ریال
    discount_price DECIMAL(15, 0),
    width INTEGER, -- عرض سانتی‌متر
    length INTEGER, -- طول سانتی‌متر
    thickness INTEGER, -- ضخامت میلی‌متر
    material_type VARCHAR(100), -- مثلاً پرسلان، سرامیک معمولی
    surface_type VARCHAR(100), -- مثلاً پولیش، مات
    image_url TEXT,
    gallery_urls TEXT[], -- آرایه‌ای از تصاویر
    stock_quantity INTEGER DEFAULT 0,
    is_new BOOLEAN DEFAULT FALSE,
    is_best_seller BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول: استانداردها و گواهینامه‌ها (Standards)
CREATE TABLE public.standards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_fa VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    code VARCHAR(100), -- کد استاندارد (مثلاً ISO 9001)
    description TEXT,
    icon_url TEXT,
    certificate_url TEXT, -- لینک دانلود فایل گواهینامه
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول: نمونه کارها / پروژه‌های اجرا شده (Portfolio)
CREATE TABLE public.portfolio_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_name VARCHAR(255) NOT NULL,
    client_name VARCHAR(255),
    location VARCHAR(255), -- محل اجرا
    completion_year INTEGER,
    description TEXT,
    category VARCHAR(100), -- مثلاً مسکونی، تجاری، نما
    image_url TEXT,
    gallery_urls TEXT[],
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول: محتوای داینامیک صفحه اصلی (Homepage Content)
-- برای بخش‌هایی مثل "چرا ما"، "آمار و ارقام" و...
CREATE TABLE public.homepage_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key VARCHAR(100) UNIQUE NOT NULL, -- مثلاً 'why_us', 'stats'
    content_json JSONB NOT NULL, -- ذخیره انعطاف‌پذیر محتوا
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول: درخواست‌های تماس (Contact Requests)
CREATE TABLE public.contact_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new', -- new, read, replied, archived
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول: لاگ‌های مدیریت (Admin Logs)
-- برای ردیابی تغییرات حساس
CREATE TABLE public.admin_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email VARCHAR(255), -- ایمیل کاربر انجام دهنده (اگر لاگین بود)
    action_type VARCHAR(100) NOT NULL, -- CREATE, UPDATE, DELETE, LOGIN
    table_name VARCHAR(100),
    record_id UUID,
    details JSONB, -- جزئیات تغییرات
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. تریگرها (Triggers)
-- ============================================================

-- اعمال تریگر updated_at روی تمام جداول مربوطه
CREATE TRIGGER set_updated_at_site_settings BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_updated_at_sliders BEFORE UPDATE ON public.sliders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_updated_at_collections BEFORE UPDATE ON public.collections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_updated_at_products BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_updated_at_standards BEFORE UPDATE ON public.standards FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_updated_at_portfolio BEFORE UPDATE ON public.portfolio_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_updated_at_homepage BEFORE UPDATE ON public.homepage_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 5. امنیت و سطوح دسترسی (Row Level Security - RLS)
-- ============================================================

-- فعال‌سازی RLS برای تمام جداول
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sliders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- سیاست‌های عمومی (Public Read-Only)
-- همه کاربران (حتی بدون لاگین) می‌توانند داده‌ها را ببینند
CREATE POLICY "Public read access for site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public read access for sliders" ON public.sliders FOR SELECT USING (true);
CREATE POLICY "Public read access for collections" ON public.collections FOR SELECT USING (true);
CREATE POLICY "Public read access for products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public read access for standards" ON public.standards FOR SELECT USING (true);
CREATE POLICY "Public read access for portfolio" ON public.portfolio_items FOR SELECT USING (true);
CREATE POLICY "Public read access for homepage" ON public.homepage_settings FOR SELECT USING (true);

-- سیاست‌های ارسال فرم تماس (Public Insert Only)
-- کاربران می‌توانند پیام بفرستند اما نمی‌توانند پیام‌های دیگران را ببینند
CREATE POLICY "Public insert for contact_requests" ON public.contact_requests FOR INSERT WITH CHECK (true);
-- نکته امنیتی: معمولاً ادمین‌ها باید بتوانند لیست پیام‌ها را ببینند (در بخش ادمین هندل می‌شود)

-- سیاست‌های مدیریت (Admin Full Access)
-- فرض بر این است که نقش 'authenticated' یا یک نقش خاص مدیریتی وجود دارد.
-- در محیط Supabase، معمولاً از auth.role() = 'authenticated' استفاده می‌شود اما برای سادگی فعلاً
-- دسترسی کامل را به کاربران احراز هویت شده می‌دهیم.
-- اگر سیستم لاگین خاصی ندارید، این بخش را می‌توان موقتاً باز گذاشت یا با Service Role مدیریت کرد.

-- برای محیط توسعه (Development): اجازه دسترسی کامل به کاربران لاگین کرده
CREATE POLICY "Admin full access site_settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access sliders" ON public.sliders FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access collections" ON public.collections FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access products" ON public.products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access standards" ON public.standards FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access portfolio" ON public.portfolio_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access homepage" ON public.homepage_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin read contact_requests" ON public.contact_requests FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin read logs" ON public.admin_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- 6. داده‌های نمونه (Seed Data)
-- ============================================================

-- الف) تنظیمات سایت
INSERT INTO public.site_settings (key, value, description) VALUES
('site_title', 'الماس سرام | کیفیت و زیبایی ماندگار', 'عنوان اصلی سایت در تب مرورگر'),
('site_description', 'تولید کننده برتر کاشی و سرامیک در ایران با تکنولوژی روز دنیا', 'توضیحات متا برای سئو'),
('footer_phone', '021-88888888', 'شماره تماس در فوتر'),
('footer_address', 'تهران، خیابان ولیعصر، برج الماس، طبقه 10', 'آدرس در فوتر'),
('social_instagram', 'https://instagram.com/elmas_ceramic', 'لینک اینستاگرام'),
('social_linkedin', 'https://linkedin.com/company/elmas-ceramic', 'لینک لینکدین');

-- ب) اسلایدرها
INSERT INTO public.sliders (title, subtitle, image_url, link_url, display_order, is_active) VALUES
('کلکسیون جدید 2024', 'ترکیبی از هنر و مهندسی', '/images/slider1.jpg', '/collections/new-arrival', 1, true),
('سرامیک‌های اسلب بزرگ', 'مناسب برای فضاهای لوکس و مدرن', '/images/slider2.jpg', '/products/slabs', 2, true),
('تخفیف ویژه پروژه‌ای', 'مشاوره رایگان برای انبوه سازان', '/images/slider3.jpg', '/contact', 3, true);

-- ج) کالکشن‌ها
INSERT INTO public.collections (name_fa, name_en, slug, description, display_order, is_featured) VALUES
('سرامیک کف', 'Floor Ceramics', 'floor-ceramics', 'مقاوم‌ترین سرامیک‌ها برای کف‌پوش منازل و فضاهای تجاری', 1, true),
('کاشی دیوار', 'Wall Tiles', 'wall-tiles', 'تنوع بی‌نظیر طرح و رنگ برای دیوارپوش آشپزخانه و سرویس', 2, true),
('اسلب‌های بزرگ', 'Large Slabs', 'large-slabs', 'ابعاد بزرگ، درز کمتر، شکوه بیشتر', 3, true),
('موزاییک و دکور', 'Mosaics & Decors', 'mosaics', 'جزئیات زیبا برای تکمیل طراحی داخلی شما', 4, false);

-- د) محصولات (همراه با داده‌های کامل فنی)
INSERT INTO public.products (collection_id, name_fa, name_en, slug, description, price, width, length, thickness, material_type, surface_type, is_new, is_best_seller)
SELECT 
    c.id,
    p.name_fa,
    p.name_en,
    p.slug,
    p.description,
    p.price,
    p.width,
    p.length,
    p.thickness,
    p.material_type,
    p.surface_type,
    p.is_new,
    p.is_best_seller
FROM public.collections c
CROSS JOIN (VALUES
    ('کاشی گرانیت مروارید', 'Pearl Granite Tile', 'pearl-granite', 'طرحی کلاسیک با درخشندگی فوق‌العاده مناسب برای پذیرایی', 450000, 60, 60, 10, 'پرسلان', 'پولیش', true, true),
    ('سرامیک چوبی بلوط', 'Oak Wood Ceramic', 'oak-wood', 'زیبایی چوب طبیعی با مقاومت سرامیک، ضد آب و خش', 620000, 20, 120, 9, 'پرسلان', 'مات', true, false),
    ('اسلب مرمر سفید', 'White Marble Slab', 'white-marble-slab', 'شبیه‌سازی دقیق مرمر کارارا با ابعاد بزرگ', 1200000, 120, 240, 12, 'پرسلان', 'پولیش', false, true),
    ('کاشی حمام آبی فیروزه‌ای', 'Turquoise Bath Tile', 'turquoise-bath', 'رنگی آرامش‌بخش برای فضای شخصی شما', 180000, 30, 60, 8, 'سرامیک', 'براق', false, false)
) AS p(name_fa, name_en, slug, description, price, width, length, thickness, material_type, surface_type, is_new, is_best_seller)
WHERE c.slug = CASE 
    WHEN p.slug IN ('pearl-granite', 'white-marble-slab') THEN 'floor-ceramics'
    WHEN p.slug = 'oak-wood' THEN 'large-slabs' -- فرض بر استفاده در کف
    ELSE 'wall-tiles'
END;

-- هـ) استانداردها
INSERT INTO public.standards (title_fa, title_en, code, description) VALUES
('استاندارد ملی ایران', 'Iran National Standard', 'ISIRI-2726', 'رعایت کامل استانداردهای جذب آب و مقاومت خمشی'),
('گواهینامه ایزو 9001', 'ISO 9001 Certified', 'ISO-9001-2015', 'سیستم مدیریت کیفیت پیشرفته در خط تولید'),
('نشان استاندارد اروپا', 'CE Marking', 'CE-EN-14411', 'تاییدیه صادرات به کشورهای اتحادیه اروپا');

-- و) نمونه کارها
INSERT INTO public.portfolio_items (project_name, client_name, location, completion_year, description, category) VALUES
('برج تجاری الماس', 'گروه ساختمانی آسیا', 'تهران، جردن', 1402, 'اجرای نمای رومی با سرامیک‌های اختصاصی الماس در 20 طبقه', 'تجاری'),
('ویلا مدرن لواسان', 'مهندس کریمی', 'لواسان', 1401, 'کف‌پوش سالن اصلی و سرویس‌های بهداشتی با طرح اسلب', 'مسکونی'),
('هتل 5 ستاره کیش', 'سرمایه‌گذاری خلیج فارس', 'کیش', 1400, 'تامین و اجرای 5000 متر مربع سرامیک ضد لغزش برای لابی و استخر', 'هتلداری');

-- ز) محتوای صفحه اصلی (بخش آمار)
INSERT INTO public.homepage_settings (section_key, content_json) VALUES
('stats', '{
    "years_experience": 15,
    "projects_completed": 350,
    "happy_customers": 1200,
    "annual_production_sqm": 5000000
}'::jsonb),
('why_us', '{
    "items": [
        {"title": "تکنولوژی ایتالیایی", "desc": "دستگاه‌های تمام اتوماتیک Sacmi"},
        {"title": "ضمانت بازگشت وجه", "desc": "در صورت عدم تطابق کیفیت"},
        {"title": "ارسال سریع", "desc": "به سراسر کشور در کمتر از 72 ساعت"}
    ]
}'::jsonb);

-- ============================================================
-- پایان اسکریپت
-- ============================================================

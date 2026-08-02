export interface ReActApproach {
  optionNumber: number;
  titleFa: string;
  titleEn: string;
  thought: string;
  action: string;
  observation: string;
  pros: string[];
  cons: string[];
  phase2Readiness: string;
}

export const REACT_APPROACHES: ReActApproach[] = [
  {
    optionNumber: 1,
    titleFa: "گزینه ۱: Next.js با SSG + فایل‌های JSON/YAML محلی و API Routes داخلی",
    titleEn: "Static Site Generation (SSG) with local JSON/YAML + Next.js API Routes",
    thought: "در این رویکرد، در زمان Build تمام صفحات کاتالوگ محصولات بر اساس فایل‌های JSON خروجی گرفته می‌شوند. این روش بالاترین سرعت بارگذاری (100 در Lighthouse) و صفر بودن هزینه سرور را تضمین می‌کند. اما سوال اصلی این است: آیا برای فاز ۲ (پنل ادمین) مناسب است؟",
    action: "پیاده‌سازی getStaticProps و getStaticPaths در Next.js صفحات تمام محصولات و کالکشن‌ها را در زمان Build تولید می‌کند. داده‌ها در فایل‌های JSON در سورس کد نگهداری می‌شوند.",
    observation: "برای فاز ۱ فوق‌العاده سریع و ساده است، اما فاز ۲ (پنل مدیریت) با چالش روبرو می‌شود؛ زیرا هر تغییر محصول توسط مدیر سیستم نیازمند Rebuild کل پروژه یا تریگر کردن Git Commit خواهد بود. بنابراین این گزینه انعطاف‌پذیری لازم برای فاز ۲ را ندارد.",
    pros: ["سرعت فوق‌العاده (Zero TTFB)", "سئو (SEO) کامل و بهینه‌شده برای موتورهای جستجو", "عدم نیاز به دیتابیس در فاز ۱"],
    cons: ["دشواری اتصال پنل ادمین دینامیک در فاز ۲", "نیاز به CI/CD Rebuild با هر تغییر قیمت یا محصول"],
    phase2Readiness: "ضعیف (نیازمند Refactor برای اتصال دیتابیس در فاز ۲)"
  },
  {
    optionNumber: 2,
    titleFa: "گزینه ۲: Next.js با ISR (Incremental Static Regeneration) + لایه Backend Node.js و PostgreSQL/Supabase",
    titleEn: "Next.js ISR + Node.js Backend with PostgreSQL/Supabase DB",
    thought: "تلفیق قدرت SSG با قابلیت بروزرسانی دینامیک! در این مدل، صفحات محصول به‌صورت استاتیک 캐ش می‌شوند، اما با قابلیت revalidate در بازه‌های زمانی مشخص یا On-Demand Revalidation هنگام ویرایش محصول در پنل ادمین.",
    action: "ایجاد سرویس‌های Node.js برای اتصال به دیتابیس PostgreSQL (از طریق Supabase / ORM). صفحات Next.js از revalidate: 60 استفاده می‌کنند. در فاز ۲، پنل ادمین مستقیماً به همان دیتابیس متصل شده و تریگر On-Demand Revalidation خروجی فرانت‌اند را بلافاصله بروز می‌کند.",
    observation: "بهترین تعادل میان سرعت عالی رندرینگ (سئو قدرتمند) و آماده‌سازی ساختاری کامل برای فاز ۲. بدون نیاز به تغییر در معماری فرانت‌اند در فازهای بعدی.",
    pros: ["کارایی و سئوی بی‌نظیر (SSG Speed)", "بروزرسانی زنده داده‌ها بدون Rebuild کل سایت", "آمادگی ۱۰۰٪ برای افزودن پنل مدیریت فاز ۲"],
    cons: ["نیازمند پیکربندی لایه Caching و Revalidation در Vercel/Next.js"],
    phase2Readiness: "عالی (بدون نیاز به بازنویسی کد در فاز ۲)"
  },
  {
    optionNumber: 3,
    titleFa: "گزینه ۳: معماری Headless کامل با Next.js React SPA/SSR + سرویس مجزای Node.js/Express API",
    titleEn: "Decoupled Headless Architecture (Next.js Frontend + Independent Node.js REST API)",
    thought: "جداسازی کاملاً مستقل فرانت‌اند از بک‌اند. بک‌اند یک Express/Node.js API سرویس‌دهنده استاندارد RESTful یا GraphQL است و Next.js صرفاً یک لایه Consumer فرانت‌اند محسوب می‌شود.",
    action: "توسعه دو مخزن جداگانه یا Monorepo (apps/web و apps/api). طراحی کامل API Endpoints همراه با Swagger/OpenAPI Spec برای احراز هویت، CRUD محصولات، و مدیریت فایل‌ها.",
    observation: "معماری بسیار سازمان‌یافته برای تیم‌های بزرگ یا پروژه‌های سازمانی. در فاز ۲ پنل ادمین می‌تواند به‌عنوان یک اپلیکیشن React/Next.js جدید به همین REST API متصل شود. تنها عیب آن مقداری پیچیدگی اضافه در پیکربندی و دپلوی دو سرویس مجزا در فاز ۱ است.",
    pros: ["استقلال کامل لایه‌ها", "قابلیت بازاستفاده API برای اپ موبایل یا پنل ادمین جداگانه", "امنیت بالا و مقیاس‌پذیری مستقل"],
    cons: ["پیچیدگی دپلوی دو سرویس مجزا در فاز ۱"],
    phase2Readiness: "فوق‌العاده عالی (معماری سازمانی)"
  },
  {
    optionNumber: 4,
    titleFa: "گزینه ۴ (برگزیده معماری): معماری مدرن Hybrid Next.js / Serverless Node.js Layer با Supabase Backend",
    titleEn: "Modern Hybrid Serverless Architecture with Supabase Persistence & Unified API Layer",
    thought: "ترکیب هوشمندانه بهترین ویژگی‌های گزینه‌های ۲ و ۳: یکپارچه‌سازی لایه REST API در سرویس‌های Node.js Serverless (api/routes)، دیتابیس واقعی PostgreSQL با لایه RLS جهت امنیت، و فرانت‌اند Next.js/React با قابلیت رندر سریع، خپش‌بینی ساختار برای پنل مدیریت بدون پیچیدگی Infra اضافی.",
    action: "پیاده‌سازی لایه API در پوشه api/ شامل routeهای استاندارد JSON، دیتابیس Supabase با جداول محصولات، کالکشن‌ها، و استعلام‌ها. فرانت‌اند با قابلیت SSR/Client Data Fetching پیشرفته به API متصل می‌شود.",
    observation: "این رویکرد ساختار پروژه را از همین فاز ۱ کاملاً منسجم نگه می‌دارد و اضافه کردن پنل ادمین (فاز ۲) و فروشگاه آنلاین/چندزبانگی (فاز ۳) را بدون هیچ نیازی به Refactor زیرساخت امکان‌پذیر می‌سازد.",
    pros: ["سرعت توسعه بسیار بالا در فاز ۱", "دیتابیس واقعی و ساختاریافته از روز اول", "هزینه نگهداری کم و دپلوی آسان روی Vercel/Supabase"],
    cons: ["نیازمند رعایت استاندارد RLS برای امنیت دیتابیس در فاز ۲"],
    phase2Readiness: "کاملاً آماده و عملیاتی (۱۰/۱۰)"
  }
];

export const TECHNICAL_DATA_MODEL_DOC = `
=====================================================
📐 Data Model Architecture (ALMAS CERAM Tile Specifications)
=====================================================

1. Table: collections
   - id: serial primary key
   - code: varchar(50) unique (e.g. 'MARBLE_ROYAL', 'CONCRETE_URBAN')
   - name_fa: varchar(255)
   - name_en: varchar(255)
   - tagline: text
   - image_url: text
   - available_sizes: jsonb (array of sizes: ['60x120', '80x80', '100x100'])

2. Table: products
   - id: serial primary key
   - code: varchar(50) unique (e.g. 'ALM-60120-ONYX01')
   - title_fa: varchar(255) (e.g. 'کاشی پرسلان اونیکس رویال پولیش')
   - title_en: varchar(255) (e.g. 'Onyx Royal Porcelain Tile')
   - collection_code: varchar(50) references collections(code)
   - collection_name: varchar(255)
   - size: varchar(20) CHECK (size IN ('30x30', '40x40', '60x60', '60x120', '80x80', '100x100', '30x90'))
   - surface_finish: varchar(100) (Matt, Polished, Carving, Sugar, Glossy, Lappato)
   - body_type: varchar(100) (Full Body Porcelain, Glazed Porcelain, White Body)
   - faces_count: integer (1 to 16 face variations)
   - thickness_mm: numeric(4,1) (e.g., 9.5, 10.0, 11.5, 12.0)
   - water_absorption: varchar(50) (e.g., '< 0.1% E≤0.5% ISO 10545-3')
   - rectified: boolean (Laser Cut / Rectified joint)
   - applications: jsonb (['Floor', 'Wall', 'Facade', 'Indoor', 'Outdoor', 'Wet Areas'])
   - color_family: varchar(100) ('White/Marble', 'Gray/Concrete', 'Beige/Cream', 'Dark/Onyx', 'Wood')
   - image_url: text (Primary render image)
   - face_images: jsonb (Array of face texture images for face randomness simulator)
   - ambiance_images: jsonb (Array of interior design ambiance renders)
   - description: text
   - featured: boolean default false
   - created_at: timestamptz default now()

3. Table: inquiries (Phase 1 & Phase 2 Ready)
   - id: serial primary key
   - customer_name: varchar(255) not null
   - phone: varchar(50) not null
   - company: varchar(255)
   - email: varchar(255)
   - items: jsonb (array of { productId, code, title, size, quantitySqm })
   - notes: text
   - status: varchar(50) default 'pending' ('pending', 'contacted', 'completed')
   - created_at: timestamptz default now()
`;

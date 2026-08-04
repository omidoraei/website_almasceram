-- =====================================================
-- ALMAS CERAM - Complete Database Schema
-- Created for Vercel + Supabase Deployment
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. PRODUCTS TABLE (جدول محصولات)
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    title_fa VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    title_ar VARCHAR(255),
    collection_code VARCHAR(100),
    collection_name_fa VARCHAR(255),
    collection_name_en VARCHAR(255),
    size VARCHAR(20) NOT NULL CHECK (size IN ('30x30', '40x40', '60x60', '60x120', '80x80', '100x100', '30x90')),
    surface_finish VARCHAR(100),
    body_type VARCHAR(100),
    thickness DECIMAL(5,2),
    faces_count INTEGER DEFAULT 1,
    main_image_url TEXT,
    face_images JSONB DEFAULT '[]'::jsonb,
    layout_images JSONB DEFAULT '[]'::jsonb,
    technical_specs JSONB,
    featured BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster searches
CREATE INDEX IF NOT EXISTS idx_products_code ON products(code);
CREATE INDEX IF NOT EXISTS idx_products_collection ON products(collection_code);
CREATE INDEX IF NOT EXISTS idx_products_size ON products(size);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_products_title_fa ON products USING gin(title_fa gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_title_en ON products USING gin(title_en gin_trgm_ops);

-- =====================================================
-- 2. COLLECTIONS TABLE (جدول کالکشن‌ها)
-- =====================================================
CREATE TABLE IF NOT EXISTS collections (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(100) UNIQUE NOT NULL,
    name_fa VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    name_ar VARCHAR(255),
    description_fa TEXT,
    description_en TEXT,
    description_ar TEXT,
    cover_image_url TEXT,
    product_count INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_collections_code ON collections(code);
CREATE INDEX IF NOT EXISTS idx_collections_featured ON collections(featured);

-- =====================================================
-- 3. PORTFOLIO TABLE (جدول پروژه‌ها/نمونه کارها)
-- =====================================================
CREATE TABLE IF NOT EXISTS portfolio (
    id BIGSERIAL PRIMARY KEY,
    title_fa VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    title_ar VARCHAR(255),
    description_fa TEXT,
    description_en TEXT,
    description_ar TEXT,
    location_fa VARCHAR(255),
    location_en VARCHAR(255),
    project_year INTEGER,
    area_sqm DECIMAL(10,2),
    images JSONB DEFAULT '[]'::jsonb,
    products_used JSONB DEFAULT '[]'::jsonb,
    featured BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_portfolio_featured ON portfolio(featured);
CREATE INDEX IF NOT EXISTS idx_portfolio_active ON portfolio(active);

-- =====================================================
-- 4. STANDARDS TABLE (جدول استانداردها و گواهینامه‌ها)
-- =====================================================
CREATE TABLE IF NOT EXISTS standards (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    title_fa VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    title_ar VARCHAR(255),
    description_fa TEXT,
    description_en TEXT,
    description_ar TEXT,
    icon_url TEXT,
    certificate_url TEXT,
    active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. CONTACT_REQUESTS TABLE (جدول درخواست‌های تماس)
-- =====================================================
CREATE TABLE IF NOT EXISTS contact_requests (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    country VARCHAR(100),
    message TEXT,
    interest_type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'resolved', 'archived')),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_requests_status ON contact_requests(status);
CREATE INDEX IF NOT EXISTS idx_contact_requests_created ON contact_requests(created_at DESC);

-- =====================================================
-- 6. INQUIRIES TABLE (جدول استعلام‌های قیمت)
-- =====================================================
CREATE TABLE IF NOT EXISTS inquiries (
    id BIGSERIAL PRIMARY KEY,
    reference_code VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255),
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    company_name VARCHAR(255),
    country VARCHAR(100),
    items JSONB DEFAULT '[]'::jsonb,
    total_items INTEGER DEFAULT 0,
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'quoted', 'completed', 'cancelled')),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_reference ON inquiries(reference_code);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created ON inquiries(created_at DESC);

-- =====================================================
-- 7. HOMEPAGE_CONTENT TABLE (مدیریت محتوای صفحه اصلی)
-- =====================================================
CREATE TABLE IF NOT EXISTS homepage_content (
    id BIGSERIAL PRIMARY KEY,
    section_key VARCHAR(100) UNIQUE NOT NULL,
    content_fa JSONB,
    content_en JSONB,
    content_ar JSONB,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default homepage sections
INSERT INTO homepage_content (section_key, content_fa, content_en, content_ar, is_active, sort_order) VALUES
    ('hero', 
     '{"title": "الماس سرام", "subtitle": "پیشرو در تولید کاشی و سرامیک پرسلان", "cta_text": "مشاهده محصولات"}'::jsonb,
     '{"title": "Almas Ceram", "subtitle": "Leader in Porcelain Tile Production", "cta_text": "View Products"}'::jsonb,
     '{"title": "الماس سيراميك", "subtitle": "رائد في إنتاج البلاط والخزف الصيني", "cta_text": "عرض المنتجات"}'::jsonb,
     true, 1),
    ('about', 
     '{"title": "درباره ما", "description": "شرکت الماس سرام با سال‌ها تجربه در صنعت کاشی و سرامیک"}'::jsonb,
     '{"title": "About Us", "description": "Almas Ceram Company with years of experience in tile industry"}'::jsonb,
     '{"title": "من نحن", "description": "شركة الماس سيراميك مع سنوات من الخبرة في صناعة البلاط"}'::jsonb,
     true, 2),
    ('features', 
     '{"items": []}'::jsonb,
     '{"items": []}'::jsonb,
     '{"items": []}'::jsonb,
     true, 3);

-- =====================================================
-- 8. ADMIN_USERS TABLE (جدول کاربران ادمین - اختیاری)
-- =====================================================
CREATE TABLE IF NOT EXISTS admin_users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'editor', 'viewer')),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 9. ACTIVITY_LOGS TABLE (جدول لاگ فعالیت‌ها)
-- =====================================================
CREATE TABLE IF NOT EXISTS activity_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id BIGINT,
    old_value JSONB,
    new_value JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs(created_at DESC);

-- =====================================================
-- ENABLE TRIGRAM EXTENSION FOR SEARCH
-- =====================================================
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- =====================================================
-- CREATE FUNCTION FOR UPDATED_AT TIMESTAMP
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ADD TRIGGERS FOR AUTO-UPDATE
-- =====================================================
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON collections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolio_updated_at BEFORE UPDATE ON portfolio
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_standards_updated_at BEFORE UPDATE ON standards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_requests_updated_at BEFORE UPDATE ON contact_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON inquiries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_homepage_content_updated_at BEFORE UPDATE ON homepage_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) - Optional but Recommended
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (adjust as needed)
CREATE POLICY "Public can view products" ON products FOR SELECT USING (active = true);
CREATE POLICY "Public can view collections" ON collections FOR SELECT USING (active = true);
CREATE POLICY "Public can view portfolio" ON portfolio FOR SELECT USING (active = true);
CREATE POLICY "Public can view standards" ON standards FOR SELECT USING (active = true);
CREATE POLICY "Public can view homepage content" ON homepage_content FOR SELECT USING (is_active = true);

-- Policy for inserting contact requests
CREATE POLICY "Anyone can create contact requests" ON contact_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create inquiries" ON inquiries FOR INSERT WITH CHECK (true);

-- =====================================================
-- SAMPLE DATA (اختیاری - برای تست)
-- =====================================================

-- Insert a sample collection
INSERT INTO collections (code, name_fa, name_en, name_ar, description_fa, featured, active, sort_order) VALUES
    ('MARBLE-SERIES', 'سری مرمر', 'Marble Series', 'سلسلة الرخام', 'کالکشن لوکس طرح مرمر طبیعی', true, true, 1)
ON CONFLICT (code) DO NOTHING;

-- Insert a sample product
INSERT INTO products (code, title_fa, title_en, title_ar, collection_code, collection_name_fa, size, surface_finish, body_type, thickness, faces_count, featured, active, sort_order) VALUES
    ('ALM-001', 'پرسلان مرمر سفید', 'White Marble Porcelain', 'بورسلين رخام أبيض', 'MARBLE-SERIES', 'سری مرمر', '80x80', 'Polished', 'Full Body', 9.0, 4, true, true, 1)
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================
-- ✅ Database schema created successfully!
-- ✅ All tables, indexes, triggers, and policies are ready!
-- ✅ Sample data inserted for testing!

-- ============================================
-- Supabase Schema Fixed for Almas Ceram
-- ============================================
-- This script fixes the search_path issue in update_updated_at_column function
-- and creates all necessary tables with proper RLS policies
-- ============================================

-- Drop existing function if exists (to recreate with fixed search_path)
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- ============================================
-- FIXED FUNCTION: update_updated_at_column
-- ============================================
-- The key fix: SET search_path = pg_catalog, public
-- This ensures deterministic object resolution regardless of caller context
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = pg_catalog, public;  -- 🔧 CRITICAL FIX: Fixed search_path

-- ============================================
-- TABLES
-- ============================================

-- 1. Collections Table
CREATE TABLE IF NOT EXISTS public.collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_fa VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    description_fa TEXT,
    description_en TEXT,
    slug VARCHAR(255) UNIQUE NOT NULL,
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collection_id UUID REFERENCES public.collections(id) ON DELETE SET NULL,
    name_fa VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    description_fa TEXT,
    description_en TEXT,
    sku VARCHAR(100) UNIQUE,
    price DECIMAL(15, 2),
    currency VARCHAR(10) DEFAULT 'IRR',
    stock_quantity INTEGER DEFAULT 0,
    images TEXT[],
    specifications JSONB DEFAULT '{}',
    slug VARCHAR(255) UNIQUE NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Portfolio Items Table
CREATE TABLE IF NOT EXISTS public.portfolio_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_fa VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    description_fa TEXT,
    description_en TEXT,
    project_date DATE,
    client_name VARCHAR(255),
    location VARCHAR(255),
    area_sqm DECIMAL(10, 2),
    images TEXT[],
    category VARCHAR(100),
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Standards Table
CREATE TABLE IF NOT EXISTS public.standards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_fa VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    description_fa TEXT,
    description_en TEXT,
    logo_url TEXT,
    certification_body VARCHAR(255),
    valid_until DATE,
    certificate_number VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Homepage Content Table
CREATE TABLE IF NOT EXISTS public.homepage_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key VARCHAR(100) UNIQUE NOT NULL,
    content_fa JSONB DEFAULT '{}',
    content_en JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Contact Requests Table
CREATE TABLE IF NOT EXISTS public.contact_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    inquiry_type VARCHAR(100),
    is_read BOOLEAN DEFAULT false,
    replied_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Admin Logs Table
CREATE TABLE IF NOT EXISTS public.admin_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TRIGGERS FOR updated_at
-- ============================================

CREATE TRIGGER update_collections_updated_at
    BEFORE UPDATE ON public.collections
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolio_items_updated_at
    BEFORE UPDATE ON public.portfolio_items
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_standards_updated_at
    BEFORE UPDATE ON public.standards
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_homepage_content_updated_at
    BEFORE UPDATE ON public.homepage_content
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
-- Note: For development, these policies are permissive.
-- For production, you should implement proper authentication checks.

-- Enable RLS on all tables
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- Development policies (allow all operations)
-- Replace these with proper auth policies in production

CREATE POLICY "Allow all operations on collections (dev)" 
    ON public.collections 
    FOR ALL 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Allow all operations on products (dev)" 
    ON public.products 
    FOR ALL 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Allow all operations on portfolio_items (dev)" 
    ON public.portfolio_items 
    FOR ALL 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Allow all operations on standards (dev)" 
    ON public.standards 
    FOR ALL 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Allow all operations on homepage_content (dev)" 
    ON public.homepage_content 
    FOR ALL 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Allow all operations on contact_requests (dev)" 
    ON public.contact_requests 
    FOR ALL 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Allow all operations on admin_logs (dev)" 
    ON public.admin_logs 
    FOR ALL 
    USING (true) 
    WITH CHECK (true);

-- ============================================
-- SAMPLE DATA
-- ============================================

-- Sample Collection
INSERT INTO public.collections (name_fa, name_en, slug, description_fa, display_order) VALUES
('سرامیک پرسلان', 'Porcelain Ceramics', 'porcelain-ceramics', 'مجموعه سرامیک‌های پرسلان با کیفیت عالی', 1),
('کاشی دکوراتیو', 'Decorative Tiles', 'decorative-tiles', 'کاشی‌های دکوراتیو برای فضاهای مدرن', 2)
ON CONFLICT (slug) DO NOTHING;

-- Sample Product
INSERT INTO public.products (name_fa, name_en, slug, description_fa, price, is_featured, is_active) VALUES
('سرامیک پرسلان سفید', 'White Porcelain Ceramic', 'white-porcelain-ceramic', 'سرامیک پرسلان سفید با ابعاد 60x60', 850000, true, true)
ON CONFLICT (slug) DO NOTHING;

-- Sample Homepage Content
INSERT INTO public.homepage_content (section_key, content_fa, content_en) VALUES
('hero_section', '{"title": "الماس سرام", "subtitle": "پیشرو در صنعت سرامیک"}', '{"title": "Almas Ceram", "subtitle": "Leader in Ceramic Industry"}')
ON CONFLICT (section_key) DO NOTHING;

-- ============================================
-- VERIFICATION QUERY
-- ============================================
-- Run this to verify the function has the correct search_path
-- SELECT proname, prosrc, proconfig FROM pg_proc WHERE proname = 'update_updated_at_column';

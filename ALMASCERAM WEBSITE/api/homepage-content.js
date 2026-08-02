import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('homepage_content')
        .select('*')
        .eq('id', 1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      // Default fallback
      const defaultContent = {
        id: 1,
        hero_subtitle: 'مجموعه پرسلان‌های لوکس معمارانه ۲۰۲۵ - ۲۰۲۶',
        hero_title: 'درخشش بی‌بدیل در کاتالوگ رسمی الماس سرام',
        hero_description: 'تولیدکننده پرسلان‌های اسلب، فول‌بادی و لعاب‌دار لوکس نمای ساختمان، سالن و دیوارهای داخلی در سایزهای استاندارد بین‌المللی همراه با تنوع فیس‌های طبیعی.',
        hero_image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
        about_title: 'تلفیق فناوری روز ایتالیا با هنر و اصالت تولید پرسلان ایرانی',
        about_description: 'شرکت کاشی و سرامیک الماس سرام با بهره‌گیری از خطوط تولید مدرن ایتالیایی و پرس‌های پیشرفته اسلب، انواع کاشی‌های پرسلان فول‌بادی و لعاب‌دار لوکس را مطابق با سخت‌گیرانه‌ترین استانداردهای بین‌المللی تولید می‌نماید.',
        cta_title: 'آماده مشاوره و دریافت پیش‌فاکتور رسمی پروژه‌تان هستید؟',
        cta_description: 'کارشناسان فنی الماس سرام آماده ارائه مشاوره انتخاب سایز، محاسبه دقیق متراژ و ارسال نمونه کاشی به سراسر کشور هستند.',
        cta_button_text: 'ثبت فرم درخواست استعلام و دریافت کاتالوگ',
        featured_product_ids: [1, 2, 3]
      };

      return res.status(200).json(data || defaultContent);
    }

    if (req.method === 'PUT') {
      const updates = req.body;

      // Sanitize text inputs
      if (updates.hero_title) updates.hero_title = updates.hero_title.replace(/[<>]/g, '');
      if (updates.hero_description) updates.hero_description = updates.hero_description.replace(/[<>]/g, '');
      if (updates.about_title) updates.about_title = updates.about_title.replace(/[<>]/g, '');
      if (updates.about_description) updates.about_description = updates.about_description.replace(/[<>]/g, '');

      const { data, error } = await supabase
        .from('homepage_content')
        .upsert({ id: 1, ...updates })
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error in homepage-content.js:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

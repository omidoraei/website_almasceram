import supabase from './db-client.js';

// Security Headers Helper
function applySecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
}

// Rate Limiter Map
const rateLimitMap = new Map();

function checkRateLimit(req, res, maxRequests = 15, windowMs = 15000) {
  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  const now = Date.now();
  const clientData = rateLimitMap.get(clientIp) || { count: 0, firstRequest: now };

  if (now - clientData.firstRequest > windowMs) {
    rateLimitMap.set(clientIp, { count: 1, firstRequest: now });
    return false;
  }

  clientData.count += 1;
  rateLimitMap.set(clientIp, clientData);

  if (clientData.count > maxRequests) {
    res.status(429).json({ error: 'تعداد درخواست‌های بیش از حد مجاز. لطفاً ۱۵ ثانیه صبر کرده و مجدداً تلاش نمایید.', code: 'RATE_LIMIT_EXCEEDED' });
    return true;
  }

  return false;
}

// Allowed Sizes Constant
const ALLOWED_SIZES = ['30x30', '40x40', '60x60', '60x120', '80x80', '100x100', '30x90'];

// Main Handler
export default async function handler(req, res) {
  // Apply CORS and Security Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  applySecurityHeaders(res);

  if (req.method === 'OPTIONS') return res.status(204).end();

  // Extract route from query or body
  const route = req.query?.route || req.body?.route || '';

  try {
    // ==================== PRODUCTS API ====================
    if (route === 'products') {
      if (req.method === 'GET') {
        const { search, size, finish, body, collection, featured, limit, id } = req.query;

        if (id) {
          const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
          if (error) throw error;
          return res.status(200).json(data);
        }

        let query = supabase.from('products').select('*');
        if (featured === 'true') query = query.eq('featured', true);
        if (collection) query = query.eq('collection_code', collection);
        if (size) {
          const sizes = size.split(',').map(s => s.trim()).filter(s => ALLOWED_SIZES.includes(s));
          if (sizes.length > 0) query = query.in('size', sizes);
        }
        if (finish) query = query.in('surface_finish', finish.split(',').map(f => f.trim()));
        if (body) query = query.eq('body_type', body);
        if (search) {
          const cleanSearch = search.replace(/[%_]/g, '');
          query = query.or(`title_fa.ilike.%${cleanSearch}%,title_en.ilike.%${cleanSearch}%,code.ilike.%${cleanSearch}%,collection_name.ilike.%${cleanSearch}%`);
        }
        query = query.order('id', { ascending: false });
        if (limit) {
          const parsedLimit = parseInt(limit, 10);
          if (!isNaN(parsedLimit) && parsedLimit > 0) query = query.limit(parsedLimit);
        }

        const { data, error } = await query;
        if (error) throw error;
        return res.status(200).json(data || []);
      }

      if (req.method === 'POST') {
        const productData = req.body;
        if (!productData.title_fa || !productData.code || !productData.size) {
          return res.status(400).json({ error: 'نام محصول، کد کالا و سایز الزامی هستند.' });
        }
        if (!ALLOWED_SIZES.includes(productData.size)) {
          return res.status(400).json({ error: 'سایز وارد شده معتبر نیست. سایزهای مجاز: ' + ALLOWED_SIZES.join(', ') });
        }
        const { data, error } = await supabase.from('products').insert([productData]).select().single();
        if (error) throw error;
        return res.status(201).json(data);
      }

      if (req.method === 'PUT') {
        const { id, ...updates } = req.body;
        if (!id) return res.status(400).json({ error: 'شناسه محصول الزامی است' });
        if (updates.size && !ALLOWED_SIZES.includes(updates.size)) {
          return res.status(400).json({ error: 'سایز وارد شده معتبر نیست.' });
        }
        const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single();
        if (error) throw error;
        return res.status(200).json(data);
      }

      if (req.method === 'DELETE') {
        const id = req.query.id || req.body.id;
        if (!id) return res.status(400).json({ error: 'شناسه محصول برای حذف الزامی است' });
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        return res.status(200).json({ success: true, message: 'محصول با موفقیت حذف شد' });
      }
    }

    // ==================== BULK PRODUCTS API ====================
    if (route === 'bulk-products') {
      if (req.method !== 'PATCH') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      const { updates, action, productIds, size, featured } = req.body;

      // Mode A: Batch Patch Updates
      if (updates && Array.isArray(updates)) {
        if (updates.length === 0) {
          return res.status(400).json({ error: 'هیچ ردیفی برای به‌روزرسانی گروهی ارسال نشده است.' });
        }

        const updatePromises = updates.map(async (item) => {
          const { id, ...fields } = item;
          if (!id) return null;
          if (fields.size && !ALLOWED_SIZES.includes(fields.size)) {
            throw new Error(`سایز ${fields.size} نامعتبر است.`);
          }
          const { data, error } = await supabase.from('products').update(fields).eq('id', id).select().single();
          if (error) throw error;
          return data;
        });

        const updatedResults = await Promise.all(updatePromises);
        return res.status(200).json({
          success: true,
          message: `${updatedResults.length} محصول با موفقیت به‌روزرسانی گروهی گردید.`,
          updatedCount: updatedResults.length
        });
      }

      // Mode B: Quick Bulk Action
      if (action && productIds && Array.isArray(productIds) && productIds.length > 0) {
        const fieldsToUpdate = {};
        if (action === 'set_size' && size) {
          if (!ALLOWED_SIZES.includes(size)) {
            return res.status(400).json({ error: 'سایز انتخابی غیرمجاز است.' });
          }
          fieldsToUpdate.size = size;
        } else if (action === 'toggle_featured') {
          fieldsToUpdate.featured = Boolean(featured);
        } else {
          return res.status(400).json({ error: 'دستور عملیات گروهی نامشخص است.' });
        }

        const { data, error } = await supabase.from('products').update(fieldsToUpdate).in('id', productIds).select();
        if (error) throw error;
        return res.status(200).json({
          success: true,
          message: `عملیات گروهی با موفقیت روی ${data ? data.length : productIds.length} محصول اعمال گردید.`,
          updatedCount: data ? data.length : productIds.length
        });
      }

      return res.status(400).json({ error: 'پارامترهای درخواست نامعتبر است.' });
    }

    // ==================== COLLECTIONS API ====================
    if (route === 'collections') {
      if (req.method === 'GET') {
        const { data, error } = await supabase.from('collections').select('*').order('id', { ascending: true });
        if (error) throw error;
        return res.status(200).json(data || []);
      }
      if (req.method === 'POST') {
        const { data, error } = await supabase.from('collections').insert([req.body]).select().single();
        if (error) throw error;
        return res.status(201).json(data);
      }
      if (req.method === 'PUT') {
        const { id, ...updates } = req.body;
        if (!id) return res.status(400).json({ error: 'شناسه کالکشن الزامی است' });
        const { data, error } = await supabase.from('collections').update(updates).eq('id', id).select().single();
        if (error) throw error;
        return res.status(200).json(data);
      }
      if (req.method === 'DELETE') {
        const id = req.query.id || req.body.id;
        if (!id) return res.status(400).json({ error: 'شناسه کالکشن برای حذف الزامی است' });
        const { error } = await supabase.from('collections').delete().eq('id', id);
        if (error) throw error;
        return res.status(200).json({ success: true });
      }
    }

    // ==================== CONTACT REQUESTS API ====================
    if (route === 'contact-requests') {
      const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
      const now = Date.now();
      const lastRequest = rateLimitMap.get(clientIp);

      if (req.method === 'POST') {
        if (lastRequest && now - lastRequest < 10000) {
          return res.status(429).json({ error: 'لطفاً چند ثانیه صبر کرده و مجدداً تلاش کنید.' });
        }
        rateLimitMap.set(clientIp, now);

        const { name, phone, email, subject, message, product_code, product_title, website } = req.body;
        if (website) return res.status(400).json({ error: 'Spam detected' });
        if (!name || !phone || !message) {
          return res.status(400).json({ error: 'نام، شماره تلفن و متن پیام الزامی است.' });
        }
        const phoneClean = phone.trim().replace(/[^0-9+]/g, '');
        if (phoneClean.length < 8) {
          return res.status(400).json({ error: 'شماره تماس وارد شده معتبر نیست.' });
        }

        const cleanName = name.replace(/[<>]/g, '');
        const cleanMessage = message.replace(/[<>]/g, '');

        const { data, error } = await supabase.from('contact_requests').insert([{
          name: cleanName,
          phone: phoneClean,
          email: email ? email.trim() : '',
          subject: subject ? subject.replace(/[<>]/g, '') : 'استعلام عمومی',
          message: cleanMessage,
          product_code: product_code || '',
          product_title: product_title || '',
          status: 'new',
          created_at: new Date().toISOString()
        }]).select().single();

        if (error) throw error;
        return res.status(201).json({
          success: true,
          data,
          message: 'پیام شما با موفقیت ثبت شد. کارشناسان الماس سرام به زودی با شما تماس خواهند گرفت.'
        });
      }

      if (req.method === 'GET') {
        const { data, error } = await supabase.from('contact_requests').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return res.status(200).json(data || []);
      }

      if (req.method === 'PUT') {
        const { id, status } = req.body;
        if (!id || !status) return res.status(400).json({ error: 'شناسه و وضعیت الزامی است' });
        const { data, error } = await supabase.from('contact_requests').update({ status }).eq('id', id).select().single();
        if (error) throw error;
        return res.status(200).json(data);
      }

      if (req.method === 'DELETE') {
        const id = req.query.id || req.body.id;
        if (!id) return res.status(400).json({ error: 'شناسه الزامی است' });
        const { error } = await supabase.from('contact_requests').delete().eq('id', id);
        if (error) throw error;
        return res.status(200).json({ success: true });
      }
    }

    // ==================== INQUIRY API ====================
    if (route === 'inquiry') {
      const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
      const now = Date.now();
      const lastRequest = rateLimitMap.get(clientIp);

      if (req.method === 'POST') {
        if (lastRequest && now - lastRequest < 8000) {
          return res.status(429).json({ error: 'لطفاً چند ثانیه صبر کرده و سپس مجدداً استعلام را ارسال نمایید.' });
        }
        rateLimitMap.set(clientIp, now);

        const { customer_name, phone, company, email, items, notes } = req.body;
        if (!customer_name || !phone || !items || items.length === 0) {
          return res.status(400).json({ error: 'اطلاعات نام، شماره تماس و اقلام استعلام الزامی است' });
        }

        const cleanName = customer_name.replace(/[<>]/g, '').trim();
        const cleanPhone = phone.trim().replace(/[^0-9+]/g, '');
        const cleanCompany = company ? company.replace(/[<>]/g, '').trim() : '';
        const cleanNotes = notes ? notes.replace(/[<>]/g, '').trim() : '';

        if (cleanPhone.length < 8) {
          return res.status(400).json({ error: 'شماره تماس وارد شده معتبر نیست.' });
        }

        const { data, error } = await supabase.from('inquiries').insert([{
          customer_name: cleanName,
          phone: cleanPhone,
          company: cleanCompany,
          email: email ? email.trim() : '',
          items,
          notes: cleanNotes,
          status: 'pending',
          created_at: new Date().toISOString()
        }]).select().single();

        if (error) throw error;
        return res.status(201).json({ success: true, inquiry: data, message: 'درخواست استعلام قیمت شما با موفقیت ثبت شد. کارشناسان الماس سرام به زودی با شما تماس خواهند گرفت.' });
      }

      if (req.method === 'GET') {
        const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return res.status(200).json(data || []);
      }

      if (req.method === 'PUT') {
        const { id, status, notes } = req.body;
        if (!id) return res.status(400).json({ error: 'شناسه استعلام الزامی است' });
        const updates = {};
        if (status) updates.status = status.replace(/[<>]/g, '');
        if (notes !== undefined) updates.notes = notes.replace(/[<>]/g, '');
        const { data, error } = await supabase.from('inquiries').update(updates).eq('id', id).select().single();
        if (error) throw error;
        return res.status(200).json(data);
      }

      if (req.method === 'DELETE') {
        const id = req.query.id || req.body.id;
        if (!id) return res.status(400).json({ error: 'شناسه استعلام الزامی است' });
        const { error } = await supabase.from('inquiries').delete().eq('id', id);
        if (error) throw error;
        return res.status(200).json({ success: true });
      }
    }

    // ==================== PORTFOLIO API ====================
    if (route === 'portfolio') {
      if (req.method === 'GET') {
        const { data, error } = await supabase.from('portfolio_projects').select('*').order('id', { ascending: false });
        if (error) throw error;
        return res.status(200).json(data || []);
      }
      if (req.method === 'POST') {
        const { title, category, category_fa, location, tile_used, size, sqm, image, description } = req.body;
        if (!title || !image) return res.status(400).json({ error: 'عنوان پروژه و تصویر الزامی هستند' });
        const { data, error } = await supabase.from('portfolio_projects').insert([{
          title,
          category: category || 'residential',
          category_fa: category_fa || 'پروژه مسکونی',
          location: location || 'ایران',
          tile_used: tile_used || 'پرسلان اسلب الماس سرام',
          size: size || '60x120',
          sqm: sqm || '۱۰۰۰ مترمربع',
          image,
          description: description || '',
          created_at: new Date().toISOString()
        }]).select().single();
        if (error) throw error;
        return res.status(201).json(data);
      }
      if (req.method === 'PUT') {
        const { id, ...updates } = req.body;
        if (!id) return res.status(400).json({ error: 'شناسه الزامی است' });
        const { data, error } = await supabase.from('portfolio_projects').update(updates).eq('id', id).select().single();
        if (error) throw error;
        return res.status(200).json(data);
      }
      if (req.method === 'DELETE') {
        const id = req.query.id || req.body.id;
        if (!id) return res.status(400).json({ error: 'شناسه الزامی است' });
        const { error } = await supabase.from('portfolio_projects').delete().eq('id', id);
        if (error) throw error;
        return res.status(200).json({ success: true });
      }
    }

    // ==================== STANDARDS API ====================
    if (route === 'standards') {
      if (req.method === 'GET') {
        const { data, error } = await supabase.from('standards').select('*').order('id', { ascending: true });
        if (error) throw error;
        return res.status(200).json(data || []);
      }
      if (req.method === 'POST') {
        const { title, subtitle, code, description, status_badge, image_url } = req.body;
        if (!title) return res.status(400).json({ error: 'عنوان استاندارد الزامی است' });
        const { data, error } = await supabase.from('standards').insert([{
          title,
          subtitle: subtitle || 'ISO',
          code: code || 'STANDARD',
          description: description || '',
          status_badge: status_badge || 'تاییدشده',
          image_url: image_url || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
          created_at: new Date().toISOString()
        }]).select().single();
        if (error) throw error;
        return res.status(201).json(data);
      }
      if (req.method === 'PUT') {
        const { id, ...updates } = req.body;
        if (!id) return res.status(400).json({ error: 'شناسه الزامی است' });
        const { data, error } = await supabase.from('standards').update(updates).eq('id', id).select().single();
        if (error) throw error;
        return res.status(200).json(data);
      }
      if (req.method === 'DELETE') {
        const id = req.query.id || req.body.id;
        if (!id) return res.status(400).json({ error: 'شناسه الزامی است' });
        const { error } = await supabase.from('standards').delete().eq('id', id);
        if (error) throw error;
        return res.status(200).json({ success: true });
      }
    }

    // ==================== HOMEPAGE CONTENT API ====================
    if (route === 'homepage-content') {
      if (req.method === 'GET') {
        const { data, error } = await supabase.from('homepage_content').select('*').eq('id', 1).single();
        if (error && error.code !== 'PGRST116') throw error;

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
        if (updates.hero_title) updates.hero_title = updates.hero_title.replace(/[<>]/g, '');
        if (updates.hero_description) updates.hero_description = updates.hero_description.replace(/[<>]/g, '');
        if (updates.about_title) updates.about_title = updates.about_title.replace(/[<>]/g, '');
        if (updates.about_description) updates.about_description = updates.about_description.replace(/[<>]/g, '');

        const { data, error } = await supabase.from('homepage_content').upsert({ id: 1, ...updates }).select().single();
        if (error) throw error;
        return res.status(200).json(data);
      }
    }

    // ==================== EXPORT PRODUCTS API ====================
    if (route === 'export-products') {
      if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      const { size, format } = req.query;
      let query = supabase.from('products').select('*').order('id', { ascending: true });
      if (size) query = query.eq('size', size);

      const { data: products, error } = await query;
      if (error) throw error;
      if (!products || products.length === 0) {
        return res.status(404).json({ error: 'هیچ محصولی برای خروجی یافت نشد.' });
      }

      const filename = `almas_ceram_products_${new Date().toISOString().split('T')[0]}.csv`;
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      let csvContent = '\uFEFF';
      csvContent += [
        'شناسه (ID)', 'کد کالا (Product Code)', 'عنوان فارسی', 'عنوان انگلیسی', 'عنوان عربی',
        'کد کالکشن', 'نام کالکشن', 'ابعاد (Size)', 'نوع سطح (Surface Finish)', 'نوع بدنه (Body Type)',
        'تعداد فیس (Faces Count)', 'ضخامت (Thickness mm)', 'جذب آب (Water Absorption)', 'برش لیزری (Rectified)',
        'گروه رنگی', 'لینک تصویر اصلی', 'تصاویر فیس‌ها (JSON Array)', 'تصاویر فضای اجرا (JSON Array)',
        'توضیحات فارسی', 'توضیحات انگلیسی', 'توضیحات عربی', 'نمایش ویژه (Featured)'
      ].map(col => `"${col.replace(/"/g, '""')}"`).join(',') + '\r\n';

      products.forEach((p) => {
        const row = [
          p.id || '', p.code || '', p.title_fa || '', p.title_en || '', p.title_ar || '',
          p.collection_code || '', p.collection_name || '', p.size || '', p.surface_finish || '', p.body_type || '',
          p.faces_count || 1, p.thickness_mm || '', p.water_absorption || '', p.rectified ? 'بله' : 'خیر',
          p.color_family || '', p.image_url || '', JSON.stringify(p.face_images || []), JSON.stringify(p.ambiance_images || []),
          (p.description_fa || p.description || '').replace(/\r?\n|\r/g, ' '),
          (p.description_en || '').replace(/\r?\n|\r/g, ' '),
          (p.description_ar || '').replace(/\r?\n|\r/g, ' '),
          p.featured ? 'بله' : 'خیر'
        ];
        csvContent += row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(',') + '\r\n';
      });

      return res.status(200).send(csvContent);
    }

    // ==================== IMPORT PREVIEW API ====================
    if (route === 'import-preview') {
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      const { csvData, filename } = req.body;
      if (!csvData) {
        return res.status(400).json({ error: 'محتوای فایل CSV/Excel ارسال نشده است.' });
      }

      const { data: existingProducts, error: dbErr } = await supabase.from('products').select('*');
      if (dbErr) throw dbErr;

      const existingMap = new Map((existingProducts || []).map((p) => [p.code, p]));
      const lines = csvData.split(/\r?\n/).filter((line) => line.trim().length > 0);
      if (lines.length < 2) {
        return res.status(400).json({ error: 'فایل حاوی ردیف متنی/داده معتبری نیست.' });
      }

      const parseCsvRow = (text) => {
        const result = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < text.length; i++) {
          const char = text[i];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            result.push(current.trim().replace(/^"|"$/g, ''));
            current = '';
          } else {
            current += char;
          }
        }
        result.push(current.trim().replace(/^"|"$/g, ''));
        return result;
      };

      const headers = parseCsvRow(lines[0]);
      const parsedRows = [];
      const seenCodesInFile = new Set();
      let newCount = 0, updateCount = 0, invalidCount = 0;

      for (let i = 1; i < lines.length; i++) {
        const rowValues = parseCsvRow(lines[i]);
        if (rowValues.length < 2) continue;

        const code = (rowValues[1] || rowValues[0] || '').trim();
        const title_fa = (rowValues[2] || '').trim();
        const size = (rowValues[7] || '60x120').trim();
        const errors = [];

        if (!code) errors.push('کد یکتای محصول (Product Code) خالی است.');
        if (seenCodesInFile.has(code)) errors.push(`کد کالا ${code} در خود این فایل تکراری است.`);
        if (code) seenCodesInFile.add(code);
        if (!title_fa) errors.push('عنوان فارسی محصول خالی است.');
        if (!ALLOWED_SIZES.includes(size)) {
          errors.push(`سایز ${size} نامعتبر است. سایزهای مجاز: ${ALLOWED_SIZES.join(', ')}`);
        }

        const existingProd = code ? existingMap.get(code) : null;
        const rowStatus = errors.length > 0 ? 'INVALID' : existingProd ? 'UPDATE' : 'NEW';

        if (rowStatus === 'NEW') newCount++;
        if (rowStatus === 'UPDATE') updateCount++;
        if (rowStatus === 'INVALID') invalidCount++;

        const diffs = [];
        const updatedFields = {};

        if (existingProd) {
          const compareAndApply = (fieldKey, newValue, oldValue) => {
            if (newValue === '[CLEAR]') {
              diffs.push({ field: fieldKey, oldValue, newValue: '' });
              updatedFields[fieldKey] = '';
            } else if (newValue !== '' && newValue !== oldValue) {
              diffs.push({ field: fieldKey, oldValue, newValue });
              updatedFields[fieldKey] = newValue;
            } else {
              updatedFields[fieldKey] = oldValue;
            }
          };
          compareAndApply('title_fa', title_fa, existingProd.title_fa);
        } else {
          Object.assign(updatedFields, {
            code, title_fa, size,
            title_en: (rowValues[3] || '').trim(),
            title_ar: (rowValues[4] || '').trim(),
            collection_code: (rowValues[5] || 'ONYX_ROYAL').trim(),
            collection_name: (rowValues[6] || 'کالکشن اونیکس رویال').trim(),
            surface_finish: (rowValues[8] || 'پولیش (Polished)').trim(),
            body_type: (rowValues[9] || 'پرسلان فول بادی (Full Body Porcelain)').trim(),
            faces_count: parseInt(rowValues[10], 10) || 8,
            thickness_mm: parseFloat(rowValues[11]) || 11.5,
            water_absorption: (rowValues[12] || '< 0.1% ISO 10545-3').trim(),
            rectified: (rowValues[13] || 'بله').trim() === 'بله',
            color_family: (rowValues[14] || 'سفید و مرمر (White/Marble)').trim(),
            image_url: (rowValues[15] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80').trim(),
            description: (rowValues[16] || '').trim(),
            description_fa: (rowValues[16] || '').trim(),
            featured: (rowValues[17] || 'خیر').trim() === 'بله'
          });
        }

        parsedRows.push({ rowNumber: i + 1, status: rowStatus, code, title_fa, size, updatedFields, diffs, errors });
      }

      return res.status(200).json({
        summary: { filename: filename || 'import.csv', totalRows: parsedRows.length, newCount, updateCount, invalidCount, canCommit: invalidCount === 0 },
        rows: parsedRows
      });
    }

    // ==================== IMPORT COMMIT API ====================
    if (route === 'import-commit') {
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      const { rows, filename, adminUser } = req.body;
      if (!rows || !Array.isArray(rows) || rows.length === 0) {
        return res.status(400).json({ error: 'هیچ ردیفی برای اعمال نهایی ارسال نشده است.' });
      }

      const validRows = rows.filter((r) => r.status === 'NEW' || r.status === 'UPDATE');
      if (validRows.length === 0) {
        return res.status(400).json({ error: 'هیچ ردیف معتبری برای ذخیره یافت نشد.' });
      }

      const codesToUpdate = validRows.map((r) => r.code).filter(Boolean);
      const { data: previousProducts } = await supabase.from('products').select('*').in('code', codesToUpdate);
      const previousStateMap = new Map((previousProducts || []).map((p) => [p.code, p]));

      const newCreatedCodes = [];
      const previousSnapshot = [];
      let newCount = 0, updateCount = 0;

      for (const item of validRows) {
        const payload = item.updatedFields;
        if (item.status === 'NEW') {
          const { data: newProd, error: insertErr } = await supabase.from('products').insert([payload]).select().single();
          if (insertErr) throw insertErr;
          if (newProd) { newCreatedCodes.push(newProd.code); newCount++; }
        } else if (item.status === 'UPDATE') {
          const oldProd = previousStateMap.get(item.code);
          if (oldProd) previousSnapshot.push(oldProd);
          const { error: updateErr } = await supabase.from('products').update(payload).eq('code', item.code);
          if (updateErr) throw updateErr;
          updateCount++;
        }
      }

      const { data: historyRecord, error: historyErr } = await supabase.from('import_history').insert([{
        filename: filename || 'import.csv',
        admin_user: adminUser || 'admin@almasceram.com',
        new_count: newCount,
        updated_count: updateCount,
        previous_state_json: { newCreatedCodes, previousSnapshot },
        status: 'completed',
        created_at: new Date().toISOString()
      }]).select().single();

      if (historyErr) console.error('Error writing import history:', historyErr);

      return res.status(200).json({
        success: true,
        importId: historyRecord?.id,
        message: `عملیات خروجی/واردسازی با موفقیت انجام شد: ${newCount} محصول جدید ایجاد و ${updateCount} محصول به‌روزرسانی گردید.`,
        summary: { newCount, updateCount }
      });
    }

    // ==================== IMPORT ROLLBACK API ====================
    if (route === 'import-rollback') {
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      const { importId } = req.body;
      if (!importId) {
        return res.status(400).json({ error: 'شناسه سابقه واردسازی (importId) الزامی است.' });
      }

      const { data: historyRecord, error: fetchErr } = await supabase.from('import_history').select('*').eq('id', importId).single();
      if (fetchErr || !historyRecord) {
        return res.status(404).json({ error: 'سابقه واردسازی مورد نظر یافت نشد.' });
      }
      if (historyRecord.status === 'rolled_back') {
        return res.status(400).json({ error: 'این عملیات قبلاً بازگردانی (Rollback) شده است.' });
      }

      const snapshot = historyRecord.previous_state_json || {};
      const newCreatedCodes = snapshot.newCreatedCodes || [];
      const previousSnapshot = snapshot.previousSnapshot || [];

      if (newCreatedCodes.length > 0) {
        const { error: delErr } = await supabase.from('products').delete().in('code', newCreatedCodes);
        if (delErr) throw delErr;
      }

      for (const prevProd of previousSnapshot) {
        const { id, created_at, ...restFields } = prevProd;
        const { error: restoreErr } = await supabase.from('products').update(restFields).eq('code', prevProd.code);
        if (restoreErr) throw restoreErr;
      }

      await supabase.from('import_history').update({ status: 'rolled_back' }).eq('id', importId);

      return res.status(200).json({
        success: true,
        message: `بازگردانی (Rollback) با موفقیت انجام شد: ${newCreatedCodes.length} محصول جدید حذف و ${previousSnapshot.length} محصول به وضعیت قبلی بازگشتند.`
      });
    }

    // ==================== BULK UPLOAD PREVIEW API ====================
    if (route === 'bulk-upload-preview') {
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      const { files } = req.body;
      if (!files || !Array.isArray(files) || files.length === 0) {
        return res.status(400).json({ error: 'هیچ فایل تصویری ارسال نشده است.' });
      }

      const { data: dbProducts, error: dbErr } = await supabase.from('products').select('id, code, title_fa, size, image_url, face_images, ambiance_images');
      if (dbErr) throw dbErr;

      const productsMap = new Map((dbProducts || []).map((p) => [p.code.toUpperCase(), p]));
      const matchedList = [], unmatchedList = [];

      files.forEach((fileItem) => {
        const fileName = fileItem.name || 'image.jpg';
        const fileBase64 = fileItem.base64 || fileItem.url || '';
        const mimeType = fileItem.type || 'image/jpeg';

        const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
        const parts = nameWithoutExt.split('_');
        const potentialCode = parts[0].toUpperCase().trim();
        const imageTypeTag = parts[1] ? parts[1].toLowerCase() : 'main';

        let imageType = 'main';
        if (imageTypeTag.includes('face')) imageType = 'face';
        else if (imageTypeTag.includes('room') || imageTypeTag.includes('ambiance')) imageType = 'ambiance';

        const targetProduct = productsMap.get(potentialCode);

        if (targetProduct) {
          matchedList.push({ fileName, code: targetProduct.code, productId: targetProduct.id, productTitle: targetProduct.title_fa, imageType, previewUrl: fileBase64 });
        } else {
          unmatchedList.push({ fileName, previewUrl: fileBase64, suggestedType: imageType });
        }
      });

      return res.status(200).json({
        summary: { totalFiles: files.length, matchedCount: matchedList.length, unmatchedCount: unmatchedList.length },
        matched: matchedList,
        unmatched: unmatchedList,
        allProducts: (dbProducts || []).map((p) => ({ id: p.id, code: p.code, title_fa: p.title_fa }))
      });
    }

    // ==================== BULK UPLOAD COMMIT API ====================
    if (route === 'bulk-upload-commit') {
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      const { items } = req.body;
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'هیچ تصویری برای ذخیره نهایی تایید نشده است.' });
      }

      let updatedCount = 0;

      for (const item of items) {
        const { productId, imageType, previewUrl } = item;
        if (!productId || !previewUrl) continue;

        const { data: prod } = await supabase.from('products').select('image_url, face_images, ambiance_images').eq('id', productId).single();
        if (!prod) continue;

        const updates = {};
        if (imageType === 'main') {
          updates.image_url = previewUrl;
        } else if (imageType === 'face') {
          const existingFaces = Array.isArray(prod.face_images) ? prod.face_images : [];
          updates.face_images = Array.from(new Set([...existingFaces, previewUrl]));
        } else if (imageType === 'ambiance') {
          const existingAmbiance = Array.isArray(prod.ambiance_images) ? prod.ambiance_images : [];
          updates.ambiance_images = Array.from(new Set([...existingAmbiance, previewUrl]));
        }

        const { error: updateErr } = await supabase.from('products').update(updates).eq('id', productId);
        if (!updateErr) updatedCount++;
      }

      return res.status(200).json({ success: true, message: `تصاویر ${updatedCount} محصول با موفقیت آپلود و گالری بروزرسانی شد.`, updatedCount });
    }

    // ==================== SITEMAP API ====================
    if (route === 'sitemap') {
      res.setHeader('Content-Type', 'text/xml');
      res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');

      const { data: products } = await supabase.from('products').select('id, code, size, created_at');
      const baseUrl = 'https://almasceram.com';

      const staticPages = ['', '/?page=about', '/?page=portfolio', '/?page=faq', '/?page=contact', '/?page=privacy', '/?page=terms'];

      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

      staticPages.forEach((page) => {
        xml += `\n  <url>\n    <loc>${baseUrl}${page}</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>${page === '' ? '1.0' : '0.8'}</priority>\n  </url>`;
      });

      if (products && products.length > 0) {
        products.forEach((p) => {
          const lastMod = p.created_at ? p.created_at.split('T')[0] : new Date().toISOString().split('T')[0];
          xml += `\n  <url>\n    <loc>${baseUrl}/?product=${p.code}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>`;
        });
      }

      xml += '\n</urlset>';
      return res.status(200).send(xml);
    }

    // ==================== DEFAULT: API ROUTE NOT FOUND ====================
    return res.status(404).json({
      error: 'API endpoint not found',
      message: 'لطفاً پارامتر route را به درستی مشخص کنید. مسیرهای موجود: products, collections, contact-requests, inquiry, portfolio, standards, homepage-content, export-products, import-preview, import-commit, import-rollback, bulk-products, bulk-upload-preview, bulk-upload-commit, sitemap',
      availableRoutes: ['products', 'collections', 'contact-requests', 'inquiry', 'portfolio', 'standards', 'homepage-content', 'export-products', 'import-preview', 'import-commit', 'import-rollback', 'bulk-products', 'bulk-upload-preview', 'bulk-upload-commit', 'sitemap']
    });

  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

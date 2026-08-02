import supabase from './db-client.js';

// IP Rate Limiter Map for Inquiry Submissions
const inquiryIpMap = new Map();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'POST') {
      const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
      const now = Date.now();
      const lastRequest = inquiryIpMap.get(clientIp);

      if (lastRequest && now - lastRequest < 8000) {
        return res.status(429).json({ error: 'لطفاً چند ثانیه صبر کرده و سپس مجدداً استعلام را ارسال نمایید.' });
      }
      inquiryIpMap.set(clientIp, now);

      const { customer_name, phone, company, email, items, notes } = req.body;
      if (!customer_name || !phone || !items || items.length === 0) {
        return res.status(400).json({ error: 'اطلاعات نام، شماره تماس و اقلام استعلام الزامی است' });
      }

      // XSS Sanitization
      const cleanName = customer_name.replace(/[<>]/g, '').trim();
      const cleanPhone = phone.trim().replace(/[^0-9+]/g, '');
      const cleanCompany = company ? company.replace(/[<>]/g, '').trim() : '';
      const cleanNotes = notes ? notes.replace(/[<>]/g, '').trim() : '';

      if (cleanPhone.length < 8) {
        return res.status(400).json({ error: 'شماره تماس وارد شده معتبر نیست.' });
      }

      const { data, error } = await supabase
        .from('inquiries')
        .insert([{
          customer_name: cleanName,
          phone: cleanPhone,
          company: cleanCompany,
          email: email ? email.trim() : '',
          items,
          notes: cleanNotes,
          status: 'pending',
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json({ success: true, inquiry: data, message: 'درخواست استعلام قیمت شما با موفقیت ثبت شد. کارشناسان الماس سرام به زودی با شما تماس خواهند گرفت.' });
    }

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data || []);
    }

    if (req.method === 'PUT') {
      const { id, status, notes } = req.body;
      if (!id) return res.status(400).json({ error: 'شناسه استعلام الزامی است' });

      const updates = {};
      if (status) updates.status = status.replace(/[<>]/g, '');
      if (notes !== undefined) updates.notes = notes.replace(/[<>]/g, '');

      const { data, error } = await supabase
        .from('inquiries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const id = req.query.id || req.body.id;
      if (!id) return res.status(400).json({ error: 'شناسه استعلام الزامی است' });

      const { error } = await supabase
        .from('inquiries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error in inquiry.js:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

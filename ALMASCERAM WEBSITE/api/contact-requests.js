import supabase from './db-client.js';

// Simple in-memory rate limiting map
const ipRateMap = new Map();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');

  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'POST') {
      const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
      const now = Date.now();
      const lastRequest = ipRateMap.get(clientIp);

      // Rate limit: 10 seconds cooldown between submissions per IP
      if (lastRequest && now - lastRequest < 10000) {
        return res.status(429).json({ error: 'لطفاً چند ثانیه صبر کرده و مجدداً تلاش کنید.' });
      }
      ipRateMap.set(clientIp, now);

      const { name, phone, email, subject, message, product_code, product_title, website } = req.body;

      // Anti-Spam Honeypot check
      if (website) {
        return res.status(400).json({ error: 'Spam detected' });
      }

      if (!name || !phone || !message) {
        return res.status(400).json({ error: 'نام، شماره تلفن و متن پیام الزامی است.' });
      }

      const phoneClean = phone.trim().replace(/[^0-9+]/g, '');
      if (phoneClean.length < 8) {
        return res.status(400).json({ error: 'شماره تماس وارد شده معتبر نیست.' });
      }

      // XSS Basic Sanitization
      const cleanName = name.replace(/[<>]/g, '');
      const cleanMessage = message.replace(/[<>]/g, '');

      const { data, error } = await supabase
        .from('contact_requests')
        .insert([{
          name: cleanName,
          phone: phoneClean,
          email: email ? email.trim() : '',
          subject: subject ? subject.replace(/[<>]/g, '') : 'استعلام عمومی',
          message: cleanMessage,
          product_code: product_code || '',
          product_title: product_title || '',
          status: 'new',
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      return res.status(201).json({
        success: true,
        data,
        message: 'پیام شما با موفقیت ثبت شد. کارشناسان الماس سرام به زودی با شما تماس خواهند گرفت.'
      });
    }

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('contact_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json(data || []);
    }

    if (req.method === 'PUT') {
      const { id, status } = req.body;
      if (!id || !status) return res.status(400).json({ error: 'شناسه و وضعیت الزامی است' });

      const { data, error } = await supabase
        .from('contact_requests')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const id = req.query.id || req.body.id;
      if (!id) return res.status(400).json({ error: 'شناسه الزامی است' });

      const { error } = await supabase
        .from('contact_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error in contact-requests.js:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

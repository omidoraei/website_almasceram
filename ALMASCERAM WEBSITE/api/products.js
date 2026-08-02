import supabase from './db-client.js';

const ALLOWED_SIZES = ['30x30', '40x40', '60x60', '60x120', '80x80', '100x100', '30x90'];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');

  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { search, size, finish, body, collection, featured, limit, id } = req.query;

      if (id) {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        return res.status(200).json(data);
      }

      let query = supabase.from('products').select('*');

      if (featured === 'true') {
        query = query.eq('featured', true);
      }

      if (collection) {
        query = query.eq('collection_code', collection);
      }

      if (size) {
        const sizes = size.split(',').map(s => s.trim()).filter(s => ALLOWED_SIZES.includes(s));
        if (sizes.length > 0) {
          query = query.in('size', sizes);
        }
      }

      if (finish) {
        const finishes = finish.split(',').map(f => f.trim());
        query = query.in('surface_finish', finishes);
      }

      if (body) {
        query = query.eq('body_type', body);
      }

      if (search) {
        // Sanitize search string
        const cleanSearch = search.replace(/[%_]/g, '');
        query = query.or(`title_fa.ilike.%${cleanSearch}%,title_en.ilike.%${cleanSearch}%,code.ilike.%${cleanSearch}%,collection_name.ilike.%${cleanSearch}%`);
      }

      query = query.order('id', { ascending: false });

      if (limit) {
        const parsedLimit = parseInt(limit, 10);
        if (!isNaN(parsedLimit) && parsedLimit > 0) {
          query = query.limit(parsedLimit);
        }
      }

      const { data, error } = await query;
      if (error) throw error;

      return res.status(200).json(data || []);
    }

    if (req.method === 'POST') {
      const productData = req.body;

      // Validation
      if (!productData.title_fa || !productData.code || !productData.size) {
        return res.status(400).json({ error: 'نام محصول، کد کالا و سایز الزامی هستند.' });
      }

      if (!ALLOWED_SIZES.includes(productData.size)) {
        return res.status(400).json({ error: 'سایز وارد شده معتبر نیست. سایزهای مجاز: ' + ALLOWED_SIZES.join(', ') });
      }

      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const { id, ...updates } = req.body;
      if (!id) return res.status(400).json({ error: 'شناسه محصول الزامی است' });

      if (updates.size && !ALLOWED_SIZES.includes(updates.size)) {
        return res.status(400).json({ error: 'سایز وارد شده معتبر نیست.' });
      }

      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const id = req.query.id || req.body.id;
      if (!id) return res.status(400).json({ error: 'شناسه محصول برای حذف الزامی است' });

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return res.status(200).json({ success: true, message: 'محصول با موفقیت حذف شد' });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error in products.js:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

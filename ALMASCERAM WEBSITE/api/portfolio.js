import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');

  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      return res.status(200).json(data || []);
    }

    if (req.method === 'POST') {
      const { title, category, category_fa, location, tile_used, size, sqm, image, description } = req.body;
      if (!title || !image) return res.status(400).json({ error: 'عنوان پروژه و تصویر الزامی هستند' });

      const { data, error } = await supabase
        .from('portfolio_projects')
        .insert([{
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
        }])
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const { id, ...updates } = req.body;
      if (!id) return res.status(400).json({ error: 'شناسه الزامی است' });

      const { data, error } = await supabase
        .from('portfolio_projects')
        .update(updates)
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
        .from('portfolio_projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error in portfolio.js:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

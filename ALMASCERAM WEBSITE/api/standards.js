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
        .from('standards')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      return res.status(200).json(data || []);
    }

    if (req.method === 'POST') {
      const { title, subtitle, code, description, status_badge, image_url } = req.body;
      if (!title) return res.status(400).json({ error: 'عنوان استاندارد الزامی است' });

      const { data, error } = await supabase
        .from('standards')
        .insert([{
          title,
          subtitle: subtitle || 'ISO',
          code: code || 'STANDARD',
          description: description || '',
          status_badge: status_badge || 'تاییدشده',
          image_url: image_url || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
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
        .from('standards')
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
        .from('standards')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error in standards.js:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

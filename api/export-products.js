import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');

  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { size, format } = req.query;

    let query = supabase.from('products').select('*').order('id', { ascending: true });

    if (size) {
      query = query.eq('size', size);
    }

    const { data: products, error } = await query;
    if (error) throw error;

    if (!products || products.length === 0) {
      return res.status(404).json({ error: 'هیچ محصولی برای خروجی یافت نشد.' });
    }

    // Set Response Headers for File Download
    const filename = `almas_ceram_products_${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Add UTF-8 BOM for Excel Persian Compatibility
    let csvContent = '\uFEFF';

    // CSV Header Row
    csvContent += [
      'شناسه (ID)',
      'کد کالا (Product Code)',
      'عنوان فارسی',
      'عنوان انگلیسی',
      'عنوان عربی',
      'کد کالکشن',
      'نام کالکشن',
      'ابعاد (Size)',
      'نوع سطح (Surface Finish)',
      'نوع بدنه (Body Type)',
      'تعداد فیس (Faces Count)',
      'ضخامت (Thickness mm)',
      'جذب آب (Water Absorption)',
      'برش لیزری (Rectified)',
      'گروه رنگی',
      'لینک تصویر اصلی',
      'توضیحات فارسی',
      'نمایش ویژه (Featured)'
    ].map(col => `"${col.replace(/"/g, '""')}"`).join(',') + '\r\n';

    // CSV Data Rows
    products.forEach((p) => {
      const row = [
        p.id || '',
        p.code || '',
        p.title_fa || '',
        p.title_en || '',
        p.title_ar || '',
        p.collection_code || '',
        p.collection_name || '',
        p.size || '',
        p.surface_finish || '',
        p.body_type || '',
        p.faces_count || 1,
        p.thickness_mm || '',
        p.water_absorption || '',
        p.rectified ? 'بله' : 'خیر',
        p.color_family || '',
        p.image_url || '',
        (p.description_fa || p.description || '').replace(/\r?\n|\r/g, ' '),
        p.featured ? 'بله' : 'خیر'
      ];

      csvContent += row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(',') + '\r\n';
    });

    return res.status(200).send(csvContent);
  } catch (err) {
    console.error('API error in export-products.js:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

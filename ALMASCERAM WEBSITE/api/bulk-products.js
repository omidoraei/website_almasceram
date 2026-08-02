import supabase from './db-client.js';

const ALLOWED_SIZES = ['30x30', '40x40', '60x60', '60x120', '80x80', '100x100', '30x90'];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');

  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method !== 'PATCH') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { updates, action, productIds, size, featured } = req.body;

    // Mode A: Batch Patch Updates array [{ id, ...fields }]
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

        const { data, error } = await supabase
          .from('products')
          .update(fields)
          .eq('id', id)
          .select()
          .single();

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

    // Mode B: Quick Bulk Action on Selected Product IDs (Bulk set size, Bulk toggle featured)
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

      const { data, error } = await supabase
        .from('products')
        .update(fieldsToUpdate)
        .in('id', productIds)
        .select();

      if (error) throw error;

      return res.status(200).json({
        success: true,
        message: `عملیات گروهی با موفقیت روی ${data ? data.length : productIds.length} محصول اعمال گردید.`,
        updatedCount: data ? data.length : productIds.length
      });
    }

    return res.status(400).json({ error: 'پارامترهای درخواست نامعتبر است.' });
  } catch (err) {
    console.error('API error in bulk-products.js:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');

  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { importId } = req.body;
    if (!importId) {
      return res.status(400).json({ error: 'شناسه سابقه واردسازی (importId) الزامی است.' });
    }

    // Fetch import history record
    const { data: historyRecord, error: fetchErr } = await supabase
      .from('import_history')
      .select('*')
      .eq('id', importId)
      .single();

    if (fetchErr || !historyRecord) {
      return res.status(404).json({ error: 'سابقه واردسازی مورد نظر یافت نشد.' });
    }

    if (historyRecord.status === 'rolled_back') {
      return res.status(400).json({ error: 'این عملیات قبلاً بازگردانی (Rollback) شده است.' });
    }

    const snapshot = historyRecord.previous_state_json || {};
    const newCreatedCodes = snapshot.newCreatedCodes || [];
    const previousSnapshot = snapshot.previousSnapshot || [];

    // 1. Delete products that were newly created in this import
    if (newCreatedCodes.length > 0) {
      const { error: delErr } = await supabase
        .from('products')
        .delete()
        .in('code', newCreatedCodes);

      if (delErr) throw delErr;
    }

    // 2. Restore previous values for updated products
    for (const prevProd of previousSnapshot) {
      const { id, created_at, ...restFields } = prevProd;
      const { error: restoreErr } = await supabase
        .from('products')
        .update(restFields)
        .eq('code', prevProd.code);

      if (restoreErr) throw restoreErr;
    }

    // Update status in import_history
    await supabase
      .from('import_history')
      .update({ status: 'rolled_back' })
      .eq('id', importId);

    return res.status(200).json({
      success: true,
      message: `بازگردانی (Rollback) با موفقیت انجام شد: ${newCreatedCodes.length} محصول جدید حذف و ${previousSnapshot.length} محصول به وضعیت قبلی بازگشتند.`
    });
  } catch (err) {
    console.error('API error in import-rollback.js:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

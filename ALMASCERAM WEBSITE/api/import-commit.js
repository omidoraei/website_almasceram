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

    const { rows, filename, adminUser } = req.body;
    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ error: 'هیچ ردیفی برای اعمال نهایی ارسال نشده است.' });
    }

    // Filter valid rows
    const validRows = rows.filter((r) => r.status === 'NEW' || r.status === 'UPDATE');
    if (validRows.length === 0) {
      return res.status(400).json({ error: 'هیچ ردیف معتبری برای ذخیره یافت نشد.' });
    }

    // Capture previous state snapshot for Rollback
    const codesToUpdate = validRows.map((r) => r.code).filter(Boolean);
    const { data: previousProducts } = await supabase
      .from('products')
      .select('*')
      .in('code', codesToUpdate);

    const previousStateMap = new Map((previousProducts || []).map((p) => [p.code, p]));

    const newCreatedCodes = [];
    const previousSnapshot = [];

    let newCount = 0;
    let updateCount = 0;

    for (const item of validRows) {
      const payload = item.updatedFields;

      if (item.status === 'NEW') {
        const { data: newProd, error: insertErr } = await supabase
          .from('products')
          .insert([payload])
          .select()
          .single();

        if (insertErr) throw insertErr;
        if (newProd) {
          newCreatedCodes.push(newProd.code);
          newCount++;
        }
      } else if (item.status === 'UPDATE') {
        const oldProd = previousStateMap.get(item.code);
        if (oldProd) {
          previousSnapshot.push(oldProd);
        }

        const { error: updateErr } = await supabase
          .from('products')
          .update(payload)
          .eq('code', item.code);

        if (updateErr) throw updateErr;
        updateCount++;
      }
    }

    // Record entry in import_history table for full audit & rollback capability
    const { data: historyRecord, error: historyErr } = await supabase
      .from('import_history')
      .insert([{
        filename: filename || 'import.csv',
        admin_user: adminUser || 'admin@almasceram.com',
        new_count: newCount,
        updated_count: updateCount,
        previous_state_json: {
          newCreatedCodes,
          previousSnapshot
        },
        status: 'completed',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (historyErr) {
      console.error('Error writing import history:', historyErr);
    }

    return res.status(200).json({
      success: true,
      importId: historyRecord?.id,
      message: `عملیات خروجی/واردسازی با موفقیت انجام شد: ${newCount} محصول جدید ایجاد و ${updateCount} محصول به‌روزرسانی گردید.`,
      summary: { newCount, updateCount }
    });
  } catch (err) {
    console.error('API error in import-commit.js:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

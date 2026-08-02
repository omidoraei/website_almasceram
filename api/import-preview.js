import supabase from './db-client.js';

const MANDATORY_SIZES = ['30x30', '40x40', '60x60', '60x120', '80x80', '100x100', '30x90'];

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

    const { csvData, filename } = req.body;
    if (!csvData) {
      return res.status(400).json({ error: 'محتوای فایل CSV/Excel ارسال نشده است.' });
    }

    // Fetch all existing products from Supabase for comparison & diff generation
    const { data: existingProducts, error: dbErr } = await supabase
      .from('products')
      .select('*');

    if (dbErr) throw dbErr;

    const existingMap = new Map((existingProducts || []).map((p) => [p.code, p]));

    // Parse CSV lines
    const lines = csvData.split(/\r?\n/).filter((line) => line.trim().length > 0);
    if (lines.length < 2) {
      return res.status(400).json({ error: 'فایل حاوی ردیف متنی/داده معتبری نیست.' });
    }

    // Parse Header
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

    let newCount = 0;
    let updateCount = 0;
    let invalidCount = 0;

    for (let i = 1; i < lines.length; i++) {
      const rowValues = parseCsvRow(lines[i]);
      if (rowValues.length < 2) continue;

      // Map values by index or key
      const code = (rowValues[1] || rowValues[0] || '').trim();
      const title_fa = (rowValues[2] || '').trim();
      const title_en = (rowValues[3] || '').trim();
      const title_ar = (rowValues[4] || '').trim();
      const collection_code = (rowValues[5] || 'ONYX_ROYAL').trim();
      const collection_name = (rowValues[6] || 'کالکشن اونیکس رویال').trim();
      const size = (rowValues[7] || '60x120').trim();
      const surface_finish = (rowValues[8] || 'پولیش (Polished)').trim();
      const body_type = (rowValues[9] || 'پرسلان فول بادی (Full Body Porcelain)').trim();
      const faces_count = parseInt(rowValues[10], 10) || 8;
      const thickness_mm = parseFloat(rowValues[11]) || 11.5;
      const water_absorption = (rowValues[12] || '< 0.1% ISO 10545-3').trim();
      const rectifiedStr = (rowValues[13] || 'بله').trim();
      const color_family = (rowValues[14] || 'سفید و مرمر (White/Marble)').trim();
      const image_url = (rowValues[15] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80').trim();
      const description_fa = (rowValues[16] || '').trim();
      const featuredStr = (rowValues[17] || 'خیر').trim();

      const errors = [];

      if (!code) errors.push('کد یکتای محصول (Product Code) خالی است.');
      if (seenCodesInFile.has(code)) errors.push(`کد کالا ${code} در خود این فایل تکراری است.`);
      if (code) seenCodesInFile.add(code);

      if (!title_fa) errors.push('عنوان فارسی محصول خالی است.');
      if (!MANDATORY_SIZES.includes(size)) {
        errors.push(`سایز ${size} نامعتبر است. سایزهای مجاز: ${MANDATORY_SIZES.join(', ')}`);
      }

      const existingProd = code ? existingMap.get(code) : null;
      const rowStatus = errors.length > 0 ? 'INVALID' : existingProd ? 'UPDATE' : 'NEW';

      if (rowStatus === 'NEW') newCount++;
      if (rowStatus === 'UPDATE') updateCount++;
      if (rowStatus === 'INVALID') invalidCount++;

      // Compute field diffs for updates (Empty cells rule: empty means KEEP existing value)
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
            updatedFields[fieldKey] = oldValue; // Keep existing value!
          }
        };

        compareAndApply('title_fa', title_fa, existingProd.title_fa);
        if (title_en) compareAndApply('title_en', title_en, existingProd.title_en);
        if (title_ar) compareAndApply('title_ar', title_ar, existingProd.title_ar);
        compareAndApply('size', size, existingProd.size);
        compareAndApply('surface_finish', surface_finish, existingProd.surface_finish);
        compareAndApply('body_type', body_type, existingProd.body_type);
        if (image_url) compareAndApply('image_url', image_url, existingProd.image_url);
        if (description_fa) compareAndApply('description_fa', description_fa, existingProd.description_fa || existingProd.description);
      } else {
        // New Product
        Object.assign(updatedFields, {
          code,
          title_fa,
          title_en,
          title_ar,
          collection_code,
          collection_name,
          size,
          surface_finish,
          body_type,
          faces_count,
          thickness_mm,
          water_absorption,
          rectified: rectifiedStr === 'بله',
          color_family,
          image_url,
          description: description_fa,
          description_fa,
          featured: featuredStr === 'بله'
        });
      }

      parsedRows.push({
        rowNumber: i + 1,
        status: rowStatus,
        code,
        title_fa,
        size,
        updatedFields,
        diffs,
        errors
      });
    }

    return res.status(200).json({
      summary: {
        filename: filename || 'import.csv',
        totalRows: parsedRows.length,
        newCount,
        updateCount,
        invalidCount,
        canCommit: invalidCount === 0
      },
      rows: parsedRows
    });
  } catch (err) {
    console.error('API error in import-preview.js:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

import supabase from './db-client.js';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB per file

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

    const { files } = req.body;
    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: 'هیچ فایل تصویری ارسال نشده است.' });
    }

    // Fetch all products from Supabase to match code
    const { data: dbProducts, error: dbErr } = await supabase
      .from('products')
      .select('id, code, title_fa, size, image_url, face_images, ambiance_images');

    if (dbErr) throw dbErr;

    const productsMap = new Map((dbProducts || []).map((p) => [p.code.toUpperCase(), p]));

    const matchedList = [];
    const unmatchedList = [];

    files.forEach((fileItem) => {
      const fileName = fileItem.name || 'image.jpg';
      const fileBase64 = fileItem.base64 || fileItem.url || '';
      const mimeType = fileItem.type || 'image/jpeg';

      // Validation
      if (!ALLOWED_MIME_TYPES.includes(mimeType) && !fileName.match(/\.(jpg|jpeg|png|webp)$/i)) {
        return; // Skip invalid format
      }

      // Parse Naming Convention: {productCode}_{imageType}.{ext}
      // e.g. ALM-60120-01.jpg -> main image
      // e.g. ALM-60120-01_face1.jpg -> face image
      // e.g. ALM-60120-01_room.jpg -> ambiance image
      const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
      const parts = nameWithoutExt.split('_');
      const potentialCode = parts[0].toUpperCase().trim();
      const imageTypeTag = parts[1] ? parts[1].toLowerCase() : 'main';

      let imageType = 'main';
      if (imageTypeTag.includes('face')) imageType = 'face';
      else if (imageTypeTag.includes('room') || imageTypeTag.includes('ambiance')) imageType = 'ambiance';

      const targetProduct = productsMap.get(potentialCode);

      if (targetProduct) {
        matchedList.push({
          fileName,
          code: targetProduct.code,
          productId: targetProduct.id,
          productTitle: targetProduct.title_fa,
          imageType,
          previewUrl: fileBase64
        });
      } else {
        unmatchedList.push({
          fileName,
          previewUrl: fileBase64,
          suggestedType: imageType
        });
      }
    });

    return res.status(200).json({
      summary: {
        totalFiles: files.length,
        matchedCount: matchedList.length,
        unmatchedCount: unmatchedList.length
      },
      matched: matchedList,
      unmatched: unmatchedList,
      allProducts: (dbProducts || []).map((p) => ({ id: p.id, code: p.code, title_fa: p.title_fa }))
    });
  } catch (err) {
    console.error('API error in bulk-upload-preview.js:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

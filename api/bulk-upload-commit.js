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

    const { items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'هیچ تصویری برای ذخیره نهایی تایید نشده است.' });
    }

    let updatedCount = 0;

    for (const item of items) {
      const { productId, imageType, previewUrl } = item;
      if (!productId || !previewUrl) continue;

      // Fetch existing product to append gallery or update main image
      const { data: prod } = await supabase
        .from('products')
        .select('image_url, face_images, ambiance_images')
        .eq('id', productId)
        .single();

      if (!prod) continue;

      const updates = {};

      if (imageType === 'main') {
        updates.image_url = previewUrl;
      } else if (imageType === 'face') {
        const existingFaces = Array.isArray(prod.face_images) ? prod.face_images : [];
        updates.face_images = Array.from(new Set([...existingFaces, previewUrl]));
      } else if (imageType === 'ambiance') {
        const existingAmbiance = Array.isArray(prod.ambiance_images) ? prod.ambiance_images : [];
        updates.ambiance_images = Array.from(new Set([...existingAmbiance, previewUrl]));
      }

      const { error: updateErr } = await supabase
        .from('products')
        .update(updates)
        .eq('id', productId);

      if (!updateErr) {
        updatedCount++;
      }
    }

    return res.status(200).json({
      success: true,
      message: `تصاویر ${updatedCount} محصول با موفقیت آپلود و گالری بروزرسانی شد.`,
      updatedCount
    });
  } catch (err) {
    console.error('API error in bulk-upload-commit.js:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

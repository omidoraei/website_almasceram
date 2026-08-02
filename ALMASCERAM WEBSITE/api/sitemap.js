import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');

  try {
    const { data: products } = await supabase
      .from('products')
      .select('id, code, size, created_at');

    const baseUrl = 'https://almasceram.com';

    const staticPages = [
      '',
      '/?page=about',
      '/?page=portfolio',
      '/?page=faq',
      '/?page=contact',
      '/?page=privacy',
      '/?page=terms'
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

    // Add Static Pages
    staticPages.forEach((page) => {
      xml += `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`;
    });

    // Add Dynamic Products
    if (products && products.length > 0) {
      products.forEach((p) => {
        const lastMod = p.created_at ? p.created_at.split('T')[0] : new Date().toISOString().split('T')[0];
        xml += `
  <url>
    <loc>${baseUrl}/?product=${p.code}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
      });
    }

    xml += `
</urlset>`;

    return res.status(200).send(xml);
  } catch (err) {
    console.error('Error generating dynamic sitemap:', err);
    return res.status(500).send('Error generating sitemap');
  }
}

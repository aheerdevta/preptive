import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const supabase = createClient();
  const baseUrl = 'https://www.preptive.in';

  let categories = [];

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('slug');

    if (!error && Array.isArray(data)) {
      categories = data;
    }
  } catch (e) {
    // fail silently, but return valid XML
  }

  const today = new Date().toISOString().split('T')[0];

  const urls = categories
    .filter(c => c?.slug)
    .map(c => `
  <url>
    <loc>${baseUrl}/category/${c.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.85</priority>
  </url>
    `)
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml.trim(), {
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

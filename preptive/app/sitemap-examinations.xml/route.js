import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const supabase = createClient();
  const baseUrl = 'https://www.preptive.in';

  let exams = [];

  try {
    const { data, error } = await supabase
      .from('examinations')
      .select('slug');

    if (!error && Array.isArray(data)) {
      exams = data;
    }
  } catch (e) {
    // still return valid XML
  }

  const urls = exams
    .filter(e => e?.slug)
    .map(e => {
      const lastmod = new Date().toISOString().split('T')[0];

      return `
  <url>
    <loc>${baseUrl}/examination/${e.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;
    })
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

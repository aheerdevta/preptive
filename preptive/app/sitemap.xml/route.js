// app/sitemap.xml/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = createClient();
    
    // Fetch all published posts for sitemap
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        slug,
        title,
        seo_title,
        seo_description,
        seo_keywords,
        featured_image,
        published_at,
        updated_at,
        language,
        status,
        author:author_id(name),
        exams:post_exam_map(examinations(name)),
        categories:post_category_map(categories(name))
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(5000); // Adjust as needed

    if (error) {
      console.error('Error fetching posts for sitemap:', error);
      return new NextResponse('Error generating sitemap', { status: 500 });
    }

    // Generate XML sitemap
    const sitemap = generateSiteMap(posts || []);

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'text/xml',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
      },
    });
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}

function generateSiteMap(posts) {
  const baseUrl = 'https://www.preptive.in';
  
  // Start building the XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" `;
  xml += `xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" `;
  xml += `xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n\n`;

  // Generate URL entries for each post
  posts.forEach(post => {
    try {
      const url = `${baseUrl}/posts/${encodeURIComponent(post.slug)}`;
      const lastmod = new Date(post.updated_at || post.published_at).toISOString();
      const pubDate = new Date(post.published_at).toISOString();
      
      // Determine change frequency
      const changeFreq = getChangeFrequency(post.updated_at, post.published_at);
      
      // Determine priority
      const priority = getPriority(post);
      
      // Extract keywords ONLY from seo_keywords field
      const keywords = extractKeywordsFromSeoKeywords(post.seo_keywords);
      
      // Get optimized image URL
      const imageUrl = getOptimizedImageUrl(post.featured_image);
      
      // News title (use seo_title if available, otherwise title)
      const newsTitle = (post.seo_title || post.title || '').trim();
      
      xml += `  <url>\n`;
      xml += `    <loc>${escapeXml(url)}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += `    <changefreq>${changeFreq}</changefreq>\n`;
      xml += `    <priority>${priority.toFixed(1)}</priority>\n`;
      
      // ALWAYS include news sitemap data (not just for recent posts)
      if (newsTitle && post.published_at) {
        xml += `    <news:news>\n`;
        xml += `      <news:publication>\n`;
        xml += `        <news:name>Prepative</news:name>\n`;
        xml += `        <news:language>${post.language === 'hi' ? 'hi' : 'en'}</news:language>\n`;
        xml += `      </news:publication>\n`;
        xml += `      <news:publication_date>${pubDate}</news:publication_date>\n`;
        xml += `      <news:title>${escapeXml(newsTitle)}</news:title>\n`;
        if (keywords.length > 0) {
          xml += `      <news:keywords>${escapeXml(keywords.join(', '))}</news:keywords>\n`;
        }
        xml += `    </news:news>\n`;
      }
      
      // Add image sitemap data (if image exists)
      if (imageUrl) {
        const imageTitle = newsTitle || 'Prepative Exam Guide';
        xml += `    <image:image>\n`;
        xml += `      <image:loc>${escapeXml(imageUrl)}</image:loc>\n`;
        xml += `      <image:caption>${escapeXml(imageTitle)}</image:caption>\n`;
        xml += `      <image:title>${escapeXml(imageTitle)}</image:title>\n`;
        xml += `    </image:image>\n`;
      }
      
      xml += `  </url>\n\n`;
    } catch (err) {
      console.error(`Error generating sitemap entry for post ${post.slug}:`, err);
    }
  });

  xml += `</urlset>`;
  return xml;
}

// Helper functions
function getChangeFrequency(updatedAt, publishedAt) {
  const now = new Date();
  const lastUpdated = new Date(updatedAt || publishedAt);
  const daysSinceUpdate = Math.floor((now - lastUpdated) / (1000 * 60 * 60 * 24));
  
  if (daysSinceUpdate < 7) return 'daily';
  if (daysSinceUpdate < 30) return 'weekly';
  if (daysSinceUpdate < 90) return 'monthly';
  return 'yearly';
}

function getPriority(post) {
  let priority = 0.6; // Default
  
  // Increase priority for recent posts
  if (post.published_at) {
    const daysSincePublished = Math.floor((new Date() - new Date(post.published_at)) / (1000 * 60 * 60 * 24));
    if (daysSincePublished < 30) priority += 0.1;
    if (daysSincePublished < 7) priority += 0.1;
  }
  
  // Increase priority for popular categories
  const categoryNames = post.categories?.map(c => c.categories?.name?.toLowerCase()).filter(Boolean) || [];
  const highPriorityCategories = ['syllabus', 'exam pattern', 'notification', 'admit card', 'result', 'answer key'];
  if (categoryNames.some(cat => highPriorityCategories.some(hp => cat.includes(hp)))) {
    priority += 0.1;
  }
  
  // Increase priority for important exams
  const examNames = post.exams?.map(e => e.examinations?.name?.toLowerCase()).filter(Boolean) || [];
  const highPriorityExams = ['ssc', 'upsc', 'bank', 'jee', 'neet', 'gate', 'cat', 'railway'];
  if (examNames.some(exam => highPriorityExams.some(hp => exam.includes(hp)))) {
    priority += 0.1;
  }
  
  return Math.min(priority, 1.0);
}

function extractKeywordsFromSeoKeywords(seoKeywords) {
  const keywords = new Set();
  
  // Only use keywords from the seo_keywords field
  if (seoKeywords && Array.isArray(seoKeywords)) {
    seoKeywords.forEach(keyword => {
      if (keyword && typeof keyword === 'string') {
        const trimmedKeyword = keyword.trim();
        if (trimmedKeyword.length > 0) {
          keywords.add(trimmedKeyword);
        }
      }
    });
  }
  
  // Return as array, limit to 25 keywords
  return Array.from(keywords).slice(0, 25);
}

function getOptimizedImageUrl(imageUrl) {
  if (!imageUrl || typeof imageUrl !== 'string') return null;
  
  const cleanedUrl = imageUrl.trim();
  
  // If it's already a direct image URL, use it
  if (cleanedUrl.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
    return cleanedUrl;
  }
  
  // If it's a Next.js image URL, extract the original URL
  if (cleanedUrl.includes('_next/image')) {
    try {
      // Extract URL from Next.js image URL
      const urlMatch = cleanedUrl.match(/url=([^&]+)/);
      if (urlMatch && urlMatch[1]) {
        const decodedUrl = decodeURIComponent(urlMatch[1]);
        return decodedUrl;
      }
    } catch (e) {
      console.error('Error parsing Next.js image URL:', e);
    }
  }
  
  return cleanedUrl;
}

function escapeXml(unsafe) {
  if (!unsafe || typeof unsafe !== 'string') return '';
  
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
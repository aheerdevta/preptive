// app/posts/[slug]/page.jsx
import { notFound } from 'next/navigation';
import Link from "next/link";
import { createClient } from '@/utils/supabase/server';
import PostContent from '@/components/PostContent';
import RelatedPostsFeed from '@/components/RelatedPostsFeed';
import TableOfContents from '@/components/TableOfContents';
import AuthorBio from '@/components/AuthorBio';
import Breadcrumb from '@/components/Breadcrumb';
import ReadingProgress from '@/components/ReadingProgress';
import ShareButtons from '@/components/ShareButtons';
import StructuredData from '@/components/StructuredData';
import AdBanner from '@/components/AdBanner';
import ScrollToTop from '@/components/ScrollToTop';
import EstimatedReadTime from '@/components/EstimatedReadTime';
import LastUpdated from '@/components/LastUpdated';
import { formatDate, generateSlug } from '@/utils/helpers';

// ========== SEO OPTIMIZATIONS ==========
// 1. Generate static paths for better SEO
export async function generateStaticParams() {
  const supabase = createClient();
  
  const { data: posts } = await supabase
    .from('posts')
    .select('slug, published_at, updated_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(2000);
  
  return posts?.map(post => ({
    slug: post.slug,
  })) || [];
}

// 2. Cache control for maximum SEO performance
export const revalidate = 3600;
export const dynamicParams = true;

// 3. Generate metadata with rich SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  const supabase = createClient();
  
  try {
    const { data: post, error } = await supabase
      .from('posts')
      .select(`
        title,
        seo_title,
        seo_description,
        short_description,
        featured_image,
        author:author_id(name),
        categories:post_category_map(categories(name)),
        exams:post_exam_map(examinations(name)),
        published_at,
        updated_at,
        language,
        image_alt,
        seo_keywords
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (!post || error) {
      return {
        title: 'Post Not Found | PrepTive',
        description: 'The requested article could not be found.',
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const examNames = post.exams?.map(e => e.examinations?.name).filter(Boolean) || [];
    const categoryNames = post.categories?.map(c => c.categories?.name).filter(Boolean) || [];
    
    const baseTitle = post.seo_title || post.title;
    const examSuffix = examNames.length > 0 ? ` - ${examNames.join(', ')}` : '';
    const pageTitle = `${baseTitle}${examSuffix} | PrepTive`;
    
    let description = post.seo_description || post.short_description || '';
    if (!description && examNames.length > 0) {
      description = `Complete guide for ${examNames.join(', ')} preparation. Get syllabus, exam pattern, and study tips.`;
    }
    
    const defaultKeywords = [...examNames, ...categoryNames];
    const keywords = post.seo_keywords || defaultKeywords;
    
    const canonicalUrl = `https://www.preptive.in/posts/${slug}`;
    const featuredImage = post.featured_image || 'https://www.preptive.in/og-default.jpg';

    return {
      title: pageTitle,
      description,
      keywords,
      other: {
        'content-language': post.language === 'hi' ? 'hi' : 'en',
      },

      openGraph: {
        title: pageTitle,
        description,
        url: canonicalUrl,
        siteName: 'PrepTive',
        images: [
          {
            url: featuredImage,
            width: 1200,
            height: 630,
            alt: post.image_alt || post.title,
          },
        ],
        locale: post.language === 'hi' ? 'hi_IN' : 'en_IN',
        type: 'article',
        publishedTime: post.published_at,
        modifiedTime: post.updated_at,
        authors: post.author ? [post.author.name] : [],
        tags: keywords,
        section: categoryNames[0] || 'Education',
      },
      
      twitter: {
        card: 'summary_large_image',
        title: pageTitle,
        description,
        images: [featuredImage],
        creator: '@preptive_in',
        site: '@preptive_in',
      },
      
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      
      alternates: {
        canonical: canonicalUrl,
      },
      
      authors: post.author ? [{ name: post.author.name }] : [],
      publisher: 'PrepTive',
      category: categoryNames[0] || 'Education',
    };
  } catch (error) {
    console.error('Metadata generation error:', error);
    return {
      title: 'Post Not Found | PrepTive',
      description: 'The requested article could not be found.',
    };
  }
}

// ========== MAIN PAGE COMPONENT ==========
export default async function PostPage({ params }) {
  const { slug } = await params;
  
  const supabase = createClient();
  
  try {
    // FIXED: Specify exact relationship for exam_boards to avoid ambiguity
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select(`
        *,
        author:author_id(*),
        categories:post_category_map(
          categories(*)
        ),
        exams:post_exam_map(
          examinations(
            *,
            exam_boards!examinations_board_id_fkey(*)
          )
        ),
        tags:post_tag_map(
          tags(*)
        ),
        post_images(*)
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (!post || postError) {
      console.error('Error fetching post:', postError);
      notFound();
    }

    // Get category and exam IDs for related posts
    const categoryIds = post.categories?.map(c => c.categories?.id).filter(Boolean) || [];
    const examIds = post.exams?.map(e => e.examinations?.id).filter(Boolean) || [];
    
    // Fetch related posts with proper query structure
    let relatedPostsQuery = supabase
      .from('posts')
      .select(`
        id,
        slug,
        title,
        image_alt,
        short_description,
        featured_image,
        published_at,
        author:author_id(name),
        categories:post_category_map(categories(name))
      `)
      .neq('id', post.id)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(6);

    // Apply filters based on categories and exams
    if (categoryIds.length > 0 || examIds.length > 0) {
      // First, get post IDs that match categories
      let matchingPostIds = new Set();
      
      if (categoryIds.length > 0) {
        const { data: categoryPosts } = await supabase
          .from('post_category_map')
          .select('post_id')
          .in('category_id', categoryIds)
          .neq('post_id', post.id);
        
        if (categoryPosts) {
          categoryPosts.forEach(item => matchingPostIds.add(item.post_id));
        }
      }
      
      if (examIds.length > 0) {
        const { data: examPosts } = await supabase
          .from('post_exam_map')
          .select('post_id')
          .in('exam_id', examIds)
          .neq('post_id', post.id);
        
        if (examPosts) {
          examPosts.forEach(item => matchingPostIds.add(item.post_id));
        }
      }
      
      // If we have matching IDs, filter by them
      if (matchingPostIds.size > 0) {
        relatedPostsQuery = relatedPostsQuery.in('id', Array.from(matchingPostIds));
      }
    }

    const { data: relatedPosts } = await relatedPostsQuery;
    const finalRelatedPosts = relatedPosts || [];

    // Extract headings for table of contents
    const headings = Array.isArray(post.content) ? post.content.filter(item => 
      item.type === 'heading' && (item.level === 2 || item.level === 3)
    ) : [];

    // Calculate reading time
    const wordCount = post.content ? JSON.stringify(post.content).split(/\s+/).length : 0;
    const readingTime = Math.ceil(wordCount / 200) || 5;

    // Generate FAQ schema
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: headings
        .filter(h => h.level === 2)
        .slice(0, 10)
        .map((heading, index) => ({
          '@type': 'Question',
          name: heading.text,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Learn about ${heading.text} in this comprehensive guide covering all aspects for ${post.exams?.[0]?.examinations?.name || 'competitive exam'} preparation.`,
          },
        })),
    };

    // Breadcrumb schema
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.preptive.in',
        },
        ...(post.categories?.[0]?.categories ? [{
          '@type': 'ListItem',
          position: 2,
          name: post.categories[0].categories.name,
          item: `https://www.preptive.in/category/${post.categories[0].categories.slug}`,
        }] : []),
        ...(post.exams?.[0]?.examinations ? [{
          '@type': 'ListItem',
          position: 3,
          name: post.exams[0].examinations.name,
          item: `https://www.preptive.in/exam/${generateSlug(post.exams[0].examinations.name)}`,
        }] : []),
        {
          '@type': 'ListItem',
          position: post.categories?.[0]?.categories ? (post.exams?.[0]?.examinations ? 4 : 3) : (post.exams?.[0]?.examinations ? 3 : 2),
          name: post.title,
          item: `https://www.preptive.in/posts/${slug}`,
        },
      ],
    };

    // Article schema for rich snippets
    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.seo_description || post.short_description || '',
      image: post.featured_image ? [post.featured_image] : [],
      datePublished: post.published_at,
      dateModified: post.updated_at,
      author: post.author ? {
        '@type': 'Person',
        name: post.author.name,
        url: post.author.website || `https://www.preptive.in/authors/${generateSlug(post.author.name)}`,
      } : undefined,
      publisher: {
        '@type': 'Organization',
        name: 'PrepTive',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.preptive.in/logo.png'
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://www.preptive.in/posts/${slug}`,
      },
      keywords: Array.isArray(post.seo_keywords) ? post.seo_keywords.join(', ') : post.seo_keywords || '',
      articleSection: post.categories?.map(c => c.categories?.name).filter(Boolean).join(', ') || 'Education',
      wordCount: wordCount,
      timeRequired: `PT${readingTime}M`,
    };

    return (
      <>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
          key="article-schema"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          key="faq-schema"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
          key="breadcrumb-schema"
        />

        <ReadingProgress />

        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
          <article 
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
            itemScope
            itemType="https://schema.org/Article"
          >
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                ...(post.exams?.[0]?.examinations ? [{
                  label: post.exams[0].examinations.name,
                  href: `/exam/${generateSlug(post.exams[0].examinations.name)}`,
                }] : []),
                ...(post.categories?.[0]?.categories ? [{
                  label: post.categories[0].categories.name,
                  href: `/category/${post.categories[0].categories.slug}`,
                }] : []),
                { label: post.title, current: true },
              ]}
            />

            <header className="mb-12">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-3/4">
                  <div className="flex flex-wrap gap-2 mb-4" itemProp="articleSection">
                    {post.categories?.map(({ categories }) => categories && (
                      <span
                        key={categories.id}
                        className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full"
                        itemProp="keywords"
                      >
                        {categories.name}
                      </span>
                    ))}
                    {post.exams?.map(({ examinations }) => examinations && (
                      <span
                        key={examinations.id}
                        className="inline-block bg-purple-100 text-purple-800 text-sm font-semibold px-3 py-1 rounded-full"
                        itemProp="keywords"
                      >
                        {examinations.name}
                      </span>
                    ))}
                  </div>

                  <h1 
                    className="text-2xl md:text-3xl lg:text-3xl font-bold text-gray-900 mb-2 leading-tight"
                    itemProp="headline"
                  >
                    {post.title}
                  </h1>

                  {post.short_description && (
                    <p 
                      className="text-xl text-gray-600 mb-4" 
                      itemProp="description"
                      style={{ lineHeight: '1.8' }}
                    >
                      {post.short_description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
                    {post.author && (
                      <div
                        className="flex items-center gap-2"
                        itemProp="author"
                        itemScope
                        itemType="https://schema.org/Person"
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                          {post.author.avatar_url && (
                            <img
                              src={post.author.avatar_url}
                              alt={post.author.name}
                              className="w-full h-full object-cover"
                              itemProp="image"
                              width="40"
                              height="40"
                            />
                          )}
                        </div>

                        <div>
                          <Link
                            href={`/author/${post.author.slug || generateSlug(post.author.name)}`}
                            itemProp="url"
                            className="font-semibold hover:underline"
                          >
                            <span itemProp="name">{post.author.name}</span>
                          </Link>

                          {post.author.bio && (
                            <span className="text-sm ml-2" itemProp="description">
                              • {post.author.bio}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div
                      className="flex items-center gap-6 overflow-x-auto whitespace-nowrap 
                               max-sm:gap-3 max-sm:text-xs max-sm:overflow-x-scroll"
                      itemProp="datePublished"
                      content={post.published_at}
                    >
                      <div className="flex items-center gap-2 max-sm:gap-1">
                        <svg
                          className="w-5 h-5 max-sm:w-3.5 max-sm:h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>

                        <time dateTime={post.published_at}>
                          {formatDate(post.published_at)}
                        </time>
                      </div>

                      <div className="max-sm:text-xs">
                        <EstimatedReadTime minutes={readingTime} />
                      </div>

                      <div className="max-sm:text-xs">
                        <LastUpdated date={post.updated_at} />
                      </div>
                    </div>
                  </div>

                  <ShareButtons
                    url={`https://www.preptive.in/posts/${slug}`}
                    title={post.title}
                    description={post.short_description}
                    image={post.featured_image}
                  />
                </div>

                <div className="lg:w-1/4">
                  <div className="sticky top-24">
                    {post.featured_image && (
                      <div className="rounded-2xl overflow-hidden shadow-2xl">
                        <img
                          src={post.featured_image}
                          alt={post.image_alt || post.title}
                          className="w-full h-auto object-cover"
                          itemProp="image"
                          loading="eager"
                          width="600"
                          height="400"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </header>

            {headings.length > 0 && (
              <aside className="mb-5">
                <TableOfContents headings={headings} />
              </aside>
            )}

          

            <main>
              <div 
                className="prose prose-lg max-w-none mb-10" 
                itemProp="articleBody"
                style={{ 
                  fontSize: '1.125rem',
                  lineHeight: '1.8',
                }}
              >
                <PostContent 
                  content={post.content} 
                  language={post.language} 
                  headings={headings}
                />
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t">
                  <h2 className="text-2xl font-semibold mb-4 text-gray-900">Related Topics:</h2>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(({ tags }) => tags && (
                      <a
                        key={tags.id}
                        href={`/tag/${generateSlug(tags.name)}`}
                        className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm px-4 py-2 rounded-full transition-colors"
                        rel="tag"
                      >
                        #{tags.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              

              <div className="mt-12">
                <ShareButtons
                  url={`https://www.preptive.in/posts/${slug}`}
                  title={post.title}
                  description={post.short_description}
                  image={post.featured_image}
                />
              </div>
            </main>
          </article>

          {finalRelatedPosts.length > 0 && (
            <section 
              className="bg-gray-50 py-16 mt-16"
              aria-label="Related articles"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Related Articles You Might Like
                  </h2>
                  <p className="text-xl text-gray-600">
                    Continue your preparation with these related guides
                  </p>
                </header>
                <RelatedPostsFeed posts={finalRelatedPosts} />
              </div>
            </section>
          )}

          <ScrollToTop />
        </div>
      </>
    );
  } catch (error) {
    console.error('Post page error:', error);
    notFound();
  }
}
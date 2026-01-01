// app/posts/page.jsx
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { formatDate, generateSlug } from '@/utils/helpers';

// ========== SEO OPTIMIZATIONS ==========

// 1. Generate static params for better SEO
export async function generateStaticParams() {
  return [
    { page: '1' },
    { page: '2' },
    { page: '3' },
  ];
}

// 2. Cache control for maximum performance
export const revalidate = 3600; // Revalidate every hour
export const dynamicParams = true;

// 3. Generate comprehensive metadata
export async function generateMetadata({ searchParams }) {
  const { page = 1 } = await searchParams;
  const currentPage = parseInt(page);
  
  const supabase = createClient();
  
  // Get total posts count for pagination metadata
  const { count } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published');

  const totalPosts = count || 0;
  const totalPages = Math.ceil(totalPosts / 20);
  
  const baseUrl = 'https://www.preptive.in/posts';
  const canonicalUrl = currentPage > 1 ? `${baseUrl}?page=${currentPage}` : baseUrl;
  
  // Dynamic title and description based on page
  const pageSuffix = currentPage > 1 ? ` - Page ${currentPage}` : '';
  const title = `Latest Exam Updates, Admit Cards, Results & Notifications | PrepTive`;
  const description = currentPage > 1 
  ? `Browse page ${currentPage} for the latest exam notifications, admit card updates, results, important dates, syllabus updates, and exam pattern changes across all major competitive exams in India.`
  : `Stay updated with the latest exam notifications, admit cards, results, important dates, syllabus revisions, and exam pattern updates for UPSC, SSC, Banking, Railways, state-level exams, and more.`;

  return {
    // Basic metadata
    title,
    description,
    keywords: [
  'latest exam notifications',
  'admit card updates',
  'exam results',
  'important exam dates',
  'government exam updates',
  'competitive exam news',
  'exam syllabus updates',
  'exam pattern changes',
  'UPSC SSC exam updates',
  'banking railway exam notifications',
  'state government exam news',
  'job recruitment notifications',
  'education news india',
],
    
    // Open Graph
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'PrepTive',
      images: [
        {
          url: 'https://www.preptive.in/og-posts.jpg',
          width: 1200,
          height: 630,
          alt: 'PrepTive',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    
    // Twitter
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://www.preptive.in/og-posts.jpg'],
      creator: '@preptive_in',
      site: '@preptive_in',
    },
    
    // Robots
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
    
    // Canonical and pagination
    alternates: {
      canonical: canonicalUrl,
     
      ...(currentPage > 1 && {
        prev: `${baseUrl}?page=${currentPage - 1}`,
      }),
      ...(currentPage < totalPages && {
        next: `${baseUrl}?page=${currentPage + 1}`,
      }),
    },
    
   
    
    // Additional
    publisher: 'PrepTive',
    category: 'Education',
  };
}

// ========== MAIN PAGE COMPONENT ==========
export default async function PostsPage({ searchParams }) {
  const { page = 1 } = await searchParams;
  const currentPage = parseInt(page);
  const postsPerPage = 20;
  
  const supabase = createClient();
  
  // ========== PARALLEL DATA FETCHING ==========
  const [postsResult, categoriesResult, examsResult, countResult] = await Promise.allSettled([
    // 1. Fetch paginated posts with relations
    supabase
      .from('posts')
      .select(`
        id,
        slug,
        title,
        short_description,
        featured_image,
        published_at,
        updated_at,
        author:author_id(name, avatar_url),
        categories:post_category_map(categories(id, name, slug)),
        exams:post_exam_map(examinations(id, name, exam_boards!examinations_board_id_fkey(name)))
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .range((currentPage - 1) * postsPerPage, currentPage * postsPerPage - 1),
    
    // 2. Fetch all categories for filtering (if needed)
    supabase
      .from('categories')
      .select('id, name, slug')
      .order('name'),
    
    // 3. Fetch all exams for filtering (if needed)
    supabase
      .from('examinations')
      .select('id, name, slug')
      .order('name'),
    
    // 4. Count total posts for pagination
    supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')
  ]);

  // Handle results safely - FIX: Add proper null checks
  const postsData = postsResult.status === 'fulfilled' ? postsResult.value : null;
  const posts = postsData && postsData.data ? postsData.data : [];
  
  const categories = categoriesResult.status === 'fulfilled' ? categoriesResult.value.data : [];
  const exams = examsResult.status === 'fulfilled' ? examsResult.value.data : [];
  const totalPosts = countResult.status === 'fulfilled' ? countResult.value.count || 0 : 0;
  
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  
  // ========== SEO ENHANCEMENTS ==========
  
  // Schema.org for Article List (only create if we have posts)
  const articleListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    numberOfItems: totalPosts,
    name: 'Study Materials & Exam Guides',
    description: 'Comprehensive collection of study materials and exam preparation guides',
    url: `https://www.preptive.in/posts${currentPage > 1 ? `?page=${currentPage}` : ''}`,
    itemListElement: posts && posts.length > 0 ? posts.slice(0, 10).map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1 + ((currentPage - 1) * postsPerPage),
      item: {
        '@type': 'Article',
        headline: post.title,
        description: post.short_description,
        image: post.featured_image,
        datePublished: post.published_at,
        dateModified: post.updated_at,
        author: post.author ? {
          '@type': 'Person',
          name: post.author.name,
        } : undefined,
        url: `https://www.preptive.in/posts/${post.slug}`,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://www.preptive.in/posts/${post.slug}`,
        },
      },
    })) : [],
  };

  // Breadcrumb Schema
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
      {
        '@type': 'ListItem',
        position: 2,
        name: 'All Posts',
        item: 'https://www.preptive.in/posts',
      },
      ...(currentPage > 1 ? [{
        '@type': 'ListItem',
        position: 3,
        name: `Page ${currentPage}`,
        item: `https://www.preptive.in/posts?page=${currentPage}`,
      }] : []),
    ],
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleListSchema) }}
      />

      <div 
        className="min-h-screen bg-gradient-to-b from-gray-50 to-white"
        itemScope
        itemType="https://schema.org/CollectionPage"
      >
        {/* Breadcrumb Navigation */}
        <nav 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
          aria-label="Breadcrumb"
        >
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link 
                href="/" 
                className="text-gray-500 hover:text-gray-700 transition-colors"
                itemProp="item"
              >
                <span itemProp="name">Home</span>
              </Link>
            </li>
            <li className="flex items-center">
              <svg 
                className="flex-shrink-0 h-5 w-5 text-gray-400" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
                  clipRule="evenodd" 
                />
              </svg>
              <span 
                className="ml-2 text-gray-700 font-semibold"
                itemProp="name"
                aria-current="page"
              >
                All Posts
              </span>
            </li>
          </ol>
        </nav>

        
        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Posts List */}
<div 
  className="space-y-0"
  itemScope
  itemType="https://schema.org/ItemList"
>
  {posts && posts.length > 0 ? (
    posts.map((post, index) => (
      <article 
        key={post.id}
        className="group relative py-8 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-300"
        itemScope
        itemType="https://schema.org/Article"
        itemProp="itemListElement"
      >
        {/* Entire card is clickable via wrapping Link */}
        <Link 
          href={`/posts/${post.slug}`}
          className="absolute inset-0 z-10"
          aria-label={`Read article: ${post.title}`}
          tabIndex={-1}
        />
        
        {/* Post Meta Information */}
        <div className="flex flex-wrap gap-2 mb-3 relative z-20">
          {/* Exam Badges */}
          {post.exams && post.exams.slice(0, 2).map(({ examinations }) => examinations && (
            <Link
              key={examinations.id}
              href={`/exam/${examinations.slug || generateSlug(examinations.name)}`}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors no-underline relative z-30"
              itemProp="keywords"
            >
              <svg 
                className="w-3 h-3 mr-1" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" 
                  clipRule="evenodd" 
                />
              </svg>
              {examinations.name}
              {examinations.exam_boards && examinations.exam_boards[0]?.name && (
                <span className="ml-1">• {examinations.exam_boards[0].name}</span>
              )}
            </Link>
          ))}
          
          {/* Category Badges */}
          {post.categories && post.categories.slice(0, 2).map(({ categories }) => categories && (
            <Link
              key={categories.id}
              href={`/category/${categories.slug}`}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors no-underline relative z-30"
              itemProp="articleSection"
            >
              {categories.name}
            </Link>
          ))}
        </div>

        {/* Post Title with Hover Effect */}
        <h2 className="mb-3 relative">
          <Link 
            href={`/posts/${post.slug}`}
            className="text-1xl md:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight block no-underline"
            itemProp="headline"
          >
            {post.title}
          </Link>
          
          {/* Hover Underline Effect */}
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
        </h2>

        {/* Post Description with Hover Effect */}
        {post.short_description && (
          <div className="relative mb-4">
            <Link 
              href={`/posts/${post.slug}`}
              className="text-gray-600 group-hover:text-gray-800 leading-relaxed transition-colors block no-underline"
              itemProp="description"
            >
              {post.short_description}
            </Link>
            {/* Hover underline for description */}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 "></span>
          </div>
        )}

        {/* Post Meta - Interactive Elements */}
        <div className="flex flex-wrap items-center justify-between mt-6 relative z-20">
          <div className="flex items-center space-x-4">
            {/* Author with Link */}
            {post.author && (
              <div 
                className="flex items-center space-x-2 group/author"
                itemProp="author"
                itemScope
                itemType="https://schema.org/Person"
              >
                {post.author.avatar_url && (
                  <img
                    src={post.author.avatar_url}
                    alt={post.author.name}
                    className="w-8 h-8 rounded-full"
                    itemProp="image"
                    loading="lazy"
                  />
                )}
                <span 
                  className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
                  itemProp="name"
                >
                  {post.author.name}
                </span>
              </div>
            )}
            
            {/* Date */}
            <div className="relative">
              <time 
                className="text-gray-500 text-sm group-hover:text-gray-700 transition-colors"
                dateTime={post.published_at}
                itemProp="datePublished"
              >
                {formatDate(post.published_at)}
              </time>
            </div>
            
            {/* Reading Time Estimate - Hidden on mobile */}
            <div className="relative hidden sm:block">
              <span className="text-gray-500 text-sm group-hover:text-gray-700 transition-colors">
                • {Math.ceil((post.short_description?.split(' ').length || 0) / 200) || 5} min read
              </span>
            </div>
          </div>
          
          {/* Updated Badge if recently updated - Hidden on mobile */}
          {post.updated_at && 
            new Date(post.updated_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
              <div className="hidden sm:block">
                <Link
                  href={`/posts/${post.slug}#updates`}
                  className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800 hover:bg-green-200 transition-colors no-underline"
                  aria-label="See recent updates"
                >
                  <svg 
                    className="w-3 h-3 mr-1" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                  Updated
                </Link>
              </div>
            )}
        </div>

                  {/* Hover Arrow Indicator */}
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <svg 
                      className="w-5 h-5 text-blue-600" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </div>
                </article>
              ))
            ) : (
              <div className="text-center py-16">
                <svg 
                  className="mx-auto h-12 w-12 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No posts found</h3>
                <p className="mt-2 text-gray-500">
                  Check back later for new study materials.
                </p>
              </div>
            )}
          </div>

          {/* Pagination with Schema */}
          {totalPages > 1 && posts && posts.length > 0 && (
            <nav 
              className="mt-16 border-t border-gray-200 pt-8"
              aria-label="Pagination"
              itemScope
              itemType="https://schema.org/SiteNavigationElement"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between">
                {/* Page Info */}
                <div className="text-sm text-gray-700 mb-4 sm:mb-0">
                  Showing <span className="font-semibold">
                    {((currentPage - 1) * postsPerPage) + 1}
                  </span> to{' '}
                  <span className="font-semibold">
                    {Math.min(currentPage * postsPerPage, totalPosts)}
                  </span> of{' '}
                  <span className="font-semibold">{totalPosts.toLocaleString()}</span> articles
                </div>
                
                {/* Pagination Buttons */}
                <div className="flex items-center space-x-2">
                  {/* Previous Button */}
                  {currentPage > 1 ? (
                    <Link
                      href={`/posts?page=${currentPage - 1}`}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      itemProp="url"
                      rel="prev"
                    >
                      <svg 
                        className="mr-2 h-4 w-4" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                      Previous
                    </Link>
                  ) : (
                    <span className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-400 bg-gray-50 cursor-not-allowed">
                      <svg 
                        className="mr-2 h-4 w-4" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                      Previous
                    </span>
                  )}
                  
                  {/* Page Numbers */}
                  <div className="hidden sm:flex space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return pageNum <= totalPages ? (
                        <Link
                          key={pageNum}
                          href={`/posts?page=${pageNum}`}
                          className={`px-4 py-2 border text-sm font-medium rounded-md transition-colors ${
                            currentPage === pageNum
                              ? 'border-blue-500 bg-blue-50 text-blue-600'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                          itemProp="url"
                          aria-current={currentPage === pageNum ? 'page' : undefined}
                        >
                          {pageNum}
                        </Link>
                      ) : null;
                    })}
                    
                    {/* Ellipsis for many pages */}
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <span className="px-4 py-2 border border-gray-300 text-sm font-medium text-gray-500">
                        ...
                      </span>
                    )}
                    
                    {/* Last page if not shown */}
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <Link
                        href={`/posts?page=${totalPages}`}
                        className="px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                        itemProp="url"
                      >
                        {totalPages}
                      </Link>
                    )}
                  </div>
                  
                  {/* Mobile Page Selector */}
                  <div className="sm:hidden">
                    <span className="text-sm text-gray-700">
                      Page <span className="font-semibold">{currentPage}</span> of{' '}
                      <span className="font-semibold">{totalPages}</span>
                    </span>
                  </div>
                  
                  {/* Next Button */}
                  {currentPage < totalPages ? (
                    <Link
                      href={`/posts?page=${currentPage + 1}`}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      itemProp="url"
                      rel="next"
                    >
                      Next
                      <svg 
                        className="ml-2 h-4 w-4" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                    </Link>
                  ) : (
                    <span className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-400 bg-gray-50 cursor-not-allowed">
                      Next
                      <svg 
                        className="ml-2 h-4 w-4" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                    </span>
                  )}
                </div>
              </div>
            </nav>
          )}

          {/* SEO Footer Content */}
          {posts && posts.length > 0 && (
            <footer className="mt-16 pt-8 border-t border-gray-200">
              <div className="prose prose-lg max-w-none text-gray-600">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                 About PrepTive
                </h2>
                <p>
                PrepTive was started to help students stay informed and never miss important exam updates. In today’s fast-paced exam world, even a small delay in information can cost a whole year. We make sure that doesn’t happen. We share the latest exam notifications, admit card releases, result updates, important dates, syllabus changes, exam pattern updates, and recruitment news in a clear and reliable way. Our platform covers all major competitive and government exams in India, such as UPSC, SSC, Banking, Railways, JEE, NEET, CLAT, state-level exams, scholarships, and university entrance tests.
                </p>
                <p>
                 We check every update on PrepTive with official sources and explain it in simple, clear language. Instead of only posting headlines, we break down what each update means for students, including eligibility, next steps, deadlines, and other important details. PrepTive is made for serious students who want accurate information, timely alerts, and no confusion. Whether you are following a government job notice, waiting for an admit card, or checking the latest exam schedule, PrepTive helps you stay ahead. Clear information. Timely updates. One trusted platform for every exam.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                  Featured Exam Categories:
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <li>• UPSC Civil Services (IAS, IPS, IFS)</li>
                  <li>• SSC (CGL, CHSL, MTS, GD)</li>
                  <li>• Banking (IBPS, SBI, RBI)</li>
                  <li>• Railway Recruitment Exams</li>
                  <li>• State PSC Examinations</li>
                  <li>• Defence Exams (NDA, CDS, AFCAT)</li>
                  <li>• Teaching Exams (CTET, UGC NET)</li>
                  <li>• Engineering Entrance (JEE, GATE)</li>
                  <li>• Medical Entrance (NEET, AIIMS)</li>
                  <li>• Management Exams (CAT, MAT, XAT)</li>
                </ul>
              </div>
            </footer>
          )}
        </main>
      </div>
    </>
  );
}
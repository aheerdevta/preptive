// app/tag/[name]/page.jsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

export async function generateMetadata({ params }) {
  const { name } = await params;
  const supabase = createClient();
const tagName = decodeURIComponent(name);
  try {
    const { data: tag, error } = await supabase
      .from('tags')
      .select('name','description')
      .eq('name', tagName)
      .single();

    if (error || !tag) {
      return {
        title: 'Tag Not Found | Preptive',
        description: 'The requested tag could not be found.',
      };
    }

    return {
      title: `${tag.name} | Preptive`,
      description: tag.description ,
      openGraph: {
        title: `${tag.name}  | Preptive`,
        url: `https://www.preptive.in/tag/${name}`,
        siteName: 'Preptive',     
        locale: 'en_IN',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${tag.name} articles | Preptive`,
        site: '@preptive',
      },
      alternates: {
        canonical: `https://www.preptive.in/tag/${name}`,
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
    };
  } catch (error) {
    console.error('Error fetching tag metadata:', error);
    return {
      title: 'Tag | Preptive',
      description: 'Exam preparation resources, syllabus updates, and study materials by tag.',
    };
  }
}

export default async function TagPage({ params }) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  const supabase = createClient();

  try {
    // Fetch tag details
    const { data: tag, error: tagError } = await supabase
      .from('tags')
      .select('*')
      .eq('name', decodedName)
      .single();

    if (tagError || !tag) {
      notFound();
    }

    // Fetch posts for this tag with proper joins
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select(`
        id,
        slug,
        title,
        short_description,
        featured_image,
        published_at,
        status,
        author:author_id (id, name, avatar_url),
        post_tag_map!inner (
          tag:tags!inner (id, name)
        ),
        post_category_map (
          category:categories (id, name, slug)
        ),
        post_exam_map (
          exam:examinations (id, name, slug)
        )
      `)
      .eq('status', 'published')
      .eq('post_tag_map.tag.name', decodedName)
      .order('published_at', { ascending: false })
      .limit(12);

    if (postsError) {
      console.error('Error fetching posts:', postsError);
    }

    const formatDate = (dateString) => {
      try {
        return new Date(dateString).toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      } catch {
        return '';
      }
    };

    // Get unique exams from posts for filtering
    const uniqueExams = posts?.reduce((acc, post) => {
      post.post_exam_map?.forEach(({ exam }) => {
        if (exam && !acc.some(e => e.id === exam.id)) {
          acc.push(exam);
        }
      });
      return acc;
    }, []) || [];

    // Get unique categories from posts
    const uniqueCategories = posts?.reduce((acc, post) => {
      post.post_category_map?.forEach(({ category }) => {
        if (category && !acc.some(c => c.id === category.id)) {
          acc.push(category);
        }
      });
      return acc;
    }, []) || [];

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: `${tag.name} - Tagged Articles`,
              description: `Articles and exam resources tagged with ${tag.name}`,
              url: `https://www.preptive.in/tag/${name}`,
              publisher: {
                '@type': 'Organization',
                name: 'Preptive',
                url: 'https://www.preptive.in',
                logo: 'https://www.preptive.in/logo.png',
                sameAs: [
                  'https://twitter.com/preptive',
                  'https://facebook.com/preptive',
                  'https://linkedin.com/company/preptive'
                ]
              },
              mainEntity: {
                '@type': 'ItemList',
                numberOfItems: posts?.length || 0,
                itemListElement: posts?.map((post, index) => ({
                  '@type': 'ListItem',
                  position: index + 1,
                  url: `https://www.preptive.in/posts/${post.slug}`,
                  item: {
                    '@type': 'Article',
                    headline: post.title,
                    description: post.short_description,
                    image: post.featured_image,
                    datePublished: post.published_at,
                    author: {
                      '@type': 'Person',
                      name: post.author?.name
                    },
                    publisher: {
                      '@type': 'Organization',
                      name: 'Preptive'
                    }
                  }
                })) || []
              }
            })
          }}
        />

        {/* Hero Section */}
        <div className="bg-black py-4">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2">
                  <li>
                    <Link href="/" className="flex items-center text-sm font-medium text-blue-100 hover:text-white">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                      Home
                    </Link>
                  </li>
                  
                  <li>
                    <span className="text-sm font-medium text-white">
                      {tag.name}
                    </span>
                  </li>
                </ol>
              </nav>

              {/* Tag Title (Right Side) */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
                  #{tag.name}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Simple List View */}
          <div className="space-y-6">
            {/* Loop through posts (latest first) */}
            {posts
              ?.sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
              .map((post) => (
                <div 
                  key={post.id} 
                  className="block pb-6 border-b border-gray-200 group"
                >
                  {/* Category + Exam Tag + Date */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {post.post_category_map?.[0]?.category?.name && (
                      <Link
                        href={`/category/${post.post_category_map[0].category.slug}`}
                        className="px-2 py-1 text-xs font-medium text-green-700 bg-green-50 rounded hover:bg-green-100 transition-colors"
                      >
                        {post.post_category_map[0].category.name}
                      </Link>
                    )}
                    {post.post_exam_map?.[0]?.exam?.name && (
                      <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded">
                        {post.post_exam_map[0].exam.name}
                      </span>
                    )}
                    <time className="text-xs text-gray-500">
                      {formatDate(post.published_at)}
                    </time>
                  </div>

                  {/* Title (Click + Underline Hover) */}
                  <Link href={`/posts/${post.slug}`}>
                    <h2
                      className="
                        font-semibold text-gray-900 inline-block relative 
                        hover:text-blue-600 transition-colors
                        text-lg md:text-xl
                      "
                    >
                      <span
                        className="
                          bg-gradient-to-r from-blue-600 to-blue-600 
                          bg-[length:0px_2px] bg-left-bottom bg-no-repeat 
                          transition-[background-size] duration-300 
                          group-hover:bg-[length:100%_2px] pb-0.5
                        "
                      >
                        {post.title}
                      </span>
                    </h2>
                  </Link>

                  {/* Description (Also Clickable) */}
                  <Link href={`/posts/${post.slug}`}>
                    <p className="mt-2 text-gray-600 text-sm md:text-base">
                      {post.short_description || "Click to read the full article."}
                    </p>
                  </Link>

                  {/* Additional Tags */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {post.post_tag_map?.slice(0, 3).map(({ tag: postTag }) => (
                      <Link
                        key={postTag.id}
                        href={`/tag/${encodeURIComponent(postTag.name)}`}
                        className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                      >
                        #{postTag.name}
                      </Link>
                    ))}
                    {post.post_tag_map?.length > 3 && (
                      <span className="px-2 py-1 text-xs text-gray-500">
                        +{post.post_tag_map.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>

          {/* Pagination (Optional) */}
          {posts?.length >= 12 && (
            <div className="mt-12 text-center">
              <button className="px-8 py-3 font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-0.5">
                Load More Articles
              </button>
            </div>
          )}

          {/* No Posts Fallback */}
          {(!posts || posts.length === 0) && (
            <div className="py-20 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-blue-50">
                <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">No articles with this tag</h3>
              <p className="mb-8 text-gray-600 max-w-md mx-auto">
                We haven&apos;t published any articles tagged with &quot;{tag.name}&quot; yet. Check back soon or explore other tags!
              </p>
              <Link
                href="/tags"
                className="inline-flex items-center px-6 py-3 font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Browse All Tags
              </Link>
            </div>
          )}

          
        </main>

       {/* Related Categories */}
<section className="bg-emerald-50 py-16 mt-4 border-t">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12 flex items-center justify-center gap-2">
      Explore Other Categories
    </h2>
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {['Latest Jobs', 'Results', 'Admit Card', 'Syllabus', 'Exam Pattern'].map((cat) => (
        <Link
          key={cat}
          href={`/category/${cat.toLowerCase().replace(/\s+/g, '-')}`}
          className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 md:p-6 text-center hover:shadow-md transition-shadow"
        >
          <div className="mb-2 sm:mb-3 md:mb-4 flex justify-center">
            {cat === 'Latest Jobs' && (
              <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z M12 14l9-5-9-5-9 5 9 5z" />
              </svg>
            )}
            {cat === 'Results' && (
              <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            )}
            {cat === 'Admit Card' && (
              <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            )}
            {cat === 'Syllabus' && (
              <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            )}
            {cat === 'Exam Pattern' && (
              <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            )}
          </div>
          <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2">{cat}</h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-tight sm:leading-normal">
            {cat === 'Latest Jobs' && 'Latest job notifications & vacancies'}
            {cat === 'Results' && 'Exam results & scorecards'}
            {cat === 'Admit Card' && 'Hall tickets & admit cards'}
            {cat === 'Syllabus' && 'Complete exam syllabus'}
            {cat === 'Exam Pattern' && 'Latest Exam Pattern & updates'}
          </p>
        </Link>
      ))}
    </div>
  </div>
</section>       

      </div>
    );
  } catch (error) {
    console.error('Error loading tag page:', error);
    notFound();
  }
}

// Generate static params for SSG
export async function generateStaticParams() {
  const supabase = createClient();
  
  try {
    const { data: tags } = await supabase
      .from('tags')
      .select('name');

    return tags?.map(({ name }) => ({
      name: encodeURIComponent(name),
    })) || [];
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}
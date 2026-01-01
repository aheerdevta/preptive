// app/exam/[slug]/page.jsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { GraduationCap } from 'lucide-react';
import AboutContentRenderer from '@/components/AboutContentRenderer';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const supabase = createClient();

  try {
    const { data: exam, error } = await supabase
      .from('examinations')
      .select(`
        *,
        exam_boards!examinations_board_id_fkey(*)
      `)
      .eq('slug', slug)
      .single();

    if (error || !exam) {
      return {
        title: 'Exam Not Found | Preptive',
        description: 'The requested exam could not be found.',
      };
    }

    const examName = exam.name;
    const boardName = exam.exam_boards?.name || '';

    return {
      title: `${examName} (${boardName}) | Latest Updates, Syllabus, Exam Pattern & Preparation | Preptive`,
      description: exam.description || ` ${examName}: syllabus, exam pattern, previous year papers, admit card, results, cutoff, and preparation tips.`,
      keywords: [
        `${examName.toLowerCase()} syllabus`,
        `exam pattern`,
        `preparation`,
        `previous year papers`,
        `admit card`,
        `result`,
        `cutoff`,
        `${examName.toLowerCase()} 2026`
      ],
      openGraph: {
        title: `${examName} - Latest Updates, Syllabus, Exam Pattern | Preptive`,
        description: exam.description || ` ${examName}: syllabus, pattern, preparation tips, and latest updates.`,
        url: `https://www.preptive.in/exam/${slug}`,
        siteName: 'Preptive',
        images: [
          {
            url: exam.image,
            width: 1200,
            height: 630,
            alt: exam.alt,
          },
        ],
        locale: 'en_IN',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${examName} - Latest Updates, Syllabus, Exam Pattern | Preptive`,
        description: exam.description || `Latest ${examName} updates, syllabus, and preparation tips.`,
        images: exam.image,
        site: '@preptive',
      },
      alternates: {
        canonical: `https://www.preptive.in/exam/${slug}`,
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
    console.error('Error fetching exam metadata:', error);
    return {
      title: 'Exam | Preptive',
      description: 'Complete exam guide with syllabus, pattern, preparation tips and latest updates.',
    };
  }
}

// Generate static params for SSG
export async function generateStaticParams() {
  const supabase = createClient();
  
  try {
    const { data: exams, error } = await supabase
      .from('examinations')
      .select('slug');

    if (error || !exams) {
      console.error('Error generating static params:', error);
      return [];
    }

    return exams.map(({ slug }) => ({
      slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function ExamPage({ params }) {
  const { slug } = await params;
  const supabase = createClient();

  try {
    // Fetch exam details with board information and about_content
    const { data: exam, error: examError } = await supabase
      .from('examinations')
      .select(`
        *,
        exam_boards!examinations_board_id_fkey(*)
      `)
      .eq('slug', slug)
      .single();

    if (examError || !exam) {
      console.error('Error fetching exam:', examError);
      notFound();
    }

    // First get post IDs for this exam
    const { data: postExams, error: postExamsError } = await supabase
      .from('post_exam_map')
      .select('post_id')
      .eq('exam_id', exam.id);

    if (postExamsError) {
      console.error('Error fetching post_exam_map:', postExamsError);
    }

    let posts = [];
    let uniqueCategories = [];

    if (postExams && postExams.length > 0) {
      const postIds = postExams.map(item => item.post_id);
      
      // Fetch posts with proper joins
      const { data: postsData, error: postsError } = await supabase
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
          post_category_map (
            category:categories (id, name, slug)
          )
        `)
        .in('id', postIds)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(12);

      if (postsError) {
        console.error('Error fetching posts:', postsError);
      } else {
        posts = postsData || [];
        
        // Get unique categories from posts for filtering
        uniqueCategories = posts.reduce((acc, post) => {
          post.post_category_map?.forEach(({ category }) => {
            if (category && !acc.some(c => c.id === category.id)) {
              acc.push(category);
            }
          });
          return acc;
        }, []);
      }
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

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Schema.org Structured Data for Exam */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'EducationalOccupationalCredential',
              name: exam.name,
              description: exam.description,
              url: `https://www.preptive.in/exam/${slug}`,
              educationalLevel: 'PostSecondary',
              credentialCategory: 'Competitive Examination',
              recognizedBy: {
                '@type': 'Organization',
                name: exam.exam_boards?.name || 'Government of India'
              },
              about: {
                '@type': 'ItemList',
                itemListElement: posts.map((post, index) => ({
                  '@type': 'ListItem',
                  position: index + 1,
                  item: {
                    '@type': 'Article',
                    headline: post.title,
                    description: post.short_description,
                    url: `https://www.preptive.in/posts/${post.slug}`
                  }
                }))
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
                  <li className="text-blue-200">/</li>
                  
                  <li>
                    <span className="text-sm font-medium text-white">
                      {exam.name}
                    </span>
                  </li>
                </ol>
              </nav>

              {/* Exam Title */}
              <h1 className="text-lg sm:text-xl font-semibold text-white">
                {exam.name}
              </h1>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="px-4 py-1 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Exam Overview */}
          <div className="mb-2  p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <GraduationCap className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{exam.name}</h1>
                    {exam.exam_boards && (
                      <p className="text-gray-600">Conducted by: {exam.exam_boards.name}</p>
                    )}
                  </div>
                </div>
                
                {exam.description && (
                  <p className="text-gray-700 mb-6">{exam.description}</p>
                )}
              </div>
              
            </div>
          </div>

          {/* Latest Posts */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Latest Updates</h2>
            </div>

            {/* Simple List View */}
            <div className="space-y-6">
              {posts
                ?.sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
                .map((post) => (
                  <Link 
                    href={`/posts/${post.slug}`} 
                    key={post.id} 
                    className="block pb-6 border-b border-gray-200 group"
                  >
                    {/* Category Tag + Date */}
                    <div className="flex items-center gap-3 mb-2">
                      {post.post_category_map?.[0]?.category?.name && (
                        <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded">
                          {post.post_category_map[0].category.name}
                        </span>
                      )}
                      <time className="text-xs text-gray-500">
                        {formatDate(post.published_at)}
                      </time>
                    </div>

                    {/* Title */}
                    <h2 className="font-semibold text-gray-900 inline-block relative hover:text-blue-600 transition-colors text-lg md:text-xl">
                      <span className="bg-gradient-to-r from-blue-600 to-blue-600 bg-[length:0px_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_2px] pb-0.5">
                        {post.title}
                      </span>
                    </h2>

                    {/* Description */}
                    <p className="mt-2 text-gray-600 text-sm md:text-base">
                      {post.short_description || "Click to read the full article."}
                    </p>
                  </Link>
                ))}
            </div>

            {/* Pagination */}
            {posts && posts.length >= 12 && (
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
                <h3 className="mb-3 text-2xl font-bold text-gray-900">No articles yet</h3>
                <p className="mb-8 text-gray-600 max-w-md mx-auto">
                  We&apos;re currently preparing content for {exam.name}. Check back soon for the latest updates and resources!
                </p>
                <Link
                  href="/posts"
                  className="inline-flex items-center px-6 py-3 font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Browse All Articles
                </Link>
              </div>
            )}
          </div>

          {/* About Content Section */}
          <div className="mt-16 p-6">
            <div className="prose prose-lg max-w-none text-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About {exam.name}</h2>
              
              {/* Render the about_content JSONB data if it exists */}
              {exam.about_content && Array.isArray(exam.about_content) && exam.about_content.length > 0 ? (
                <AboutContentRenderer content={exam.about_content} />
              ) : (
                /* Fallback to default content if about_content is empty */
                <>
                  {exam.exam_boards && (
                    <p>
                      <strong>{exam.name}</strong> is conducted by <strong>{exam.exam_boards.name}</strong>, 
                      one of India's premier examination bodies. This exam is highly competitive and attracts 
                      thousands of aspirants every year seeking government jobs and educational opportunities.
                    </p>
                  )}

                  <h3 className="text-xl font-semibold mt-6 mb-3">Key Information</h3>
                  <ul className="space-y-2">
                    <li>• <strong>Conducting Body:</strong> {exam.exam_boards?.name || 'Various Government Agencies'}</li>
                    <li>• <strong>Eligibility:</strong> Varies based on educational qualification and age limit</li>
                  </ul>

                  <h3 className="text-xl font-semibold mt-6 mb-3">Why Preptive for {exam.name} Preparation?</h3>
                  <p>
                    Preptive provides comprehensive resources for {exam.name} preparation including:
                  </p>
                  <ul className="space-y-2">
                    <li>• Latest syllabus and exam pattern updates</li>
                    <li>• Previous year question papers with solutions</li>
                    <li>• Admit card download links and instructions</li>
                    <li>• Result announcements and cutoff analysis</li>
                    <li>• Preparation tips and study plans</li>
                    <li>• Important dates and notifications</li>
                  </ul>

                  <div className="bg-blue-50 p-4 rounded-lg mt-6">
                    <p className="text-blue-800 font-medium">
                      Stay updated with the latest {exam.name} notifications by regularly checking this page 
                      or subscribing to our newsletter for instant updates.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error('Error loading exam page:', error);
    notFound();
  }
}
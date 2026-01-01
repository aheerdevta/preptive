
// app/page.jsx
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/server';
import { 
  GraduationCap, 
  BarChart3, 
  Ticket, 
  BookOpen, 
  Calendar,
  FileText,
  Briefcase,
  Clock,
  User,
  ChevronRight,
  ArrowRight,
  Sparkles
} from 'lucide-react';

// Generate metadata for SEO
export const metadata = {
  title: 'PrepTive – Latest Updates, Exam Syllabus, Admit Cards, Jobs & Results',
  description: 'PrepTive provides latest education updates, exam patterns, syllabus, admit cards, important dates, government jobs, and results. Stay ahead in your exam preparation with accurate, verified, and up-to-date information.',
  keywords: [
    'education updates', 'exam syllabus', 'admit card', 'exam pattern', 'government jobs', 'exam results', 'important dates', 'competitive exams', 'study materials', 'Preptive'
  ].join(', '),
  openGraph: {
    title: 'Preptive - Updates, Exam Syllabus, Admit Cards, Jobs & Results',
    description: 'Latest exam updates, syllabus, results, admit cards and job notifications for all competitive exams in India.',
    url: 'https://www.preptive.in',
    siteName: 'Preptive',
    images: [
      {
        url: 'https://www.preptive.in/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Preptive',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Preptive - Updates, Exam Syllabus, Admit Cards, Jobs & Results',
    description: 'Get latest exam updates, syllabus, results and job notifications',
    images: ['https://www.preptive.in/og-image.jpg'],
    site: '@preptive',
  },
  alternates: {
    canonical: 'https://www.preptive.in',
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

// PostList Component
const PostList = ({ posts, showLoadMore = true, onLoadMore }) => {
  // Format date function
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;
      
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="w-full">
      {/* Simple List View */}
      <div className="space-y-4 md:space-y-6">
        {/* Loop through posts (latest first) */}
        {posts
          ?.sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
          .map((post) => (
            <article key={post.id} className="w-full" itemScope itemType="https://schema.org/Article">
              <Link 
                href={`/posts/${post.slug}`} 
                className="block pb-4 md:pb-6 border-b border-gray-200 group w-full"
                itemProp="url"
              >
                <meta itemProp="url" content={`https://www.preptive.in/posts/${post.slug}`} />
                
                {/* Meta Information Row */}
                <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                  {/* Category Badge */}
                  {post.post_category_map?.[0]?.category?.name && (
                    <span 
                      className="px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-full border border-blue-100"
                      itemProp="articleSection"
                    >
                      {post.post_category_map[0].category.name}
                    </span>
                  )}

                  {/* Exam Tag */}
                  {post.post_exam_map?.[0]?.exam?.name && (
                    <span className="px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-50 rounded-full border border-gray-200">
                      {post.post_exam_map[0].exam.name}
                    </span>
                  )}

                  {/* Date */}
                  <time 
                    className="text-xs text-gray-500 flex items-center ml-auto"
                    dateTime={post.published_at}
                    itemProp="datePublished"
                  >
                    <Clock className="w-3 h-3 mr-1 flex-shrink-0" aria-hidden="true" />
                    {formatDate(post.published_at)}
                  </time>
                </div>

                {/* Title with Hover Underline Effect */}
                <h2
                  className="
                    font-semibold text-gray-900 inline-block relative 
                    hover:text-blue-600 transition-colors duration-200
                    text-base md:text-lg lg:text-xl
                    w-full
                  "
                  itemProp="headline"
                >
                  <span className="relative">
                    {post.title}
                    <span 
                      className="
                        absolute left-0 -bottom-1 w-0 h-0.5 
                        bg-gradient-to-r from-blue-600 to-blue-500
                        transition-all duration-300 group-hover:w-full
                      " 
                      aria-hidden="true"
                    />
                  </span>
                </h2>

                {/* Description */}
                {post.short_description && (
                  <p 
                    className="mt-2 text-gray-600 text-sm md:text-base line-clamp-2"
                    itemProp="description"
                  >
                    {post.short_description}
                  </p>
                )}

                {/* Read Time (Optional) */}
                {post.read_time && (
                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {post.read_time} min read
                  </div>
                )}
              </Link>
            </article>
          ))}
      </div>

      {/* Load More Button */}
      {showLoadMore && posts?.length >= 12 && (
        <div className="mt-8 md:mt-12 text-center">
          <button 
            onClick={onLoadMore}
            className="
              px-6 md:px-8 py-3 font-medium text-white 
              bg-gradient-to-r from-blue-600 to-indigo-600 
              rounded-lg hover:from-blue-700 hover:to-indigo-700 
              transition-all duration-300 
              transform hover:-translate-y-0.5 hover:shadow-lg
              text-sm md:text-base
            "
            aria-label="Load more articles"
          >
            Load More Articles
          </button>
        </div>
      )}

      {/* Empty State */}
      {(!posts || posts.length === 0) && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No articles yet
          </h3>
          <p className="text-gray-600">
            Check back later for new updates
          </p>
        </div>
      )}
    </div>
  );
};

// Category-wise Post List Component
const CategoryWisePostList = ({ categorizedPosts }) => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Category Sections */}
      <div className="space-y-12">
        {categorizedPosts.map(({ category, posts }) => {
          if (!posts || posts.length === 0) return null;
          
          return (
            <section 
              key={category?.slug || 'general'} 
              className="space-y-6"
              aria-labelledby={`${category?.slug}-heading`}
            >
              {/* Category Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 
                    id={`${category?.slug}-heading`}
                    className="text-xl md:text-2xl font-bold text-gray-900"
                  >
                    {category?.name || 'General'}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {posts.length} {posts.length === 1 ? 'article' : 'articles'}
                  </p>
                </div>
                <Link 
                  href={`/category/${category?.slug || 'general'}`}
                  className="
                    inline-flex items-center text-blue-600 hover:text-blue-800 
                    text-sm font-medium transition-colors
                  "
                  aria-label={`View all posts in ${category?.name}`}
                >
                  View all
                  <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
                </Link>
              </div>

              {/* Posts List */}
              <PostList 
                posts={posts.slice(0, 5)} // Show only 5 recent posts per category
                showLoadMore={false} // No load more in category sections
              />
            </section>
          );
        })}
      </div>
    </div>
  );
};


const CategoryItem = ({ icon: Icon, name, slug, color }) => {
  return (
    <Link
      href={`/category/${slug}`}
      className="
        group flex items-center gap-2 px-4 py-2
        text-gray-700 font-medium
        hover:text-blue-600
        transition-all duration-200
        whitespace-nowrap flex-shrink-0
        text-sm md:text-base
      "
      aria-label={`Browse ${name} category`}
    >
      <Icon
        className={`
          w-4 h-4 md:w-5 md:h-5
          ${color}
          group-hover:scale-110
          transition-transform duration-200
          flex-shrink-0
        `}
        aria-hidden="true"
      />
      <span className="whitespace-nowrap">{name}</span>
    </Link>
  );
};
// Default categories to show when database fetch fails
const defaultCategories = [
  {
    slug: 'results',
    name: 'Results',
    icon: BarChart3,
    color: 'text-green-600',
    description: 'Latest exam results and scorecards',
  },
  {
    slug: 'admit-card',
    name: 'Admit Card',
    icon: Ticket,
    color: 'text-yellow-600',
    description: 'Hall tickets and admit cards',
  },
  {
    slug: 'syllabus',
    name: 'Syllabus',
    icon: BookOpen,
    color: 'text-purple-600',
    description: 'Exam syllabus and patterns',
  },
  {
    slug: 'jobs',
    name: 'Latest Jobs',
    icon: Briefcase,
    color: 'text-blue-600',
    description: 'Government job notifications',
  },
  {
    slug: 'exam-pattern',
    name: 'Exam Pattern',
    icon: FileText,
    color: 'text-red-600',
    description: 'Detailed exam patterns',
  },
  {
    slug: 'exam-date',
    name: 'Important Dates',
    icon: Calendar,
    color: 'text-indigo-600',
    description: 'Exam schedules and calendars',
  },
];

// Helper function to organize posts by category
const organizePostsByCategory = (posts) => {
  const categorized = {};
  
  posts?.forEach(post => {
    const categories = post.post_category_map || [];
    
    if (categories.length > 0) {
      categories.forEach(catMap => {
        const category = catMap.category;
        if (category) {
          if (!categorized[category.slug]) {
            categorized[category.slug] = {
              category: {
                name: category.name,
                slug: category.slug
              },
              posts: []
            };
          }
          categorized[category.slug].posts.push(post);
        }
      });
    } else {
      // Posts without category go to "General"
      if (!categorized.general) {
        categorized.general = {
          category: {
            name: 'General',
            slug: 'general'
          },
          posts: []
        };
      }
      categorized.general.posts.push(post);
    }
  });
  
  return Object.values(categorized);
};

export default async function HomePage() {
  const supabase = createClient();
  let categories = defaultCategories;
  let posts = [];

  try {
    // Fetch categories with post counts
    const { data: fetchedCategories, error: categoriesError } = await supabase
      .from('categories')
      .select(`
        id,
        name,
        slug,
        icon,
        description,
        posts:post_category_map(count)
      `)
      .order('priority', { ascending: true })
      .limit(6);

    if (!categoriesError && fetchedCategories && fetchedCategories.length > 0) {
      categories = fetchedCategories.map(cat => ({
        slug: cat.slug,
        name: cat.name,
        icon: getIconComponent(cat.icon),
        color: getCategoryColor(cat.slug),
        description: cat.description,
      }));
    }

    // Fetch latest posts with all necessary data
    const { data: fetchedPosts, error: postsError } = await supabase
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
        post_category_map (category:categories (id, name, slug)),
        post_exam_map (exam:examinations (id, name, slug))
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(12);

    if (!postsError && fetchedPosts) {
      posts = fetchedPosts;
    }
  } catch (error) {
    console.error('Error loading homepage data:', error);
  }

  // Helper function to get icon component
  function getIconComponent(iconName) {
    const iconMap = {
      'GraduationCap': GraduationCap,
      'BarChart3': BarChart3,
      'Ticket': Ticket,
      'BookOpen': BookOpen,
      'Calendar': Calendar,
      'FileText': FileText,
      'Briefcase': Briefcase,
    };
    return iconMap[iconName] || FileText;
  }

  // Helper function to get category color
  function getCategoryColor(slug) {
    const colorMap = {
      'results': 'text-green-600',
      'admit-card': 'text-yellow-600',
      'syllabus': 'text-purple-600',
      'jobs': 'text-blue-600',
      'exam-pattern': 'text-red-600',
      'exam-date': 'text-indigo-600',
    };
    return colorMap[slug] || 'text-gray-600';
  }

  // Organize posts by category for category-wise view
  const categorizedPosts = organizePostsByCategory(posts);

  return (
    <div className="min-h-screen">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Preptive',
            url: 'https://www.preptive.in',
            description: 'Latest exam updates, syllabus, results, admit cards and job notifications for all competitive exams in India.',
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://www.preptive.in/search?q={search_term_string}',
              'query-input': 'required name=search_term_string'
            },
            publisher: {
              '@type': 'Organization',
              name: 'Preptive',
              logo: 'https://www.preptive.in/logo.png',
              sameAs: [
                'https://twitter.com/preptive',
                'https://facebook.com/preptive',
                'https://linkedin.com/company/preptive'
              ]
            }
          })
        }}
      />

      {/* Main Content */}
      <main className="bg-white px-2 py-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Hero Section with Breadcrumb */}
        

      
 {/* Featured Categories Section */}
  <section className="mb-16 mt-5" aria-labelledby="categories-heading">
    <h2 id="categories-heading" className="sr-only">Exam Categories</h2>
    
    <div
      className="
        flex items-center
        bg-white rounded-xl
        border border-gray-200
        px-2 py-1
        shadow-sm
        md:flex-wrap md:justify-center
        overflow-x-auto
        [&::-webkit-scrollbar]:h-1.5
        [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-track]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-gray-300
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:hover:bg-gray-400
        scrollbar-width: thin
        scrollbar-color: #cbd5e1 #f1f1f1
      "
    >
      {categories && categories.length > 0 ? (
        categories.map((cat, index) => (
          <div key={cat.slug || index} className="flex items-center h flex-shrink-0">
            <CategoryItem {...cat} />
            
            {/* Vertical Divider - Hidden on mobile, shown on desktop */}
            {index !== categories.length - 1 && (
              <span 
                className="
                  text-gray-300 mx-1 select-none
                  hidden md:inline
                  text-base
                " 
                aria-hidden="true"
              >
                |
              </span>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500 py-4 flex-shrink-0 text-sm md:text-base">Loading categories...</p>
      )}
    </div>
  </section> 
        {/* Latest Updates Section - Using CategoryWisePostList */}
        <section className="mb-16" aria-labelledby="latest-updates-heading">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 id="latest-updates-heading" className="text-xl font-bold text-gray-900 sm:text-2xl">
                Latest Exam Updates & Notifications
              </h1>
              <p className="mt-2 text-gray-600">
                Stay updated with the most recent exam news, results, admit cards and job notifications
              </p>
            </div>
            <Link
              href="/posts"
              className="hidden sm:flex items-center px-6 py-3 font-medium text-white bg-emerald-600 rounded-full hover:bg-emerald-700 transition-colors"
              aria-label="View all posts"
            >
              All posts
              <ArrowRight className="w-3 h-3 ml-2" aria-hidden="true" />
            </Link>
          </div>

          {posts && posts.length > 0 ? (
            <>
              {/* Category-wise posts view */}
              <CategoryWisePostList 
                categorizedPosts={categorizedPosts}
              />
              
              {/* Additional posts view if we have more than categorized posts */}
              {posts.length > 12 && (
                <div className="mt-12">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">More Updates</h3>
                  <PostList 
                    posts={posts.slice(12)} 
                    showLoadMore={true}
                    onLoadMore={() => {
                      // Implement load more functionality
                      console.log('Load more clicked');
                    }}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-blue-50">
                <FileText className="w-10 h-10 text-blue-500" aria-hidden="true" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">
                No updates yet
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                We're preparing amazing content for you. Check back soon for the latest exam updates!
              </p>
            </div>
          )}
        </section>

        {/* SEO Content Section */}
        <section className="py-12 bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 md:p-12" aria-labelledby="why-choose-heading">
          <div className="max-w-4xl mx-auto">
            <h2 id="why-choose-heading" className="mb-8 text-2xl font-bold text-center text-gray-900">
             What do we post on Preptive?
            </h2>
            
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg mr-4">
                    <Clock className="w-6 h-6 text-blue-600" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Real-time Updates
                    </h3>
                    <p className="text-gray-600">
                      Get instant notifications for exam dates, results, admit cards and important announcements across UPSC, SSC, Banking, Railways and more.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-2 bg-green-100 rounded-lg mr-4">
                    <FileText className="w-6 h-6 text-green-600" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Verified Information
                    </h3>
                    <p className="text-gray-600">
                      All content is verified from official sources including UPSC.gov.in, SSC.nic.in, Banks, Railway Recruitment Boards to ensure accuracy.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-2 bg-purple-100 rounded-lg mr-4">
                    <GraduationCap className="w-6 h-6 text-purple-600" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Comprehensive Resources
                    </h3>
                    <p className="text-gray-600">
                      Access syllabus, previous year papers, study materials, preparation tips and expert guidance for all competitive exams in India.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-2 bg-yellow-100 rounded-lg mr-4">
                    <Briefcase className="w-6 h-6 text-yellow-600" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Job Alerts
                    </h3>
                    <p className="text-gray-600">
                      Never miss important government job notifications, vacancy updates, application deadlines and recruitment details.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                What is Preptive?
              </h3>
              <p className="text-gray-700 mb-4">
                Preptive is India's leading platform for providing timely updates, verified information, and comprehensive resources for exams like 
                <strong> UPSC Civil Services</strong>, <strong>SSC CGL/CHSL</strong>, <strong>Banking (IBPS, SBI)</strong>, 
                <strong> Railways (RRB)</strong>, <strong>State PSCs</strong>, <strong>Defense</strong>, and more.
              </p>
              <p className="text-gray-700">
                We help aspirants stay updated with the latest exam notifications, 
                syllabus changes, admit card releases, result announcements, and job vacancies 
                across various government sectors. Our platform provides the most accurate and timely information to help you succeed in 
                your exam preparation journey.
              </p>
            </div>
          </div>
        </section>
      </main>

    
    </div>
  );
}
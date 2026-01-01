// app/search/page.jsx
'use client';

import { useState, useEffect, Suspense, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { formatDate } from '@/utils/helpers';

// Create a separate component that uses searchParams
function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Refs to prevent infinite loops
  const isInitialMount = useRef(true);
  const lastSearchQuery = useRef('');
  const lastCurrentPage = useRef(1);

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalResults / 10);

  // Initialize from URL on component mount only
  useEffect(() => {
    const q = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1');
    
    if (q !== searchQuery) {
      setSearchQuery(q);
    }
    
    if (page !== currentPage) {
      setCurrentPage(page);
    }
    
    // Set initial values for comparison
    lastSearchQuery.current = q;
    lastCurrentPage.current = page;
    
    // Perform initial search if query exists
    if (q) {
      performSearch(q, page);
    }
  }, []); // Empty dependency array - runs only once on mount

  // Memoized search function
  const performSearch = useCallback(async (query = searchQuery, page = currentPage) => {
    // Prevent duplicate searches
    if (query === lastSearchQuery.current && page === lastCurrentPage.current && !isInitialMount.current) {
      return;
    }
    
    lastSearchQuery.current = query;
    lastCurrentPage.current = page;
    isInitialMount.current = false;

    setIsLoading(true);

    try {
      let supabaseQuery = supabase
        .from('posts')
        .select(`
          id,
          slug,
          title,
          short_description,
          published_at
        `, { count: 'exact' })
        .eq('status', 'published');

      // Apply search query
      if (query.trim()) {
        supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,short_description.ilike.%${query}%`);
      }

      // Sort by latest first
      supabaseQuery = supabaseQuery.order('published_at', { ascending: false });

      // Pagination
      const from = (page - 1) * 10;
      const to = from + 9;
      supabaseQuery = supabaseQuery.range(from, to);

      const { data, error, count } = await supabaseQuery;

      if (error) throw error;

      setSearchResults(data || []);
      setTotalResults(count || 0);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setTotalResults(0);
    } finally {
      setIsLoading(false);
    }
  }, [supabase, searchQuery, currentPage]);

  // Handle search input change with debounce
  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateURLAndSearch();
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setTotalResults(0);
    setCurrentPage(1);
    
    // Update URL
    router.replace('/search', { scroll: false });
  };

  // Update URL and trigger search
  const updateURLAndSearch = useCallback(() => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
    }
    if (currentPage > 1) {
      params.set('page', currentPage.toString());
    }
    
    const newUrl = `/search${params.toString() ? `?${params.toString()}` : ''}`;
    
    // Only update if URL has actually changed
    const currentUrl = window.location.pathname + window.location.search;
    if (currentUrl !== newUrl) {
      router.replace(newUrl, { scroll: false });
    }
    
    // Perform search
    performSearch(searchQuery.trim(), currentPage);
  }, [searchQuery, currentPage, router, performSearch]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    
    setCurrentPage(newPage);
    
    // Update URL and search after state update
    setTimeout(() => {
      updateURLAndSearch();
    }, 0);
  };

  // Handle manual search button
  const handleManualSearch = () => {
    setCurrentPage(1);
    updateURLAndSearch();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* SEO Metadata */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SearchResultsPage',
              name: `Search Results: ${searchQuery || 'Latest Exam Updates'} | PrepTive`,
              description: 'Search for latest government exam notifications, syllabus, admit card, results, and important dates for SSC, UPSC, Banking, Railway exams.',
              url: `https://www.preptive.in/search${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`,
            })
          }}
        />

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-xl font-bold text-gray-900 mb-3">
            Search Latest Exam Updates
          </h1>
          <p className="text-gray-600">
            Find notifications, syllabus, admit card, results, and important dates
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search exam updates (e.g., SSC CGL 2024, UPSC syllabus)"
                className="w-full px-5 py-4 bg-white rounded-lg border border-gray-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-6 py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              Search
            </button>
          </form>
        </div>

        {/* Results Stats */}
        {searchQuery && !isLoading && (
          <div className="mb-6">
            <p className="text-gray-700">
              Found {totalResults} result{totalResults !== 1 ? 's' : ''} for "{searchQuery}"
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                <hr className="mt-6 border-gray-200" />
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && searchQuery && searchResults.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No results found
            </h3>
            <p className="text-gray-600">
              No updates found for "{searchQuery}"
            </p>
          </div>
        )}

        {/* Results List */}
        {!isLoading && searchResults.length > 0 && (
          <div className="space-y-0">
            {searchResults.map((post, index) => (
              <div key={post.id}>
                <article className="py-6">
                  <Link href={`/posts/${post.slug}`} className="block group">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-emerald-600">
                      {post.title}
                    </h2>
                    {post.short_description && (
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {post.short_description}
                      </p>
                    )}
                    <time className="text-sm text-gray-500">
                      {formatDate(post.published_at)}
                    </time>
                  </Link>
                </article>
                {index < searchResults.length - 1 && (
                  <hr className="border-gray-200" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !isLoading && (
          <div className="flex justify-center items-center gap-4 mt-10 pt-6 border-t">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {/* Initial Help */}
        {!searchQuery && !isLoading && (
          <div className="text-center py-12 text-gray-500">
            <p>Enter a search term to find latest exam updates</p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
             
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function SearchPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-10">
              <h1 className="text-xl font-bold text-gray-900 mb-3">
                Search Latest Exam Updates
              </h1>
              <p className="text-gray-600">
                Find notifications, syllabus, admit card, results, and important dates
              </p>
            </div>
            <div className="mb-8">
              <div className="w-full h-14 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  <hr className="mt-6 border-gray-200" />
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}

export const dynamic = 'force-dynamic';
// app/search/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { formatDate } from '@/utils/helpers';

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalResults / 10);

  // Search effect
  useEffect(() => {
    if (searchQuery) {
      performSearch();
    }
  }, [searchQuery, currentPage]);

  // Update URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    params.set('page', currentPage);
    
    router.replace(`/search?${params.toString()}`, { scroll: false });
  }, [searchQuery, currentPage]);

  // Perform search
  const performSearch = async () => {
    setIsLoading(true);

    try {
      let query = supabase
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
      if (searchQuery.trim()) {
        query = query.or(`title.ilike.%${searchQuery}%,short_description.ilike.%${searchQuery}%`);
      }

      // Sort by latest first
      query = query.order('published_at', { ascending: false });

      // Pagination
      const from = (currentPage - 1) * 10;
      const to = from + 9;
      query = query.range(from, to);

      const { data, error, count } = await query;

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
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setTotalResults(0);
    setCurrentPage(1);
  };

  return (
    <>
      {/* SEO Metadata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SearchResultsPage',
            name: `Search Results: ${searchQuery || 'Latest Exam Updates'} | PrepTive`,
            description: 'Search for latest government exam notifications, syllabus, admit card, results, and important dates for SSC, UPSC, Banking, Railway exams.',
            url: `https://www.preptive.in/search${searchParams.toString() ? `?${searchParams.toString()}` : ''}`,
          })
        }}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
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
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search exam updates (e.g., SSC CGL 2024, UPSC syllabus)"
                className="w-full px-5 py-4 bg-white rounded-lg border border-gray-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Results Stats */}
          {searchQuery && (
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
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-10 pt-6 border-t">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
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
            </div>
          )}
        </div>
      </div>
    </>
  );
}
// components/Pagination.jsx
'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

export default function Pagination({
  currentPage,
  totalPages,
  hasPrevPage,
  hasNextPage,
  baseUrl,
  queryParams = {},
}) {
  const router = useRouter();

  if (totalPages <= 1) return null;

  const generatePageUrl = (page) => {
    const params = new URLSearchParams({
      ...queryParams,
      page: page.toString(),
    });
    return `${baseUrl}?${params.toString()}`;
  };

  const handlePageChange = (page) => {
    const url = generatePageUrl(page);
    router.push(url);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    if (hasPrevPage) {
      pages.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      );
    }

    // First page
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-20"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span
            key="ellipsis-start"
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
          >
            <MoreHorizontal className="h-4 w-4" />
          </span>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium focus:z-20 ${
            i === currentPage
              ? 'z-10 bg-blue-600 border-blue-500 text-white'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
          aria-current={i === currentPage ? 'page' : undefined}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span
            key="ellipsis-end"
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
          >
            <MoreHorizontal className="h-4 w-4" />
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-20"
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    if (hasNextPage) {
      pages.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      );
    }

    return pages;
  };

  return (
    <nav className="flex items-center justify-between border-t border-gray-200 px-4 py-6 sm:px-0">
      <div className="hidden sm:block">
        <p className="text-sm text-gray-700">
          Showing page{' '}
          <span className="font-medium">{(currentPage - 1) * 24 + 1}</span> to{' '}
          <span className="font-medium">
            {Math.min(currentPage * 24, totalPages * 24)}
          </span>{' '}
          of <span className="font-medium">{totalPages * 24}</span> results
        </p>
      </div>
      <div className="flex flex-1 justify-between sm:justify-end">
        <div className="flex">
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
            {renderPageNumbers()}
          </nav>
        </div>
      </div>
    </nav>
  );
}
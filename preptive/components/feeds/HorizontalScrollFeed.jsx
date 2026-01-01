// components/feeds/HorizontalScrollFeed.jsx
'use client';

import { useRef } from 'react';
import PostCard from '@/components/PostCard';

export default function HorizontalScrollFeed({ posts }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full w-10 h-10 shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
        aria-label="Scroll left"
      >
        ←
      </button>
      
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide space-x-6 py-4 px-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {posts.map((post) => (
          <div key={post.id} className="flex-shrink-0 w-80">
            <PostCard post={post} variant="horizontal" />
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full w-10 h-10 shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
        aria-label="Scroll right"
      >
        →
      </button>
    </div>
  );
}
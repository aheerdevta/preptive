// components/PostCard.jsx
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, Clock, Eye, ChevronRight } from 'lucide-react';

export default function PostCard({ post, variant = 'grid' }) {
  // Calculate reading time
  const wordCount = JSON.stringify(post.content || '').split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);
  
  // Format date
  const formattedDate = new Date(post.published_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Grid variant (default)
  if (variant === 'grid') {
    return (
      <article className="group bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          {post.featured_image ? (
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <div className="text-4xl">
                {post.categories?.[0]?.categories?.name?.[0] || '📚'}
              </div>
            </div>
          )}
          
          {/* Category badge */}
          {post.categories?.[0]?.categories && (
            <div className="absolute top-3 left-3">
              <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
                {post.categories[0].categories.name}
              </span>
            </div>
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 mb-3 line-clamp-2 leading-snug">
            <Link href={`/posts/${post.slug}`} className="hover:underline">
              {post.title}
            </Link>
          </h3>
          
          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
            {post.short_description}
          </p>

          {/* Meta info */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t">
            <div className="flex items-center gap-3">
              {post.author && (
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {post.author.name}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formattedDate}
              </span>
            </div>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {readingTime} min
            </span>
          </div>
        </div>
      </article>
    );
  }

  // Horizontal variant
  if (variant === 'horizontal') {
    return (
      <article className="group bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all duration-300">
        <div className="flex">
          {/* Image */}
          <div className="w-32 md:w-40 flex-shrink-0">
            {post.featured_image ? (
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-4">
                <div className="text-2xl">📚</div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Category */}
                {post.categories?.[0]?.categories && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded mb-2">
                    {post.categories[0].categories.name}
                  </span>
                )}
                
                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 mb-2 line-clamp-2">
                  <Link href={`/posts/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {post.short_description}
                </p>

                {/* Meta info */}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  {post.author && (
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author.name}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formattedDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {readingTime} min
                  </span>
                </div>
              </div>
              
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 ml-2 flex-shrink-0" />
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Featured variant
  if (variant === 'featured') {
    return (
      <article className="group bg-white rounded-xl shadow-lg border overflow-hidden hover:shadow-xl transition-all duration-300">
        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          {post.featured_image ? (
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <div className="text-5xl">📚</div>
            </div>
          )}
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          
          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-center gap-2 mb-3">
              {post.categories?.map(({ categories }) => (
                <span
                  key={categories.id}
                  className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full"
                >
                  {categories.name}
                </span>
              ))}
            </div>
            
            <h3 className="text-2xl font-bold mb-3 line-clamp-2">
              <Link href={`/posts/${post.slug}`} className="hover:underline">
                {post.title}
              </Link>
            </h3>
            
            <p className="text-gray-200 mb-4 line-clamp-2">
              {post.short_description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                {post.author && (
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {post.author.name}
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formattedDate}
                </span>
              </div>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {readingTime} min read
              </span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Magazine variant
  if (variant === 'magazine') {
    return (
      <article className="group bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all duration-300">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          {post.featured_image ? (
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <div className="text-4xl">📰</div>
            </div>
          )}
          
          {/* Category */}
          {post.categories?.[0]?.categories && (
            <div className="absolute top-3 left-3">
              <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold px-3 py-1 rounded uppercase tracking-wide">
                {post.categories[0].categories.name}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 mb-3 line-clamp-2">
            <Link href={`/posts/${post.slug}`} className="hover:underline">
              {post.title}
            </Link>
          </h3>
          
          <p className="text-gray-600 mb-4 line-clamp-3">
            {post.short_description}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{formattedDate}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {readingTime} min
            </span>
          </div>
        </div>
      </article>
    );
  }

  // Magazine featured variant
  if (variant === 'magazine-featured') {
    return (
      <article className="group relative rounded-xl overflow-hidden">
        {post.featured_image && (
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="flex items-center gap-2 mb-4">
            {post.categories?.map(({ categories }) => (
              <span
                key={categories.id}
                className="bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full"
              >
                {categories.name}
              </span>
            ))}
          </div>
          
          <h3 className="text-3xl font-bold mb-4">
            <Link href={`/posts/${post.slug}`} className="hover:underline">
              {post.title}
            </Link>
          </h3>
        </div>
      </article>
    );
  }

  // Default fallback
  return (
    <article className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
      <h3 className="font-bold text-gray-900 mb-2">
        <Link href={`/posts/${post.slug}`} className="hover:text-blue-600 hover:underline">
          {post.title}
        </Link>
      </h3>
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
        {post.short_description}
      </p>
      <div className="text-xs text-gray-500">
        {formattedDate} • {readingTime} min read
      </div>
    </article>
  );
}
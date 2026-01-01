// components/PostTimelineItem.jsx
import Link from 'next/link';
import { Calendar, User, ChevronRight } from 'lucide-react';

export default function PostTimelineItem({ post, index, total }) {
  const formattedDate = new Date(post.published_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Colors for timeline dots
  const dotColors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-green-500',
    'bg-pink-500',
    'bg-orange-500',
  ];
  const dotColor = dotColors[index % dotColors.length];

  return (
    <article className="relative group">
      {/* Timeline dot */}
      <div className={`absolute left-0 transform -translate-x-1/2 z-10 w-6 h-6 rounded-full ${dotColor} border-4 border-white shadow-lg`}></div>
      
      {/* Content */}
      <div className="ml-12 bg-white rounded-xl border p-6 hover:shadow-md transition-all duration-300 group-hover:border-blue-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Timeline date */}
            <div className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formattedDate}
            </div>
            
            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 mb-3">
              <Link href={`/posts/${post.slug}`} className="hover:underline">
                {post.title}
              </Link>
            </h3>
            
            {/* Description */}
            <p className="text-gray-600 mb-4 line-clamp-2">
              {post.short_description}
            </p>
            
            {/* Meta info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                {post.author && (
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {post.author.name}
                  </span>
                )}
                {post.categories?.[0]?.categories && (
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1 rounded-full">
                    {post.categories[0].categories.name}
                  </span>
                )}
              </div>
              
              <Link
                href={`/posts/${post.slug}`}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all"
              >
                Read more <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          
          {/* Image */}
          {post.featured_image && (
            <div className="ml-6 flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
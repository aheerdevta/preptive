// components/PostListItem.jsx
import Link from 'next/link';
import { Calendar, User, Eye } from 'lucide-react';

export default function PostListItem({ post, rank = null }) {
  return (
    <article className="group hover:bg-gray-50 transition-colors p-4 rounded-lg">
      <div className="flex items-start gap-4">
        {rank && (
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
              {rank}
            </div>
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              {post.categories?.map(({ categories }) => (
                <span
                  key={categories.id}
                  className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded"
                >
                  {categories.name}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {post.views && (
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {post.views.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 mb-2 line-clamp-2">
            <Link href={`/posts/${post.slug}`} className="hover:underline">
              {post.title}
            </Link>
          </h3>
          
          <p className="text-gray-600 mb-4 line-clamp-2">
            {post.short_description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {post.author && (
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {post.author.name}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(post.published_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
            
            <Link
              href={`/posts/${post.slug}`}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all"
            >
              Read more →
            </Link>
          </div>
        </div>

        {post.featured_image && (
          <div className="flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
      </div>
    </article>
  );
}
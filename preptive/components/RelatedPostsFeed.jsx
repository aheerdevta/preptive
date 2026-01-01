// components/RelatedPostsFeed.jsx
import Link from 'next/link';
import Image from 'next/image';
import { formatDate, generateSlug } from '@/utils/helpers';

export default function RelatedPostsFeed({ posts }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <article
          key={post.id}
          className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <Link href={`/posts/${post.slug}`} className="block">
            {post.featured_image && (
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  {post.exams?.[0]?.examinations && (
                    <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {post.exams[0].examinations.name}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                {post.categories?.slice(0, 2).map(({ categories }) => (
                  <span
                    key={categories.id}
                    className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded"
                  >
                    {categories.name}
                  </span>
                ))}
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h3>

              {post.short_description && (
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.short_description}
                </p>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  {post.author?.avatar_url && (
                    <img
                      src={post.author.avatar_url}
                      alt={post.author.name}
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <span>{post.author?.name || 'PrepTive Team'}</span>
                </div>
                <time dateTime={post.published_at}>
                  {formatDate(post.published_at)}
                </time>
              </div>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
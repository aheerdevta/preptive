// components/feeds/MagazineFeed.jsx
import PostCard from '@/components/PostCard';

export default function MagazineFeed({ posts }) {
  if (posts.length === 0) return null;

  const [featured, ...remaining] = posts;

  return (
    <div className="space-y-8">
      {/* Featured Post */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="lg:col-span-1">
          <PostCard post={featured} variant="magazine-featured" />
        </div>
        <div className="lg:col-span-1">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {featured.title}
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            {featured.short_description}
          </p>
          <div className="flex items-center gap-4 text-gray-500">
            {featured.author && (
              <span className="font-medium">{featured.author.name}</span>
            )}
            <time dateTime={featured.published_at}>
              {new Date(featured.published_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </time>
          </div>
        </div>
      </div>

      {/* Grid of remaining posts */}
      {remaining.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {remaining.map((post) => (
            <PostCard key={post.id} post={post} variant="magazine" />
          ))}
        </div>
      )}
    </div>
  );
}
// components/feeds/CardFeed.jsx
import PostCard from '@/components/PostCard';

export default function CardFeed({ posts }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} variant="featured" />
      ))}
    </div>
  );
}
// components/feeds/TimelineFeed.jsx
import PostTimelineItem from '@/components/PostTimelineItem';

export default function TimelineFeed({ posts }) {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500"></div>
      
      <div className="space-y-12 pl-16">
        {posts.map((post, index) => (
          <PostTimelineItem
            key={post.id}
            post={post}
            index={index}
            total={posts.length}
          />
        ))}
      </div>
    </div>
  );
}
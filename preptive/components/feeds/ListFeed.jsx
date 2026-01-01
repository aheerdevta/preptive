// components/feeds/ListFeed.jsx
import PostListItem from '@/components/PostListItem';

export default function ListFeed({ posts }) {
  return (
    <div className="space-y-4">
      {posts.map((post, index) => (
        <div key={post.id}>
          <PostListItem post={post} rank={index + 1} />
          {index < posts.length - 1 && (
            <div className="border-t border-gray-100 my-4"></div>
          )}
        </div>
      ))}
    </div>
  );
}
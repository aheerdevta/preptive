// components/EstimatedReadTime.jsx
export default function EstimatedReadTime({ minutes }) {
  if (!minutes || minutes < 1) return null;

  return (
    <div className="flex items-center gap-2 text-sm">
      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="font-medium">
        {minutes} min read
      </span>
    </div>
  );
}
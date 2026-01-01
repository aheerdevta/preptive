// components/loading/LoadingFeedSkeleton.jsx
export default function LoadingFeedSkeleton({ layout = 'grid' }) {
  // Skeleton for Grid layout
  if (layout === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border overflow-hidden"
          >
            <div className="animate-pulse">
              <div className="h-48 bg-gray-300"></div>
              <div className="p-6">
                <div className="h-4 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded w-1/4 mb-1"></div>
                    <div className="h-2 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Skeleton for Horizontal layout
  if (layout === 'horizontal') {
    return (
      <div className="flex overflow-hidden space-x-6 py-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-80 bg-white rounded-xl shadow-sm border overflow-hidden"
          >
            <div className="animate-pulse">
              <div className="h-40 bg-gray-300"></div>
              <div className="p-6">
                <div className="h-4 bg-gray-300 rounded mb-3"></div>
                <div className="h-4 bg-gray-300 rounded w-4/5 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Skeleton for List layout
  if (layout === 'list') {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border p-6"
          >
            <div className="animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 rounded-lg bg-gray-300 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-300 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Skeleton for Card layout
  if (layout === 'card') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg border overflow-hidden"
          >
            <div className="animate-pulse">
              <div className="h-64 bg-gray-300"></div>
              <div className="p-8">
                <div className="h-6 bg-gray-300 rounded mb-4"></div>
                <div className="h-5 bg-gray-300 rounded w-4/5 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                    <div>
                      <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
                      <div className="h-2 bg-gray-200 rounded w-12"></div>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Skeleton for Magazine layout
  if (layout === 'magazine') {
    return (
      <div className="space-y-8">
        {/* Featured section skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-300 rounded-xl"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5 mb-6"></div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-300"></div>
              <div>
                <div className="h-3 bg-gray-200 rounded w-24 mb-1"></div>
                <div className="h-2 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-48 bg-gray-300 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Skeleton for Timeline layout
  if (layout === 'timeline') {
    return (
      <div className="relative pl-16">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="relative mb-12">
            <div className="absolute left-0 transform -translate-x-1/2">
              <div className="w-6 h-6 rounded-full bg-gray-300 animate-pulse"></div>
            </div>
            <div className="ml-8 animate-pulse">
              <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default skeleton
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border p-4 animate-pulse"
        >
          <div className="h-40 bg-gray-300 rounded-lg mb-4"></div>
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}
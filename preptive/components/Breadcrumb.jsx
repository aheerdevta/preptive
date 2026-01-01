// components/Breadcrumb.jsx
import Link from 'next/link';

export default function Breadcrumb({ items = [] }) {
  if (!items.length) return null;

  return (
    <nav className="mb-8" aria-label="Breadcrumb">
      {/* Mobile scrollable wrapper */}
      <div className="overflow-x-auto sm:overflow-visible">
        <ol className="flex flex-nowrap sm:flex-wrap items-center gap-2 text-sm text-gray-600 whitespace-nowrap sm:whitespace-normal">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && (
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}

              {item.current ? (
                <span
                  className="text-gray-900 font-semibold"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}

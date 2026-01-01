// components/TableOfContents.jsx
'use client';

import { useEffect, useState } from 'react';

export default function TableOfContents({ headings }) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0% 0% -80% 0%' }
    );

    headings.forEach((_, index) => {
      const element = document.getElementById(`heading-${index}`);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Header remains the same */}
      <div className="bg-emerald-50 px-6 py-4 border-b border-gray-300">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          Table of Contents
        </h3>
      </div>

      {/* Table-like content section */}
      <div className="bg-white">
        <table className="w-full border-collapse">
          <tbody>
            {headings.map((heading, index) => (
              <tr 
                key={index}
                className={`border-b border-gray-200 last:border-b-0 ${
                  activeId === `heading-${index}` ? 'bg-blue-50' : ''
                }`}
              >
                <td 
                  className={`py-3 px-6 text-left ${
                    heading.level === 3 ? 'pl-10' : 
                    heading.level === 2 ? 'pl-6' : 
                    'pl-4'
                  }`}
                >
                  {/* Simple text - not clickable */}
                  <span className={`inline-block ${
                    activeId === `heading-${index}` 
                      ? 'text-blue-700 font-semibold' 
                      : 'text-gray-700'
                  } ${
                    heading.level === 3 ? 'text-sm' : 'text-base'
                  }`}>
                    {heading.text}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
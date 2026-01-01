// components/AboutContentRenderer.jsx
'use client';

import { useState } from 'react';

// Helper function to parse text and render inline links
const renderTextWithLinks = (text, isInTableCell = false) => {
  if (!text) return null;

  // If text doesn't contain markdown links, return plain text
  if (!text.includes('[') || !text.includes('](')) {
    return text;
  }

  // Regex to find markdown-style links [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  let matchIndex = 0;

  while ((match = linkRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    // Add the link
    const linkText = match[1];
    const linkUrl = match[2];
    
    // Check if it's an external link
    const isExternal = linkUrl.startsWith('http');
    
    parts.push(
      <a
        key={`link-${matchIndex}`}
        href={linkUrl}
        target={isExternal ? "_blank" : "_self"}
        rel={isExternal ? "noopener noreferrer" : ""}
        className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
      >
        {linkText}
        {isExternal && (
          <svg 
            className="w-3 h-3 ml-1 inline" 
            fill="currentColor" 
            viewBox="0 0 20 20" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
          </svg>
        )}
      </a>
    );

    lastIndex = match.index + match[0].length;
    matchIndex++;
  }

  // Add remaining text after last link
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  // If no links were processed, return original text
  if (parts.length === 0) {
    return text;
  }

  return parts;
};

export default function AboutContentRenderer({ content }) {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const renderContent = (item, index) => {
    switch (item.type) {
      case 'heading':
        const HeadingTag = `h${item.level}`;
        const headingContent = renderTextWithLinks(item.text);
        
        return (
          <HeadingTag
            key={index}
            className={`font-bold text-gray-900 mt-8 mb-4 ${
              item.level === 1 ? 'text-2xl' :
              item.level === 2 ? 'text-2xl' :
              item.level === 3 ? 'text-xl' :
              'text-xl'
            }`}
            id={`about-heading-${index}`}
          >
            {headingContent}
          </HeadingTag>
        );

      case 'paragraph':
        const paragraphContent = renderTextWithLinks(item.text);
        
        return (
          <p
            key={index}
            className={`mb-6 leading-relaxed text-gray-900 text-lg`}
          >
            {paragraphContent}
          </p>
        );

      case 'bullet_list':
        return (
          <ul key={index} className="mb-6 space-y-2 pl-6">
            {item.items.map((listItem, idx) => {
              const listItemContent = renderTextWithLinks(listItem);
              
              return (
                <li
                  key={idx}
                  className="flex items-start"
                >
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span
                    className={`text-gray-900`}
                  >
                    {listItemContent}
                  </span>
                </li>
              );
            })}
          </ul>
        );

      case 'table':
        return (
          <div key={index} className="mb-8 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  {item.headers?.map((header, idx) => {
                    const headerContent = renderTextWithLinks(header, true);
                    
                    return (
                      <th
                        key={idx}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300 last:border-r-0"
                      >
                        {headerContent}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {item.rows.map((row, rowIdx) => (
                  <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {row.map((cell, cellIdx) => {
                      const cellContent = renderTextWithLinks(cell, true);
                      
                      return (
                        <td
                          key={cellIdx}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-300 last:border-r-0"
                        >
                          {cellContent}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'pdf_link':
        return (
          <div key={index} className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
            <div className="flex items-start">
              <svg 
                className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" 
                fill="currentColor" 
                viewBox="0 0 20 20" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  fillRule="evenodd" 
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" 
                  clipRule="evenodd" 
                />
              </svg>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  {item.title}
                </h4>
                <p className="text-gray-700 text-sm mb-2">
                  PDF Document • {item.size || 'File size not specified'}
                </p>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline"
                >
                  Download PDF
                  <svg 
                    className="w-4 h-4 ml-1" 
                    fill="currentColor" 
                    viewBox="0 0 20 20" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        );

      case 'internal_link':
        return (
          <div key={index} className="mb-6">
            <a
              href={item.url}
              className="group block p-5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow"
            >
              <div className="flex items-start">
                <svg 
                  className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0 group-hover:text-blue-500 transition-colors" 
                  fill="currentColor" 
                  viewBox="0 0 20 20" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" 
                    clipRule="evenodd" 
                  />
                </svg>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h4>
                  <p className={`text-gray-600 text-sm`}>
                    {item.description || 'Read more about this topic'}
                  </p>
                  <div className="mt-2 flex items-center text-blue-500 text-sm font-medium">
                    <span>Read article</span>
                    <svg 
                      className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" 
                      fill="currentColor" 
                      viewBox="0 0 20 20" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </a>
          </div>
        );

      case 'text':
        let className = '';
        if (item.bold) className += 'font-bold ';
        if (item.italic) className += 'italic ';
        if (item.highlight) className += 'bg-yellow-100 px-1 rounded';
        
        // Handle inline links in text spans
        const textContent = renderTextWithLinks(item.text);
        
        return (
          <span
            key={index}
            className={`inline ${className}`}
          >
            {textContent}
          </span>
        );

      case 'faq':
        const isOpen = openFaqIndex === index;
        const faqId = `about-faq-${index}`;
        
        // Parse question and answer for links
        const questionContent = renderTextWithLinks(item.question);
        const answerContent = renderTextWithLinks(item.answer);
        
        return (
          <div key={index} className="mb-2" itemScope itemType="https://schema.org/FAQPage">
            <div 
              itemScope 
              itemProp="mainEntity" 
              itemType="https://schema.org/Question"
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-5 text-left bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200"
                aria-expanded={isOpen}
                aria-controls={`${faqId}-answer`}
              >
                <div className="flex items-center justify-between">
                  <h3 
                    className="text-lg font-semibold text-gray-900 pr-6"
                    itemProp="name"
                  >
                    {questionContent}
                  </h3>
                  <svg
                    className={`w-6 h-6 text-gray-500 transform transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>
              
              <div
                id={`${faqId}-answer`}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
                aria-hidden={!isOpen}
              >
                <div 
                  className="px-6 pb-6 pt-2 border-t border-gray-100 bg-gray-50"
                  itemScope
                  itemProp="acceptedAnswer"
                  itemType="https://schema.org/Answer"
                >
                  <div 
                    className={`prose prose-lg max-w-none`}
                    itemProp="text"
                  >
                    {answerContent}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {content.map(renderContent)}
    </div>
  );
}
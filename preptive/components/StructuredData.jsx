// components/StructuredData.jsx
export default function StructuredData({ type, data }) {
  const getStructuredData = () => {
    switch (type) {
      case 'Article':
        return {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: data.headline,
          description: data.description,
          image: data.image,
          datePublished: data.datePublished,
          dateModified: data.dateModified,
          author: data.author,
          publisher: data.publisher,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://www.preptive.in/posts/${data.slug}`,
          },
          articleBody: data.articleBody,
        };

      default:
        return null;
    }
  };

  const structuredData = getStructuredData();

  if (!structuredData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
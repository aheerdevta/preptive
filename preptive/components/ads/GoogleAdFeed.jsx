// components/ads/GoogleAdFeed.jsx
'use client';

import { useEffect } from 'react';

export default function GoogleAdFeed({ 
  adSlot, 
  format = 'auto', 
  responsive = 'true',
  layoutKey,
  className = '' 
}) {
  useEffect(() => {
    try {
      if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
        window.adsbygoogle.push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <div className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-YOUR_AD_CLIENT_ID"
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
        data-ad-layout-key={layoutKey}
      ></ins>
    </div>
  );
}
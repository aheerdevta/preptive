// components/AdBanner.jsx
export default function AdBanner({ position = 'top' }) {
  // For now, using a placeholder. Replace with actual ad code later.
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className={`my-8 text-center ${position === 'top' ? 'mb-8' : 'mt-8 mb-8'}`}>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-dashed border-blue-300 rounded-xl p-8">
          <p className="text-gray-600 font-medium">
            Ad Slot - {position === 'top' ? 'Top Banner' : 'Middle Banner'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            728x90, 300x250 or similar ad units will be displayed here
          </p>
        </div>
      </div>
    );
  }

  // Production ad code (example for Google AdSense)
  return (
    <div className={`my-8 text-center ${position === 'top' ? 'mb-8' : 'mt-8 mb-8'}`}>
      {/* Place your actual ad code here */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-xxxxxxxxxxxxxx"
        data-ad-slot="xxxxxxxxxx"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
    </div>
  );
}
'use client';

import { useInstagramTracking } from './PlausibleTracker';

export default function InstagramButton() {
  const { trackInstagramClick, trackSocialShare, trackRegistrationFromInstagram } = useInstagramTracking();

  const handleInstagramClick = () => {
    trackInstagramClick('Instagram Link Clicked', {
      buttonLocation: 'header',
      page: window.location.pathname,
    });
    
    // Open Instagram in new tab
    window.open('https://instagram.com/sabrang_jklu', '_blank');
  };

  const handleEventRegistration = (eventName: string) => {
    trackRegistrationFromInstagram(eventName);
    // Your registration logic here
  };

  const handleShareToInstagram = () => {
    trackSocialShare('Instagram', 'Sabrang 2025 Event');
    // Your Instagram sharing logic here
  };

  return (
    <div className="space-y-4">
      {/* Instagram Follow Button */}
      <button
        onClick={handleInstagramClick}
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
      >
        Follow us on Instagram
      </button>

      {/* Event Registration Button */}
      <button
        onClick={() => handleEventRegistration('Cultural Night')}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
      >
        Register for Cultural Night
      </button>

      {/* Share Button */}
      <button
        onClick={handleShareToInstagram}
        className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
      >
        Share on Instagram
      </button>
    </div>
  );
}
'use client';

import { usePlausible } from './PlausibleProvider';
import { useEffect } from 'react';

interface PlausibleTrackerProps {
  eventName?: string;
  props?: Record<string, string | number | boolean>;
}

export default function PlausibleTracker({ eventName, props }: PlausibleTrackerProps) {
  const plausible = usePlausible();

  useEffect(() => {
    // Track referrer information
    const referrer = document.referrer;
    const urlParams = new URLSearchParams(window.location.search);
    
    // Check if visitor came from Instagram
    if (referrer.includes('instagram.com') || referrer.includes('ig.me')) {
      plausible('Instagram Visitor', {
        props: {
          source: 'Instagram',
          referrer: referrer,
        }
      });
    }

    // Check for UTM parameters (useful for Instagram campaign tracking)
    if (urlParams.get('utm_source') === 'instagram') {
      plausible('Instagram Campaign Visitor', {
        props: {
          source: 'Instagram Campaign',
          campaign: urlParams.get('utm_campaign') || 'unknown',
          medium: urlParams.get('utm_medium') || 'social',
        }
      });
    }

    // Track custom events if provided
    if (eventName) {
      plausible(eventName, props);
    }
  }, [plausible, eventName, props]);

  return null; // This component doesn't render anything
}

// Hook for tracking Instagram-specific events
export function useInstagramTracking() {
  const plausible = usePlausible();

  const trackInstagramClick = (action: string, customProps?: Record<string, string | number | boolean>) => {
    plausible('Instagram Action', {
      props: {
        action,
        ...customProps,
      }
    });
  };

  const trackSocialShare = (platform: string, content?: string) => {
    plausible('Social Share', {
      props: {
        platform,
        content: content || 'unknown',
        timestamp: new Date().toISOString(),
      }
    });
  };

  const trackRegistrationFromInstagram = (eventType: string) => {
    plausible('Registration from Instagram', {
      props: {
        eventType,
        source: 'Instagram',
        timestamp: new Date().toISOString(),
      }
    });
  };

  return {
    trackInstagramClick,
    trackSocialShare,
    trackRegistrationFromInstagram,
  };
}
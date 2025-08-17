'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LayeredLandingPage from "./HOME";
import LoadingPage from "../../components/LoadingPage";

export default function Page() {
  const [showLoading, setShowLoading] = useState(false);
  const [hasShownLoading, setHasShownLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if this is a direct visit to the home page
    const isDirectVisit = !document.referrer || 
      document.referrer.includes(window.location.origin) === false;
    
    // Check if we're coming from another page on the same site
    const isInternalNavigation = document.referrer.includes(window.location.origin);
    
    // Check if there's a skip parameter (for internal navigation)
    const skipLoading = searchParams.get('skipLoading') === 'true';
    
    // Show loading only on direct visits and if we haven't shown it before
    if (isDirectVisit && !hasShownLoading && !skipLoading) {
      setShowLoading(true);
      setHasShownLoading(true);
      
      // Store in session storage to remember we've shown the loading
      sessionStorage.setItem('hasShownLoading', 'true');
    } else {
      // Check session storage for subsequent visits
      const hasShown = sessionStorage.getItem('hasShownLoading');
      if (hasShown) {
        setHasShownLoading(true);
      }
    }
  }, [searchParams, hasShownLoading]);

  const handleLoadingComplete = () => {
    setShowLoading(false);
  };

  return (
    <>
      <LoadingPage 
        isVisible={showLoading} 
        onComplete={handleLoadingComplete} 
      />
      <LayeredLandingPage isLoading={showLoading} />
    </>
  );
}

'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface LazyVideoProps {
  src: string;
  fallbackImage: string;
  alt: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  controls?: boolean;
  onError?: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
}

const LazyVideo: React.FC<LazyVideoProps> = ({
  src,
  fallbackImage,
  alt,
  className = '',
  autoPlay = false,
  muted = true,
  loop = true,
  playsInline = true,
  controls = false,
  onError
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { elementRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
    triggerOnce: true
  });

  useEffect(() => {
    if (hasIntersected && !isLoaded && videoRef.current) {
      const video = videoRef.current;
      video.load();
      
      const handleCanPlay = () => {
        setIsLoaded(true);
        if (autoPlay) {
          video.play().catch(console.warn);
        }
      };
      
      const handleError = (e: Event) => {
        setHasError(true);
        if (onError) {
          onError(e as any);
        }
      };

      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('error', handleError);

      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
      };
    }
  }, [hasIntersected, isLoaded, autoPlay, onError]);

  return (
    <div 
      ref={elementRef as any} 
      className={`relative ${className}`}
    >
      {/* Fallback image - always visible initially */}
      <img
        src={fallbackImage}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
        decoding="async"
      />
      
      {/* Video overlay - loads when in viewport */}
      {hasIntersected && !hasError && (
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          muted={muted}
          loop={loop}
          playsInline={playsInline}
          controls={controls}
          preload="none"
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
    </div>
  );
};

export default LazyVideo;

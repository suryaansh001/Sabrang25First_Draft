'use client';

import { useEffect } from 'react';

// Global cache for ultra-fast loading
declare global {
  var splineComponentCache: any;
  var splineSceneCache: any;
  var splinePreloadPromise: Promise<any>;
}

// Initialize global cache
if (typeof window !== 'undefined') {
  if (!window.splineComponentCache) {
    window.splineComponentCache = null;
  }
  if (!window.splineSceneCache) {
    window.splineSceneCache = null;
  }
  if (!window.splinePreloadPromise) {
    window.splinePreloadPromise = Promise.resolve();
  }
}

export default function UltraFastSplineLoader() {
  useEffect(() => {
    // Ultra-aggressive preloading - starts immediately when component mounts
    
    // 1. Preload Spline component
    const componentPromise = import('@splinetool/react-spline').then((module) => {
      if (typeof window !== 'undefined') {
        window.splineComponentCache = module.default;
      }
      return module.default;
    }).catch(() => {});
    
    // 2. Preload scene file with multiple strategies
    const scenePromises = [
      // Strategy 1: Full GET request with aggressive caching
      fetch('https://prod.spline.design/3O0nwQNm6dcILIOA/scene.splinecode', {
        method: 'GET',
        mode: 'cors',
        cache: 'force-cache'
      }).then(res => res.arrayBuffer()).then(buffer => {
        if (typeof window !== 'undefined') {
          window.splineSceneCache = buffer;
          // Store in localStorage for instant subsequent loads
          try {
            localStorage.setItem('splineSceneCache', JSON.stringify(Array.from(new Uint8Array(buffer))));
          } catch (e) {}
        }
      }).catch(() => {}),
      
      // Strategy 2: HEAD request for connection establishment
      fetch('https://prod.spline.design/3O0nwQNm6dcILIOA/scene.splinecode', {
        method: 'HEAD',
        mode: 'cors'
      }).catch(() => {}),
      
      // Strategy 3: Preconnect to domain
      new Promise((resolve) => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = 'https://prod.spline.design';
        document.head.appendChild(link);
        resolve(null);
      })
    ];
    
    // Execute all preloading strategies in parallel
    window.splinePreloadPromise = Promise.all([componentPromise, ...scenePromises]).catch(() => {});
    
  }, []);

  return null; // This component doesn't render anything
}

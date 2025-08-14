'use client';

import { useEffect } from 'react';

// Global cache for ultra-fast loading
declare global {
  var splineRuntimeCache: any;
  var splineSceneCache: any;
}

// Initialize global cache
if (typeof window !== 'undefined') {
  if (!window.splineRuntimeCache) {
    window.splineRuntimeCache = null;
  }
  if (!window.splineSceneCache) {
    window.splineSceneCache = null;
  }
}

export default function SplinePreloader() {
  useEffect(() => {
    // Ultra-aggressive preloading - starts immediately when component mounts
    
    // 1. Preload runtime
    const runtimePromise = import('@splinetool/runtime').then(({ Application }) => {
      if (typeof window !== 'undefined') {
        window.splineRuntimeCache = Application;
      }
      return Application;
    }).catch(() => {});
    
    // 2. Preload scene file with multiple strategies
    const scenePromises = [
      // Strategy 1: Full GET request
      fetch('https://prod.spline.design/3O0nwQNm6dcILIOA/scene.splinecode', {
        method: 'GET',
        mode: 'cors',
        cache: 'force-cache'
      }).then(res => res.arrayBuffer()).then(buffer => {
        if (typeof window !== 'undefined') {
          window.splineSceneCache = buffer;
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
    
    // Execute all preloading strategies
    Promise.all([runtimePromise, ...scenePromises]).catch(() => {});
    
  }, []);

  return null; // This component doesn't render anything
}

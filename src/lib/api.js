// Utility function to create API URLs without double slashes
export const createApiUrl = (endpoint) => {
  // Get base URL from env; fall back to current origin for client-side
  const envBase = process.env.NEXT_PUBLIC_API_URL || '';

  const baseFromEnv = envBase && typeof envBase === 'string' ? envBase : '';
  const baseFromWindow = typeof window !== 'undefined' ? window.location.origin : '';

  const baseUrl = baseFromEnv || baseFromWindow || '';

  // Clean base URL - remove trailing slash
  const cleanBaseUrl = baseUrl && baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

  // Clean endpoint - ensure leading slash
  const cleanEndpoint = endpoint && endpoint.startsWith('/') ? endpoint : `/${endpoint || ''}`;

  const fullUrl = `${cleanBaseUrl}${cleanEndpoint}`;
  
  // Debug logging for mobile troubleshooting
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    console.log('🔗 API URL Debug:', {
      endpoint,
      envBase,
      baseFromWindow,
      finalUrl: fullUrl,
      userAgent: navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'
    });
  }
  
  return fullUrl;
};

// Utility function to create enhanced fetch requests with mobile-friendly options
export const createMobileFetch = (url, options = {}) => {
  const defaultOptions = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'User-Agent': typeof navigator !== 'undefined' ? navigator.userAgent : 'Sabrang-Frontend',
      ...options.headers
    },
    // Add timeout for mobile networks
    signal: AbortSignal.timeout?.(15000) || options.signal,
    ...options
  };

  return fetch(url, defaultOptions);
};

export default createApiUrl;

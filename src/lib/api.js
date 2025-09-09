// Utility function to create API URLs without double slashes
export const createApiUrl = (endpoint) => {
  // Get base URL from env; fall back to current origin for client-side
  const envBase = process.env.NEXT_PUBLIC_API_URL || '';

  const baseFromEnv = envBase && typeof envBase === 'string' ? envBase : '';
  const baseFromWindow = typeof window !== 'undefined' ? window.location.origin : '';

  const baseUrl = baseFromEnv || baseFromWindow || '';

  const cleanBaseUrl = baseUrl && baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

  const cleanEndpoint = endpoint && endpoint.startsWith('/') ? endpoint : `/${endpoint || ''}`;

  const fullUrl = `${cleanBaseUrl}${cleanEndpoint}`;
  return fullUrl;
};

export default createApiUrl;

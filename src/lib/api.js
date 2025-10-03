// Mobile-optimized utility function to create API URLs
export const createApiUrl = (endpoint) => {
  // Always use absolute URL from environment for mobile reliability
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://surprising-balance-production.up.railway.app';
  
  // Ensure clean URL construction - remove multiple trailing slashes
  const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
  
  // Ensure endpoint starts with single forward slash
  const cleanEndpoint = endpoint && endpoint.startsWith('/') ? endpoint : `/${endpoint || ''}`;
  
  const fullUrl = `${cleanBaseUrl}${cleanEndpoint}`;
  
  // Log for mobile debugging
  if (typeof window !== 'undefined' && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    console.log(`📱 Mobile API URL: ${fullUrl}`);
  }
  
  return fullUrl;
};

export default createApiUrl;

// Mobile-friendly API request utility with retry logic and enhanced error handling
import createApiUrl from './api.js';

/**
 * Mobile-optimized API request function with automatic retries and better error handling
 * @param {string} endpoint - API endpoint (e.g., '/register')
 * @param {object} options - Fetch options
 * @param {number} retries - Number of retry attempts (default: 3)
 * @returns {Promise<Response>} - Fetch response
 */
export const mobileApiRequest = async (endpoint, options = {}, retries = 3) => {
  const url = createApiUrl(endpoint);
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`📱 Mobile API request attempt ${attempt}/${retries}: ${url}`);
      
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log(`⏰ Request timeout after 45s: ${url}`);
        controller.abort();
      }, 45000); // 45 second timeout for mobile networks

      // Enhanced headers for mobile compatibility
      const enhancedOptions = {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Sabrang-Mobile-App/1.0',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          ...options.headers,
        },
      };

      const response = await fetch(url, enhancedOptions);
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        // Provide more specific error messages for mobile users
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        if (response.status === 408 || response.status === 504) {
          errorMessage = 'Request timeout. Please check your internet connection and try again.';
        } else if (response.status === 0 || response.status >= 500) {
          errorMessage = 'Server connection issue. Please try again.';
        } else if (response.status === 403) {
          errorMessage = 'Access denied. Please refresh the page and try again.';
        }
        
        throw new Error(errorMessage);
      }
      
      console.log(`✅ Mobile API request successful: ${url}`);
      return response;
      
    } catch (error) {
      console.log(`❌ Mobile API request failed (attempt ${attempt}): ${error.message}`);
      
      // Check if it's a network-related error
      const isNetworkError = 
        error.name === 'AbortError' ||
        error.message.includes('fetch') ||
        error.message.includes('network') ||
        error.message.includes('timeout') ||
        error.message.includes('Failed to fetch');
      
      if (attempt === retries) {
        // Final attempt failed - provide user-friendly error message
        let finalMessage = error.message;
        
        if (isNetworkError) {
          finalMessage = `Mobile network error after ${retries} attempts. Please check your internet connection and try again. If using mobile data, try switching to WiFi, or vice versa.`;
        }
        
        throw new Error(finalMessage);
      }
      
      // Only retry on network errors, not on client errors (4xx)
      if (!isNetworkError && error.message.includes('HTTP 4')) {
        throw error;
      }
      
      // Exponential backoff for retries (but cap at 5 seconds)
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
      console.log(`⏳ Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

/**
 * Specialized function for payment-related API calls with extra reliability
 * @param {string} endpoint - Payment API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise<Response>} - Fetch response
 */
export const mobilePaymentRequest = async (endpoint, options = {}) => {
  // Use more retries for payment requests as they are critical
  return mobileApiRequest(endpoint, options, 5);
};

/**
 * Check if device is likely on a mobile network
 * @returns {boolean} - True if likely on mobile
 */
export const isMobileNetwork = () => {
  if (typeof navigator === 'undefined') return false;
  
  // Check if using mobile data connection
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (connection) {
    return connection.type === 'cellular' || connection.effectiveType === '2g' || connection.effectiveType === '3g';
  }
  
  // Fallback: check user agent for mobile devices
  return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export default mobileApiRequest;
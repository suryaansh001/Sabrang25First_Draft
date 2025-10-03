// Cashfree API utility functions with FALLBACK support
import createApiUrl from '../lib/api';

// Cashfree configuration for DIRECT API fallback
const CASHFREE_CONFIG = {
  API_URL: 'https://api.cashfree.com/pg',
  API_VERSION: '2023-08-01',
  // Fallback credentials (only used if backend fails)
  CLIENT_ID: process.env.NEXT_PUBLIC_CASHFREE_CLIENT_ID || '',
  CLIENT_SECRET: process.env.NEXT_PUBLIC_CASHFREE_CLIENT_SECRET || '',
  HAS_FALLBACK_CREDENTIALS: !!(process.env.NEXT_PUBLIC_CASHFREE_CLIENT_ID && process.env.NEXT_PUBLIC_CASHFREE_CLIENT_SECRET)
};

console.log('🔧 Cashfree Config:', {
  backendProxy: 'PRIMARY',
  directApiFallback: CASHFREE_CONFIG.HAS_FALLBACK_CREDENTIALS ? 'ENABLED' : 'DISABLED',
  apiUrl: CASHFREE_CONFIG.API_URL
});

export interface CashfreeOrder {
  order_id: string;
  order_currency: string;
  order_amount: number;
  customer_details: {
    customer_id: string;
    customer_phone: string;
  };
  order_meta: {
    return_url: string;
    payment_methods?: string;
  };
}

export interface PaymentDetails {
  cf_payment_id: string;
  order_id: string;
  entity: string;
  payment_currency: string;
  error_details: any;
  order_amount: number;
  order_currency: string;
  is_captured: boolean;
  payment_group: string;
  authorization: any;
  payment_method: any;
  payment_amount: number;
  payment_time: string;
  payment_completion_time: string;
  payment_status: string;
  payment_message: string;
  bank_reference: string;
  auth_id: string;
  international_payment: any;
  payment_gateway_details: any;
}

export interface OrderStatus {
  cf_order_id: string;
  created_at: string;
  customer_details: {
    customer_id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    customer_uid: string;
  };
  entity: string;
  order_amount: number;
  payment_session_id: string;
  order_currency: string;
  order_expiry_time: string;
  order_id: string;
  order_meta: any;
  order_note: string;
  order_splits: any[];
  order_status: string;
  order_tags: any;
  terminal_data: any;
  cart_details: any;
}

/**
 * Create payment order directly with Cashfree (FALLBACK ONLY)
 * This bypasses the backend and calls Cashfree API directly
 */
const createPaymentOrderDirect = async (orderData: {
  amount: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}): Promise<{
  success: boolean;
  data?: {
    payment_session_id: string;
    order_id: string;
    amount: number;
  };
  message?: string;
  usedFallback?: boolean;
}> => {
  console.log('⚠️ FALLBACK: Creating payment order directly with Cashfree API');
  
  if (!CASHFREE_CONFIG.HAS_FALLBACK_CREDENTIALS) {
    throw new Error('Fallback credentials not configured. Cannot proceed.');
  }

  // Generate order ID on frontend (since backend is not available)
  const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  
  const orderRequest = {
    order_amount: parseFloat(orderData.amount),
    order_currency: "INR",
    order_id: orderId,
    customer_details: {
      customer_id: `customer_${Date.now()}`,
      customer_name: orderData.customerName || "Customer",
      customer_email: orderData.customerEmail,
      customer_phone: orderData.customerPhone || "9999999999"
    },
    order_meta: {
      return_url: `${window.location.origin}/payment/success?order_id=${orderId}`
    }
  };

  console.log('📤 Direct API Request:', { orderId, amount: orderData.amount });

  const response = await fetch(`${CASHFREE_CONFIG.API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-version': CASHFREE_CONFIG.API_VERSION,
      'x-client-id': CASHFREE_CONFIG.CLIENT_ID,
      'x-client-secret': CASHFREE_CONFIG.CLIENT_SECRET
    },
    body: JSON.stringify(orderRequest)
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('❌ Cashfree direct API error:', errorData);
    throw new Error(`Cashfree API error: ${errorData}`);
  }

  const result = await response.json();
  console.log('✅ Direct API order created:', result);

  return {
    success: true,
    data: {
      order_id: result.order_id,
      payment_session_id: result.payment_session_id,
      amount: parseFloat(orderData.amount)
    },
    usedFallback: true
  };
};

/**
 * Create a new payment order via backend proxy with FALLBACK to direct API
 * PRIMARY: Calls backend → backend calls Cashfree
 * FALLBACK: If backend fails, calls Cashfree API directly from frontend
 */
export const createPaymentOrder = async (orderData: {
  amount: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  registrationData?: any; // Complete registration data for fallback
}): Promise<{
  success: boolean;
  data?: {
    payment_session_id: string;
    order_id: string;
    amount: number;
  };
  message?: string;
  usedFallback?: boolean;
}> => {
  try {
    console.log('🚀 [PRIMARY] Creating payment order via backend proxy:', orderData);
    
    const response = await fetch(createApiUrl('/api/payments/create-order'), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData),
      signal: AbortSignal.timeout(15000) // 15 second timeout
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Backend proxy failed');
    }

    const result = await response.json();
    console.log('✅ [PRIMARY] Payment order created via backend:', result);
    
    return { ...result, usedFallback: false };
    
  } catch (backendError) {
    console.error('❌ [PRIMARY] Backend proxy failed:', backendError);
    
    // Try fallback if credentials are available
    if (CASHFREE_CONFIG.HAS_FALLBACK_CREDENTIALS) {
      console.log('🔄 Attempting FALLBACK to direct Cashfree API...');
      
      try {
        const fallbackResult = await createPaymentOrderDirect(orderData);
        
        // Store registration data in localStorage for later backend sync
        if (orderData.registrationData) {
          const pendingData = {
            orderId: fallbackResult.data?.order_id,
            registrationData: orderData.registrationData,
            timestamp: Date.now()
          };
          localStorage.setItem('pending_registration', JSON.stringify(pendingData));
          console.log('💾 Registration data stored in localStorage for backend sync');
        }
        
        return fallbackResult;
        
      } catch (fallbackError) {
        console.error('❌ [FALLBACK] Direct API also failed:', fallbackError);
        const backendMsg = backendError instanceof Error ? backendError.message : String(backendError);
        const fallbackMsg = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
        throw new Error(`Both backend and direct API failed. Backend: ${backendMsg}, Direct: ${fallbackMsg}`);
      }
    } else {
      console.error('⚠️ No fallback credentials configured');
      throw backendError;
    }
  }
};

/**
 * Get payments for an order via our backend proxy
 */
export const getPaymentsForOrder = async (orderId: string): Promise<PaymentDetails[]> => {
  try {
    console.log(`🔍 Fetching payments for order: ${orderId}`);
    
    const response = await fetch(createApiUrl(`/api/payments/get-payments/${orderId}`), {
      method: 'GET',
      credentials: 'include'
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to fetch payments');
    }

    const result = await response.json();
    console.log('✅ Payments fetched:', result);
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch payments');
    }

    return result.data;
  } catch (error) {
    console.error('❌ Failed to fetch payments:', error);
    throw error;
  }
};

/**
 * Get order status via our backend proxy
 */
export const getOrderStatus = async (orderId: string): Promise<OrderStatus> => {
  try {
    console.log(`🔍 Fetching order status: ${orderId}`);
    
    const response = await fetch(createApiUrl(`/api/payments/get-order-status/${orderId}`), {
      method: 'GET',
      credentials: 'include'
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to fetch order status');
    }

    const result = await response.json();
    console.log('✅ Order status fetched:', result);
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch order status');
    }

    return result.data;
  } catch (error) {
    console.error('❌ Failed to fetch order status:', error);
    throw error;
  }
};

/**
 * Verify payment status and redirect to success page if payment is successful
 */
export const verifyPaymentAndRedirect = async (orderId: string): Promise<{
  success: boolean;
  status: string;
  redirectUrl?: string;
  paymentDetails?: PaymentDetails;
}> => {
  try {
    console.log(`🔍 Verifying payment for order: ${orderId}`);
    
    // Get payments for the order
    const payments = await getPaymentsForOrder(orderId);
    
    if (payments && payments.length > 0) {
      // Get the latest payment
      const latestPayment = payments[0];
      
      console.log('Payment details:', latestPayment);
      
      if (latestPayment.payment_status === 'SUCCESS') {
        console.log('✅ Payment successful! Redirecting to success page...');
        
        const successUrl = `/payment/success?order_id=${orderId}`;
        
        return {
          success: true,
          status: 'SUCCESS',
          redirectUrl: successUrl,
          paymentDetails: latestPayment
        };
      } else if (latestPayment.payment_status === 'FAILED') {
        console.log('❌ Payment failed');
        return {
          success: false,
          status: 'FAILED',
          paymentDetails: latestPayment
        };
      } else {
        console.log('⏳ Payment pending');
        return {
          success: false,
          status: 'PENDING',
          paymentDetails: latestPayment
        };
      }
    } else {
      console.log('❌ No payments found for order');
      return {
        success: false,
        status: 'NO_PAYMENTS'
      };
    }
  } catch (error) {
    console.error('❌ Failed to verify payment:', error);
    return {
      success: false,
      status: 'ERROR'
    };
  }
};

/**
 * Create a payment URL for manual redirect (instead of using SDK)
 */
export const createPaymentUrl = (paymentSessionId: string): string => {
  // For production environment, use the Cashfree hosted checkout
  return `https://payments.cashfree.com/pay/${paymentSessionId}`;
};

/**
 * Handle payment completion callback
 * This should be called when user returns from payment gateway
 */
export const handlePaymentCallback = async (orderId: string): Promise<void> => {
  try {
    console.log(`🔄 Handling payment callback for order: ${orderId}`);
    
    // Wait a moment for payment to be processed
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verify payment and redirect
    const verification = await verifyPaymentAndRedirect(orderId);
    
    if (verification.success && verification.redirectUrl) {
      // Redirect to success page
      window.location.href = verification.redirectUrl;
    } else {
      // Handle failed payment
      console.log('❌ Payment verification failed:', verification.status);
      alert(`Payment verification failed: ${verification.status}`);
    }
  } catch (error) {
    console.error('❌ Failed to handle payment callback:', error);
    alert('Failed to verify payment status');
  }
};
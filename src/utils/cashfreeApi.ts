// Cashfree API utility functions using direct API calls
import createApiUrl from '../lib/api';

// Cashfree API configuration - DIRECT TO CASHFREE (No backend proxy)
const CASHFREE_CONFIG = {
  API_URL: 'https://api.cashfree.com/pg',
  API_VERSION: '2023-08-01',
  // Get credentials from frontend environment variables
  // NOTE: These will be visible in browser - use with caution
  CLIENT_ID: process.env.NEXT_PUBLIC_CASHFREE_CLIENT_ID || '',
  CLIENT_SECRET: process.env.NEXT_PUBLIC_CASHFREE_CLIENT_SECRET || '',
};

console.log('🔧 Cashfree Frontend Config:', {
  hasClientId: !!CASHFREE_CONFIG.CLIENT_ID,
  hasClientSecret: !!CASHFREE_CONFIG.CLIENT_SECRET,
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
 * Create a new payment order via our backend proxy
 * This will call our backend which in turn calls Cashfree API with proper credentials
 */
export const createPaymentOrder = async (orderData: {
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
}> => {
  try {
    console.log('🚀 Creating payment order via backend proxy:', orderData);
    
    const response = await fetch(createApiUrl('/api/payments/create-order'), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to create payment order');
    }

    const result = await response.json();
    console.log('✅ Payment order created:', result);
    
    return result;
  } catch (error) {
    console.error('❌ Failed to create payment order:', error);
    throw error;
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
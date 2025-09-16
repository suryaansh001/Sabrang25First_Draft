// Frontend utility for creating Cashfree orders
// Since we can't use cashfree-pg on the frontend (it's a server-side package),
// we'll create orders by calling our own backend endpoint that handles Cashfree API calls

import createApiUrl from '../lib/api';

export interface CashfreeOrderRequest {
  order_amount: number;
  order_currency: string;
  order_id: string;
  customer_details: {
    customer_id: string;
    customer_name?: string;
    customer_email?: string;
    customer_phone?: string;
  };
  order_meta: {
    return_url: string;
    payment_methods?: string;
  };
}

export interface CashfreeOrderResponse {
  order_id: string;
  payment_session_id: string;
  order_status: string;
  order_amount: number;
  order_currency: string;
}

/**
 * Create a Cashfree order via our backend endpoint
 * @param orderRequest - The order request object
 * @returns Promise<CashfreeOrderResponse>
 */
export const createCashfreeOrder = async (orderRequest: CashfreeOrderRequest): Promise<CashfreeOrderResponse> => {
  try {
    console.log('🔄 Creating Cashfree order with request:', JSON.stringify(orderRequest, null, 2));
    
    const response = await fetch(createApiUrl('/api/payment/cashfree/create-order'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(orderRequest)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to create Cashfree order');
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to create Cashfree order');
    }
    
    console.log('✅ Cashfree order created successfully:', data.data);
    return data.data;
  } catch (error: any) {
    console.error('❌ Cashfree order creation failed:', error);
    throw new Error(error.message || 'Failed to create Cashfree order');
  }
};

/**
 * Fetch payment details for an order from Cashfree via backend
 * @param orderId - The Cashfree order ID
 * @returns Promise<any>
 */
export const fetchCashfreePayments = async (orderId: string): Promise<any> => {
  try {
    console.log(`🔍 Fetching payment details for order: ${orderId}`);
    
    const response = await fetch(createApiUrl(`/api/payment/cashfree/fetch-payments/${orderId}`), {
      method: 'GET',
      credentials: 'include'
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to fetch payment details');
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch payment details');
    }
    
    console.log('✅ Payment details fetched successfully:', data.data);
    return data.data;
  } catch (error: any) {
    console.error('❌ Failed to fetch payment details:', error);
    throw new Error(error.message || 'Failed to fetch payment details');
  }
};

/**
 * Build a Cashfree order request from order data
 * @param orderData - Order data from backend
 * @param amount - Order amount
 * @returns CashfreeOrderRequest
 */
export const buildCashfreeOrderRequest = (
  orderData: any, 
  amount: number
): CashfreeOrderRequest => {
  return {
    order_amount: amount,
    order_currency: "INR",
    order_id: orderData.orderId,
    customer_details: {
      customer_id: orderData.customerDetails.customer_id,
      customer_name: orderData.customerDetails.customer_name,
      customer_email: orderData.customerDetails.customer_email,
      customer_phone: orderData.customerDetails.customer_phone
    },
    order_meta: {
      return_url: orderData.orderMeta.return_url,
      payment_methods: orderData.orderMeta.payment_methods
    }
  };
};

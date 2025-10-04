// Example of how to verify payments after checkout

import createApiUrl from '../lib/api';

/**
 * Fetch payment details from Cashfree via backend
 * @param orderId - The Cashfree order ID
 * @returns Promise<any>
 */
export const fetchCashfreePayments = async (orderId: string): Promise<any> => {
  try {
    console.log(`🔍 Fetching payment details for order: ${orderId}`);
    
    // Use the correct endpoint that matches the create-order endpoint
    const url = createApiUrl(`/api/payments/fetch-payments/${orderId}`);
    console.log(`🔗 Calling URL: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error: ${response.status} ${response.statusText}`, errorText);
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
 * Verify payment status after user completes payment
 * This should be called from your success page or payment status checking component
 */
export const verifyPaymentStatus = async (orderId: string) => {
  try {
    console.log(`🔍 Verifying payment for order: ${orderId}`);
    
    // Fetch payment details from Cashfree
    const paymentDetails = await fetchCashfreePayments(orderId);
    
    if (paymentDetails && paymentDetails.length > 0) {
      const latestPayment = paymentDetails[0];
      
      console.log('Payment details:', latestPayment);
      
      if (latestPayment.payment_status === 'SUCCESS') {
        console.log('✅ Payment successful!');
        return {
          success: true,
          status: 'SUCCESS',
          transactionId: latestPayment.cf_payment_id,
          amount: latestPayment.payment_amount,
          method: latestPayment.payment_method
        };
      } else if (latestPayment.payment_status === 'FAILED') {
        console.log('❌ Payment failed');
        return {
          success: false,
          status: 'FAILED',
          reason: latestPayment.failure_reason || 'Payment failed'
        };
      } else {
        console.log('⏳ Payment pending');
        return {
          success: false,
          status: 'PENDING',
          reason: 'Payment is still pending'
        };
      }
    } else {
      return {
        success: false,
        status: 'NOT_FOUND',
        reason: 'No payment found for this order'
      };
    }
  } catch (error) {
    console.error('❌ Payment verification failed:', error);
    return {
      success: false,
      status: 'ERROR',
      reason: error instanceof Error ? error.message : 'Payment verification failed'
    };
  }
};

/**
 * Example usage in a React component:
 */
/*
const PaymentSuccessPage = () => {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const orderId = searchParams.get('order_id');
    if (orderId) {
      verifyPaymentStatus(orderId).then(result => {
        setPaymentStatus(result);
        setLoading(false);
      });
    }
  }, [searchParams]);
  
  if (loading) return <div>Verifying payment...</div>;
  
  if (paymentStatus?.success) {
    return <div>Payment successful! Transaction ID: {paymentStatus.transactionId}</div>;
  } else {
    return <div>Payment failed: {paymentStatus?.reason}</div>;
  }
};
*/

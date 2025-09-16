// Example of how to verify payments after checkout

import { fetchCashfreePayments } from '../utils/cashfreeOrders';

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

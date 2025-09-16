import { NextRequest, NextResponse } from 'next/server';

// Verify payment status using server-side SDK
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await context.params;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Cashfree configuration from server environment
    const CASHFREE_CONFIG = {
      APP_ID: process.env.CASHFREE_APP_ID,
      SECRET_KEY: process.env.CASHFREE_SECRET_KEY,
      API_URL: process.env.CASHFREE_API_URL || 'https://api.cashfree.com/pg',
      API_VERSION: process.env.CASHFREE_API_VERSION || '2025-01-01'
    };

    // Ensure secrets are available
    if (!CASHFREE_CONFIG.APP_ID || !CASHFREE_CONFIG.SECRET_KEY) {
      return NextResponse.json(
        { success: false, error: 'Cashfree credentials not configured' },
        { status: 500 }
      );
    }

    console.log('Verifying payment for order:', orderId);

    // Get payment status from Cashfree
    const response = await fetch(
      `${CASHFREE_CONFIG.API_URL}/orders/${orderId}/payments`,
      {
        method: 'GET',
        headers: {
          'x-client-id': CASHFREE_CONFIG.APP_ID,
          'x-client-secret': CASHFREE_CONFIG.SECRET_KEY,
          'Accept': 'application/json',
          'x-api-version': CASHFREE_CONFIG.API_VERSION
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cashfree verification error:', errorData);
      return NextResponse.json(
        { success: false, error: `Payment verification failed: ${errorData.message || 'Unknown error'}` },
        { status: response.status }
      );
    }

    const payments = await response.json();
    
    // Process payment data for client
    const processedData = {
      success: true,
      order_id: orderId,
      payments: payments.map((payment: any) => ({
        payment_id: payment.cf_payment_id,
        payment_status: payment.payment_status,
        payment_amount: payment.payment_amount,
        payment_currency: payment.payment_currency,
        payment_method: payment.payment_group,
        payment_time: payment.payment_completion_time,
        payment_message: payment.payment_message
      })),
      total_payments: payments.length,
      latest_status: payments.length > 0 ? payments[0].payment_status : 'NO_PAYMENTS'
    };

    console.log('Payment verification completed for order:', orderId);

    return NextResponse.json(processedData);

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

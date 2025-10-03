import { NextRequest, NextResponse } from 'next/server';

// Get order status from Cashfree
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

    // Forward the request to the main backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const cleanBackendUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
    
    console.log(`🔍 Forwarding get order status request to backend: ${cleanBackendUrl}/api/payments/get-order-status/${orderId}`);
    
    const response = await fetch(`${cleanBackendUrl}/api/payments/get-order-status/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Forward any authentication headers if needed
        'Authorization': request.headers.get('Authorization') || '',
        'Cookie': request.headers.get('Cookie') || '',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error:', errorText);
      return NextResponse.json(
        { success: false, error: errorText || 'Failed to fetch order status from backend' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Order status fetched successfully from backend');

    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Order status fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
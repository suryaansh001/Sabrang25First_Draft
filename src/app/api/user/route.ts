import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.BACKEND_URL || 'https://surprising-balance-production.up.railway.app';

export async function GET(request: NextRequest) {
  try {
    // Get cookies from the request
    const cookieHeader = request.headers.get('cookie') || '';
    
    // Make request to backend /api/user endpoint
    const backendUrl = `${BACKEND_BASE_URL}/api/user`;
    
    console.log(`[User API] GET /api/user -> ${backendUrl}`);

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
      },
    });

    const responseData = await response.text();
    
    if (!response.ok) {
      console.error(`Backend user API responded with ${response.status}: ${response.statusText}`);
      return NextResponse.json(
        { success: false, message: 'Authentication failed' },
        { status: response.status }
      );
    }

    // Parse and return the user data
    try {
      const userData = JSON.parse(responseData);
      return NextResponse.json(userData, { 
        status: response.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Cookie',
        }
      });
    } catch (error) {
      console.error('Error parsing user data:', error);
      return NextResponse.json(
        { success: false, message: 'Invalid response from backend' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('User API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Cookie',
    },
  });
}
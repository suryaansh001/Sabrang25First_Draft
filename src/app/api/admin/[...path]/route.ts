import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.BACKEND_URL || 'https://sabrang-self-backend-production.up.railway.app';

export async function GET(request: NextRequest) {
  return handleAdminRequest(request, 'GET');
}

export async function POST(request: NextRequest) {
  return handleAdminRequest(request, 'POST');
}

export async function PUT(request: NextRequest) {
  return handleAdminRequest(request, 'PUT');
}

export async function DELETE(request: NextRequest) {
  return handleAdminRequest(request, 'DELETE');
}

async function handleAdminRequest(request: NextRequest, method: string) {
  try {
    // Extract the admin route path
    const url = new URL(request.url);
    const adminPath = url.pathname.replace('/api/admin', '');
    const queryString = url.search;
    
    // Construct backend URL
    const backendUrl = `${BACKEND_BASE_URL}/admin${adminPath}${queryString}`;
    
    console.log(`[Admin API] ${method} ${adminPath} -> ${backendUrl}`);

    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        // Forward cookies for authentication
        'Cookie': request.headers.get('cookie') || '',
      },
    };

    // Add body for POST, PUT requests
    if (method === 'POST' || method === 'PUT') {
      try {
        const body = await request.text();
        if (body) {
          requestOptions.body = body;
        }
      } catch (error) {
        console.error('Error reading request body:', error);
      }
    }

    // Make request to backend
    const response = await fetch(backendUrl, requestOptions);
    
    if (!response.ok) {
      console.error(`Backend responded with ${response.status}: ${response.statusText}`);
    }

    // Get response data
    const responseData = await response.text();
    
    // Handle different content types
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      try {
        const jsonData = JSON.parse(responseData);
        return NextResponse.json(jsonData, { 
          status: response.status,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie',
          }
        });
      } catch (error) {
        console.error('Error parsing JSON response:', error);
        return NextResponse.json(
          { success: false, message: 'Invalid JSON response from backend' },
          { status: 500 }
        );
      }
    } else if (contentType?.includes('text/csv')) {
      // Handle CSV downloads
      return new NextResponse(responseData, {
        status: response.status,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': response.headers.get('Content-Disposition') || 'attachment; filename="export.csv"',
        }
      });
    } else {
      // Handle other content types
      return new NextResponse(responseData, {
        status: response.status,
        headers: {
          'Content-Type': contentType || 'text/plain',
        }
      });
    }

  } catch (error) {
    console.error('Admin API Error:', error);
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
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie',
    },
  });
}
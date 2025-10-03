import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent);
    
    // Test backend connectivity
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://surprising-balance-production.up.railway.app';
    const backendBase = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
    
    let backendStatus = 'unknown';
    let backendError = null;
    
    try {
      const backendResponse = await fetch(`${backendBase}/health`, {
        method: 'GET',
        headers: {
          'User-Agent': 'Sabrang-HealthCheck'
        },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      backendStatus = backendResponse.ok ? 'healthy' : `error-${backendResponse.status}`;
    } catch (error) {
      backendStatus = 'unreachable';
      backendError = error instanceof Error ? error.message : String(error);
    }

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      frontend: {
        domain: request.headers.get('host'),
        userAgent,
        isMobile,
        origin: request.headers.get('origin'),
      },
      backend: {
        url: backendBase,
        status: backendStatus,
        error: backendError
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasApiUrl: !!process.env.NEXT_PUBLIC_API_URL,
        hasChatbotUrl: !!process.env.NEXT_PUBLIC_CHATBOT_API_BASE
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
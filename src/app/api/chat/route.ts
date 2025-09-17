import { NextRequest, NextResponse } from 'next/server';

// Server-side env var for backend FastAPI URL. Do NOT expose publicly.
// Example: BACKEND_CHAT_URL=https://your-backend.example.com/chat/
const BACKEND_CHAT_URL = process.env.BACKEND_CHAT_URL ?? 'http://localhost:8000/chat/';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const message: unknown = body?.message;
    const role: unknown = body?.role ?? 'user';
    const conversation_id: unknown = body?.conversation_id;

    if (typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'message is required' }, { status: 400 });
    }
    if (typeof conversation_id !== 'string' || !conversation_id.trim()) {
      return NextResponse.json({ error: 'conversation_id is required' }, { status: 400 });
    }

    const forwardPayload = {
      message,
      role: (typeof role === 'string' && (role === 'user' || role === 'assistant')) ? role : 'user',
      conversation_id,
    };

    const resp = await fetch(BACKEND_CHAT_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(forwardPayload),
      // In case backend is self-signed locally; keep default in prod
    });

    const contentType = resp.headers.get('content-type') || '';

    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      return NextResponse.json(
        { error: 'Upstream error', status: resp.status, detail: text },
        { status: 502 }
      );
    }

    if (contentType.includes('application/json')) {
      const data = await resp.json();
      const response = data?.response ?? data?.reply ?? data?.text ?? '';
      return NextResponse.json({ response, raw: data });
    }

    const text = await resp.text();
    return NextResponse.json({ response: text });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}




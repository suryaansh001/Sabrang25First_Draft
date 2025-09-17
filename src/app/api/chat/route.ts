import { NextRequest, NextResponse } from "next/server";

// Server-side env var for backend FastAPI URL (do not expose publicly)
// Prefer CHATBOT_API_BASE; fallback to NEXT_PUBLIC for convenience
const BACKEND_BASE = process.env.CHATBOT_API_BASE || process.env.NEXT_PUBLIC_CHATBOT_API_BASE || "https://backendmuj-production.up.railway.app";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    const res = await fetch(`${BACKEND_BASE}/chat/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    const contentType = res.headers.get("content-type") || "application/json";

    if (!res.ok) {
      return new NextResponse(text || `Upstream error ${res.status}`, {
        status: res.status,
        headers: { "content-type": contentType },
      });
    }

    return new NextResponse(text, { status: 200, headers: { "content-type": contentType } });
  } catch (err: any) {
    return NextResponse.json({ error: "Proxy error", message: err?.message || String(err) }, { status: 500 });
  }
}

export const runtime = "nodejs";

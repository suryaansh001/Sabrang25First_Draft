"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

const DEFAULT_BACKEND_BASE = "https://backendmuj-production.up.railway.app";

function generateConversationId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function getApiBase(): string {
  if (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_CHATBOT_API_BASE) {
    return process.env.NEXT_PUBLIC_CHATBOT_API_BASE;
  }
  return DEFAULT_BACKEND_BASE;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm the Sabrang Assistant. Ask me about SABRANG 2025 events, registrations, schedules, stays, or contacts.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiBase = useMemo(getApiBase, []);
  const conversationIdRef = useRef<string | null>(null);
  const listEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const stored = typeof window !== "undefined" ? localStorage.getItem("sabrang_chat_conversation_id") : null;
      if (stored) {
        conversationIdRef.current = stored;
      } else {
        const id = generateConversationId();
        conversationIdRef.current = id;
        if (typeof window !== "undefined") localStorage.setItem("sabrang_chat_conversation_id", id);
      }
    } catch {
      conversationIdRef.current = generateConversationId();
    }
  }, []);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;
    setIsSending(true);
    setError(null);

    const userMessage: ChatMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const conversationId = conversationIdRef.current ?? generateConversationId();
    if (!conversationIdRef.current) conversationIdRef.current = conversationId;

    try {
      const res = await fetch(`${apiBase}/chat/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, role: "user", conversation_id: conversationId }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed with ${res.status}`);
      }

      const data = (await res.json()) as { response: string };
      const assistantMessage: ChatMessage = { role: "assistant", content: data.response };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (e: unknown) {
      const friendly = e instanceof Error ? e.message : "Failed to reach the chatbot server.";
      setError(friendly);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having trouble responding right now. Please try again." },
      ]);
    } finally {
      setIsSending(false);
    }
  }, [apiBase, input, isSending]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        void sendMessage();
      }
    },
    [sendMessage]
  );

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex-1 overflow-y-auto space-y-3 p-3">
        {messages.map((m, idx) => (
          <div key={idx} className={m.role === "user" ? "text-right" : "text-left"}>
            <div
              className={
                (m.role === "user"
                  ? "inline-block max-w-[85%] rounded-2xl bg-indigo-600 px-4 py-3 text-white"
                  : "inline-block max-w-[85%] rounded-2xl bg-white/10 px-4 py-3 text-white") +
                " whitespace-pre-wrap break-words leading-relaxed"
              }
            >
              {m.content}
            </div>
          </div>
        ))}
        <div ref={listEndRef} />
      </div>

      <div className="border-t border-white/10 px-2 pt-2 pb-1">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about SABRANG 2025..."
            className="flex-1 rounded-xl bg-black/40 px-3 py-2 text-white placeholder-white/50 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-indigo-500"
            disabled={isSending}
          />
          <button
            onClick={() => void sendMessage()}
            disabled={isSending || input.trim().length === 0}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {isSending ? "Sending" : "Send"}
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </div>
    </div>
  );
}

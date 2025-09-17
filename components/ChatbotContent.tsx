"use client";

import { useEffect, useRef, useState } from "react";

// Chatbot component connected to your backend
function Chatbot() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm Sabrang Assistant. How can I help you with festival planning today?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const conversationIdRef = useRef<string | null>(null);

  const API_BASE = (typeof process !== "undefined" && (process as any).env?.NEXT_PUBLIC_CHATBOT_API_BASE) || "https://backendmuj-production.up.railway.app";

  useEffect(() => {
    try {
      const stored = typeof window !== "undefined" ? localStorage.getItem("sabrang_chat_conversation_id") : null;
      if (stored) {
        conversationIdRef.current = stored;
      } else {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
        conversationIdRef.current = id;
        if (typeof window !== "undefined") localStorage.setItem("sabrang_chat_conversation_id", id);
      }
    } catch {
      conversationIdRef.current = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    }
  }, []);

  async function postMessage(path: string, payload: any) {
    return fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      mode: 'cors',
    });
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = { id: Date.now(), text: input, sender: "user" } as const;
    setMessages(prev => [...prev, userMessage]);
    
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    const payload = { 
      message: currentInput,
      role: 'user',
      conversation_id: conversationIdRef.current || `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    };

    try {
      let res = await postMessage('/chat/', payload);

      // Fallback without trailing slash if the first attempt fails due to routing setups
      if (!res.ok && res.status === 404) {
        res = await postMessage('/chat', payload);
      }

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `HTTP ${res.status}`);
      }

      const data = await res.json().catch(() => ({ response: "" }));
      const reply = typeof data?.response === 'string' && data.response.trim().length > 0
        ? data.response
        : (typeof data?.message === 'string' ? data.message : "Sorry, I couldn't process your request.");
      
      const botResponse = { id: Date.now() + 1, text: reply, sender: "bot" } as const;
      setMessages(prev => [...prev, botResponse]);
    } catch (error: any) {
      console.error('Chat request failed:', error);
      const hint = error?.message?.includes('Failed to fetch')
        ? 'Network/CORS error: Ensure the backend URL is reachable over HTTPS and CORS allows this origin.'
        : error?.message || 'Unknown error';
      const errorResponse = { 
        id: Date.now() + 1, 
        text: `Sorry, I could not reach the server. ${hint}`, 
        sender: "bot" 
      } as const;
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                msg.sender === "user"
                  ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white"
                  : "bg-white/10 text-white/90 backdrop-blur-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 rounded-full bg-white/60 animate-bounce" />
                  <div className="h-2 w-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="h-2 w-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
                <span className="text-xs text-white/60">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="border-t border-white/10 p-3">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about festivals, decorations, food..."
            className="flex-1 rounded-xl bg-white/10 px-4 py-2 text-white placeholder-white/60 backdrop-blur-sm border border-white/20 focus:border-violet-400 focus:outline-none"
          />
          <button
            onClick={handleSend}
            className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2 text-white font-medium hover:from-violet-600 hover:to-fuchsia-600 transition-all duration-200"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function EnhancedOrbIcon({ isOpen = false }: { isOpen?: boolean }) {
  return (
    <div className="relative h-16 w-16 select-none">
      {/* Pulsing glow effect */}
      <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-cyan-400/20 blur-xl animate-pulse" />
      
      {/* Spinning gradient border */}
      <div
        className={`absolute -inset-1 rounded-full transition-all duration-300 ${
          isOpen ? "animate-spin" : "animate-pulse"
        }`}
        style={{
          background: "conic-gradient(from 0deg, #8b5cf6, #ec4899, #06b6d4, #10b981, #8b5cf6)",
          padding: "2px",
          borderRadius: "9999px",
        }}
      >
        <div className="h-full w-full rounded-full bg-slate-900" />
      </div>
      
      {/* Main orb */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 shadow-xl border border-white/10" />
      
      {/* Icon content */}
      <div className="absolute inset-0 grid place-items-center">
        <div className={`transition-all duration-300 ${isOpen ? "rotate-90 scale-110" : "rotate-0 scale-100"}`}>
          {isOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" className="text-white" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" className="text-white" fill="none">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </div>
      
      {/* Status indicator */}
      <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 border-2 border-slate-900 animate-pulse" />
    </div>
  );
}

export default function ChatbotContent() {
  const [open, setOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const panelSize = isMinimized
    ? "w-80 h-16"
    : "w-96 h-[580px]";

  return (
    <>
      {/* Enhanced floating orb */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        <button
          aria-label={open ? "Close chat" : "Open chat"}
          onClick={() => {
            setOpen(!open);
            setIsMinimized(false);
          }}
          className="relative group transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <EnhancedOrbIcon isOpen={open} />
        </button>
      </div>

      {/* Enhanced chat panel */}
      {open && (
        <div className={`fixed bottom-24 right-6 z-[9998] transition-all duration-300 ${panelSize}`}>
          {/* Glass morphism container */}
          <div className="relative h-full w-full">
            {/* Gradient border effect */}
            <div
              className="absolute -inset-0.5 rounded-3xl opacity-75 blur-sm"
              style={{
                background: "linear-gradient(45deg, #8b5cf6, #ec4899, #06b6d4, #10b981)",
              }}
            />
            
            {/* Main panel */}
            <div className="relative h-full w-full rounded-3xl bg-slate-900/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
              {/* Ambient light effects */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              <div className="absolute -top-40 -right-20 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-40 -left-20 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-3xl" />
              
              {!isMinimized && (
                <>
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" className="text-white" fill="none">
                          <circle cx="12" cy="12" r="3" fill="currentColor" />
                          <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Sabrang Assistant</h3>
                        <p className="text-xs text-white/60">Festival Helper • Online</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsMinimized(true)}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                        title="Minimize"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <path d="M6 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setOpen(false)}
                        className="p-2 rounded-lg bg-white/10 hover:bg-red-500/20 text-white/80 hover:text-white transition-colors"
                        title="Close"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* Chat content */}
                  <div className="h-[calc(100%-80px)]">
                    <Chatbot />
                  </div>
                </>
              )}
              
              {/* Minimized state */}
              {isMinimized && (
                <div className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
                    <span className="text-white font-medium">Sabrang Assistant</span>
                  </div>
                  <button
                    onClick={() => setIsMinimized(false)}
                    className="p-1 rounded text-white/60 hover:text-white transition-colors"
                    title="Expand"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M7 14l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
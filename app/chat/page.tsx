"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ChatMessage, N8nChatPayload } from "@/types/property";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import {
  Bot,
  Code2,
  MessageSquare,
  Plus,
  RefreshCw,
  Send,
  Terminal,
  User,
} from "lucide-react";

export default function ChatPage() {
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init_1",
      sender: "assistant",
      text: "Hello! Welcome to **Adron AI Assistant**. I am your official real estate consultant.\n\nHow can I help you today? Ask me about live properties, plot sizes (300sqm / 500sqm), title verification (C of O), 36-month flexible payment plans, or booking a free physical site tour!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      suggestedActions: [
        "What can I get for 15 million naira?",
        "Tell me about 300sqm plot in Eko City",
        "Do you offer installment payments?",
        "Book a free site inspection",
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastPayloadSent, setLastPayloadSent] = useState<N8nChatPayload | null>(null);
  const [lastResponseMeta, setLastResponseMeta] = useState<any>(null);
  const [showJsonInspector, setShowJsonInspector] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize real-time session ID per browser session
  useEffect(() => {
    let sid = sessionStorage.getItem("adron_chat_page_session_id");
    if (!sid) {
      sid = `session_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      sessionStorage.setItem("adron_chat_page_session_id", sid);
    }
    setActiveSessionId(sid);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (customText?: string) => {
    const text = customText || input;
    if (!text.trim() || loading) return;

    const currentSid = activeSessionId || `session_${Date.now()}`;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: "user",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInput("");
    setLoading(true);

    const payload: N8nChatPayload = {
      message: text.trim(),
      sessionId: currentSid,
      userContext: { device: "Next.js Chat Page" },
    };

    setLastPayloadSent(payload);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      setLastResponseMeta(json.meta);

      const responseText =
        json.data?.output ||
        json.data?.response ||
        json.response ||
        json.output ||
        json.data?.text ||
        json.text ||
        "Thank you for reaching out to Adron Homes!";

      const assistantMsg: ChatMessage = {
        id: `ast_${Date.now()}`,
        sender: "assistant",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedActions: json.data?.suggestedActions || json.suggestedActions,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const savedThreads = [
    { id: "t1", title: "Eko City Shimawa Pricing", date: "Today" },
    { id: "t2", title: "36-Month Payment Plan Calculation", date: "Yesterday" },
    { id: "t3", title: "Abuja Manhattan Park Inquiry", date: "3 days ago" },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      {/* ChatGPT Layout Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full grid grid-cols-1 md:grid-cols-12 gap-6 h-[calc(100vh-140px)] min-h-[600px]">
        {/* Left Sidebar */}
        <div className="hidden md:flex md:col-span-4 lg:col-span-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <button
              onClick={() => {
                const newSid = `session_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
                sessionStorage.setItem("adron_chat_page_session_id", newSid);
                setActiveSessionId(newSid);
                setMessages([
                  {
                    id: `new_${Date.now()}`,
                    sender: "assistant",
                    text: "New real-time conversation session started! How can I assist you with Adron Estates?",
                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    suggestedActions: ["Show Featured Estates", "Book Free Tour"],
                  },
                ]);
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-4 rounded-2xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 font-aclonica cursor-pointer"
            >
              <Plus className="w-4 h-4" /> New Chat Session
            </button>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-2">Saved Conversations</span>
              {savedThreads.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveSessionId(`session_${t.id}`);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors ${
                    activeSessionId.includes(t.id)
                      ? "bg-zinc-100 dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                  }`}
                >
                  <span className="truncate flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 shrink-0" /> {t.title}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-normal shrink-0">{t.date}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
            <span className="flex items-center gap-1.5 font-semibold text-zinc-700 dark:text-zinc-300">
              <User className="w-4 h-4 text-emerald-600" /> Session Active
            </span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">
              Live
            </span>
          </div>
        </div>

        {/* Center Main ChatGPT Conversation Workspace */}
        <div className="col-span-1 md:col-span-8 lg:col-span-9 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between">
          {/* Header */}
          <div className="bg-zinc-100 dark:bg-zinc-950 px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-zinc-950 dark:text-white font-aclonica">Adron AI Consultant</h3>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Session: {activeSessionId ? activeSessionId.substring(0, 18) : "Connecting..."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowJsonInspector(!showJsonInspector)}
                className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 font-mono cursor-pointer"
              >
                <Code2 className="w-4 h-4" /> {showJsonInspector ? "Hide Payload" : "Inspect Payload"}
              </button>
              <Link href="/properties" className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
                Browse Estates &rarr;
              </Link>
            </div>
          </div>

          {/* JSON Inspector Panel (Collapsible) */}
          {showJsonInspector && (
            <div className="bg-zinc-950 text-emerald-400 p-4 border-b border-zinc-800 font-mono text-xs space-y-2 animate-in slide-in-from-top-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-emerald-400" /> Target Webhook Variable (N8N_WEBHOOK_URL):
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                  {lastResponseMeta?.n8nUrl || process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || "Configured via .env.local"}
                </span>
              </div>
              <div>
                <span className="text-zinc-400 block mb-1">Last Outgoing JSON Body:</span>
                <pre className="bg-zinc-900 p-2.5 rounded border border-zinc-800 text-[11px] overflow-x-auto">
                  {lastPayloadSent ? JSON.stringify(lastPayloadSent, null, 2) : "// Awaiting user input..."}
                </pre>
              </div>
            </div>
          )}

          {/* Message Stream */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-zinc-50/50 dark:bg-zinc-950/40">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3.5 max-w-3xl ${m.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${
                  m.sender === "user" ? "bg-zinc-800 text-white" : "bg-emerald-600 text-white shadow-md"
                }`}>
                  {m.sender === "user" ? "U" : <Bot className="w-4 h-4" />}
                </div>

                <div className="space-y-2 max-w-[88%]">
                  <div
                    className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      m.sender === "user"
                        ? "bg-emerald-600 text-white font-medium rounded-tr-none shadow-md"
                        : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-tl-none border border-zinc-200 dark:border-zinc-700/60 shadow-sm"
                    }`}
                  >
                    <MarkdownRenderer content={m.text} />
                  </div>

                  <span className="text-[10px] text-zinc-400 block px-1">{m.timestamp}</span>

                  {m.suggestedActions && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {m.suggestedActions.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(action)}
                          className="text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-full transition-colors font-medium text-left cursor-pointer"
                        >
                          ⚡ {action}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-3 text-xs text-emerald-600 dark:text-emerald-400 bg-white dark:bg-zinc-800 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 w-fit shadow-sm">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Adron AI Sales Agent is reasoning and querying live inventory...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* ChatGPT Prompt Input Bar */}
          <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-3"
            >
              <input
                type="text"
                placeholder="Ask about properties, plot sizes, C of O verification, or schedule site inspection..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-xs sm:text-sm px-4 py-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:border-emerald-600 placeholder:text-zinc-400"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold p-3.5 rounded-2xl transition-all shadow-md shadow-emerald-600/20 font-aclonica cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <p className="text-[10px] text-zinc-400 text-center">
              Active Environment Webhook: <code className="text-emerald-500 font-mono">N8N_WEBHOOK_URL</code> configured in <code className="text-zinc-300">.env.local</code>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

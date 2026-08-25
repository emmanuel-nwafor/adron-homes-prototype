"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChatMessage, N8nChatPayload } from "@/types/property";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Bot,
  Building2,
  Calendar,
  Code2,
  CreditCard,
  Home,
  Plus,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  Terminal,
  User,
} from "lucide-react";

export default function ChatPage() {
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastPayloadSent, setLastPayloadSent] = useState<N8nChatPayload | null>(null);
  const [lastResponseMeta, setLastResponseMeta] = useState<any>(null);
  const [showJsonInspector, setShowJsonInspector] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize session ID and load saved chat history
  useEffect(() => {
    let sid = sessionStorage.getItem("adron_chat_page_session_id");
    if (!sid) {
      sid = `session_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      sessionStorage.setItem("adron_chat_page_session_id", sid);
    }
    setActiveSessionId(sid);
    fetchChatHistory(sid);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const fetchChatHistory = async (sid: string) => {
    try {
      const res = await fetch(`/api/chat?sessionId=${sid}`);
      const json = await res.json();
      if (json.success && json.messages && json.messages.length > 0) {
        setMessages(json.messages);
      }
    } catch (err) {
      console.warn("Could not fetch chat history:", err);
    }
  };

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

  return (
    <div className="h-screen w-screen bg-zinc-50 dark:bg-[#07090e] text-zinc-900 dark:text-zinc-100 flex font-sans overflow-hidden relative selection:bg-emerald-500 selection:text-white transition-colors duration-300">
      {/* Background Radial Glow */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_20%,#10b98115,transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_20%,#064e3b33,transparent_70%)]" />

      <div className="w-full h-full p-2 sm:p-4 flex gap-3 sm:gap-4 overflow-hidden relative">
        {/* Left Vertical Dock Sidebar */}
        <aside className="hidden md:flex flex-col justify-between items-center py-5 px-3 bg-white/80 dark:bg-zinc-900/70 backdrop-blur-2xl border border-zinc-200 dark:border-zinc-800/80 rounded-3xl w-16 shrink-0 shadow-2xl z-20 transition-colors duration-300">
          <div className="flex flex-col items-center gap-6">
            <Link href="/" className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-600/30 hover:scale-105 transition-transform">
              A
            </Link>

            <nav className="flex flex-col gap-4">
              <Link href="/" className="p-2.5 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors" title="Home Landing">
                <Home className="w-5 h-5" />
              </Link>
              <Link href="/properties" className="p-2.5 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors" title="Properties Catalog">
                <Building2 className="w-5 h-5" />
              </Link>
              <button
                onClick={() => {
                  const newSid = `session_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
                  sessionStorage.setItem("adron_chat_page_session_id", newSid);
                  setActiveSessionId(newSid);
                  setMessages([]);
                }}
                className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors cursor-pointer"
                title="New Chat Session"
              >
                <Plus className="w-5 h-5" />
              </button>
            </nav>
          </div>

          <div className="flex flex-col items-center gap-4">
            <ThemeToggle />
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center font-bold text-xs text-zinc-800 dark:text-white">
                <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-950 animate-pulse" />
            </div>
          </div>
        </aside>

        {/* Main Gemini-Style AI Workspace Container */}
        <main className="flex-1 bg-white/90 dark:bg-zinc-900/40 backdrop-blur-2xl border border-zinc-200 dark:border-zinc-800/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between relative h-full transition-colors duration-300">
          {/* Top Fixed Header Bar */}
          <header className="bg-zinc-100/90 dark:bg-zinc-900/90 backdrop-blur-md px-4 sm:px-6 py-3 border-b border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between shrink-0 z-20 transition-colors duration-300">
            <div className="flex items-center gap-3">
              <Link href="/" className="md:hidden w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                A
              </Link>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 dark:bg-emerald-600/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-zinc-950 dark:text-white font-aclonica flex items-center gap-2">
                  Adron AI Workspace
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-mono font-bold">
                    Gemini Engine
                  </span>
                </h3>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
                  Session: {activeSessionId ? activeSessionId.substring(0, 16) : "Connecting..."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://wa.me/?text=Hello%20Adron%20Homes%20%26%20Properties,%20I%20am%20interested%20in%20your%20land%20plots."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold text-xs transition-colors cursor-pointer"
                title="Connect on WhatsApp"
              >
                <svg
                  className="w-4 h-4 fill-emerald-600 dark:fill-emerald-400"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.118.553 4.106 1.522 5.834L.05 23.55l5.859-1.536A11.937 11.937 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.848 0-3.578-.497-5.075-1.365l-.364-.21-3.473.91.926-3.385-.231-.368A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                </svg>
                <span className="hidden sm:inline">WhatsApp</span>
              </a>

              <button
                onClick={() => setShowJsonInspector(!showJsonInspector)}
                className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white flex items-center gap-1 font-mono cursor-pointer"
              >
                <Code2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> {showJsonInspector ? "Hide Payload" : "Inspect Payload"}
              </button>
              <Link href="/properties" className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline hidden sm:inline">
                Explore Estates &rarr;
              </Link>
            </div>
          </header>

          {/* JSON Inspector Panel */}
          {showJsonInspector && (
            <div className="bg-zinc-100 dark:bg-zinc-950 text-emerald-700 dark:text-emerald-400 p-4 border-b border-zinc-200 dark:border-zinc-800 font-mono text-xs space-y-2 animate-in slide-in-from-top-2 shrink-0 z-20">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Target Environment Variable:
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded">
                  {lastResponseMeta?.n8nUrl || process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || "N8N_WEBHOOK_URL"}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 dark:text-zinc-400 block mb-1">Last Outgoing JSON Body:</span>
                <pre className="bg-zinc-200 dark:bg-zinc-900 p-2.5 rounded border border-zinc-300 dark:border-zinc-800 text-[11px] overflow-x-auto text-zinc-900 dark:text-emerald-400">
                  {lastPayloadSent ? JSON.stringify(lastPayloadSent, null, 2) : "// Awaiting prompt submission..."}
                </pre>
              </div>
            </div>
          )}

          {/* Middle Scrollable Chat Stream (Mouse wheel & Touchpad scrolling enabled via data-lenis-prevent) */}
          <div
            className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-800 touch-pan-y"
            data-lenis-prevent
          >
            {messages.length === 0 ? (
              /* Hero Splash View */
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 my-auto py-6">
                {/* 3D Iridescent Orb Avatar */}
                <div className="relative group cursor-pointer">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-emerald-600 via-cyan-400 to-indigo-600 animate-pulse shadow-[0_0_60px_rgba(16,185,129,0.3)] flex items-center justify-center p-1">
                    <div className="w-full h-full rounded-full bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm flex items-center justify-center">
                      <Sparkles className="w-10 h-10 text-emerald-600 dark:text-emerald-400 animate-bounce" />
                    </div>
                  </div>
                </div>

                {/* Hero Greeting Typography */}
                <div className="space-y-2 max-w-xl">
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white font-aclonica tracking-tight">
                    Hi, Welcome to Adron AI
                  </h1>
                  <h2 className="text-xl sm:text-3xl font-bold text-zinc-700 dark:text-zinc-300">
                    How can I help today?
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto pt-1">
                    I&apos;m here to help — from quick property budget searches to 36-month payment plans and free site inspection tour bookings.
                  </p>
                </div>

                {/* Bottom Quick Feature Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl w-full pt-2">
                  <button
                    onClick={() => handleSendMessage("Show properties under ₦20 Million")}
                    className="p-4 rounded-2xl bg-zinc-100/90 dark:bg-zinc-900/80 hover:bg-zinc-200/90 dark:hover:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-800 text-left space-y-2 transition-all hover:border-emerald-500/40 group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Search className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-xs text-zinc-950 dark:text-white">Search Estates</h4>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400">Find verified land plots matching your exact budget.</p>
                  </button>

                  <button
                    onClick={() => handleSendMessage("How does 36-month flexible payment work?")}
                    className="p-4 rounded-2xl bg-zinc-100/90 dark:bg-zinc-900/80 hover:bg-zinc-200/90 dark:hover:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-800 text-left space-y-2 transition-all hover:border-emerald-500/40 group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-xs text-zinc-950 dark:text-white">Payment Plans</h4>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400">Daily installments starting from ₦2,750/day.</p>
                  </button>

                  <button
                    onClick={() => handleSendMessage("I'd like to inspect property tomorrow")}
                    className="p-4 rounded-2xl bg-zinc-100/90 dark:bg-zinc-900/80 hover:bg-zinc-200/90 dark:hover:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-800 text-left space-y-2 transition-all hover:border-emerald-500/40 group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-xs text-zinc-950 dark:text-white">Book Free Tour</h4>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400">Reserve executive bus seats for physical site inspection.</p>
                  </button>
                </div>
              </div>
            ) : (
              /* Active Message Stream */
              <div className="space-y-6 max-w-4xl mx-auto">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex gap-3.5 max-w-3xl ${m.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}
                  >
                    <div className={`w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 font-bold text-xs ${
                      m.sender === "user" ? "bg-zinc-800 text-white" : "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                    }`}>
                      {m.sender === "user" ? "U" : <Bot className="w-4 h-4" />}
                    </div>

                    <div className="space-y-2 max-w-[90%]">
                      <div
                        className={`rounded-3xl p-4 text-xs sm:text-sm leading-relaxed ${
                          m.sender === "user"
                            ? "bg-emerald-600 text-white font-medium rounded-tr-none shadow-lg"
                            : "bg-white dark:bg-zinc-900/90 text-zinc-950 dark:text-zinc-100 rounded-tl-none border border-zinc-200 dark:border-zinc-800 shadow-md"
                        }`}
                      >
                        <MarkdownRenderer content={m.text} />
                      </div>

                      <span className="text-[10px] text-zinc-500 block px-1">{m.timestamp}</span>

                      {m.suggestedActions && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {m.suggestedActions.map((action, i) => (
                            <button
                              key={i}
                              onClick={() => handleSendMessage(action)}
                              className="text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full transition-colors font-medium text-left cursor-pointer"
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
                  <div className="flex items-center gap-3 text-xs text-emerald-600 dark:text-emerald-400 bg-white dark:bg-zinc-900 p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 w-fit shadow-md animate-pulse">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Adron AI Agent is reasoning & querying live inventory...</span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          {/* Locked Bottom Prompt Input Bar (Fixed at bottom like Gemini / ChatGPT) */}
          <div className="shrink-0 p-3 sm:p-4 bg-gradient-to-t from-zinc-100 via-zinc-100/95 to-transparent dark:from-[#07090e] dark:via-[#07090e]/95 dark:to-transparent z-20 transition-colors duration-300">
            <div className="max-w-3xl mx-auto bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl border border-zinc-200 dark:border-zinc-800 rounded-3xl p-3 shadow-2xl space-y-2 transition-colors duration-300">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex flex-col space-y-2"
              >
                <textarea
                  rows={2}
                  placeholder="Ask me anything about Adron Homes land plots, prices, titles..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="w-full bg-transparent text-zinc-950 dark:text-white text-xs sm:text-sm px-3 py-1 focus:outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500 resize-none"
                />

                {/* Bottom Quick Action Pills & Send Button */}
                <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800/80 pt-2 px-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleSendMessage("Show properties under ₦20 Million")}
                      className="text-[11px] bg-zinc-200/80 dark:bg-zinc-800/80 hover:bg-zinc-300/80 dark:hover:bg-zinc-700/80 text-zinc-800 dark:text-zinc-300 px-2.5 py-1 rounded-xl transition-colors font-medium flex items-center gap-1 cursor-pointer"
                    >
                      📁 Browse
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendMessage("Tell me more about 300sqm plot")}
                      className="text-[11px] bg-zinc-200/80 dark:bg-zinc-800/80 hover:bg-zinc-300/80 dark:hover:bg-zinc-700/80 text-zinc-800 dark:text-zinc-300 px-2.5 py-1 rounded-xl transition-colors font-medium flex items-center gap-1 cursor-pointer"
                    >
                      📐 300sqm Details
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendMessage("Do you offer installment payments?")}
                      className="text-[11px] bg-zinc-200/80 dark:bg-zinc-800/80 hover:bg-zinc-300/80 dark:hover:bg-zinc-700/80 text-zinc-800 dark:text-zinc-300 px-2.5 py-1 rounded-xl transition-colors font-medium flex items-center gap-1 cursor-pointer hidden sm:flex"
                    >
                      💳 Payment FAQ
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white flex items-center justify-center font-bold transition-all shadow-lg shadow-emerald-600/30 cursor-pointer shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

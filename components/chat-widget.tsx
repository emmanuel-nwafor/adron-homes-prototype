"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, ChevronDown, RefreshCw, Send } from "lucide-react";
import { ChatMessage } from "@/types/property";
import { MarkdownRenderer } from "@/components/markdown-renderer";

interface ChatWidgetProps {
  initialPropertyTitle?: string;
  initialPropertyId?: string;
}

export function ChatWidget({ initialPropertyTitle, initialPropertyId }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg_welcome",
      sender: "assistant",
      text: initialPropertyTitle
        ? `Hello! I am your Adron AI Assistant. How can I help you regarding **${initialPropertyTitle}**?`
        : "Hello! Welcome to **Adron Homes & Properties** AI Assistant. Ask me about land prices, 36-month flexible payment plans, or site inspection bookings!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      suggestedActions: initialPropertyTitle
        ? ["Show Payment Breakdown", "Book Inspection", "Title Verification"]
        : ["Show Estates under ₦20M", "How Payment Plans Work", "Book Free Site Inspection"],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generate unique real-time session ID per browser session
  useEffect(() => {
    let sid = sessionStorage.getItem("adron_chat_session_id");
    if (!sid) {
      sid = `session_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      sessionStorage.setItem("adron_chat_session_id", sid);
    }
    setSessionId(sid);
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim() || loading) return;

    const activeSessionId = sessionId || `session_${Date.now()}`;

    const userMsg: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      sender: "user",
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          sessionId: activeSessionId,
          userContext: {
            propertyId: initialPropertyId,
            propertyTitle: initialPropertyTitle,
          },
        }),
      });

      const json = await res.json();

      const responseText =
        json.data?.output ||
        json.data?.response ||
        json.response ||
        json.output ||
        json.data?.text ||
        json.text ||
        "Thank you for inquiring with Adron Homes!";

      const assistantMsg: ChatMessage = {
        id: `msg_ast_${Date.now()}`,
        sender: "assistant",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedActions: json.data?.suggestedActions || json.suggestedActions,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          sender: "system",
          text: "Unable to connect to assistant backend. Please verify server status.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="w-[360px] sm:w-[420px] h-[550px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 mb-3 text-zinc-900 dark:text-zinc-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 p-4 border-b border-zinc-800 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm font-aclonica flex items-center gap-2">
                  Adron AI Assistant
                </h4>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online • Autonomous Sales Agent
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Feed (Mouse wheel & touchpad scrolling enabled via data-lenis-prevent) */}
          <div
            className="flex-1 p-4 overflow-y-auto space-y-3 bg-zinc-50 dark:bg-zinc-950/50 touch-pan-y"
            data-lenis-prevent
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-emerald-600 text-white font-medium rounded-br-none shadow-md"
                      : msg.sender === "system"
                      ? "bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800"
                      : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-none border border-zinc-200 dark:border-zinc-700/60 shadow-sm"
                  }`}
                >
                  <MarkdownRenderer content={msg.text} />
                </div>

                <span className="text-[10px] text-zinc-400 mt-1 px-1">{msg.timestamp}</span>

                {/* Suggested actions if present */}
                {msg.suggestedActions && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                    {msg.suggestedActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(action)}
                        className="text-[11px] bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full transition-colors text-left font-medium cursor-pointer"
                      >
                        ⚡ {action}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 bg-white dark:bg-zinc-900 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 w-fit">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>AI Agent is generating response...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about properties, plot sizes, C of O..."
                className="flex-1 bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-white text-xs px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:border-emerald-600 placeholder:text-zinc-400"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white p-2.5 rounded-xl transition-colors font-bold shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-2xl shadow-xl shadow-emerald-600/30 font-bold flex items-center gap-2.5 transition-transform duration-200 hover:scale-105 cursor-pointer"
      >
        <div className="relative">
          <Bot className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-zinc-950 animate-ping" />
        </div>
        <span className="text-sm font-extrabold hidden sm:inline font-aclonica">Adron AI Support</span>
      </button>
    </div>
  );
}

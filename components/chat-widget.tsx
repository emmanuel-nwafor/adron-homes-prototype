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
        ? `Hello! I am **AdBot**. How can I help you regarding **${initialPropertyTitle}**?`
        : "Hello! Welcome to **Adron Homes & Properties**. I am **AdBot**, your AI Assistant. Ask me about land prices, 36-month flexible payment plans, or site inspection bookings!",
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
                  AdBot Assistant
                </h4>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online • Autonomous Sales Agent
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://wa.me/?text=Hello%20Adron%20Homes%20%26%20Properties,%20I%20am%20interested%20in%20your%20land%20plots."
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-white p-1.5 rounded-xl hover:bg-emerald-600/30 transition-colors flex items-center justify-center cursor-pointer"
                title="Chat on WhatsApp"
              >
                <svg
                  className="w-5 h-5 fill-emerald-400 hover:fill-white transition-colors"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.118.553 4.106 1.522 5.834L.05 23.55l5.859-1.536A11.937 11.937 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.848 0-3.578-.497-5.075-1.365l-.364-.21-3.473.91.926-3.385-.231-.368A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                </svg>
              </a>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-white p-1.5 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
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
                <span>AdBot is generating response...</span>
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
        <span className="text-sm font-extrabold hidden sm:inline font-aclonica">AdBot Support</span>
      </button>
    </div>
  );
}

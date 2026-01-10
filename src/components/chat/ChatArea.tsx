"use client";

import React, { useEffect, useRef } from "react";
import { Bot, Copy, RefreshCw, Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
// Define the type for messages (should align with your hooks/useChat type)
interface Message {
  id: string;
  role: "user" | "model" | "assistant";
  content: string;
  timestamp: string;
}

interface ChatAreaProps {
  messages: Message[];
}

export const ChatArea: React.FC<ChatAreaProps> = ({ messages }) => {
  const { user } = useAuth();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main className="flex-1 flex flex-col relative h-full overflow-hidden">
      {/* Mobile Header - Visible only on small screens */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white/35 backdrop-blur-md border border-white/40 sticky top-0 z-30">
        <span className="font-bold text-[#3A5A40] flex items-center gap-2">
          {/* flower/spa icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 text-[#588157]"
          >
            <path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V9m-4.5 3a4.5 4.5 0 1 1 4.5-4.5M7.5 12H9m3 0a4.5 4.5 0 1 1-4.5 4.5M9 12v1.5M12 12v1.5a4.5 4.5 0 1 1 4.5 4.5M12 12h1.5" />
          </svg>
          P.A.T.C.H
        </span>
        <button className="p-2 rounded-lg text-[#3A5A40]">
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* Chat Stream */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth pb-32">
        {/* Initial Greeting if no messages */}
        {messages.length === 0 && (
          <div className="flex gap-4 max-w-4xl mx-auto w-full group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-[#A3B18A] border border-white/50 flex-shrink-0 flex items-center justify-center shadow-sm">
              <Bot className="w-5 h-5 text-[#588157]" />
            </div>
            <div className="flex flex-col gap-1 max-w-[85%] lg:max-w-[70%]">
              <div className="flex items-center gap-2 ml-1">
                <span className="text-xs font-bold text-[#3A5A40]">
                  P.A.T.C.H
                </span>
              </div>
              <div className="bg-white/35 backdrop-blur-md border border-white/40 p-5 rounded-2xl rounded-tl-none shadow-soft text-[#3A5A40] relative">
                <p className="leading-relaxed">
                  Hello! I am P.A.T.C.H, your serene AI companion. I&apos;m
                  designed to help you organize your thoughts and tasks with
                  clarity.
                </p>
                <p className="leading-relaxed mt-3">
                  How can I assist you in navigating your day?
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Message Mapping */}
        {messages.map((msg, index) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id || index}
              className={`flex gap-4 max-w-4xl mx-auto w-full group ${
                isUser ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex-shrink-0 border-2 border-white/20 shadow-sm flex items-center justify-center font-bold text-sm overflow-hidden
                  ${
                    isUser
                      ? "bg-[#A3B18A] text-white"
                      : "bg-gradient-to-br from-white to-[#A3B18A] border-white/50"
                  }
                `}
              >
                {isUser ? (
                  user?.username?.charAt(0).toUpperCase() || "U"
                ) : (
                  <Bot className="w-5 h-5 text-[#588157]" />
                )}
              </div>

              <div
                className={`flex flex-col gap-1 max-w-[85%] lg:max-w-[70%] ${
                  isUser ? "items-end" : ""
                }`}
              >
                {!isUser && (
                  <div className="flex items-center gap-2 ml-1">
                    <span className="text-xs font-bold text-[#3A5A40]">
                      P.A.T.C.H
                    </span>
                  </div>
                )}

                <div
                  className={`p-5 rounded-2xl shadow-soft relative text-[#3A5A40]
                    ${
                      isUser
                        ? "bg-[#588157] text-white rounded-tr-none shadow-[#588157]/20"
                        : "bg-white/35 backdrop-blur-md border border-white/40 rounded-tl-none"
                    }
                  `}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>

                {!isUser && (
                  <div className="flex gap-2 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-xs text-[#3A5A40]/50 hover:text-[#588157] flex items-center gap-1">
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                    <button className="text-xs text-[#3A5A40]/50 hover:text-[#588157] flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" /> Regenerate
                    </button>
                  </div>
                )}

                {isUser && (
                  <span className="text-[10px] text-[#3A5A40]/40 mr-1">
                    Delivered
                  </span>
                )}
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} className="h-4"></div>
      </div>
    </main>
  );
};

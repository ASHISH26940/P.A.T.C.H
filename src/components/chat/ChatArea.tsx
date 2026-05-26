"use client";
import React, { useEffect, useRef } from "react";

interface Message { id: string; role: "user" | "model" | "assistant"; content: string; timestamp: string; }
interface ChatAreaProps { messages: Message[]; isLoading?: boolean; }

export const ChatArea: React.FC<ChatAreaProps> = ({ messages, isLoading }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8 max-w-4xl mx-auto w-full custom-scrollbar">
      {messages.length === 0 && (
        <div className="flex justify-start w-full">
          <div className="w-[90%] p-6 border border-primary-container rounded flex flex-col gap-4">
            <p className="text-[14px] leading-relaxed text-on-surface">
              Hello, I&apos;m P.A.T.C.H — your creator memory layer.
            </p>
            <p className="text-[14px] leading-relaxed text-on-surface">
              Ask me anything about your videos, notes, or projects.
            </p>
          </div>
        </div>
      )}

      {messages.map((msg, index) => {
        const isUser = msg.role === "user";
        return (
          <div key={msg.id || index} className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
            <div className={isUser ? "w-[80%]" : "w-[90%]"}>
              {isUser ? (
                <div className="p-6 border border-glass-border rounded text-on-surface text-[14px] leading-relaxed">
                  {msg.content}
                </div>
              ) : (
                <div className="p-6 border border-primary-container rounded text-[14px] leading-relaxed text-on-surface">
                  {msg.content}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {isLoading && (
        <div className="flex justify-start w-full">
          <div className="w-[90%] p-6 border border-primary-container rounded">
            <p className="text-[14px] text-primary-container flex items-center">
              Generating response...
              <span className="typing-cursor"></span>
            </p>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

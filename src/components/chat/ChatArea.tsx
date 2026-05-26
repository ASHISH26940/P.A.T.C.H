"use client";
import React, { useEffect, useRef, useState } from "react";

interface SourceDoc {
  id?: string;
  content?: string;
  metadata?: Record<string, unknown>;
  distance?: number;
}

interface Message {
  id: string;
  role: "user" | "model" | "assistant";
  content: string;
  timestamp: string;
  sourceDocuments?: SourceDoc[];
}

interface ChatAreaProps {
  messages: Message[];
  isLoading?: boolean;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ messages, isLoading }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCopy = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  const getSourceLabel = (doc: SourceDoc): string => {
    const meta = doc.metadata || {};
    return (meta as any).source_type || (meta as any).title || "Source";
  };

  const getSourceIcon = (doc: SourceDoc): string => {
    const meta = doc.metadata || {};
    const type = ((meta as any).source_type || "").toLowerCase();
    if (type.includes("pdf") || type.includes("guide")) return "auto_awesome";
    if (type.includes("log")) return "source";
    return "description";
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8 max-w-4xl mx-auto w-full custom-scrollbar">
      {messages.length === 0 && !isLoading && (
        <div className="flex justify-start w-full animate-fade-in">
          <div className="w-[90%] p-6 border border-primary-container rounded flex flex-col gap-4 hover:border-primary-container/80 transition-colors">
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
        const docs = (msg as any).sourceDocuments as SourceDoc[] | undefined;

        return (
          <div
            key={msg.id || index}
            className={`flex w-full ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}
          >
            <div className={isUser ? "w-[80%]" : "w-[90%] group"}>
              {isUser ? (
                <div className="p-6 border border-glass-border rounded text-on-surface text-[14px] leading-relaxed hover:border-glass-border/60 transition-colors">
                  {msg.content}
                </div>
              ) : (
                <div className="p-6 border border-primary-container rounded text-[14px] leading-relaxed text-on-surface hover:border-primary-container/80 transition-colors">
                  {msg.content}
                  {docs && docs.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-3 pt-4 border-t border-primary-container/20">
                      {docs.map((doc, i) => (
                        <div
                          key={doc.id || i}
                          className="px-3 py-1.5 bg-surface-container-low border border-primary-container/30 rounded text-[10px] text-primary-container flex items-center gap-2 cursor-pointer hover:bg-surface-container-high transition-colors"
                        >
                          <span className="material-symbols-outlined text-[14px]">{getSourceIcon(doc)}</span>
                          {getSourceLabel(doc)}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleCopy(msg.content, msg.id || String(index))}
                      className="text-[11px] text-on-surface-variant hover:text-primary-container flex items-center gap-1.5 px-2 py-1 rounded hover:bg-surface-container-low transition-all"
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {copiedId === (msg.id || String(index)) ? "check" : "content_copy"}
                      </span>
                      {copiedId === (msg.id || String(index)) ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {isLoading && (
        <div className="flex justify-start w-full animate-fade-in">
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

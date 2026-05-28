"use client";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

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

  // Pull the best available label from whatever the backend returns
  const getSourceLabel = (doc: SourceDoc): string => {
    const meta = (doc.metadata ||
      (doc as any).document?.metadata ||
      {}) as Record<string, unknown>;
    return (
      (meta.title as string) ||
      (meta.source_type as string) ||
      (meta.source as string) ||
      (meta.filename as string) ||
      (meta.document_type as string) ||
      (meta.name as string) ||
      // last resort: first 40 chars of content
      ((doc.content || (doc as any).document?.content || "") as string)
        .slice(0, 40)
        .trim() ||
      `Doc ${String(doc.id || "?").slice(0, 6)}`
    );
  };

  const getSourceIcon = (doc: SourceDoc): string => {
    const meta = (doc.metadata ||
      (doc as any).document?.metadata ||
      {}) as Record<string, unknown>;
    const type = String(
      meta.source_type || meta.document_type || meta.filename || "",
    ).toLowerCase();
    if (type.includes("pdf") || type.includes("guide")) return "picture_as_pdf";
    if (type.includes("log")) return "terminal";
    if (type.includes("video") || type.includes("mp4")) return "play_circle";
    if (type.includes("note")) return "sticky_note_2";
    return "description";
  };

  const getSourceContent = (doc: SourceDoc): string =>
    (doc.content || (doc as any).document?.content || "") as string;

  const getSourceScore = (doc: SourceDoc): string | null => {
    if (doc.distance == null) return null;
    // distance → similarity (lower distance = higher relevance)
    const score = Math.max(0, Math.min(1, 1 - doc.distance));
    return `${Math.round(score * 100)}%`;
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
                <div className="p-6 border border-primary-container rounded text-[14px] leading-relaxed text-on-surface hover:border-primary-container/80 transition-colors prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                  {docs && docs.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-primary-container/20">
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mb-3">
                        {docs.length} Source{docs.length > 1 ? "s" : ""}
                      </p>
                      <div className="flex flex-col gap-2">
                        {docs.map((doc, i) => {
                          const label = getSourceLabel(doc);
                          const preview = getSourceContent(doc);
                          const score = getSourceScore(doc);
                          return (
                            <div
                              key={doc.id || i}
                              className="flex items-start gap-3 px-3 py-2.5 bg-surface-lowest border border-glass-border rounded-lg hover:border-primary-container/30 transition-colors cursor-pointer group/src"
                            >
                              <span className="material-symbols-outlined text-primary-container/60 text-[16px] mt-0.5 flex-shrink-0">
                                {getSourceIcon(doc)}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-bold text-primary-container truncate">
                                  {label}
                                </p>
                                {preview && (
                                  <p className="text-[11px] text-on-surface-variant leading-relaxed line-clamp-2 mt-0.5">
                                    {preview}
                                  </p>
                                )}
                              </div>
                              {score && (
                                <span className="text-[10px] font-mono text-primary flex-shrink-0 mt-0.5">
                                  {score}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() =>
                        handleCopy(msg.content, msg.id || String(index))
                      }
                      className="text-[11px] text-on-surface-variant hover:text-primary-container flex items-center gap-1.5 px-2 py-1 rounded hover:bg-surface-container-low transition-all"
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {copiedId === (msg.id || String(index))
                          ? "check"
                          : "content_copy"}
                      </span>
                      {copiedId === (msg.id || String(index))
                        ? "Copied"
                        : "Copy"}
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

"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import type { DocumentQueryResult } from "@/types/api";

interface MemoryItem {
  id: string;
  content: string;
  type: string;
  importance: number;
  title?: string;
  videoUrl?: string;
  duration?: string;
}

interface ActiveMemoriesProps {
  memories: MemoryItem[];
  loading?: boolean;
  onClose?: () => void;
}

function sourceToMemory(doc: DocumentQueryResult, index: number): MemoryItem {
  const content = doc.content || doc.document?.content || "";
  const meta = doc.metadata || doc.document?.metadata || {};
  return {
    id: doc.id || doc.document?.id || `src-${index}`,
    content: content.slice(0, 120),
    type: (meta as any).source_type || "Source Document",
    importance:
      doc.distance !== undefined ? 1 - Math.min(doc.distance, 1) : 0.5,
    title:
      (meta as any).title || (meta as any).filename || `Source ${index + 1}`,
  };
}

export const ActiveMemories: React.FC<ActiveMemoriesProps> = ({
  memories: propMemories,
  loading,
  onClose,
}) => {
  const [memoriesMap, setMemoriesMap] = useState<Record<string, MemoryItem[]>>({});

  const currentChatId =
    typeof window !== "undefined"
      ? window.location.pathname.match(/^\/chat\/([^/]+)/)?.[1] || ""
      : "";

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.sourceDocuments && detail?.chatId) {
        const mapped = detail.sourceDocuments.map(sourceToMemory);
        setMemoriesMap((prev) => {
          const existing = new Set((prev[detail.chatId] || []).map((m: MemoryItem) => m.id));
          const newOnes = mapped.filter((m: MemoryItem) => !existing.has(m.id));
          return { ...prev, [detail.chatId]: [...newOnes, ...(prev[detail.chatId] || [])].slice(0, 5) };
        });
      }
    };
    window.addEventListener("patch-source-docs", handler);
    return () => window.removeEventListener("patch-source-docs", handler);
  }, []);

  const liveMemories = currentChatId ? memoriesMap[currentChatId] || [] : [];
  const memories = liveMemories.length > 0 ? liveMemories : propMemories;

  const fireQuery = (query: string) => {
    window.dispatchEvent(
      new CustomEvent("patch-query-click", { detail: { query } }),
    );
  };

  return (
    <section className="w-sidebar-secondary bg-surface-container-lowest border-l border-glass-border flex flex-col h-full overflow-hidden flex-shrink-0 z-30">
      <header className="h-[72px] px-6 flex items-center justify-between border-b border-glass-border bg-surface">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-surface-container-low border border-glass-border flex items-center justify-center text-on-surface-variant">
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              bolt
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-on-surface text-[14px]">
              Conversation Context
            </span>
            <span className="text-[10px] text-on-surface-variant/60 leading-tight">
              Sources for this chat
            </span>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="material-symbols-outlined text-on-surface-variant hover:text-primary-container cursor-pointer text-[20px] hover:rotate-90 transition-all duration-300"
          >
            close
          </button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 custom-scrollbar">
        {loading && (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse space-y-3">
                <div className="h-4 bg-surface-high rounded w-3/4" />
                <div className="h-3 bg-surface-high rounded w-full" />
                <div className="h-1 bg-surface-high rounded w-full" />
              </div>
            ))}
          </div>
        )}

        {!loading && memories.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <span className="material-symbols-outlined text-[32px] text-on-surface-variant/30 mb-3">bolt</span>
            <p className="text-sm text-on-surface-variant">No sources yet.</p>
            <p className="text-xs text-on-surface-variant/60 mt-1">Send a message to retrieve relevant context.</p>
          </div>
        ) : (
          <>
            {/* Dynamic suggested queries from real memories */}
            {memories.length > 0 && (
              <div className="flex flex-col gap-4 animate-fade-in">
                <span className="text-[10px] text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">
                    auto_awesome
                  </span>
                  Suggested Queries
                </span>
                {memories.slice(0, 3).map((mem) => {
                  const q = mem.title || mem.content.slice(0, 50);
                  return (
                    <button
                      key={mem.id + "-q"}
                      onClick={() => fireQuery(q)}
                      className="w-full text-left px-4 py-3 text-[12px] text-on-surface hover:border-primary-container/50 hover:text-primary-container border border-glass-border rounded transition-all bg-surface-container-low/50 hover:bg-surface-container-low hover:pl-5"
                    >
                      &ldquo;{q}&rdquo;
                    </button>
                  );
                })}
              </div>
            )}

            {/* Memory cards */}
            {memories.map((mem, i) => (
              <div
                key={mem.id}
                className="flex flex-col gap-3 group animate-fade-in"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {mem.videoUrl !== undefined && (
                  <div className="relative aspect-[16/9] rounded overflow-hidden border border-glass-border bg-surface-container-low cursor-pointer hover:border-primary-container/30 transition-all duration-300">
                    <div className="absolute inset-0 flex items-center justify-center text-on-surface-variant text-sm group-hover:scale-105 transition-transform duration-500">
                      Memory Preview
                    </div>
                    {mem.duration && (
                      <div className="absolute top-2 right-2 px-2 py-1 bg-surface-dim/80 backdrop-blur rounded text-[10px] text-on-surface">
                        {mem.duration}
                      </div>
                    )}
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <h3 className="text-[14px] font-bold text-on-surface group-hover:text-primary-container transition-colors cursor-pointer">
                    {mem.title || "Memory"}
                  </h3>
                  <p className="text-[12px] text-on-surface-variant leading-relaxed">
                    {mem.content}
                  </p>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between text-[10px] text-on-surface-variant mb-2 uppercase tracking-widest">
                    <span>Correlation</span>
                    <span className="text-primary-container">
                      {mem.importance.toFixed(2)}
                    </span>
                  </div>
                  <div className="h-1 w-full bg-surface-container-high rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-container transition-all duration-1000"
                      style={{
                        width: `${Math.min(mem.importance * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <footer className="p-6 border-t border-glass-border bg-surface">
        <Link
          href="/memory"
          className="w-full py-3 bg-surface-container-low border border-glass-border rounded text-[12px] text-on-surface hover:bg-glass-fill hover:border-primary-container/30 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-[18px]">archive</span>
          Access Archives
        </Link>
      </footer>
    </section>
  );
};

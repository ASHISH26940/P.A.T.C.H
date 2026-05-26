"use client";
import React from "react";

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

export const ActiveMemories: React.FC<ActiveMemoriesProps> = ({
  memories,
  loading,
  onClose,
}) => (
  <section className="w-sidebar-secondary bg-surface-container-lowest border-l border-glass-border flex flex-col h-full overflow-hidden flex-shrink-0 z-30">
    <header className="h-[72px] px-6 flex items-center justify-between border-b border-glass-border bg-surface">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded bg-surface-container-low border border-glass-border flex items-center justify-center text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
        </div>
        <span className="font-bold text-on-surface text-[14px]">Active Memories</span>
      </div>
      {onClose && (
        <button onClick={onClose} className="material-symbols-outlined text-on-surface-variant hover:text-primary-container cursor-pointer text-[20px]">
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
        <>
          {/* Static demo cards matching HTML prototype */}
          <div className="flex flex-col gap-3 group">
            <div className="relative aspect-[16/9] rounded overflow-hidden border border-glass-border bg-surface-container-low cursor-pointer">
              <div className="w-full h-full bg-surface-container-low flex items-center justify-center text-on-surface-variant text-sm">
                Memory Preview
              </div>
              <div className="absolute top-2 right-2 px-2 py-1 bg-surface-dim/80 backdrop-blur rounded text-[10px] text-on-surface">04:12</div>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-[14px] font-bold text-on-surface group-hover:text-primary-container transition-colors cursor-pointer">Project_Overview.mp4</h3>
              <p className="text-[12px] text-on-surface-variant leading-relaxed">Recorded session regarding the integration of gothic gray shadows...</p>
            </div>
            <div className="pt-2">
              <div className="flex justify-between text-[10px] text-on-surface-variant mb-2 uppercase tracking-widest">
                <span>Correlation</span>
                <span className="text-primary-container">0.92</span>
              </div>
              <div className="h-1 w-full bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-primary-container" style={{ width: "92%" }}></div>
              </div>
            </div>
          </div>

          <div className="h-px bg-glass-border w-full" />

          <div className="flex flex-col gap-3 group">
            <div className="flex justify-between items-center mb-1">
              <span className="px-2 py-1 bg-surface-container-low border border-glass-border rounded text-[10px] text-primary-container uppercase tracking-wider">QA Snippet</span>
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant cursor-pointer hover:text-on-surface">more_horiz</span>
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-on-surface mb-2 group-hover:text-primary-container transition-colors cursor-pointer">Color Token Logic</h3>
              <p className="text-[12px] text-on-surface-variant leading-relaxed">Detailed explanation of charcoal usage for L1 depth...</p>
            </div>
            <div className="pt-2">
              <div className="flex justify-between text-[10px] text-on-surface-variant mb-2 uppercase tracking-widest">
                <span>Correlation</span>
                <span className="text-primary-container">0.65</span>
              </div>
              <div className="h-1 w-full bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-primary-container/60" style={{ width: "65%" }}></div>
              </div>
            </div>
          </div>

          <div className="h-px bg-glass-border w-full" />

          <div className="flex flex-col gap-4">
            <span className="text-[10px] text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              Suggested Queries
            </span>
            {[
              "\"Define Level 2 blur thresholds\"",
              "\"Summarize system logs v3\"",
            ].map((q) => (
              <button
                key={q}
                className="w-full text-left px-4 py-3 text-[12px] text-on-surface hover:border-primary-container/50 border border-glass-border rounded transition-all bg-surface-container-low/50"
              >
                {q}
              </button>
            ))}
          </div>
        </>
      ) : (
        !loading && memories.map((mem) => (
          <div key={mem.id} className="flex flex-col gap-3 group">
            {mem.videoUrl !== undefined && (
              <div className="relative aspect-[16/9] rounded overflow-hidden border border-glass-border bg-surface-container-low cursor-pointer">
                <div className="absolute inset-0 flex items-center justify-center text-on-surface-variant text-sm">
                  Memory Preview
                </div>
                {mem.duration && (
                  <div className="absolute top-2 right-2 px-2 py-1 bg-surface-dim/80 backdrop-blur rounded text-[10px] text-on-surface">{mem.duration}</div>
                )}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <h3 className="text-[14px] font-bold text-on-surface group-hover:text-primary-container transition-colors cursor-pointer">{mem.title || "Memory"}</h3>
              <p className="text-[12px] text-on-surface-variant leading-relaxed">{mem.content}</p>
            </div>
            <div className="pt-2">
              <div className="flex justify-between text-[10px] text-on-surface-variant mb-2 uppercase tracking-widest">
                <span>Correlation</span>
                <span className="text-primary-container">{mem.importance.toFixed(2)}</span>
              </div>
              <div className="h-1 w-full bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-primary-container" style={{ width: `${Math.min(mem.importance * 100, 100)}%` }}></div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>

    <footer className="p-6 border-t border-glass-border bg-surface">
      <button className="w-full py-3 bg-surface-container-low border border-glass-border rounded text-[12px] text-on-surface hover:bg-glass-fill transition-colors flex items-center justify-center gap-2">
        <span className="material-symbols-outlined text-[18px]">archive</span>
        Access Archives
      </button>
    </footer>
  </section>
);

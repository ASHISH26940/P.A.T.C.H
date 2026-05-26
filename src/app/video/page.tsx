"use client";
import React, { useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";

const recentExtractions = [
  {
    title: "Synthesizing Neural Latency",
    status: "Processed",
    time: "12:45",
    progress: 88,
  },
  {
    title: "Architectural Flow States",
    status: "Analyzing",
    time: "42:10",
    progress: 42,
  },
];

const steps = [
  { label: "Fetching Source", state: "complete" },
  { label: "Transcribing", state: "current" },
  { label: "Extracting", state: "pending" },
  { label: "Linking Graph", state: "pending" },
];

const consoleLines = [
  { text: "[SYSTEM]: Initializing...", dim: true },
  { text: "[SOURCE]: YouTube API v3 OK.", dim: true },
  { text: "[EXTRACT]: Analyzing 0xFA42...", dim: false },
  { text: '[EXTRACT]: "Neural Node" @ 00:04', dim: false },
  { text: "[READY]: Input pending", dim: false, cursor: true },
];

export default function VideoPage() {
  const [url, setUrl] = useState("");

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-surface-dim">
      {/* ── Top nav ── */}
      <header className="flex items-center justify-between px-8 h-14 bg-surface/80 backdrop-blur-xl border-b border-glass-border flex-shrink-0">
        <div className="flex items-center gap-8">
          <span className="font-heading text-base text-primary tracking-tighter uppercase">
            P.A.T.C.H
          </span>
          <nav className="hidden lg:flex items-center gap-6">
            {["Dashboard", "Ingestion", "Library"].map((item) => (
              <a
                key={item}
                href="#"
                className={
                  item === "Ingestion"
                    ? "text-primary border-b-2 border-primary h-14 flex items-center text-sm font-semibold"
                    : "text-on-surface-variant hover:text-primary transition-colors text-sm"
                }
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
        <input
          className="bg-surface-low border border-glass-border rounded-full py-1.5 px-4 text-sm focus:border-primary outline-none transition-all w-44 text-on-surface placeholder:text-on-surface-variant"
          placeholder="Search..."
          type="text"
        />
      </header>

      {/* ── Step bar ── */}
      <div className="bg-surface-lowest border-b border-glass-border flex-shrink-0">
        <div className="max-w-6xl mx-auto px-8 py-4 grid grid-cols-4 gap-4">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold border ${
                  step.state === "complete"
                    ? "bg-primary-container/20 border-primary text-primary"
                    : step.state === "current"
                      ? "bg-primary-container/10 border-primary-container text-primary-container"
                      : "bg-surface-high border-glass-border text-on-surface-variant"
                }`}
              >
                {step.state === "complete" ? (
                  <span className="material-symbols-outlined text-[16px]">
                    check
                  </span>
                ) : (
                  i + 1
                )}
              </div>
              <div className="min-w-0">
                <p
                  className={`text-[10px] uppercase tracking-widest font-bold leading-none mb-0.5 ${
                    step.state === "complete"
                      ? "text-primary/60"
                      : step.state === "current"
                        ? "text-primary-container"
                        : "text-on-surface-variant/50"
                  }`}
                >
                  {step.state === "complete"
                    ? "Complete"
                    : step.state === "current"
                      ? "Current"
                      : "Pending"}
                </p>
                <p
                  className={`text-sm truncate ${
                    step.state === "pending"
                      ? "text-on-surface-variant"
                      : "text-on-surface"
                  }`}
                >
                  {step.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ── Left column ── */}
            <section className="lg:col-span-2 flex flex-col gap-6">
              {/* Ingestion card */}
              <GlassPanel className="p-6 rounded-xl border-l-4 border-l-primary-container">
                <div className="mb-6">
                  <h2 className="font-heading text-xl text-primary font-bold mb-1">
                    Initialize Ingestion
                  </h2>
                  <p className="text-sm text-on-surface-variant">
                    Extract memories from a video URL.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-[11px] text-primary uppercase tracking-widest font-bold mb-2">
                      Video Source URL
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary-container text-[20px]">
                        link
                      </span>
                      <input
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full bg-surface-lowest border border-glass-border rounded-lg py-3 pl-11 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:border-primary-container outline-none transition-all"
                        placeholder="Paste YouTube link or video URL..."
                      />
                    </div>
                  </div>

                  <button
                    disabled={!url.trim()}
                    className="w-full bg-primary-container text-on-primary-container py-3.5 rounded-lg font-bold text-sm uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      bolt
                    </span>
                    Process Asset
                  </button>
                </div>
              </GlassPanel>

              {/* Recent Extractions */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-base font-bold text-primary uppercase tracking-wide">
                    Recent Extractions
                  </h3>
                  <button className="text-xs text-on-surface-variant hover:text-primary transition-colors">
                    View All
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {recentExtractions.map((item) => (
                    <GlassPanel
                      key={item.title}
                      hover
                      className="rounded-xl p-4 flex gap-4 items-center"
                    >
                      <div className="w-14 h-14 rounded-lg flex-shrink-0 bg-surface-low flex items-center justify-center">
                        <span className="material-symbols-outlined text-on-surface-variant/40 text-2xl">
                          play_circle
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-on-surface truncate mb-1">
                          {item.title}
                        </h4>
                        <p className="text-[10px] text-primary font-mono uppercase tracking-wider mb-2">
                          {item.status} • {item.time}
                        </p>
                        <div className="h-1 bg-surface-lowest rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    </GlassPanel>
                  ))}
                </div>
              </div>
            </section>

            {/* ── Right column ── */}
            <aside className="flex flex-col gap-6">
              {/* Metrics */}
              <GlassPanel className="p-6 rounded-xl">
                <h4 className="text-[11px] text-primary uppercase tracking-widest font-bold mb-5">
                  Extraction Metrics
                </h4>

                <div className="flex flex-col gap-4">
                  {[
                    { label: "Compute Time", value: "142.5h", accent: false },
                    { label: "Mem-Chips", value: "2,841", accent: false },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-on-surface-variant">
                        {s.label}
                      </span>
                      <span className="text-sm font-mono text-on-surface font-semibold">
                        {s.value}
                      </span>
                    </div>
                  ))}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-on-surface-variant">
                      Success Rate
                    </span>
                    <div className="text-right">
                      <span className="text-sm font-mono text-primary font-bold block">
                        99.2%
                      </span>
                      <span className="text-[10px] text-tertiary font-bold">
                        +2.1% ↑
                      </span>
                    </div>
                  </div>
                </div>

                <button className="w-full mt-6 py-2.5 border border-primary-container/30 rounded-lg text-xs text-primary font-bold uppercase tracking-widest hover:bg-primary-container/5 transition-all">
                  Generate Report
                </button>
              </GlassPanel>

              {/* Live Console */}
              <GlassPanel className="p-5 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse flex-shrink-0" />
                  <h4 className="text-[11px] text-on-surface uppercase tracking-widest font-bold">
                    Live Console
                  </h4>
                </div>

                <div className="font-mono text-[11px] text-on-surface-variant space-y-1.5 h-44 overflow-y-auto">
                  {consoleLines.map((line, i) => (
                    <div
                      key={i}
                      className={`leading-relaxed ${line.dim ? "text-primary-container/50" : "text-on-surface"}`}
                    >
                      {line.text}
                      {line.cursor && (
                        <span className="inline-block w-2 h-3.5 bg-primary-container ml-1 align-middle animate-blink" />
                      )}
                    </div>
                  ))}
                </div>
              </GlassPanel>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

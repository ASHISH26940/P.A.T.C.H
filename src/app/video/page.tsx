"use client";
import React, { useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";

const recentExtractions = [
  { title: "Synthesizing Neural Latency", status: "Processed", time: "12:45", progress: 88 },
  { title: "Architectural Flow States", status: "Analyzing", time: "42:10", progress: 42 },
];

export default function VideoPage() {
  const [url, setUrl] = useState("");

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-surface-dim">
      <header className="flex justify-between items-center px-margin-page h-16 w-full bg-surface/80 backdrop-blur-xl border-b border-glass-border">
        <div className="flex items-center gap-4">
          <span className="font-heading text-h2 text-primary tracking-tighter">P.A.T.C.H</span>
          <nav className="hidden lg:flex items-center gap-6 ml-8">
            <a className="text-on-surface-variant hover:text-primary transition-colors text-label-md" href="#">Dashboard</a>
            <a className="text-primary border-b-2 border-primary h-16 flex items-center text-label-md" href="#">Ingestion</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors text-label-md" href="#">Library</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input className="bg-surface-low border-glass-border border rounded-full py-1.5 px-4 text-label-sm focus:border-primary outline-none transition-all w-48 text-on-surface placeholder:text-on-surface-variant" placeholder="Search..." type="text" />
          </div>
        </div>
      </header>

      <div className="w-full bg-surface-lowest border-b border-glass-border px-margin-page py-4">
        <div className="max-w-6xl mx-auto grid grid-cols-4 gap-4">
          {["Fetching Source", "Transcribing", "Extracting", "Linking Graph"].map((step, i) => (
            <div key={step} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-label-sm z-10 ${
                i <= 1 ? "bg-primary-container/20 border border-primary text-primary" : "bg-surface-high border border-glass-border text-on-surface-variant"
              }`}>{i + 1}</div>
              <div>
                <p className={`text-[10px] uppercase tracking-widest font-bold ${i <= 1 ? "text-primary" : "text-on-surface-variant"}`}>
                  {i <= 0 ? "Complete" : i === 1 ? "Current" : "Pending"}
                </p>
                <p className={`text-label-sm ${i <= 1 ? "text-on-surface" : "text-on-surface-variant"}`}>{step}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 p-margin-page max-w-6xl mx-auto w-full overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <section className="lg:col-span-2 space-y-6">
            <GlassPanel className="p-8 rounded-xl border-l-4 border-l-primary-container">
              <div className="mb-8">
                <h2 className="font-heading text-h2 text-primary mb-2">Initialize Ingestion</h2>
                <p className="text-body-md text-on-surface-variant">Extract memories from a video URL.</p>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-label-sm text-primary uppercase tracking-widest mb-2">Video Source URL</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary-container">link</span>
                    <input
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full bg-surface-lowest border-glass-border border rounded-xl py-4 pl-12 pr-4 text-body-lg text-on-surface placeholder:text-on-surface-variant/30 focus:border-primary outline-none transition-all"
                      placeholder="Paste YouTube link or video URL..."
                    />
                  </div>
                </div>
                <div className="pt-4">
                  <button
                    disabled={!url.trim()}
                    className="w-full bg-primary-container text-on-primary-container py-4 rounded-xl text-h3 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined">bolt</span>
                    PROCESS ASSET
                  </button>
                </div>
              </div>
            </GlassPanel>

            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading text-h3 text-primary">Recent Extractions</h3>
                <button className="text-label-sm text-on-surface-variant hover:text-primary transition-colors">View All</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentExtractions.map((item) => (
                  <GlassPanel key={item.title} hover className="rounded-xl p-4 flex gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-surface-low flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-surface-variant/40">play_circle</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-label-md text-on-surface line-clamp-1">{item.title}</h4>
                      <p className="text-[10px] text-primary mt-1 font-mono-code uppercase">{item.status} • {item.time}</p>
                      <div className="mt-2 h-1 bg-surface-lowest rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${item.progress}%` }} />
                      </div>
                    </div>
                  </GlassPanel>
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <GlassPanel className="p-6 rounded-xl">
              <h4 className="font-label-md text-primary uppercase tracking-widest mb-6">Extraction Metrics</h4>
              <div className="space-y-5">
                {[{ label: "Compute Time", value: "142.5h" }, { label: "Mem-Chips", value: "2,841" }].map((s) => (
                  <div key={s.label} className="flex justify-between items-center">
                    <span className="text-on-surface-variant text-body-sm">{s.label}</span>
                    <span className="text-on-surface font-mono-code">{s.value}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant text-body-sm">Success Rate</span>
                  <div className="text-right">
                    <span className="text-primary font-mono-code block">99.2%</span>
                    <span className="text-[10px] text-tertiary font-bold">+2.1% ↑</span>
                  </div>
                </div>
              </div>
              <button className="w-full mt-8 py-3 border border-primary-container/20 rounded-lg text-label-sm text-primary hover:bg-primary-container/5 transition-all">
                GENERATE REPORT
              </button>
            </GlassPanel>

            <GlassPanel className="p-5 rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <h4 className="font-label-sm text-on-surface uppercase tracking-widest">Live Console</h4>
              </div>
              <div className="font-mono-code text-[11px] text-on-surface-variant h-48 overflow-y-auto space-y-2">
                {["[SYSTEM]: Initializing...", "[SOURCE]: YouTube API v3 OK.", "[EXTRACT]: Analyzing 0xFA42...", '[EXTRACT]: "Neural Node" @ 00:04', "[READY]: Input pending"].map((line, i) => (
                  <div key={i} className={i < 2 ? "text-primary-container/60" : i === 4 ? "flex items-center gap-1" : "text-on-surface"}>
                    {line}{i === 4 && <span className="inline-block w-2 h-4 bg-primary-container ml-1 animate-blink" />}
                  </div>
                ))}
              </div>
            </GlassPanel>
          </aside>
        </div>
      </div>
    </div>
  );
}

"use client";
import React, { useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import { ImportanceBar } from "@/components/ui/ImportanceBar";
import { BreadcrumbStepper } from "@/components/layout/BreadcrumbStepper";

const mockMemories = [
  {
    id: "1",
    type: "Extraction",
    date: "24 OCT 2023",
    title: "Neural Architecture Trends 2024",
    desc: "Deep analysis of transformer-based architectures and the shift towards state-space models.",
    importance: 0.92,
  },
  {
    id: "2",
    type: "QA",
    date: "22 OCT 2023",
    title: "Latency Optimization Queries",
    desc: "Collection of validated prompt sequences for reducing inference lag.",
    importance: 0.78,
  },
  {
    id: "3",
    type: "Extraction",
    date: "15 OCT 2023",
    title: "Vector Database Comparison",
    desc: "Benchmark results comparing Pinecone, Weaviate, and Milvus.",
    importance: 0.64,
  },
  {
    id: "4",
    type: "Video",
    date: "10 OCT 2023",
    title: "Hook Analysis Deep Dive",
    desc: "Analysis of top 50 YouTube hooks and retention patterns.",
    importance: 0.88,
  },
];

const steps = [
  {
    label: "Extracted",
    description: "Neural entities identified",
    status: "complete" as const,
  },
  {
    label: "Linked",
    description: "Relational graph mapped",
    status: "complete" as const,
  },
  {
    label: "Verified",
    description: "Validation queue",
    status: "current" as const,
  },
  {
    label: "Archived",
    description: "Cold storage",
    status: "pending" as const,
  },
];

export default function MemoryPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(mockMemories[0].id);
  const [showDetails, setShowDetails] = useState(true);

  const active = mockMemories.find((m) => m.id === selected) ?? mockMemories[0];

  const filtered = mockMemories.filter(
    (m) =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.desc.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-surface">
      <BreadcrumbStepper steps={steps} />

      <div className="flex-1 flex overflow-hidden">
        {/* ── Main content ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-8 py-8">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <h1 className="font-heading text-headline-lg text-on-surface tracking-tighter mb-1">
                  Knowledge Base
                </h1>
                <p className="text-on-surface-variant text-sm">
                  Managed cognitive assets and extracted metadata.
                </p>
              </div>

              {/* Search + filter */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                    search
                  </span>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search memories..."
                    className="bg-surface-low border border-glass-border rounded-lg pl-9 pr-4 py-2 text-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:border-primary-container transition-colors w-52"
                  />
                </div>
                <button className="bg-surface-mid border border-glass-border px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold hover:bg-surface-high transition-colors text-on-surface whitespace-nowrap">
                  <span className="material-symbols-outlined text-[18px]">
                    filter_list
                  </span>
                  Filter
                </button>
              </div>
            </div>

            {/* Memory grid — auto-adjusts: 1 → 2 → 3 cols */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 pb-10">
              {filtered.map((mem) => (
                <GlassPanel
                  key={mem.id}
                  as="button"
                  onClick={() => {
                    setSelected(mem.id);
                    setShowDetails(true);
                  }}
                  hover
                  className={`p-5 rounded-xl text-left flex flex-col w-full cursor-pointer transition-all ${
                    selected === mem.id
                      ? "ring-1 ring-primary-container border-primary-container/30"
                      : ""
                  }`}
                >
                  {/* Card top row */}
                  <div className="flex justify-between items-center mb-4">
                    <Badge variant="primary">{mem.type}</Badge>
                    <span className="text-[11px] text-on-surface-variant font-mono">
                      {mem.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-heading text-sm font-bold text-on-surface mb-2 leading-snug">
                    {mem.title}
                  </h3>

                  {/* Description */}
                  <p className="text-on-surface-variant text-xs leading-relaxed line-clamp-2 flex-1 mb-5">
                    {mem.desc}
                  </p>

                  {/* Importance bar */}
                  <div className="pt-4 border-t border-glass-border/50">
                    <ImportanceBar value={mem.importance} />
                  </div>
                </GlassPanel>
              ))}

              {/* Inject card */}
              <GlassPanel
                as="button"
                hover
                className="border-2 border-dashed border-glass-border rounded-xl p-5 flex flex-col items-center justify-center gap-3 min-h-[180px] hover:border-primary-container/40 cursor-pointer text-on-surface-variant hover:text-primary-container transition-all w-full"
              >
                <div className="w-10 h-10 rounded-full bg-surface-high flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">
                    add
                  </span>
                </div>
                <span className="font-bold text-sm">Inject Knowledge</span>
              </GlassPanel>
            </div>
          </div>
        </div>

        {/* ── Asset details sidebar ── */}
        {showDetails && (
          <aside className="hidden lg:flex w-[360px] flex-shrink-0 flex-col bg-surface-mid border-l border-glass-border overflow-y-auto">
            {/* Sidebar header */}
            <div className="px-6 py-4 border-b border-glass-border flex items-center justify-between sticky top-0 bg-surface-mid z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-primary-container/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary-container text-[20px]">
                    description
                  </span>
                </div>
                <span className="text-sm font-bold text-on-surface uppercase tracking-widest">
                  Asset Details
                </span>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-glass-fill text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">
                  close
                </span>
              </button>
            </div>

            {/* Sidebar body */}
            <div className="p-6 flex flex-col gap-6 flex-1">
              {/* Thumbnail */}
              <div className="aspect-video w-full bg-surface-lowest rounded-lg border border-glass-border flex items-center justify-center overflow-hidden relative">
                <span className="material-symbols-outlined text-5xl text-primary-container/30">
                  play_circle
                </span>
              </div>

              {/* Metadata */}
              <div className="flex flex-col gap-5">
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                    Title
                  </p>
                  <p className="text-on-surface font-bold text-sm leading-snug">
                    {active.title}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">
                    Metadata Tags
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["#transformers", "#ai-infra", "#deep-learning"].map(
                      (t) => (
                        <span
                          key={t}
                          className="px-2 py-1 bg-glass-fill border border-glass-border rounded text-[11px] text-on-surface-variant"
                        >
                          {t}
                        </span>
                      ),
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                    Summary
                  </p>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {active.desc}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">
                    Significance
                  </p>
                  <ImportanceBar value={active.importance} showLabel={false} />
                  <p className="text-right text-xs text-primary mt-1 font-mono">
                    {active.importance.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-auto pt-4 border-t border-glass-border">
                <button className="w-full py-3 bg-primary-container text-on-primary-container font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm">
                  <span className="material-symbols-outlined text-[18px]">
                    open_in_new
                  </span>
                  Open Full Asset
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

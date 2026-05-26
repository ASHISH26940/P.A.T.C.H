"use client";
import React, { useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";

const mockLinks = [
  { id: "1", source: "Neural Architecture Trends 2024", relationship: "supports", target: "Vector Database Comparison" },
  { id: "2", source: "Hook Analysis Deep Dive", relationship: "example_of", target: "Latency Optimization Queries" },
];

export default function GraphPage() {
  const [filter, setFilter] = useState("");

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-surface">
      <header className="h-14 px-6 flex items-center justify-between border-b border-glass-border bg-surface/50 backdrop-blur-md">
        <h2 className="font-heading text-h3 text-primary-container">Knowledge Graph</h2>
        <div className="flex items-center gap-4">
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter by relationship..."
            className="bg-surface-low border border-glass-border rounded px-3 py-1.5 text-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:border-primary-container"
          />
          <button className="bg-primary-container text-on-primary-container px-4 py-1.5 rounded text-sm font-bold hover:brightness-110 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">add</span> Add Link
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 p-margin-page flex items-center justify-center bg-surface-dim">
          <GlassPanel className="p-8 rounded-xl text-center max-w-lg mx-auto">
            <span className="material-symbols-outlined text-6xl text-primary-container/30">hub</span>
            <h3 className="font-heading text-h3 text-on-surface mt-4 mb-2">Graph Visualization</h3>
            <p className="text-on-surface-variant text-body-sm mb-4">
              Interactive force-directed graph will render here. Nodes = memories, edges = relationships.
            </p>
            <p className="text-xs text-on-surface-variant/60 font-mono-code">
              Requires canvas/SVG library (d3-force or vis-network)
            </p>
          </GlassPanel>
        </div>

        <aside className="w-[400px] bg-surface-low border-l border-glass-border flex flex-col overflow-y-auto">
          <div className="p-6 border-b border-glass-border">
            <h3 className="font-label-md text-on-surface uppercase tracking-widest">Links</h3>
          </div>
          <div className="p-4 space-y-3">
            {mockLinks
              .filter((l) => !filter || l.relationship.includes(filter))
              .map((link) => (
                <GlassPanel key={link.id} className="p-4 rounded-lg" hover>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-on-surface font-medium truncate">{link.source}</span>
                  </div>
                  <div className="flex items-center gap-2 my-2">
                    <div className="h-px flex-1 bg-glass-border" />
                    <Badge variant="primary">{link.relationship}</Badge>
                    <div className="h-px flex-1 bg-glass-border" />
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-on-surface font-medium truncate">{link.target}</span>
                  </div>
                </GlassPanel>
              ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

"use client";
import React, { useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";

const mockPersonas = [
  { id: "1", name: "Video Strategist", description: "Focuses on hook analysis and retention optimization.", traits: ["analytical", "data-driven"], goals: ["improve CTR", "optimize retention"] },
  { id: "2", name: "Creative Coach", description: "Encouraging mentor for brainstorming content ideas.", traits: ["supportive", "creative"], goals: ["generate ideas", "reduce burnout"] },
];

export default function PersonaPage() {
  const [active, setActive] = useState("1");

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-surface">
      <header className="h-14 px-6 flex items-center justify-between border-b border-glass-border bg-surface/50 backdrop-blur-md">
        <h2 className="font-heading text-h3 text-primary-container">Personas</h2>
        <button className="bg-primary-container text-on-primary-container px-4 py-1.5 rounded text-sm font-bold hover:brightness-110 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">add</span> Create Persona
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-margin-page">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockPersonas.map((p) => (
            <GlassPanel
              key={p.id}
              as="button"
              onClick={() => setActive(p.id)}
              hover
              className={`p-6 rounded-xl text-left transition-all ${active === p.id ? "ring-1 ring-primary-container/40 bg-surface-high" : ""}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-heading text-h3 text-on-surface mb-1">{p.name}</h3>
                  <p className="text-body-sm text-on-surface-variant">{p.description}</p>
                </div>
                {active === p.id && (
                  <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {p.traits.map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}
              </div>
              <div className="flex flex-wrap gap-2">
                {p.goals.map((g) => <Badge key={g} variant="outline">{g}</Badge>)}
              </div>
            </GlassPanel>
          ))}
        </div>
      </div>
    </div>
  );
}

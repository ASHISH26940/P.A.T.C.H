"use client";
import React, { useState, useEffect, useCallback } from "react";
import { getAllPersonas, createPersona, deletePersona } from "@/lib/api/persona";
import type { Persona } from "@/types/api";
import { PersonaCard } from "@/components/persona/PersonaCard";
import { DefaultPersonaCard } from "@/components/persona/DefaultPersonaCard";
import { PersonaSkeleton } from "@/components/persona/PersonaSkeleton";

const DEFAULT_PERSONAS: Omit<Persona, "id">[] = [
  {
    name: "Video Strategist",
    description: "Content strategy, audience retention, and hook optimization.",
    traits: ["Strategic", "Data-driven", "Retention-focused"],
    goals: ["Improve viewer retention", "Optimize hook placement", "Maximize engagement"],
  },
  {
    name: "Research Analyst",
    description: "Thorough, source-citing analysis with deep dives into topics.",
    traits: ["Analytical", "Detail-oriented", "Source-driven"],
    goals: ["Provide comprehensive answers", "Cite relevant sources", "Explore edge cases"],
  },
  {
    name: "Creative Partner",
    description: "Brainstorms ideas, suggests creative directions, and thinks outside the box.",
    traits: ["Creative", "Enthusiastic", "Open-ended"],
    goals: ["Generate novel ideas", "Explore creative angles", "Encourage experimentation"],
  },
  {
    name: "Editor",
    description: "Concise, editing-focused feedback with constructive criticism.",
    traits: ["Concise", "Critical", "Constructive"],
    goals: ["Improve pacing and flow", "Cut dead space", "Polish final output"],
  },
  {
    name: "Default Assistant",
    description: "Balanced, general-purpose helper for everyday queries.",
    traits: ["Balanced", "Helpful", "Clear"],
    goals: ["Answer accurately", "Be concise", "Stay helpful"],
  },
];

function getActiveKey() {
  if (typeof window === "undefined") return "patch_active_persona";
  const chatId = localStorage.getItem("patch_persona_chat");
  return chatId ? `patch_persona_${chatId}` : "patch_active_persona";
}

function getActiveId(): string | null {
  return localStorage.getItem(getActiveKey());
}

function setActive(id: string, name: string) {
  localStorage.setItem(getActiveKey(), id);
  localStorage.setItem(`patch_persona_name_${id}`, name);
}

export default function PersonaPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const [, forceUpdate] = useState(0);

  const activeId = getActiveId();

  const loadPersonas = useCallback(async () => {
    try {
      const data = await getAllPersonas();
      setPersonas(data);
    } catch {
      setPersonas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPersonas();
  }, [loadPersonas]);

  const handleSelect = (p: Persona) => {
    setActive(p.id, p.name);
    forceUpdate((n) => n + 1);
  };

  const handleSelectDefault = async (dp: (typeof DEFAULT_PERSONAS)[0]) => {
    try {
      const created = await createPersona({
        name: dp.name,
        description: dp.description,
        traits: dp.traits,
        goals: dp.goals,
      });
      setPersonas((prev) => [...prev, created]);
      setActive(created.id, created.name);
      forceUpdate((n) => n + 1);
    } catch {
      /* ignore */
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePersona(id);
      setPersonas((prev) => prev.filter((p) => p.id !== id));
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-surface">
      <header className="h-14 px-6 flex items-center gap-3 border-b border-glass-border bg-surface/50 backdrop-blur-md">
        <span className="material-symbols-outlined text-primary-container text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
          psychology
        </span>
        <h2 className="font-heading text-h3 text-on-surface">Personas</h2>
      </header>

      <div className="flex-1 m-10 overflow-y-auto p-margin-page">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading && (
              <>
                <PersonaSkeleton />
                <PersonaSkeleton />
              </>
            )}

            {!loading &&
              personas.map((p) => (
                <PersonaCard
                  key={p.id}
                  persona={p}
                  isActive={p.id === activeId}
                  onSelect={handleSelect}
                />
              ))}

            {!loading &&
              DEFAULT_PERSONAS.filter(
                (dp) => !personas.some((p) => p.name === dp.name),
              ).map((dp, i) => (
                <DefaultPersonaCard
                  key={`default-${i}`}
                  name={dp.name}
                  description={dp.description}
                  traits={dp.traits}
                  goals={dp.goals}
                  onSelect={() => handleSelectDefault(dp)}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

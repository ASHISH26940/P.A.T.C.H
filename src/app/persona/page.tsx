"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Modal } from "@/components/ui/Modal";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import { getAllPersonas, createPersona, derivePersonas, saveDerivedPersona, deletePersona } from "@/lib/api/persona";
import type { Persona, DerivedPersonaSuggestion } from "@/types/api";

const DEFAULT_PERSONAS: Omit<Persona, "id">[] = [
  {
    name: "Video Strategist",
    description: "Focuses on content strategy, audience retention, and hook optimization.",
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

interface PersonaForm {
  name: string;
  description: string;
  traits: string;
  goals: string;
}

const emptyForm: PersonaForm = { name: "", description: "", traits: "", goals: "" };

export default function PersonaPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<DerivedPersonaSuggestion[]>([]);
  const [acceptingId, setAcceptingId] = useState<number | null>(null);
  const [deriveError, setDeriveError] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<PersonaForm>(emptyForm);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("patch_persona_chat");
      setActiveChatId(stored);
    }
  }, []);

  function getActiveChatPersonaKey() {
    if (!activeChatId) return "patch_active_persona";
    return `patch_persona_${activeChatId}`;
  }

  function getActivePersonaId(): string | null {
    return localStorage.getItem(getActiveChatPersonaKey());
  }

  function setActivePersonaId(id: string) {
    localStorage.setItem(getActiveChatPersonaKey(), id);
    const p = personas.find((p) => p.id === id);
    if (p) localStorage.setItem(`patch_persona_name_${id}`, p.name);
    setPersonas((prev) => [...prev]);
  }

  function getActivePersona(): Persona | null {
    const id = getActivePersonaId();
    if (!id) return null;
    return personas.find((p) => p.id === id) ?? null;
  }

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

  useEffect(() => { loadPersonas(); }, [loadPersonas]);

  useEffect(() => {
    derivePersonas()
      .then((result) => setSuggestions(result))
      .catch((e) => {
        setSuggestions([]);
        setDeriveError(e?.message || "Derivation failed");
      });
  }, []);

  const handleAccept = async (s: DerivedPersonaSuggestion, index: number) => {
    setAcceptingId(index);
    try {
      await saveDerivedPersona(s);
      setSuggestions((prev) => prev.filter((_, i) => i !== index));
      await loadPersonas();
    } catch (e: any) {
      setDeriveError(e?.message || "Failed to save persona");
    } finally {
      setAcceptingId(null);
    }
  };

  const handleCreate = async () => {
    if (!form.name.trim()) return;
    setCreating(true);
    try {
      const traits = form.traits.split(",").map((t) => t.trim()).filter(Boolean);
      const goals = form.goals.split(",").map((g) => g.trim()).filter(Boolean);
      const created = await createPersona({ name: form.name.trim(), description: form.description.trim() || undefined, traits, goals });
      setPersonas((prev) => [...prev, created]);
      setShowCreate(false);
      setForm(emptyForm);
    } catch (e: any) {
      setErrorMsg(e?.message || "Failed to create persona");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePersona(id);
      setPersonas((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setErrorMsg("Failed to delete persona");
    }
  };

  const allPersonas = [...personas];
  const isActive = (id: string) => id === getActivePersonaId();
  const shownPersonas = allPersonas.length > 0 ? allPersonas : [];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-surface">
      <header className="h-14 px-6 flex items-center justify-between border-b border-glass-border bg-surface/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary-container text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
          <h2 className="font-heading text-h3 text-on-surface">Personas</h2>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-container text-surface-dim font-bold rounded-lg text-sm hover:brightness-110 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Create
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-margin-page">
        <div className="max-w-4xl mx-auto">

          {/* Derived suggestions */}
          {suggestions.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-amber-400 text-[20px]">auto_awesome</span>
                <h3 className="font-heading text-h3 text-amber-400">Derived Personas</h3>
                <span className="text-xs text-on-surface-variant font-mono-code">
                  from your chat history
                </span>
              </div>
              <p className="text-body-sm text-on-surface-variant mb-4">
                These personas were identified from patterns in your conversations. Accept one to save it.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestions.map((s, i) => {
                  const pct = Math.round(s.confidence * 100);
                  return (
                    <GlassPanel key={i} className="p-6 rounded-xl border border-amber-500/20">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-heading text-h3 text-on-surface">{s.name}</h3>
                          <p className="text-body-sm text-on-surface-variant mt-0.5">{s.description}</p>
                        </div>
                        <span className="text-xs font-mono-code text-amber-400/70 bg-amber-500/10 px-2 py-0.5 rounded-full">{pct}% match</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {s.traits.map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {s.goals.map((g) => <Badge key={g} variant="outline">{g}</Badge>)}
                      </div>
                      <details className="text-xs text-on-surface-variant mb-4">
                        <summary className="cursor-pointer hover:text-on-surface transition-colors">Sample messages ({s.message_count} clustered)</summary>
                        <div className="mt-2 space-y-1">
                          {s.sample_messages.map((m, j) => (
                            <p key={j} className="bg-surface-high rounded px-3 py-1.5 italic">&ldquo;{m}&rdquo;</p>
                          ))}
                        </div>
                      </details>
                      <div className="flex gap-3">
                        <button onClick={() => handleAccept(s, i)} disabled={acceptingId === i} className="bg-primary-container text-on-primary-container px-4 py-1.5 rounded text-sm font-bold hover:brightness-110 transition-all disabled:opacity-50 flex items-center gap-2">
                          {acceptingId === i ? (
                            <><span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span> Saving...</>
                          ) : (
                            <><span className="material-symbols-outlined text-[16px]">add</span> Accept</>
                          )}
                        </button>
                        <button onClick={() => setSuggestions((prev) => prev.filter((_, j) => j !== i))} className="text-on-surface-variant hover:text-on-surface px-4 py-1.5 rounded text-sm transition-colors">Dismiss</button>
                      </div>
                    </GlassPanel>
                  );
                })}
              </div>
            </div>
          )}

          {/* Defaults hint */}
          {allPersonas.length === 0 && suggestions.length === 0 && !loading && (
            <div className="mb-8 p-4 rounded-xl bg-primary-container/5 border border-primary-container/20 text-sm text-on-surface-variant">
              No saved personas yet. Pick from the defaults below or{" "}
              <button onClick={() => setShowCreate(true)} className="text-primary-container underline hover:no-underline">create your own</button>.
            </div>
          )}

          {/* Persona grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Saved personas from API */}
            {allPersonas.map((p) => (
              <GlassPanel
                key={p.id}
                as="button"
                onClick={() => setActivePersonaId(p.id)}
                hover
                className={`p-6 rounded-xl text-left transition-all relative ${isActive(p.id) ? "ring-1 ring-primary-container/40 bg-surface-high" : ""}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-h3 text-on-surface mb-1 truncate">{p.name}</h3>
                    <p className="text-body-sm text-on-surface-variant line-clamp-2">{p.description}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                    {isActive(p.id) && (
                      <span className="material-symbols-outlined text-primary-container text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    )}
                    <span
                      onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }}
                      className="p-1 rounded hover:bg-error-container/20 text-on-surface-variant hover:text-error transition-colors cursor-pointer inline-flex"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {p.traits.map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}
                </div>
                <div className="flex flex-wrap gap-2">
                  {p.goals.map((g) => <Badge key={g} variant="outline">{g}</Badge>)}
                </div>
              </GlassPanel>
            ))}

            {/* Default personas (only if no saved ones from API) */}
            {allPersonas.length === 0 && DEFAULT_PERSONAS.map((dp, i) => (
              <GlassPanel
                key={`default-${i}`}
                as="button"
                onClick={async () => {
                  try {
                    const created = await createPersona({ name: dp.name, description: dp.description, traits: dp.traits, goals: dp.goals });
                    setPersonas((prev) => [...prev, created]);
                    setActivePersonaId(created.id);
                  } catch { /* backend error — skip */ }
                }}
                hover
                className="p-6 rounded-xl text-left transition-all border border-dashed border-glass-border hover:border-primary-container/30"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-heading text-h3 text-on-surface mb-1">{dp.name}</h3>
                    <p className="text-body-sm text-on-surface-variant">{dp.description}</p>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant/40 text-[18px]">add</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {dp.traits.map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}
                </div>
                <div className="flex flex-wrap gap-2">
                  {dp.goals.map((g) => <Badge key={g} variant="outline">{g}</Badge>)}
                </div>
              </GlassPanel>
            ))}

            {loading && Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="bg-surface border border-glass-border rounded-xl p-6 animate-pulse">
                <div className="h-5 w-32 bg-surface-high rounded mb-3" />
                <div className="h-3 w-48 bg-surface-high rounded mb-4" />
                <div className="flex gap-2 mb-3"><div className="h-5 w-16 bg-surface-high rounded-full" /><div className="h-5 w-20 bg-surface-high rounded-full" /></div>
                <div className="flex gap-2"><div className="h-5 w-24 bg-surface-high rounded-full" /></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 z-[998] bg-surface-lowest/60 backdrop-blur-sm flex items-center justify-center" onClick={() => setShowCreate(false)}>
          <div className="bg-surface border border-glass-border rounded-xl w-full max-w-lg mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-glass-border">
              <h3 className="text-sm font-bold text-on-surface uppercase tracking-widest">Create Persona</h3>
              <button onClick={() => setShowCreate(false)} className="w-7 h-7 flex items-center justify-center rounded hover:bg-glass-fill text-on-surface-variant hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Video Strategist" className="w-full bg-surface-low border border-glass-border rounded-lg px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:border-primary-container transition-colors" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What does this persona do?" rows={2} className="w-full bg-surface-low border border-glass-border rounded-lg px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:border-primary-container transition-colors resize-none" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">Traits (comma-separated)</label>
                <input value={form.traits} onChange={(e) => setForm({ ...form, traits: e.target.value })} placeholder="e.g. Strategic, Data-driven, Creative" className="w-full bg-surface-low border border-glass-border rounded-lg px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:border-primary-container transition-colors" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">Goals (comma-separated)</label>
                <input value={form.goals} onChange={(e) => setForm({ ...form, goals: e.target.value })} placeholder="e.g. Improve retention, Optimize hooks" className="w-full bg-surface-low border border-glass-border rounded-lg px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:border-primary-container transition-colors" />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-glass-border">
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors">Cancel</button>
              <button onClick={handleCreate} disabled={!form.name.trim() || creating} className="px-5 py-2 bg-primary-container text-surface-dim font-bold rounded-lg text-sm hover:brightness-110 transition-all disabled:opacity-50 flex items-center gap-2">
                {creating ? <><span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span> Creating...</> : "Create Persona"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error modal */}
      <Modal
        open={!!errorMsg}
        onClose={() => setErrorMsg(null)}
        title="Error"
        actions={
          <button onClick={() => setErrorMsg(null)} className="px-4 py-2 bg-primary-container text-surface-dim font-bold rounded-lg text-sm transition-colors">OK</button>
        }
      >
        <p>{errorMsg}</p>
      </Modal>
    </div>
  );
}

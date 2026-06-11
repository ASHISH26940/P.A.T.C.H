"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Modal } from "@/components/ui/Modal";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import { ImportanceBar } from "@/components/ui/ImportanceBar";
import { getRecentMemories, searchMemories, createMemory, updateMemory, deleteMemory } from "@/lib/api/memory";
import type { MemoryItem } from "@/lib/api/memory";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface MemoryDisplay {
  id: string;
  type: string;
  date: string;
  title: string;
  desc: string;
  importance: number;
}

function toDisplay(m: MemoryItem): MemoryDisplay {
  const raw = m.content;
  const title = raw.replace(/^\[.*?\]\s*/, "").length > 60
    ? raw.replace(/^\[.*?\]\s*/, "").slice(0, 57) + "..."
    : raw.replace(/^\[.*?\]\s*/, "");
  return {
    id: m.id,
    type: m.memory_type.charAt(0).toUpperCase() + m.memory_type.slice(1),
    date: new Date(m.created_at).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase().replace(",", ""),
    title: title || raw.slice(0, 60),
    desc: raw,
    importance: m.importance,
  };
}

function MemoryContent() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [memories, setMemories] = useState<MemoryDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(true);
  const [injectOpen, setInjectOpen] = useState(false);
  const [injectText, setInjectText] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [injecting, setInjecting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [editImportance, setEditImportance] = useState(0.5);
  const [saving, setSaving] = useState(false);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadMemories = useCallback(async (query?: string) => {
    setError(null);
    setLoading(true);
    try {
      const data = query?.trim()
        ? (await searchMemories({ query: query.trim(), n_results: 20 })).results || []
        : await getRecentMemories(20);
      const seen = new Set<string>();
      const display = data.filter((m) => { const key = m.content; if (seen.has(key)) return false; seen.add(key); return true; }).map(toDisplay);
      setMemories(display);
      if (display.length > 0) setSelected((prev) => prev && display.find((d) => d.id === prev) ? prev : display[0].id);
    } catch (err: any) {
      setError(err?.message || "Failed to load memories");
      setMemories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (authLoading) return;
    loadMemories();
  }, [authLoading, loadMemories]);

  // Debounced server-side search when user types
  useEffect(() => {
    if (!search.trim()) return;
    setSearching(true);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(async () => {
      try {
        const sdata = (await searchMemories({ query: search.trim(), n_results: 20 })).results || [];
        const sseen = new Set<string>();
        setMemories(sdata.filter((m) => { const key = m.content; if (sseen.has(key)) return false; sseen.add(key); return true; }).map(toDisplay));
        setError(null);
      } catch {
        // server search failed — client-side filter on loaded data still works
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => { if (searchTimer.current) clearTimeout(searchTimer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleInject = async () => {
    if (!injectText.trim() || injecting) return;
    setInjecting(true);
    try {
      await createMemory(injectText.trim());
      setInjectText("");
      setInjectOpen(false);
      loadMemories();
    } catch (err: any) {
      setError(err?.message || "Failed to inject knowledge");
    } finally {
      setInjecting(false);
    }
  };

  const handleEdit = async () => {
    if (!selected || saving || !editContent.trim()) return;
    setSaving(true);
    try {
      await updateMemory(selected, { content: editContent, importance: editImportance });
      setEditing(false);
      loadMemories();
    } catch (err: any) {
      setError(err?.message || "Failed to update memory");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteMemory(deleteConfirmId);
      if (selected === deleteConfirmId) setSelected(null);
      setDeleteConfirmId(null);
      loadMemories();
    } catch (err: any) {
      setError(err?.message || "Failed to delete memory");
      setDeleteConfirmId(null);
    }
  };

  const startEdit = () => {
    if (!active) return;
    setEditContent(active.desc);
    setEditImportance(active.importance);
    setEditing(true);
  };

  const active = memories.find((m) => m.id === selected);
  const filtered = memories.filter(
    (m) =>
      !search.trim() ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.desc.toLowerCase().includes(search.toLowerCase()),
  );

  if (authLoading || !user) {
    return (
      <div className="flex-1 flex items-center justify-center text-on-surface-variant font-mono-code text-sm">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-surface">

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

              {/* Search */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                    search
                  </span>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search memories..."
                    className="bg-surface-low border border-glass-border rounded-lg pl-9 pr-10 py-2 text-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:border-primary-container transition-colors w-52"
                  />
                  {searching && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 border-2 border-primary-container border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mb-6 bg-error-container/10 border border-error-container/30 text-error text-sm rounded-lg px-4 py-3 flex items-center gap-3">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span className="flex-1">{error}</span>
                <button onClick={() => setError(null)} className="text-on-surface-variant hover:text-on-surface">
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            )}

            {/* Inject inline form */}
            {injectOpen && (
              <div className="mb-6 bg-surface border border-glass-border rounded-xl p-5">
                <h3 className="text-sm font-bold text-on-surface uppercase tracking-widest mb-3">Inject Knowledge</h3>
                <textarea
                  value={injectText}
                  onChange={(e) => setInjectText(e.target.value)}
                  placeholder="Paste text, notes, or extracted content..."
                  rows={4}
                  className="w-full bg-surface-lowest border border-glass-border rounded-lg p-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-primary-container transition-all resize-none"
                />
                <div className="flex justify-end gap-3 mt-3">
                  <button
                    onClick={() => { setInjectOpen(false); setInjectText(""); }}
                    className="px-4 py-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleInject}
                    disabled={!injectText.trim() || injecting}
                    className="px-5 py-2 bg-primary-container text-on-primary-container rounded-lg text-sm font-bold hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {injecting ? (
                      <><span className="w-3.5 h-3.5 border-2 border-on-primary-container border-t-transparent rounded-full animate-spin" /> Saving...</>
                    ) : (
                      <><span className="material-symbols-outlined text-[16px]">add</span> Save Memory</>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Memory grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 pb-10">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-surface border border-glass-border rounded-xl p-5 animate-pulse flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                      <div className="h-5 w-16 bg-surface-high rounded" />
                      <div className="h-3 w-20 bg-surface-high rounded" />
                    </div>
                    <div className="h-4 w-full bg-surface-high rounded mb-2" />
                    <div className="h-4 w-3/4 bg-surface-high rounded mb-2 flex-1" />
                    <div className="h-4 w-1/2 bg-surface-high rounded mb-5" />
                    <div className="pt-4 border-t border-glass-border/50">
                      <div className="h-1 w-full bg-surface-high rounded" />
                    </div>
                  </div>
                ))
              ) : filtered.length === 0 ? (
                <div className="col-span-full py-20 text-center">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-3 block">database</span>
                  <p className="text-sm text-on-surface-variant mb-1">
                    {search.trim() ? "No memories match your search." : "No memories yet."}
                  </p>
                  <p className="text-xs text-on-surface-variant/60">
                    {search.trim() ? "Try a different search term." : "Inject knowledge to get started."}
                  </p>
                </div>
              ) : (
                filtered.map((mem) => (
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
                    <div className="flex justify-between items-center mb-4">
                      <Badge variant="primary">{mem.type}</Badge>
                      <span className="text-[11px] text-on-surface-variant font-mono">{mem.date}</span>
                    </div>
                    <h3 className="font-heading text-sm font-bold text-on-surface mb-2 leading-snug">{mem.title}</h3>
                    <p className="text-on-surface-variant text-xs leading-relaxed line-clamp-2 flex-1 mb-5">{mem.desc}</p>
                    <div className="pt-4 border-t border-glass-border/50">
                      <ImportanceBar value={mem.importance} />
                    </div>
                  </GlassPanel>
                ))
              )}

              {/* Inject card — always visible at bottom of grid */}
              {!injectOpen && (
                <GlassPanel
                  as="button"
                  onClick={() => setInjectOpen(true)}
                  hover
                  className="border-2 border-dashed border-glass-border rounded-xl p-5 flex flex-col items-center justify-center gap-3 min-h-[180px] hover:border-primary-container/40 cursor-pointer text-on-surface-variant hover:text-primary-container transition-all w-full"
                >
                  <div className="w-10 h-10 rounded-full bg-surface-high flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">add</span>
                  </div>
                  <span className="font-bold text-sm">Inject Knowledge</span>
                </GlassPanel>
              )}
            </div>
          </div>
        </div>

          {/* ── Asset details sidebar ── */}
        {showDetails && (
          <aside className="hidden lg:flex w-[360px] flex-shrink-0 flex-col bg-surface-mid border-l border-glass-border overflow-y-auto">
            <div className="px-6 py-4 border-b border-glass-border flex items-center justify-between sticky top-0 bg-surface-mid z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-primary-container/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary-container text-[20px]">description</span>
                </div>
                <span className="text-sm font-bold text-on-surface uppercase tracking-widest">Asset Details</span>
              </div>
              <button onClick={() => setShowDetails(false)} className="w-7 h-7 flex items-center justify-center rounded hover:bg-glass-fill text-on-surface-variant hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="p-6 flex flex-col gap-6 flex-1">
              {!active ? (
                <div className="flex-1 flex items-center justify-center text-sm text-on-surface-variant">
                  Select a memory to view details.
                </div>
              ) : editing ? (
                <div className="flex flex-col gap-4 flex-1">
                  <div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Content</p>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={6}
                      className="w-full bg-surface-lowest border border-glass-border rounded-lg p-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-primary-container transition-all resize-none"
                    />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Importance</p>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={editImportance}
                      onChange={(e) => setEditImportance(parseFloat(e.target.value))}
                      className="w-full accent-primary-container"
                    />
                    <p className="text-right text-xs text-primary mt-1 font-mono">{editImportance.toFixed(2)}</p>
                  </div>
                  <div className="flex gap-2 mt-auto pt-4 border-t border-glass-border">
                    <button
                      onClick={() => setEditing(false)}
                      className="flex-1 py-2 text-sm text-on-surface-variant hover:text-on-surface border border-glass-border rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleEdit}
                      disabled={saving || !editContent.trim()}
                      className="flex-1 py-2 text-sm font-bold text-on-primary-container bg-primary-container rounded-lg hover:brightness-110 transition-all disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="aspect-video w-full bg-surface-lowest rounded-lg border border-glass-border flex items-center justify-center overflow-hidden relative">
                    <span className="material-symbols-outlined text-5xl text-primary-container/30">play_circle</span>
                  </div>

                  <div className="flex flex-col gap-5">
                    <div>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Title</p>
                      <p className="text-on-surface font-bold text-sm leading-snug">{active.title}</p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Type</p>
                      <Badge variant="secondary">{active.type}</Badge>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Summary</p>
                      <p className="text-sm text-on-surface-variant leading-relaxed">{active.desc}</p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Created</p>
                      <p className="text-sm text-on-surface font-mono">{active.date}</p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Significance</p>
                      <ImportanceBar value={active.importance} showLabel={false} />
                      <p className="text-right text-xs text-primary mt-1 font-mono">{active.importance.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-glass-border flex gap-2">
                    <button
                      onClick={startEdit}
                      className="flex-1 py-2 text-sm font-bold text-on-surface bg-surface-high hover:bg-surface-high/80 rounded-lg transition-all flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span> Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(active.id)}
                      className="flex-1 py-2 text-sm font-bold text-red-400 bg-red-400/10 hover:bg-red-400/20 rounded-lg transition-all flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* Delete confirmation modal */}
      <Modal
        open={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Memory"
        actions={
          <>
            <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors">Cancel</button>
            <button onClick={handleDeleteConfirm} className="px-4 py-2 bg-error/80 hover:bg-error text-white font-bold rounded-lg text-sm transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">delete</span> Delete
            </button>
          </>
        }
      >
        <p>Are you sure you want to delete this memory? This cannot be undone.</p>
      </Modal>
    </div>
  );
}

export default function MemoryPage() {
  return (
    <AuthProvider>
      <MemoryContent />
    </AuthProvider>
  );
}

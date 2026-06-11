"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/Badge";
import { ForceGraph } from "@/components/graph/ForceGraph";
import { getRecentMemories, getAllLinks, getMemory, createLink, deleteLink } from "@/lib/api/memory";
import type { MemoryItem, MemoryLink } from "@/lib/api/memory";
import { cachedFetch, clearCache } from "@/lib/datacache";

interface LinkDisplay {
  id: string;
  source: string;
  sourceId: string;
  relationship: string;
  target: string;
  targetId: string;
}

interface GraphNode {
  id: string;
  label: string;
  type: string;
  importance: number;
  content: string;
}

interface GraphLink {
  source: string;
  target: string;
  relationship: string;
}

export default function GraphPage() {
  const [links, setLinks] = useState<LinkDisplay[]>([]);
  const [graphNodes, setGraphNodes] = useState<GraphNode[]>([]);
  const [graphLinks, setGraphLinks] = useState<GraphLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [memories, setMemories] = useState<MemoryItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const mems = await cachedFetch("graph:memories", () => getRecentMemories(50));
        if (cancelled) return;
        setMemories(mems);

        const memoryMap = new Map<string, string>();
        const typeMap = new Map<string, string>();
        const importanceMap = new Map<string, number>();
        const contentMap = new Map<string, string>();
        mems.forEach((m: MemoryItem) => {
          memoryMap.set(m.id, m.content.split("\n")[0].slice(0, 60));
          typeMap.set(m.id, m.memory_type);
          importanceMap.set(m.id, m.importance);
          contentMap.set(m.id, m.content);
        });

        let allLinks: MemoryLink[];
        try {
          const res = await cachedFetch("graph:links", () => getAllLinks());
          allLinks = res.links;
        } catch {
          allLinks = [];
        }

        const missingIds = new Set<string>();
        for (const link of allLinks) {
          if (!memoryMap.has(link.source_memory_id)) missingIds.add(link.source_memory_id);
          if (!memoryMap.has(link.target_memory_id)) missingIds.add(link.target_memory_id);
        }
        for (const mid of missingIds) {
          try {
            const m = await getMemory(mid);
            memoryMap.set(m.id, m.content.split("\n")[0].slice(0, 60));
            typeMap.set(m.id, m.memory_type);
            importanceMap.set(m.id, m.importance);
            contentMap.set(m.id, m.content);
          } catch { /* skip */ }
        }

        const resolved: LinkDisplay[] = [];
        const seen = new Set<string>();
        for (const link of allLinks) {
          const src = memoryMap.get(link.source_memory_id) || link.source_memory_id;
          const tgt = memoryMap.get(link.target_memory_id) || link.target_memory_id;
          const key = `${link.source_memory_id}|${link.target_memory_id}|${link.relationship}`;
          if (seen.has(key)) continue;
          seen.add(key);
          resolved.push({
            id: link.id,
            source: src,
            sourceId: link.source_memory_id,
            relationship: link.relationship,
            target: tgt,
            targetId: link.target_memory_id,
          });
        }

        const allIds = new Set<string>();
        mems.forEach((m) => allIds.add(m.id));
        resolved.forEach((l) => { allIds.add(l.sourceId); allIds.add(l.targetId); });

        const nodeList: GraphNode[] = [];
        allIds.forEach((id) => {
          nodeList.push({
            id,
            label: memoryMap.get(id) || id.slice(0, 8),
            type: typeMap.get(id) || "general",
            importance: importanceMap.get(id) || 0.5,
            content: contentMap.get(id) || "",
          });
        });

        if (!cancelled) {
          setLinks(resolved);
          setGraphNodes(nodeList);
          setGraphLinks(resolved.map((l) => ({
            source: l.sourceId,
            target: l.targetId,
            relationship: l.relationship,
          })));
          setLoading(false);
        }
      } catch {
        if (!cancelled) { setLinks([]); setLoading(false); }
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const filtered = links.filter(
    (l) => !filter ||
      l.relationship.toLowerCase().includes(filter.toLowerCase()) ||
      l.source.toLowerCase().includes(filter.toLowerCase()) ||
      l.target.toLowerCase().includes(filter.toLowerCase())
  );

  const handleDeleteLink = useCallback(async (linkId: string) => {
    try {
      await deleteLink(linkId);
      setLinks((prev) => {
        const updated = prev.filter((l) => l.id !== linkId);
        setGraphLinks(updated.map((l) => ({
          source: l.sourceId,
          target: l.targetId,
          relationship: l.relationship,
        })));
        return updated;
      });
    } catch { /* ignore */ }
  }, []);

  const handleLinkCreated = useCallback(async () => {
    setShowAddModal(false);
    clearCache("graph:");
    try {
      const res = await getAllLinks();
      const allLinks = res.links;
      const mems = await getRecentMemories(50);
      setMemories(mems);

      const memoryMap = new Map<string, string>();
      const typeMap = new Map<string, string>();
      const importanceMap = new Map<string, number>();
      const contentMap = new Map<string, string>();
      mems.forEach((m) => {
        memoryMap.set(m.id, m.content.split("\n")[0].slice(0, 60));
        typeMap.set(m.id, m.memory_type);
        importanceMap.set(m.id, m.importance);
        contentMap.set(m.id, m.content);
      });

      const missingIds = new Set<string>();
      for (const link of allLinks) {
        if (!memoryMap.has(link.source_memory_id)) missingIds.add(link.source_memory_id);
        if (!memoryMap.has(link.target_memory_id)) missingIds.add(link.target_memory_id);
      }
      for (const mid of missingIds) {
        try {
          const m = await getMemory(mid);
          memoryMap.set(m.id, m.content.split("\n")[0].slice(0, 60));
          typeMap.set(m.id, m.memory_type);
          importanceMap.set(m.id, m.importance);
          contentMap.set(m.id, m.content);
        } catch { /* skip */ }
      }

      const resolved: LinkDisplay[] = [];
      const seen = new Set<string>();
      for (const link of allLinks) {
        const src = memoryMap.get(link.source_memory_id) || link.source_memory_id;
        const tgt = memoryMap.get(link.target_memory_id) || link.target_memory_id;
        const key = `${link.source_memory_id}|${link.target_memory_id}|${link.relationship}`;
        if (seen.has(key)) continue;
        seen.add(key);
        resolved.push({
          id: link.id,
          source: src,
          sourceId: link.source_memory_id,
          relationship: link.relationship,
          target: tgt,
          targetId: link.target_memory_id,
        });
      }

      setLinks(resolved);
      setGraphLinks(resolved.map((l) => ({
        source: l.sourceId,
        target: l.targetId,
        relationship: l.relationship,
      })));
    } catch { /* ignore */ }
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-surface-dim overflow-hidden relative">
      {loading ? (
        <div className="flex h-full items-center justify-center">
          <div className="text-on-surface-variant text-sm">Loading graph...</div>
        </div>
      ) : graphNodes.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <div className="text-center max-w-lg">
            <span className="material-symbols-outlined text-6xl text-primary-container/30">hub</span>
            <h3 className="text-lg text-on-surface mt-4 mb-2">Graph Visualization</h3>
            <p className="text-on-surface-variant text-sm mb-4">
              No data yet. Add memories and create links to build your knowledge graph.
            </p>
          </div>
        </div>
      ) : (
        <ForceGraph nodes={graphNodes} links={graphLinks} />
      )}

      {/* floating toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-surface/80 backdrop-blur-md border border-glass-border rounded-lg px-4 py-2 shadow-lg">
        <h2 className="text-sm font-bold text-primary-container mr-2">Knowledge Graph</h2>
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter..."
          className="bg-surface-low border border-glass-border rounded px-2.5 py-1 text-xs text-on-surface placeholder:text-on-surface-variant outline-none focus:border-primary-container w-36"
        />
        <div className="w-px h-5 bg-glass-border" />
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary-container text-on-primary-container px-3 py-1 rounded text-xs font-bold hover:brightness-110 transition-all flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[14px]">add</span> Link
        </button>
        <button
          onClick={() => setShowSidebar((s) => !s)}
          className={`text-xs flex items-center gap-1 px-2.5 py-1 rounded transition-all ${
            showSidebar ? "bg-primary-container/20 text-primary-container" : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">list</span>
          {links.length}
        </button>
      </div>

      {/* slide-over sidebar */}
      {showSidebar && (
        <div className="absolute top-16 right-4 bottom-4 w-[380px] bg-surface/90 backdrop-blur-md border border-glass-border rounded-xl shadow-2xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-glass-border">
            <span className="text-xs font-bold text-on-surface uppercase tracking-widest">
              Links ({filtered.length})
            </span>
            <button
              onClick={() => setShowSidebar(false)}
              className="material-symbols-outlined text-on-surface-variant hover:text-on-surface text-[18px]"
            >
              close
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filtered.length === 0 ? (
              <div className="py-8 text-center text-xs text-on-surface-variant">
                {links.length === 0 ? "No relationships yet." : "No links match the filter."}
              </div>
            ) : (
              filtered.map((link) => (
                <div
                  key={link.id}
                  className="bg-surface-low border border-glass-border rounded-lg p-3 hover:border-primary-container/30 transition-all group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-on-surface font-medium truncate">{link.source}</span>
                  </div>
                  <div className="flex items-center gap-2 my-1.5">
                    <div className="h-px flex-1 bg-glass-border" />
                    <Badge variant="primary">{link.relationship}</Badge>
                    <div className="h-px flex-1 bg-glass-border" />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-on-surface font-medium truncate">{link.target}</span>
                    <button
                      onClick={() => handleDeleteLink(link.id)}
                      className="material-symbols-outlined text-on-surface-variant hover:text-red-400 text-[14px] opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {showAddModal && (
        <AddLinkModal
          memories={memories}
          onClose={() => setShowAddModal(false)}
          onCreated={() => {
            setShowAddModal(false);
            handleLinkCreated();
          }}
        />
      )}
    </div>
  );
}

function AddLinkModal({
  memories,
  onClose,
  onCreated,
}: {
  memories: MemoryItem[];
  onClose: () => void;
  onCreated: () => void;
}) {
  const [sourceId, setSourceId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [relationship, setRelationship] = useState("related_to");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!sourceId || !targetId) { setError("Select both source and target memories"); return; }
    if (sourceId === targetId) { setError("Cannot link a memory to itself"); return; }
    setSaving(true);
    setError("");
    try {
      await createLink(sourceId, targetId, relationship);
      onCreated();
    } catch (e: any) {
      setError(e?.response?.data?.detail || e.message || "Failed to create link");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-surface-low border border-glass-border rounded-xl p-6 w-[480px] shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-on-surface">Add Link</h3>
          <button onClick={onClose} className="material-symbols-outlined text-on-surface-variant hover:text-on-surface">close</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-on-surface-variant block mb-1">Source Memory</label>
            <select
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              className="w-full bg-surface border border-glass-border rounded px-3 py-2 text-sm text-on-surface outline-none focus:border-primary-container"
            >
              <option value="">Select...</option>
              {memories.map((m) => (
                <option key={m.id} value={m.id}>{m.content.split("\n")[0].slice(0, 60)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-on-surface-variant block mb-1">Relationship</label>
            <input
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              placeholder="e.g. supports, references, example_of"
              className="w-full bg-surface border border-glass-border rounded px-3 py-2 text-sm text-on-surface outline-none focus:border-primary-container"
            />
          </div>

          <div>
            <label className="text-xs text-on-surface-variant block mb-1">Target Memory</label>
            <select
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="w-full bg-surface border border-glass-border rounded px-3 py-2 text-sm text-on-surface outline-none focus:border-primary-container"
            >
              <option value="">Select...</option>
              {memories.map((m) => (
                <option key={m.id} value={m.id}>{m.content.split("\n")[0].slice(0, 60)}</option>
              ))}
            </select>
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <div className="flex gap-3 justify-end pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-on-surface-variant hover:text-on-surface border border-glass-border rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 text-sm font-bold text-on-primary-container bg-primary-container rounded hover:brightness-110 transition-all disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create Link"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

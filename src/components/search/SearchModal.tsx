"use client";
import React, { useState, useRef, useEffect } from "react";
import { searchMemories } from "@/lib/api/memory";
import type { MemoryItem } from "@/lib/api/memory";
import Link from "next/link";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ open, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MemoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await searchMemories({ query: query.trim(), n_results: 10 });
      setResults(res.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="fixed inset-0 bg-black/60" />
      <div className="relative w-full max-w-xl bg-surface border border-glass-border rounded-xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-4 px-5 py-4 border-b border-glass-border">
          <span className="material-symbols-outlined text-on-surface-variant text-[20px]">search</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search memories..."
            className="flex-1 bg-transparent text-on-surface placeholder:text-on-surface-variant/50 outline-none text-sm"
          />
          {loading && <span className="w-4 h-4 border-2 border-primary-container border-t-transparent rounded-full animate-spin" />}
          <button onClick={onClose} className="text-[11px] text-on-surface-variant uppercase tracking-wider px-2 py-1 rounded hover:bg-glass-fill transition-colors">Esc</button>
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {searched && !loading && results.length === 0 && (
            <div className="py-10 text-center text-sm text-on-surface-variant">No memories found</div>
          )}
          {results.map((m) => (
            <Link
              key={m.id}
              href="/memory"
              className="flex items-start gap-4 p-4 rounded-lg hover:bg-glass-fill transition-colors group"
              onClick={onClose}
            >
              <span className="material-symbols-outlined text-on-surface-variant text-[18px] mt-0.5">description</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono text-primary-container uppercase tracking-wider">{m.memory_type}</span>
                  <span className="text-[10px] text-on-surface-variant">{new Date(m.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-on-surface leading-relaxed line-clamp-2 group-hover:text-primary-container transition-colors">{m.content}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

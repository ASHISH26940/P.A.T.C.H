"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  getConversations,
  removeConversation,
  StoredConversation,
} from "@/lib/localstore";
import { getAllPersonas } from "@/lib/api/persona";
import type { Persona } from "@/types/api";
import clsx from "clsx";

interface ConversationPanelProps {
  userId: number | string;
}

function formatRelativeTime(timestamp: string): string {
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(diffMs / 3_600_000);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(diffMs / 86_400_000);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

export const ConversationPanel: React.FC<ConversationPanelProps> = ({
  userId,
}) => {
  const router = useRouter();
  const params = useParams();
  const activeChatId = Array.isArray(params.chatId)
    ? params.chatId[0]
    : params.chatId;
  const [conversations, setConversations] = useState<StoredConversation[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [personaOpen, setPersonaOpen] = useState(false);
  const personaRef = useRef<HTMLDivElement>(null);

  const personaKey = activeChatId ? `patch_persona_${activeChatId}` : "patch_active_persona";
  const activePersonaId = typeof window !== "undefined" ? localStorage.getItem(personaKey) : null;
  const activePersona = personas.find((p) => p.id === activePersonaId) || null;

  const refresh = useCallback(() => {
    setConversations(getConversations(userId));
  }, [userId]);

  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => {
    const handler = () => refresh();
    window.addEventListener("storage", handler);
    window.addEventListener("patch-conv-change", handler);
    window.addEventListener("focus", handler);
    window.addEventListener("popstate", handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("patch-conv-change", handler);
      window.removeEventListener("focus", handler);
      window.removeEventListener("popstate", handler);
    };
  }, [refresh]);

  useEffect(() => {
    getAllPersonas().then(setPersonas).catch(() => setPersonas([]));
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (personaRef.current && !personaRef.current.contains(e.target as Node)) setPersonaOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const setActivePersona = (id: string | null, name: string | null) => {
    const key = activeChatId ? `patch_persona_${activeChatId}` : "patch_active_persona";
    if (id) {
      localStorage.setItem(key, id);
      if (name) localStorage.setItem(`patch_persona_name_${id}`, name);
    } else {
      localStorage.removeItem(key);
    }
    setPersonaOpen(false);
    setPersonas((prev) => [...prev]);
  };

  const handleNewChat = () => router.push(`/chat/${crypto.randomUUID()}`);
  const handleDelete = (e: React.MouseEvent, chatId: string) => {
    e.preventDefault();
    e.stopPropagation();
    removeConversation(userId, chatId);
    if (activeChatId === chatId) handleNewChat();
  };

  return (
    <>
      <header className="p-6 border-b border-glass-border flex flex-col gap-6">
        <h2 className="font-h3 text-primary-container font-bold">Conversations</h2>
        <button
          onClick={handleNewChat}
          className="w-full py-3 bg-primary-container text-surface-dim font-bold rounded flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          New Memory
        </button>

        <div className="relative" ref={personaRef}>
          <button
            onClick={() => setPersonaOpen(!personaOpen)}
            className="w-full flex items-center gap-3 px-3 py-2.5 bg-surface-low border border-glass-border rounded-lg text-left hover:bg-surface-mid transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Persona</p>
              <p className="text-sm text-on-surface truncate">{activePersona ? activePersona.name : "None"}</p>
            </div>
            <span className={`material-symbols-outlined text-[16px] text-on-surface-variant transition-transform ${personaOpen ? "rotate-180" : ""}`}>expand_more</span>
          </button>

          {personaOpen && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-surface border border-glass-border rounded-xl shadow-2xl py-2 z-50 max-h-64 overflow-y-auto">
              <button
                onClick={() => setActivePersona(null, null)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left ${!activePersona ? "bg-surface-high text-primary-container" : "text-on-surface-variant hover:bg-glass-fill hover:text-on-surface"}`}
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
                No persona
              </button>
              <div className="border-t border-glass-border my-1" />
              {personas.length === 0 && (
                <p className="px-4 py-2 text-xs text-on-surface-variant italic">No personas created yet</p>
              )}
              {personas.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActivePersona(p.id, p.name)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left ${activePersonaId === p.id ? "bg-surface-high text-primary-container" : "text-on-surface-variant hover:bg-glass-fill hover:text-on-surface"}`}
                >
                  <span className={`material-symbols-outlined text-[18px] ${activePersonaId === p.id ? "text-primary-container" : "text-on-surface-variant/40"}`} style={activePersonaId === p.id ? { fontVariationSettings: "'FILL' 1" } : undefined}>psychology</span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate">{p.name}</p>
                    {p.description && <p className="text-[11px] text-on-surface-variant/60 truncate">{p.description}</p>}
                  </div>
                  {activePersonaId === p.id && (
                    <span className="material-symbols-outlined text-[16px] text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto flex flex-col p-4 gap-2 custom-scrollbar">
        {conversations.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-on-surface-variant/50 text-sm">
            No conversations yet
          </div>
        ) : (
          conversations.map((chat) => (
            <Link
              key={chat.id}
              href={`/chat/${chat.id}`}
              className={clsx(
                "p-4 rounded cursor-pointer transition-all duration-200 group relative",
                chat.id === activeChatId
                  ? "bg-surface-container-low border border-glass-border"
                  : "hover:bg-glass-fill hover:pl-5",
              )}
            >
              <div className="flex justify-between items-start mb-2">
                <span
                  className={clsx(
                    "font-label-md text-[14px]",
                    chat.id === activeChatId
                      ? "text-primary-container"
                      : "text-on-surface group-hover:text-primary-container transition-colors",
                  )}
                >
                  {chat.title || "New Chat"}
                </span>
                <span className="text-[10px] text-on-surface-variant uppercase font-mono-code flex-shrink-0 ml-2">
                  {formatRelativeTime(chat.timestamp)}
                </span>
              </div>
              <p className="text-[13px] text-on-surface-variant line-clamp-1">
                {chat.preview || chat.title || "Conversation"}
              </p>
              <button
                onClick={(e) => handleDelete(e, chat.id)}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-error-container/20 transition-all"
              >
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant hover:text-error">delete</span>
              </button>
            </Link>
          ))
        )}
      </div>
    </>
  );
};

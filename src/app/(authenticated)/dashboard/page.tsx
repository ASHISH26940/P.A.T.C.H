"use client";
import React, { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { getConversations } from "@/lib/localstore";
import { getRecentMemories } from "@/lib/api/memory";
import type { MemoryItem } from "@/lib/api/memory";
import Link from "next/link";

function DashboardContent() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [recentMemories, setRecentMemories] = useState<MemoryItem[]>([]);
  const conversations = user ? getConversations(user.id) : [];

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
  }, [user, isLoading, router]);

  useEffect(() => {
    getRecentMemories(5).then(setRecentMemories).catch(() => {});
  }, []);

  if (isLoading || !user) return null;

  return (
    <div className="flex h-screen w-full bg-surface-dim">
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-[72px] flex items-center justify-between px-8 border-b border-glass-border bg-surface flex-shrink-0">
          <div className="flex items-center gap-8 h-full">
            <Link href="/dashboard" className="text-primary-container font-bold text-[14px] relative h-full flex items-center">
              Dashboard
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-container" />
            </Link>
            <Link href={`/chat/${crypto.randomUUID()}`} className="text-on-surface-variant hover:text-on-surface transition-colors text-[14px] font-bold h-full flex items-center">Chat</Link>
            <Link href="/memory" className="text-on-surface-variant hover:text-on-surface transition-colors text-[14px] font-bold h-full flex items-center">Library</Link>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-xs text-on-surface-variant font-mono">v0.1</span>
            <div className="w-8 h-8 rounded-full bg-surface-container-high border border-glass-border flex items-center justify-center text-sm font-bold text-on-surface cursor-default">
              {user.username.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-8 py-10">
            <h1 className="text-[28px] font-bold text-on-surface mb-1">
              Welcome back, {user.username}
            </h1>
            <p className="text-on-surface-variant text-sm mb-10">Your creator memory layer.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-surface border border-glass-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary-container text-[22px]">chat_bubble</span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-on-surface">{conversations.length}</p>
                <p className="text-xs text-on-surface-variant mt-1 uppercase tracking-wider">Conversations</p>
              </div>
              <div className="bg-surface border border-glass-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary-container text-[22px]">database</span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-on-surface">{recentMemories.length > 0 ? `${recentMemories.length}+` : "—"}</p>
                <p className="text-xs text-on-surface-variant mt-1 uppercase tracking-wider">Recent Memories</p>
              </div>
              <Link href={`/chat/${crypto.randomUUID()}`} className="bg-primary-container/10 border border-primary-container/30 rounded-xl p-6 hover:bg-primary-container/20 transition-colors group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary-container text-[22px]">add</span>
                  </div>
                </div>
                <p className="text-sm font-bold text-primary-container group-hover:brightness-110">New Chat</p>
                <p className="text-xs text-on-surface-variant mt-1">Start a new conversation</p>
              </Link>
            </div>

            {conversations.length > 0 && (
              <section className="mb-12">
                <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4">Recent Conversations</h2>
                <div className="bg-surface border border-glass-border rounded-xl divide-y divide-glass-border">
                  {conversations.slice(0, 5).map((c) => (
                    <Link key={c.id} href={`/chat/${c.id}`} className="flex items-center justify-between px-6 py-4 hover:bg-glass-fill transition-colors">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-on-surface truncate">{c.title || "New Chat"}</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">{c.preview || "No messages"}</p>
                      </div>
                      <span className="text-[10px] text-on-surface-variant font-mono uppercase flex-shrink-0 ml-4">
                        {new Date(c.timestamp).toLocaleDateString()}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {recentMemories.length > 0 && (
              <section>
                <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4">Recent Memories</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentMemories.map((m) => (
                    <div key={m.id} className="bg-surface border border-glass-border rounded-xl p-5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono text-primary-container uppercase tracking-wider">{m.memory_type}</span>
                        <span className="text-[10px] text-on-surface-variant">{new Date(m.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-on-surface leading-relaxed line-clamp-2">{m.content}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  );
}

"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  getConversations,
  removeConversation,
  StoredConversation,
} from "@/lib/localstore";
import clsx from "clsx";

interface SidebarProps {
  username: string;
  userId: number | string;
  onLogout: () => void;
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

export const Sidebar: React.FC<SidebarProps> = ({
  username,
  userId,
  onLogout,
}) => {
  const router = useRouter();
  const params = useParams();
  const activeChatId = Array.isArray(params.chatId)
    ? params.chatId[0]
    : params.chatId;
  const [conversations, setConversations] = useState<StoredConversation[]>([]);

  useEffect(() => {
    setConversations(getConversations());
  }, []);
  useEffect(() => {
    const handler = () => setConversations(getConversations());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const handleNewChat = () => router.push(`/chat/${crypto.randomUUID()}`);
  const handleDelete = (e: React.MouseEvent, chatId: string) => {
    e.preventDefault();
    e.stopPropagation();
    removeConversation(chatId);
    setConversations(getConversations());
    if (activeChatId === chatId) handleNewChat();
  };

  return (
    <section className="w-[320px] bg-surface border-r border-glass-border flex flex-col h-full flex-shrink-0 z-30">
      <header className="p-6 border-b border-glass-border flex flex-col gap-6">
        <h2 className="font-h3 text-primary-container font-bold">Conversations</h2>
        <button
          onClick={handleNewChat}
          className="w-full py-3 bg-primary-container text-surface-dim font-bold rounded flex items-center justify-center gap-2 hover:brightness-110 transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          New Memory
        </button>
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
                "p-4 rounded cursor-pointer transition-colors group",
                chat.id === activeChatId
                  ? "bg-surface-container-low border border-glass-border"
                  : "hover:bg-glass-fill",
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
            </Link>
          ))
        )}
      </div>
    </section>
  );
};

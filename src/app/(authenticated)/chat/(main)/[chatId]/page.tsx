"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/contexts/AuthContext";
import { useParams } from "next/navigation";

import { ChatArea } from "@/components/chat/ChatArea";
import { MessageInput } from "@/components/chat/MessageInput";
import { SearchModal } from "@/components/search/SearchModal";

export default function ChatPage() {
  const { user, logout } = useAuth();

  const params = useParams();
  const chatId = Array.isArray(params.chatId)
    ? params.chatId[0]
    : params.chatId;

  const collectionName = "general_knowledge";

  const {
    messages,
    isLoading: isChatLoading,
    error,
    sendMessage,
  } = useChat({
    userId: user?.id || "",
    collectionName: collectionName,
    chatId: chatId || "",
  });

  const [showSearch, setShowSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [derivationAvail, setDerivationAvail] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setShowProfile(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      setDerivationAvail(true);
    };
    window.addEventListener("patch-derivation-available", handler);
    return () => window.removeEventListener("patch-derivation-available", handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearch(true);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!chatId) return;
    await sendMessage(text);
  };

  // Listen for suggested query clicks from the Active Memories panel
  useEffect(() => {
    const handler = (e: Event) => {
      const query = (e as CustomEvent).detail?.query as string | undefined;
      if (query) handleSendMessage(query);
    };
    window.addEventListener("patch-query-click", handler);
    return () => window.removeEventListener("patch-query-click", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center text-on-surface-variant">
        Initializing user session...
      </div>
    );
  }

  if (!chatId) {
    return (
      <div className="flex-1 flex items-center justify-center text-on-surface-variant">
        Select a chat or start a new one.
      </div>
    );
  }

  const pathname = `/chat/${chatId}`;

  return (
    <section className="flex-1 flex flex-col bg-surface relative z-20">
      {error && (
        <div
          className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-error-container/20 border border-error-container/30 text-error p-4 rounded-lg max-w-lg w-full"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      <nav className="h-[72px] flex items-center justify-between px-8 border-b border-glass-border bg-surface z-10">
        <div className="flex items-center gap-8 h-full">
          <Link
            href="/dashboard"
            className="text-on-surface-variant hover:text-on-surface transition-colors text-[14px] font-bold h-full flex items-center"
          >
            Dashboard
          </Link>
          <Link
            href={pathname}
            className="text-primary-container font-bold text-[14px] relative h-full flex items-center"
          >
            Chat
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-container"></div>
          </Link>
          <Link
            href="/memory"
            className="text-on-surface-variant hover:text-on-surface transition-colors text-[14px] font-bold h-full flex items-center"
          >
            Library
          </Link>
          <Link
            href="/persona"
            className="text-on-surface-variant hover:text-on-surface transition-colors text-[14px] font-bold h-full flex items-center gap-1.5"
          >
            Personas
            {derivationAvail && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" title="Chat history ready for persona derivation" />
            )}
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => setShowSearch(true)}
            className="material-symbols-outlined text-on-surface-variant hover:text-primary-container cursor-pointer text-[20px] no-underline"
            title="Search memories (⌘K)"
          >
            search
          </button>

          <div className="relative" ref={profileRef}>
            <div
              className="w-8 h-8 rounded-full bg-surface-container-high border border-glass-border flex items-center justify-center cursor-pointer hover:border-primary-container transition-colors"
              onClick={() => setShowProfile(!showProfile)}
            >
              <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                person
              </span>
            </div>
            {showProfile && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-surface border border-glass-border rounded-xl shadow-2xl py-2 z-50">
                <div className="px-4 py-3 border-b border-glass-border">
                  <p className="text-sm font-bold text-on-surface">
                    {user.username}
                  </p>
                  {user.email && (
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {user.email}
                    </p>
                  )}
                </div>
                <Link
                  href="/settings"
                  className="flex items-center gap-3 px-4 py-3 text-sm text-on-surface-variant hover:text-on-surface hover:bg-glass-fill transition-colors"
                  onClick={() => setShowProfile(false)}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    settings
                  </span>
                  Settings
                </Link>
                <button
                  onClick={() => {
                    setShowProfile(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-on-surface-variant hover:text-on-surface hover:bg-glass-fill transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    logout
                  </span>
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <SearchModal open={showSearch} onClose={() => setShowSearch(false)} />

      <ChatArea messages={messages as any} isLoading={isChatLoading} />
      <MessageInput
        onSendMessage={handleSendMessage}
        isLoading={isChatLoading}
      />
    </section>
  );
}

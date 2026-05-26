"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/contexts/AuthContext";
import { useParams } from "next/navigation";

import { ChatArea } from "@/components/chat/ChatArea";
import { MessageInput } from "@/components/chat/MessageInput";

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

  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!chatId) return;
    await sendMessage(text);
  };

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
          <Link href="/" className="text-on-surface-variant hover:text-on-surface transition-colors text-[14px] font-bold h-full flex items-center">Dashboard</Link>
          <Link href={pathname} className="text-primary-container font-bold text-[14px] relative h-full flex items-center">
            Chat
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-container"></div>
          </Link>
          <Link href="/memory" className="text-on-surface-variant hover:text-on-surface transition-colors text-[14px] font-bold h-full flex items-center">Library</Link>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/memory" className="material-symbols-outlined text-on-surface-variant hover:text-primary-container cursor-pointer text-[20px] no-underline">search</Link>

          <div className="relative" ref={notifRef}>
            <span
              className="material-symbols-outlined text-on-surface-variant hover:text-primary-container cursor-pointer text-[20px]"
              onClick={() => setShowNotif(!showNotif)}
            >notifications</span>
            {showNotif && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-surface border border-glass-border rounded-xl shadow-2xl p-4 z-50">
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Notifications</p>
                <div className="flex flex-col items-center justify-center py-8 text-on-surface-variant">
                  <span className="material-symbols-outlined text-3xl mb-2">notifications_off</span>
                  <p className="text-sm">No new notifications</p>
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={profileRef}>
            <div
              className="w-8 h-8 rounded-full bg-surface-container-high border border-glass-border flex items-center justify-center cursor-pointer hover:border-primary-container transition-colors"
              onClick={() => setShowProfile(!showProfile)}
            >
              <span className="material-symbols-outlined text-on-surface-variant text-[20px]">person</span>
            </div>
            {showProfile && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-surface border border-glass-border rounded-xl shadow-2xl py-2 z-50">
                <div className="px-4 py-3 border-b border-glass-border">
                  <p className="text-sm font-bold text-on-surface">{user.username}</p>
                  {user.email && <p className="text-xs text-on-surface-variant mt-0.5">{user.email}</p>}
                </div>
                <Link
                  href="/settings"
                  className="flex items-center gap-3 px-4 py-3 text-sm text-on-surface-variant hover:text-on-surface hover:bg-glass-fill transition-colors"
                  onClick={() => setShowProfile(false)}
                >
                  <span className="material-symbols-outlined text-[18px]">settings</span>
                  Settings
                </Link>
                <button
                  onClick={() => { setShowProfile(false); logout(); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-on-surface-variant hover:text-on-surface hover:bg-glass-fill transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <ChatArea messages={messages as any} isLoading={isChatLoading} />
      <MessageInput
        onSendMessage={handleSendMessage}
        isLoading={isChatLoading}
      />
    </section>
  );
}

"use client";

import React from "react";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/contexts/AuthContext";
import { useParams } from "next/navigation";

import { ChatArea } from "@/components/chat/ChatArea";
import { MessageInput } from "@/components/chat/MessageInput";

export default function ChatPage() {
  const { user } = useAuth();

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
          <a className="text-on-surface-variant hover:text-on-surface transition-colors text-[14px] font-bold h-full flex items-center" href="#">Dashboard</a>
          <a className="text-primary-container font-bold text-[14px] relative h-full flex items-center" href="#">
            Chat
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-container"></div>
          </a>
          <a className="text-on-surface-variant hover:text-on-surface transition-colors text-[14px] font-bold h-full flex items-center" href="#">Library</a>
        </div>
        <div className="flex items-center gap-6">
          <span className="material-symbols-outlined text-on-surface-variant hover:text-primary-container cursor-pointer text-[20px]">search</span>
          <span className="material-symbols-outlined text-on-surface-variant hover:text-primary-container cursor-pointer text-[20px]">notifications</span>
          <div className="w-8 h-8 rounded-full bg-surface-container-high border border-glass-border flex items-center justify-center cursor-pointer hover:border-primary-container transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">person</span>
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

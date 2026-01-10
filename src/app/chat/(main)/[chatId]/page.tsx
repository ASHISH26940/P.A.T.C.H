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

  // Hardcoded for now with plans to be dynamic later
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
      <div className="flex-1 flex items-center justify-center text-[#3A5A40]">
        Initializing user session...
      </div>
    );
  }

  if (!chatId) {
    return (
      <div className="flex-1 flex items-center justify-center text-[#3A5A40]">
        Select a chat or start a new one.
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col h-full relative">
      {error && (
        <div
          className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md max-w-lg w-full"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* 
         Cast messages to any if there's a strict type mismatch between hook and component, 
         but ideally they should align. The interface used in ChatArea is compatible with typical chat message structures.
      */}
      <ChatArea messages={messages as any} />
      <MessageInput
        onSendMessage={handleSendMessage}
        isLoading={isChatLoading}
      />
    </div>
  );
}

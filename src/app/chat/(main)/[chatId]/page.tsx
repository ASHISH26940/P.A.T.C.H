/**
 * t3-chat-frontend/app/chat/(main)/[chatId]/page.tsx
 *
 * The main chat page component. It assembles all the chat UI components
 * and wires them up to the useChat hook for full functionality.
 * This version is updated for dynamic routing.
 */
"use client";

import React from 'react';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/contexts/AuthContext';
import { useParams } from 'next/navigation';

import { ChatWindow } from '@/components/ChatWindow';
import { ChatInput } from '@/components/ChatInput';

export default function ChatPage() {
  const { user } = useAuth();
  const params = useParams();
  const chatId = Array.isArray(params.chatId) ? params.chatId[0] : params.chatId;

  // Hardcoded for now. In a real app, this could be dynamic.
  const collectionName = 'general_knowledge';

  // The useChat hook now receives the dynamic chatId from the URL
  const { messages, isLoading, error, sendMessage } = useChat({
    userId: user?.id || '',
    collectionName: collectionName,
    chatId: chatId || '', // Pass the chatId to the hook
  });

  const handleSendMessage = async (text: string) => {
    if (!chatId) return; // Don't send if there's no active chat ID
    await sendMessage(text);
  };

  if (!user) {
    return <div className="flex-1 flex items-center justify-center">Initializing...</div>
  }
  
  if (!chatId) {
    return <div className="flex-1 flex items-center justify-center">Select a chat or start a new one.</div>
  }

  return (
    <div className="flex flex-1 flex-col h-full">
      {error && (
        <div className="bg-red-100 border-t-4 border-red-500 rounded-b text-red-900 px-4 py-3 shadow-md m-4" role="alert">
          <div className="flex">
            <div>
              <p className="font-bold">An error occurred</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      <ChatWindow messages={messages} onSuggestionClick={handleSendMessage} username={user.username} />
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}

// components/chat/ChatWindow.tsx
"use client";
import React, { useRef, useEffect } from 'react';
import { BackendChatMessage } from '@/types/api';
import { ChatMessage } from './ChatMessage';

interface ChatWindowProps {
  messages: BackendChatMessage[];
  onSuggestionClick: (suggestion: string) => void;
  username: string; // The username is now required to pass to the ChatMessage
}

// A styled suggestion card component for the dark theme
const SuggestionCard: React.FC<{ title: string; subtitle: string; onClick: () => void }> = ({ title, subtitle, onClick }) => (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-xl bg-[#232323] p-4 ring-1 ring-gray-700 transition-all hover:bg-[#343434]"
    >
      <p className="font-semibold text-gray-200">{title}</p>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
);

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSuggestionClick, username }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const suggestions = [
      { title: "Explain a concept", subtitle: "like quantum computing in simple terms" },
      { title: "Write a code snippet", subtitle: "to make a GET request in Python" },
      { title: "Draft an email", subtitle: "to a potential client for a proposal" },
      { title: "Brainstorm ideas", subtitle: "for a 10th-anniversary marketing campaign" },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mx-auto max-w-4xl">
        {messages.length === 0 ? (
          // Display a welcome message and suggestion cards when the chat is empty
          <div className="flex flex-col gap-8">
            <h1 className="text-4xl font-bold text-gray-200">
              Hello,
              <br />
              How can I help you today?
            </h1>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {suggestions.map((s, i) => (
                    <SuggestionCard
                        key={i}
                        title={s.title}
                        subtitle={s.subtitle}
                        onClick={() => onSuggestionClick(`${s.title} ${s.subtitle}`)}
                    />
                ))}
            </div>
          </div>
        ) : (
          // Render the list of messages
          <div>
            {messages.map((msg, index) => (
              <ChatMessage key={msg.id || index} message={msg} username={username} />
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
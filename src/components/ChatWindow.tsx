/**
 * t3-chat-frontend/components/chat/ChatWindow.tsx
 *
 * The main display area for the conversation. It renders the list of
 * messages and handles auto-scrolling to the latest message.
 */
"use client";

import React, { useRef, useEffect } from 'react';
import { BackendChatMessage } from '@/types/api';
import { ChatMessage } from './ChatMessage';

interface ChatWindowProps {
    messages: BackendChatMessage[];
    onSuggestionClick: (suggestion: string) => void;
}

interface SuggestionCardType {
    title: string;
    subtitle: string;
    onClick: () => void
}

const SuggestionCard: React.FC<SuggestionCardType> = ({ title, onClick, subtitle }) => (
    <div
        onClick={onClick}
        className="cursor-pointer rounded-xl bg-white p-4 shadow-md ring-1 ring-gray-200 transition-all hover:bg-gray-100 hover:shadow-lg"
    >
        <p className="font-semibold text-gray-800">{title}</p>
        <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
)

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSuggestionClick }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Effect to scroll to the bottom on new messages
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
                    // Empty State UI
                    <div className="flex flex-col gap-8">
                        <h1 className="text-4xl font-bold text-gray-700">
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
                    // Messages List
                    <div>
                        {messages.map((msg, index) => (
                            <ChatMessage key={msg.id || index} message={msg} />
                        ))}
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}
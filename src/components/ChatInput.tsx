/**
 * t3-chat-frontend/components/chat/ChatInput.tsx
 *
 * The main input component for the user to send messages.
 * It features a dynamically resizing textarea and a send button that
 * displays a loading state.
 */
"use client"; // This component requires client-side state and browser APIs.

import React, { useState, useRef, useEffect } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface ChatInputProps {
    onSendMessage: (message: string) => Promise<void>;
    isLoading: boolean;
}


export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {

    const [input, setInput] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'; // Reset height
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [input]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            const messageToSend = input;
            setInput('');
            await onSendMessage(messageToSend);
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Submit on Enter press, but allow new lines with Shift+Enter
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };


    return (
        <div className="px-4 pb-4">
            <form
                onSubmit={handleSubmit}
                className="relative mx-auto max-w-4xl rounded-xl bg-white p-2 shadow-lg ring-1 ring-gray-200"
            >
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter a prompt here"
                    className="w-full resize-none border-0 bg-transparent p-3 pr-20 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-0"
                    rows={1}
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-md transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isLoading || !input.trim()}
                >
                    {isLoading ? <LoadingSpinner /> : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                        </svg>
                    )}
                </button>
            </form>
        </div>
    );
}
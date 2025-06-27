/**
 * t3-chat-frontend/app/chat/(main)/layout.tsx
 *
 * This version fixes the sidebar by ensuring that a new chat
 * is immediately reflected in the "Recent" list upon creation.
 */
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth, AuthProvider } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, getConversationList } from '@/lib/indexeddb/chatStore';

// --- Icons (defined as components for reusability) ---
const NewChatIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

const ChatHistoryIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const UserAvatar: React.FC<{ username: string }> = ({ username }) => (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-400 font-semibold text-white">
        {username?.charAt(0).toUpperCase() || 'U'}
    </div>
);


// --- The Enhanced Sidebar Component ---
const Sidebar: React.FC<{ isCollapsed: boolean, onToggle: () => void, onLogout: () => void, username: string, userId: number | string }> =
({ isCollapsed, onToggle, onLogout, username, userId }) => {
    const router = useRouter();
    const params = useParams();
    const activeChatId = Array.isArray(params.chatId) ? params.chatId[0] : params.chatId;

    const conversationsFromDB = useLiveQuery(
        () => getConversationList(String(userId)),
        [userId],
        []
    );

    // **CRITICAL FIX:** Create a memoized list for display.
    // This adds a temporary "New Chat" item if the active chat isn't in the DB yet.
    const displayedConversations = useMemo(() => {
        if (!activeChatId || !conversationsFromDB) {
            return conversationsFromDB || [];
        }

        const activeChatExistsInDB = conversationsFromDB.some(c => c.id === activeChatId);
        
        if (!activeChatExistsInDB) {
            // Prepend a temporary item for the new, unsaved chat.
            return [
                { id: activeChatId, title: "New Chat", timestamp: new Date().toISOString() },
                ...conversationsFromDB
            ];
        }

        return conversationsFromDB;
    }, [conversationsFromDB, activeChatId]);


    const handleNewChat = () => {
        const newChatId = crypto.randomUUID();
        router.push(`/chat/${newChatId}`);
    };

    return (
        <div className={`bg-[#F0F2F5] dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-all duration-300 ease-in-out flex flex-col ${isCollapsed ? 'w-20' : 'w-72'}`}>
            <div className="p-4 flex items-center justify-between">
                {!isCollapsed && <span className="font-bold text-lg">Chat</span>}
                <button onClick={onToggle} className="p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
                </button>
            </div>

            <div className="px-4 mb-4">
                <button onClick={handleNewChat} className="w-full flex items-center justify-center bg-blue-500 text-white rounded-full p-3 hover:bg-blue-600 transition-colors">
                    <NewChatIcon />
                    {!isCollapsed && <span className="ml-2 font-semibold">New Chat</span>}
                </button>
            </div>

            <div className="flex-grow overflow-y-auto px-4">
                {!isCollapsed && <p className="text-sm font-semibold mb-2">Recent</p>}
                <ul className="space-y-2">
                    {displayedConversations.map((chat) => (
                        <li key={chat.id}>
                            <Link 
                                href={`/chat/${chat.id}`} 
                                className={clsx("flex items-center p-2 rounded-md", {
                                    'bg-gray-300 dark:bg-gray-700': chat.id === activeChatId,
                                    'hover:bg-gray-300 dark:hover:bg-gray-700': chat.id !== activeChatId
                                })}
                            >
                                <ChatHistoryIcon />
                                {!isCollapsed && <span className="ml-3 text-sm truncate">{chat.title}</span>}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            
            <div className="p-4 border-t border-gray-300 dark:border-gray-700">
                <div className="flex items-center p-2">
                    <UserAvatar username={username}/>
                    {!isCollapsed && <span className="ml-3 font-semibold truncate">{username}</span>}
                </div>
                 <button onClick={onLogout} className="w-full text-left p-2 rounded-md hover:bg-gray-300 text-sm text-gray-700 dark:hover:bg-gray-700 mt-2">
                    {isCollapsed ? '🚪' : 'Logout'}
                </button>
            </div>
        </div>
    );
};

// --- Protected Layout Component ---
const ChatLayoutComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading, logout } = useAuth();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div className="flex h-screen w-full items-center justify-center bg-gray-100">Loading...</div>;
  }

  if (!user) {
    return null; // Redirecting...
  }

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
        <Sidebar
            isCollapsed={isSidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!isSidebarCollapsed)}
            onLogout={logout}
            username={user.username}
            userId={user.id}
        />
        <main className="flex-1 flex flex-col overflow-hidden">
            {children}
        </main>
    </div>
  );
};


// --- Main Export ---
export default function ChatLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <ChatLayoutComponent>{children}</ChatLayoutComponent>
        </AuthProvider>
    );
}

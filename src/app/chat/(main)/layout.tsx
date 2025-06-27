/**
 * t3-chat-frontend/app/chat/(main)/layout.tsx
 *
 * This version uses the new dark color palette for a more sophisticated UI.
 */
"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useAuth, AuthProvider } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';
import { useLiveQuery } from 'dexie-react-hooks';
import { getConversationList, deleteConversation, Conversation } from '@/lib/indexeddb/chatStore';

// --- Icons ---
const NewChatIcon = () => <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const ChatHistoryIcon = () => <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const UserAvatar = ({ username }: { username: string }) => <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#464646] font-semibold text-white">{username?.charAt(0).toUpperCase() || 'U'}</div>;
const DotsVerticalIcon = () => <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" /></svg>;
const TrashIcon = () => <svg className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;


// --- The Enhanced Sidebar Component ---
const Sidebar: React.FC<{ isCollapsed: boolean, onToggle: () => void, onLogout: () => void, username: string, userId: number | string }> =
({ isCollapsed, onToggle, onLogout, username, userId }) => {
    const router = useRouter();
    const params = useParams();
    const activeChatId = Array.isArray(params.chatId) ? params.chatId[0] : params.chatId;
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    const conversationsFromDB = useLiveQuery(
        () => getConversationList(String(userId)),
        [userId],
        []
    );

    const displayedConversations = useMemo(() => {
        if (!activeChatId) return conversationsFromDB || [];
        const conversations = conversationsFromDB || [];
        const activeChatExists = conversations.some(c => c.id === activeChatId);
        if (!activeChatExists) {
            return [{ id: activeChatId, title: "New Chat", timestamp: new Date().toISOString() }, ...conversations];
        }
        return conversations;
    }, [conversationsFromDB, activeChatId]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [userMenuRef]);


    const handleNewChat = () => {
        router.push(`/chat/${crypto.randomUUID()}`);
    };

    const handleDelete = async (chatIdToDelete: string) => {
        await deleteConversation(String(userId), chatIdToDelete);
        if(activeChatId === chatIdToDelete) {
            handleNewChat();
        }
    };


    return (
        <div className={`bg-[#232323] text-gray-300 transition-all duration-300 ease-in-out flex flex-col ${isCollapsed ? 'w-20' : 'w-72'}`}>
            <div className="p-4 flex items-center justify-between">
                {!isCollapsed && <span className="font-bold text-lg text-white">Chat</span>}
                <button onClick={onToggle} className="p-2 rounded-full hover:bg-[#343434]">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
                </button>
            </div>

            <div className="px-4 mb-4">
                <button onClick={handleNewChat} className="w-full flex items-center justify-center bg-[#343434] text-white rounded-full p-3 hover:bg-[#464646] transition-colors">
                    <NewChatIcon />
                    {!isCollapsed && <span className="ml-2 font-semibold">New Chat</span>}
                </button>
            </div>

            <div className="flex-grow overflow-y-auto px-4">
                {!isCollapsed && <p className="text-xs font-semibold mb-2 uppercase text-gray-400">Recent</p>}
                <ul className="space-y-1">
                    {displayedConversations.map((chat) => (
                        <li key={chat.id} className="group relative">
                            <Link
                                href={`/chat/${chat.id}`}
                                className={clsx("flex items-center w-full p-2 rounded-md", {
                                    'bg-[#464646] text-white': chat.id === activeChatId,
                                    'hover:bg-[#343434]': chat.id !== activeChatId
                                })}
                            >
                                <ChatHistoryIcon />
                                {!isCollapsed && <span className="ml-3 text-sm truncate flex-grow">{chat.title}</span>}
                                {!isCollapsed && (
                                    <button 
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(chat.id); }} 
                                        className="p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white"
                                    >
                                        <TrashIcon />
                                    </button>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div ref={userMenuRef} className="p-4 border-t border-gray-700 relative">
                <button onClick={() => setIsUserMenuOpen(prev => !prev)} className="flex items-center w-full p-2 rounded-md hover:bg-[#343434]">
                    <UserAvatar username={username}/>
                    {!isCollapsed && <span className="ml-3 font-semibold truncate flex-grow text-left">{username}</span>}
                    {!isCollapsed && <DotsVerticalIcon />}
                </button>
                {isUserMenuOpen && (
                    <div className="absolute bottom-full mb-2 w-[calc(100%-2rem)] bg-[#232323] rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                        <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-[#343434] rounded-md">
                            Logout
                        </button>
                    </div>
                )}
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
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div className="flex h-screen w-full items-center justify-center bg-[#111111]">Loading...</div>;
  }

  if (!user) {
    return null; // Redirecting...
  }

  return (
    <div className="flex h-screen bg-[#111111]">
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

/**
 * t3-chat-frontend/app/chat/(main)/layout.tsx
 *
 * Final enhanced version. The sidebar now includes a "more options"
 * menu for each chat with both Rename and Delete functionality.
 */
"use client";

import React,{useState,useEffect,useRef,useMemo} from 'react';
import { useAuth, AuthProvider } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';
import { useLiveQuery } from 'dexie-react-hooks';
import { getConversationList, deleteConversation, Conversation } from '@/lib/indexeddb/chatStore';

// --- Icons ---
const NewChatIcon = () => <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const ChatHistoryIcon = () => <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const UserAvatar = ({ username }: { username: string }) => <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-400 font-semibold text-white">{username?.charAt(0).toUpperCase() || 'U'}</div>;
const DotsVerticalIcon = () => <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" /></svg>;
const EditIcon = () => <svg className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" /></svg>;
const TrashIcon = () => <svg className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const CheckIcon = () => <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const CloseIcon = () => <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;


// --- The Enhanced Sidebar Component ---
const Sidebar: React.FC<{ isCollapsed: boolean, onToggle: () => void, onLogout: () => void, username: string, userId: number | string }> =
({ isCollapsed, onToggle, onLogout, username, userId }) => {
    const router = useRouter();
    const params = useParams();
    const activeChatId = Array.isArray(params.chatId) ? params.chatId[0] : params.chatId;

    const [renamingChatId, setRenamingChatId] = useState<string | null>(null);
    const [newChatTitle, setNewChatTitle] = useState('');
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [openOptionsMenu, setOpenOptionsMenu] = useState<string | null>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const optionsMenuRef = useRef<HTMLDivElement>(null);

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
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) setIsUserMenuOpen(false);
            if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target as Node)) setOpenOptionsMenu(null);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const handleNewChat = () => {
        router.push(`/chat/${crypto.randomUUID()}`);
    };

    const handleStartRename = (chat: { id: string, title: string }) => {
        setRenamingChatId(chat.id);
        setNewChatTitle(chat.title);
        setOpenOptionsMenu(null);
    };

    const handleCancelRename = () => {
        setRenamingChatId(null);
    };

    // const handleSaveRename = async (chatId: string) => {
    //     if (!newChatTitle.trim()) return;
    //     await updateConversationTitle(String(userId), chatId, newChatTitle.trim());
    //     setRenamingChatId(null);
    // };

    const handleDelete = async (chatIdToDelete: string) => {
        setOpenOptionsMenu(null);
        await deleteConversation(String(userId), chatIdToDelete);
        if(activeChatId === chatIdToDelete) {
            handleNewChat();
        }
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
                <ul className="space-y-1">
                    {displayedConversations.map((chat) => (
                        <li key={chat.id} className="group relative">
                           {renamingChatId === chat.id ? (
                                <div className="flex items-center p-2 rounded-md bg-white dark:bg-gray-900">
                                    <input
                                        type="text"
                                        value={newChatTitle}
                                        onChange={(e) => setNewChatTitle(e.target.value)}
                                        className="flex-grow bg-transparent text-sm focus:outline-none"
                                        autoFocus
                                    />
                                    
                                    <button onClick={handleCancelRename} className="p-1 hover:bg-gray-200 rounded-full"><CloseIcon /></button>
                                </div>
                           ) : (
                                <Link
                                    href={`/chat/${chat.id}`}
                                    className={clsx("flex items-center w-full p-2 rounded-md", {
                                        'bg-gray-300 dark:bg-gray-700': chat.id === activeChatId,
                                        'hover:bg-gray-300 dark:hover:bg-gray-700': chat.id !== activeChatId
                                    })}
                                >
                                    <ChatHistoryIcon />
                                    {!isCollapsed && <span className="ml-3 text-sm truncate flex-grow">{chat.title}</span>}
                                    {!isCollapsed && (
                                        <div className="relative" ref={openOptionsMenu === chat.id ? optionsMenuRef : null}>
                                            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpenOptionsMenu(openOptionsMenu === chat.id ? null : chat.id) }} className="p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-gray-400">
                                                <DotsVerticalIcon />
                                            </button>
                                            {openOptionsMenu === chat.id && (
                                                <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-gray-900 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                                                    
                                                    <button onClick={() => handleDelete(chat.id)} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"><TrashIcon /> Delete</button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Link>
                           )}
                        </li>
                    ))}
                </ul>
            </div>

            <div ref={userMenuRef} className="p-4 border-t border-gray-300 dark:border-gray-700 relative">
                <button onClick={() => setIsUserMenuOpen(prev => !prev)} className="flex items-center w-full p-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700">
                    <UserAvatar username={username}/>
                    {!isCollapsed && <span className="ml-3 font-semibold truncate flex-grow text-left">{username}</span>}
                    {!isCollapsed && <DotsVerticalIcon />}
                </button>
                {isUserMenuOpen && (
                    <div className="absolute bottom-full mb-2 w-[calc(100%-2rem)] bg-white dark:bg-gray-900 rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                        <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
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

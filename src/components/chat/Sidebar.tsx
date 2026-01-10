"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Plus,
  Brain,
  MessageSquare,
  Moon,
  Sun,
  Trash2,
  MoreVertical,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import {
  getConversationList,
  deleteConversation,
} from "@/lib/indexeddb/chatStore";
import clsx from "clsx";

interface SidebarProps {
  username: string;
  userId: number | string;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  username,
  userId,
  onLogout,
}) => {
  const router = useRouter();
  const params = useParams();
  const activeChatId = Array.isArray(params.chatId)
    ? params.chatId[0]
    : params.chatId;
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const conversationsFromDB = useLiveQuery(
    () => getConversationList(String(userId)),
    [userId],
    []
  );

  const displayedConversations = useMemo(() => {
    // If we have an active chat ID but it's not in the DB yet (new chat), we might want to show it temporarily
    // But typically the DB update happens fast. For now, just list DB conversations.
    return conversationsFromDB || [];
  }, [conversationsFromDB]);

  const handleNewChat = () => {
    router.push(`/chat/${crypto.randomUUID()}`);
  };

  const handleDelete = async (e: React.MouseEvent, chatIdToDelete: string) => {
    e.preventDefault();
    e.stopPropagation();
    await deleteConversation(String(userId), chatIdToDelete);
    if (activeChatId === chatIdToDelete) {
      handleNewChat();
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuRef]);

  return (
    <aside className="w-[280px] h-full hidden md:flex flex-col relative z-20 transition-all duration-300 border-r border-white/20 bg-[#A3B18A]/15 backdrop-blur-xl">
      <div className="p-6 pb-2">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-lg bg-[#588157] flex items-center justify-center text-white shadow-lg shadow-[#588157]/30">
            {/* flower/spa icon replacement */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V9m-4.5 3a4.5 4.5 0 1 1 4.5-4.5M7.5 12H9m3 0a4.5 4.5 0 1 1-4.5 4.5M9 12v1.5M12 12v1.5a4.5 4.5 0 1 1 4.5 4.5M12 12h1.5" />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#3A5A40]">
            P.A.T.C.H
          </h1>
        </div>
        <button
          onClick={handleNewChat}
          className="w-full py-3 px-4 rounded-xl bg-[#588157] hover:bg-[#4a6e49] text-white transition-all shadow-md shadow-[#588157]/20 hover:shadow-[#588157]/40 flex items-center justify-center gap-2 group mb-6"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span className="font-medium text-sm">New Chat</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-4 space-y-1">
        <div className="text-[10px] font-bold uppercase tracking-widest text-[#3A5A40]/50 mb-3 px-2">
          Recent Personas
        </div>

        {displayedConversations.map((chat) => (
          <Link
            key={chat.id}
            href={`/chat/${chat.id}`}
            className={clsx(
              "flex items-center gap-3 p-3 rounded-xl transition-all group relative",
              chat.id === activeChatId
                ? "bg-white/40 border border-white/40 shadow-sm"
                : "hover:bg-white/20 text-[#3A5A40]/80"
            )}
          >
            <MessageSquare
              className={clsx(
                "w-5 h-5",
                chat.id === activeChatId
                  ? "text-[#588157]"
                  : "opacity-50 group-hover:opacity-100"
              )}
            />
            <div className="flex-1 min-w-0">
              <p
                className={clsx(
                  "truncate text-sm font-medium",
                  chat.id === activeChatId ? "text-[#3A5A40]" : ""
                )}
              >
                {chat.title || "New Chat"}
              </p>
              <p className="truncate text-xs opacity-60 text-[#3A5A40]">
                {new Date(chat.timestamp).toLocaleDateString()}
              </p>
            </div>

            {/* Delete Button (visible on hover) */}
            <button
              onClick={(e) => handleDelete(e, chat.id)}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full hover:bg-red-100 hover:text-red-600 transition-all absolute right-2"
              title="Delete chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </Link>
        ))}

        {displayedConversations.length === 0 && (
          <div className="px-4 py-8 text-center text-[#3A5A40]/40 text-sm">
            No recent chats
          </div>
        )}
      </div>

      <div
        ref={userMenuRef}
        className="p-4 mt-auto border-t border-[#3A5A40]/10 relative"
      >
        <div
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/20 cursor-pointer transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-[#A3B18A]/30 border-2 border-white/30 flex items-center justify-center text-[#3A5A40] font-bold text-xs uppercase">
            {username.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-[#3A5A40]">
              {username}
            </p>
            <p className="text-xs opacity-60 truncate text-[#3A5A40]">
              Free Plan
            </p>
          </div>
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#3A5A40]/10 text-[#3A5A40] transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {isUserMenuOpen && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-white/80 backdrop-blur-md rounded-xl shadow-glass border border-white/50 overflow-hidden py-1 z-50">
            <button
              onClick={onLogout}
              className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

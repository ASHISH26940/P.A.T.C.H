"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { ConversationPanel } from "@/components/chat/ConversationPanel";

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
  const pathname = usePathname();
  const isChatPage = pathname.startsWith("/chat");

  return (
    <section
      className={`bg-surface border-r border-glass-border flex flex-col h-full flex-shrink-0 z-30 transition-all duration-300 ${
        isChatPage ? "w-[320px]" : "w-0 overflow-hidden border-r-0"
      }`}
    >
      {isChatPage && <ConversationPanel userId={userId} />}
    </section>
  );
};

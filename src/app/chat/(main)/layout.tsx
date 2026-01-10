"use client";

import React, { useState, useEffect } from "react";
import { useAuth, AuthProvider } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/chat/Sidebar";
import { useSessionTimeout } from "@/hooks/useSessionTimeout";

// --- Protected Layout Component ---
const ChatLayoutComponent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  // Session timeout (15 minutes)
  useSessionTimeout(logout, 15 * 60 * 1000);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    // Light mode loading screen
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#DAD7CD] text-[#3A5A40]">
        Loading...
      </div>
    );
  }

  // Prevent rendering children if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-[#DAD7CD] overflow-hidden">
      <Sidebar onLogout={logout} username={user.username} userId={user.id} />
      <main className="flex-1 flex flex-col h-full relative">{children}</main>
    </div>
  );
};

// --- Main Export ---
export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ChatLayoutComponent>{children}</ChatLayoutComponent>
    </AuthProvider>
  );
}

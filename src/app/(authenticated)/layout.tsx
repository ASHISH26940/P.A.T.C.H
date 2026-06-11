"use client";
import React from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/chat/Sidebar";
import { IconRail } from "@/components/layout/IconRail";
import { useEffect } from "react";
import { useSessionTimeout } from "@/hooks/useSessionTimeout";

const AuthenticatedShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  useSessionTimeout(logout, 15 * 60 * 1000);

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface-dim">
        <div className="text-on-surface-variant font-mono-code text-sm">Loading...</div>
      </div>
    );
  }
  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      <IconRail />
      <Sidebar onLogout={logout} username={user.username} userId={user.id} />
      {children}
    </div>
  );
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthenticatedShell>{children}</AuthenticatedShell>
    </AuthProvider>
  );
}

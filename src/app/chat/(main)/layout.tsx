"use client";
import React, { useEffect } from "react";
import { useAuth, AuthProvider } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/chat/Sidebar";
import { useSessionTimeout } from "@/hooks/useSessionTimeout";
import { IconRail } from "@/components/layout/IconRail";
import { BreadcrumbStepper } from "@/components/layout/BreadcrumbStepper";

const STEP_ROUTES = ["/settings", "/memory", "/chat", "/graph"];

const ChatLayoutComponent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  useSessionTimeout(logout, 15 * 60 * 1000);

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
  }, [user, isLoading, router]);

  if (isLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center bg-surface-dim">
        <div className="text-on-surface-variant font-mono-code text-sm">
          Loading...
        </div>
      </div>
    );
  if (!user) return null;

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col">
      <BreadcrumbStepper
        steps={[
          {
            label: "Settings",
            description: "Workspace & persona",
            status: "pending",
          },
          {
            label: "Memory",
            description: "Knowledge base",
            status: "pending",
          },
          {
            label: "Neural Chat",
            description: "Current conversation",
            status: "current",
          },
          {
            label: "Graph",
            description: "Knowledge graph",
            status: "pending",
          },
        ]}
        onStepClick={(index) => {
          // Already on Neural Chat (index 2) — no navigation needed
          if (index === 2) return;
          const route = STEP_ROUTES[index];
          if (route) router.push(route);
        }}
      />
      <div className="flex-1 flex overflow-hidden">
        <IconRail />
        <Sidebar onLogout={logout} username={user.username} userId={user.id} />
        {children}
      </div>
    </div>
  );
};

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

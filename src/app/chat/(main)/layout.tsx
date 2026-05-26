"use client";
import React, { useState, useEffect } from "react";
import { useAuth, AuthProvider } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/chat/Sidebar";
import { ActiveMemories } from "@/components/layout/ActiveMemories";
import { useSessionTimeout } from "@/hooks/useSessionTimeout";
import { IconRail } from "@/components/layout/IconRail";
import { BreadcrumbStepper } from "@/components/layout/BreadcrumbStepper";
import clsx from "clsx";

const STEP_ROUTES = ["/settings", "/memory", "/chat", "/graph"];

const ChatLayoutComponent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [showMemories, setShowMemories] = useState(true);

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
            label: "1. Workspace Config",
            description: "Neural Optimization",
            status: "complete",
          },
          {
            label: "2. Memory Sources",
            description: "System Logs, PDF Docs",
            status: "complete",
          },
          {
            label: "3. Neural Chat",
            description: "Active Interaction",
            status: "current",
          },
          {
            label: "4. Synthesis Report",
            description: "Final Output",
            status: "pending",
          },
        ]}
        onStepClick={(index) => {
          const route = STEP_ROUTES[index];
          if (route) router.push(route);
        }}
        leading={
          <button
            onClick={() => setShowMemories((s) => !s)}
            className="flex flex-col items-center justify-center w-full h-full gap-1 group"
            aria-label="Toggle memories panel"
          >
            <span
              className={clsx(
                "material-symbols-outlined text-[24px] transition-colors",
                showMemories
                  ? "text-primary-container"
                  : "text-on-surface-variant group-hover:text-on-surface"
              )}
              style={showMemories ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              bolt
            </span>
            <span
              className={clsx(
                "text-[9px] uppercase tracking-widest font-mono-code transition-colors",
                showMemories ? "text-primary-container" : "text-on-surface-variant"
              )}
            >
              Memory
            </span>
          </button>
        }
      />
      <div className="flex-1 flex overflow-hidden">
        <IconRail />
        <Sidebar onLogout={logout} username={user.username} userId={user.id} />
        {children}
        {showMemories && (
          <ActiveMemories
            memories={[]}
            loading={false}
            onClose={() => setShowMemories(false)}
          />
        )}
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

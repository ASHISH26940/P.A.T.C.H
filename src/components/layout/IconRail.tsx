"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { HelpPanel } from "./HelpPanel";

interface TooltipState {
  label: string;
  top: number;
  left: number;
}

const navItems = [
  { href: "/chat", icon: "chat_bubble", label: "Chat" },
  { href: "/memory", icon: "database", label: "Memory" },
  { href: "/video", icon: "video_library", label: "Ingest" },
  { href: "/graph", icon: "hub", label: "Graph" },
  { href: "/persona", icon: "psychology", label: "Persona" },
];

export const IconRail: React.FC = () => {
  const pathname = usePathname();
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);

  const showTooltip = (e: React.MouseEvent<HTMLElement>, label: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      label,
      top: rect.top + rect.height / 2,
      left: rect.right + 10,
    });
  };
  const hideTooltip = () => setTooltip(null);

  return (
    <>
      <aside className="h-full w-[88px] bg-surface border-r border-glass-border flex flex-col items-center py-6 z-40 flex-shrink-0">
        {/* Logo */}
        <Link
          href="/chat"
          className="mb-8 cursor-pointer"
          onMouseEnter={(e) => showTooltip(e, "P.A.T.C.H")}
          onMouseLeave={hideTooltip}
        >
          <span className="material-symbols-outlined text-primary-container text-[32px]">
            hub
          </span>
        </Link>

        {/* Main nav */}
        <nav className="flex flex-col gap-4 flex-1 w-full px-4">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onMouseEnter={(e) => showTooltip(e, item.label)}
                onMouseLeave={hideTooltip}
                className={clsx(
                  "p-3 rounded cursor-pointer transition-all duration-200 flex justify-center",
                  active
                    ? "bg-surface-container-low text-primary-container border-l-2 border-primary-container"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-glass-fill",
                )}
              >
                <span
                  className="material-symbols-outlined text-[24px]"
                  style={
                    active ? { fontVariationSettings: "'FILL' 1" } : undefined
                  }
                >
                  {item.icon}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="mt-auto flex flex-col gap-4 w-full px-4 pb-4">
          {/* Help */}
          <button
            onClick={() => setHelpOpen(true)}
            onMouseEnter={(e) => showTooltip(e, "Help")}
            onMouseLeave={hideTooltip}
            className={clsx(
              "p-3 flex justify-center rounded transition-all duration-200 w-full",
              helpOpen
                ? "bg-surface-container-low text-primary-container"
                : "text-on-surface-variant hover:text-on-surface hover:bg-glass-fill",
            )}
          >
            <span
              className="material-symbols-outlined text-[24px]"
              style={
                helpOpen ? { fontVariationSettings: "'FILL' 1" } : undefined
              }
            >
              help
            </span>
          </button>

          {/* Settings */}
          <Link
            href="/settings"
            onMouseEnter={(e) => showTooltip(e, "Settings")}
            onMouseLeave={hideTooltip}
            className={clsx(
              "p-3 flex justify-center rounded transition-all duration-200",
              pathname.startsWith("/settings")
                ? "bg-surface-container-low text-primary-container border-l-2 border-primary-container"
                : "text-on-surface-variant hover:text-on-surface hover:bg-glass-fill",
            )}
          >
            <span
              className="material-symbols-outlined text-[24px]"
              style={
                pathname.startsWith("/settings")
                  ? { fontVariationSettings: "'FILL' 1" }
                  : undefined
              }
            >
              settings
            </span>
          </Link>
        </div>
      </aside>

      {/* Tooltip */}
      {tooltip && !helpOpen && (
        <div
          className="fixed z-[9999] pointer-events-none whitespace-nowrap bg-surface-container border border-glass-border rounded px-3 py-1.5 text-[12px] font-medium text-on-surface shadow-lg"
          style={{
            top: tooltip.top,
            left: tooltip.left,
            transform: "translateY(-50%)",
          }}
        >
          {tooltip.label}
        </div>
      )}

      {/* Help panel */}
      <HelpPanel open={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
};

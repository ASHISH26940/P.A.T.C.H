"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navItems = [
  { href: "/chat", icon: "chat_bubble", label: "Chat" },
  { href: "/memory", icon: "database", label: "Memory" },
  { href: "/video", icon: "video_library", label: "Ingest" },
  { href: "/graph", icon: "hub", label: "Graph" },
  { href: "/persona", icon: "psychology", label: "Persona" },
];

export const IconRail: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="h-full w-[88px] bg-surface border-r border-glass-border flex flex-col items-center py-6 z-40 flex-shrink-0">
      <Link href="/chat" className="mb-8 cursor-pointer">
        <span className="material-symbols-outlined text-primary-container text-[32px]">hub</span>
      </Link>
      <nav className="flex flex-col gap-4 flex-1 w-full px-4">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "p-3 rounded cursor-pointer transition-all duration-200 flex justify-center",
                active
                  ? "bg-surface-container-low text-primary-container border-l-2 border-primary-container"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-glass-fill"
              )}
              title={item.label}
            >
              <span
                className="material-symbols-outlined text-[24px]"
                style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto flex flex-col gap-4 w-full px-4 pb-4">
        <div className="p-3 text-on-surface-variant hover:text-on-surface cursor-pointer flex justify-center rounded hover:bg-glass-fill">
          <span className="material-symbols-outlined text-[24px]">help</span>
        </div>
        <Link href="/settings" className="p-3 text-on-surface-variant hover:text-on-surface cursor-pointer flex justify-center rounded hover:bg-glass-fill">
          <span className="material-symbols-outlined text-[24px]">settings</span>
        </Link>
      </div>
    </aside>
  );
};

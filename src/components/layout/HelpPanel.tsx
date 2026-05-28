"use client";
import React, { useEffect } from "react";
import clsx from "clsx";

interface HelpPanelProps {
  open: boolean;
  onClose: () => void;
}

const sections = [
  {
    icon: "chat_bubble",
    title: "Neural Chat",
    href: "/chat",
    description:
      "Your main interface for querying P.A.T.C.H. Ask anything — it searches your memory sources and returns answers grounded in your own content.",
    tips: [
      "Press Enter to send, Shift+Enter for a new line.",
      "Each conversation is saved and fully persistent.",
      "Switch between past conversations from the left sidebar.",
      "Source cards below each response show exactly which documents were used.",
    ],
  },
  {
    icon: "database",
    title: "Memory",
    href: "/memory",
    description:
      "Your Knowledge Base. Every piece of content you've ingested lives here — transcripts, PDFs, notes, and video analyses.",
    tips: [
      "Click any memory card to preview its full content in the details panel.",
      "Use the search bar to filter by title or content.",
      "The Significance bar shows how often that memory surfaces in queries.",
      "Click 'Inject Knowledge' to manually add a new memory entry.",
    ],
  },
  {
    icon: "video_library",
    title: "Ingest",
    href: "/video",
    description:
      "Feed P.A.T.C.H. new information by pasting a YouTube URL or video link. The system fetches, transcribes, and embeds it automatically.",
    tips: [
      "Paste any public YouTube or direct video URL.",
      "Processing runs in the background — check the Live Console for status.",
      "Once complete, the video's content is immediately searchable in Chat.",
      "Recent Extractions shows the last processed videos and their progress.",
    ],
  },
  {
    icon: "hub",
    title: "Graph",
    href: "/graph",
    description:
      "A visual map of how your memories relate to each other. Nodes are memory items, edges are semantic relationships discovered during extraction.",
    tips: [
      "Filter by relationship type using the search bar.",
      "Click a node to expand its connections.",
      "Graph visualization requires the canvas renderer — coming soon.",
    ],
  },
  {
    icon: "psychology",
    title: "Persona",
    href: "/persona",
    description:
      "Define AI personas that shape how P.A.T.C.H. responds. Each persona has traits and goals that steer the tone and focus of answers.",
    tips: [
      "The active persona is highlighted with a check circle.",
      "Personas affect all chat responses until switched.",
      "Create a persona per project type (e.g. 'Video Strategist', 'Research Mode').",
    ],
  },
];

const commands = [
  { cmd: "/add <text>", description: "Save a piece of text directly to your memory / knowledge base." },
  { cmd: "/cmds", description: "Show all available commands inline in the chat." },
];

const shortcuts = [
  { keys: ["Enter"], action: "Send message" },
  { keys: ["Shift", "Enter"], action: "New line in input" },
  { keys: ["Ctrl", "K"], action: "Open search (coming soon)" },
  { keys: ["Esc"], action: "Close panels / modals" },
];

export const HelpPanel: React.FC<HelpPanelProps> = ({ open, onClose }) => {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={clsx(
          "fixed inset-0 z-[998] bg-surface-lowest/60 backdrop-blur-sm transition-opacity duration-300",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        className={clsx(
          "fixed top-0 right-0 h-full z-[999] w-[480px] max-w-[95vw] bg-surface border-l border-glass-border flex flex-col shadow-glass transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-glass-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <span
              className="material-symbols-outlined text-primary-container text-[22px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              help
            </span>
            <div>
              <h2 className="text-sm font-bold text-on-surface uppercase tracking-widest">
                Help & Reference
              </h2>
              <p className="text-[11px] text-on-surface-variant mt-0.5">
                P.A.T.C.H — Creator Memory Layer
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-glass-fill text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 custom-scrollbar">
          {/* What is PATCH */}
          <div className="p-4 rounded-xl bg-primary-container/5 border border-primary-container/20">
            <p className="text-sm text-on-surface leading-relaxed">
              <span className="font-bold text-primary-container">
                P.A.T.C.H.
              </span>{" "}
              is your personal AI memory layer. It ingests your videos, notes,
              and documents, embeds them into a searchable knowledge base, and
              lets you query them through a grounded AI chat.
            </p>
          </div>

          {/* Feature sections */}
          <div className="space-y-5">
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
              Sections
            </p>
            {sections.map((s) => (
              <div key={s.title} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    className="material-symbols-outlined text-primary-container text-[18px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {s.icon}
                  </span>
                  <h3 className="text-sm font-bold text-on-surface">
                    {s.title}
                  </h3>
                </div>
                <p className="text-[12px] text-on-surface-variant leading-relaxed pl-7">
                  {s.description}
                </p>
                <ul className="pl-7 space-y-1">
                  {s.tips.map((tip) => (
                    <li
                      key={tip}
                      className="text-[11px] text-on-surface-variant flex gap-2"
                    >
                      <span className="text-primary-container/60 flex-shrink-0 mt-0.5">
                        ›
                      </span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Commands */}
          <div className="space-y-3">
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
              Chat Commands
            </p>
            <div className="flex flex-col gap-2">
              {commands.map((c) => (
                <div key={c.cmd} className="flex items-start gap-3">
                  <code className="px-2 py-0.5 bg-surface-high border border-glass-border rounded text-[11px] font-mono text-primary-container whitespace-nowrap flex-shrink-0 mt-0.5">
                    {c.cmd}
                  </code>
                  <span className="text-[12px] text-on-surface-variant leading-relaxed">
                    {c.description}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Keyboard shortcuts */}
          <div className="space-y-3">
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
              Keyboard Shortcuts
            </p>
            <div className="flex flex-col gap-2">
              {shortcuts.map((s) => (
                <div
                  key={s.action}
                  className="flex items-center justify-between"
                >
                  <span className="text-[12px] text-on-surface-variant">
                    {s.action}
                  </span>
                  <div className="flex items-center gap-1">
                    {s.keys.map((k) => (
                      <kbd
                        key={k}
                        className="px-2 py-0.5 bg-surface-high border border-glass-border rounded text-[11px] font-mono text-on-surface"
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Version */}
          <div className="pt-4 border-t border-glass-border flex items-center justify-between">
            <span className="text-[11px] text-on-surface-variant/50 font-mono">
              v2.4.0-stable
            </span>
            <a
              href="#"
              className="text-[11px] text-primary-container/60 hover:text-primary-container transition-colors"
            >
              View changelog →
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};

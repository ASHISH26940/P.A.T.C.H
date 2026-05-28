"use client";
import React, { useEffect } from "react";
import clsx from "clsx";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ open, onClose, title, children, actions }) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) { document.addEventListener("keydown", handler); return () => document.removeEventListener("keydown", handler); }
  }, [open, onClose]);

  return (
    <>
      <div
        className={clsx("fixed inset-0 z-[998] bg-surface-lowest/60 backdrop-blur-sm transition-opacity duration-200", open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")}
        onClick={onClose}
      />
      <div className={clsx("fixed inset-0 z-[999] flex items-center justify-center p-4 transition-all duration-200", open ? "opacity-100 pointer-events-auto scale-100" : "opacity-0 pointer-events-none scale-95")}>
        <div className="bg-surface border border-glass-border rounded-xl shadow-2xl w-full max-w-md mx-auto" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-glass-border">
            <h3 className="text-sm font-bold text-on-surface uppercase tracking-widest">{title}</h3>
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded hover:bg-glass-fill text-on-surface-variant hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
          <div className="px-6 py-5 text-sm text-on-surface-variant">{children}</div>
          {actions && <div className="flex justify-end gap-3 px-6 py-4 border-t border-glass-border">{actions}</div>}
        </div>
      </div>
    </>
  );
};

"use client";
import React from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

function SettingsContent() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-surface-dim">
        <div className="text-on-surface-variant font-mono-code text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-surface-dim">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-8 py-10">
            <h1 className="font-heading text-headline-lg text-on-surface tracking-tighter mb-1">
              Settings
            </h1>
            <p className="text-on-surface-variant text-sm mb-10">
              Manage your account and preferences.
            </p>

            <div className="flex flex-col gap-6">
              <div className="bg-surface border border-glass-border rounded-xl p-6">
                <h2 className="text-sm font-bold text-on-surface uppercase tracking-widest mb-4">
                  Account
                </h2>
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-[11px] text-on-surface-variant uppercase tracking-wider mb-1">
                      Username
                    </p>
                    <p className="text-on-surface font-bold">{user.username}</p>
                  </div>
                  {user.email && (
                    <div>
                      <p className="text-[11px] text-on-surface-variant uppercase tracking-wider mb-1">
                        Email
                      </p>
                      <p className="text-on-surface">{user.email}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-surface border border-glass-border rounded-xl p-6">
                <h2 className="text-sm font-bold text-on-surface uppercase tracking-widest mb-4">
                  Session
                </h2>
                <button
                  onClick={() => logout()}
                  className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-high hover:bg-surface-container-higher border border-glass-border rounded-lg text-sm font-bold text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <AuthProvider>
      <SettingsContent />
    </AuthProvider>
  );
}

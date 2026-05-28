"use client";
import React, { useState } from "react";
import Link from "next/link";
import { registerUser } from "@/lib/api/auth";

export const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    try {
      await registerUser({ username, ...(email ? { email } : {}), password });
      setSuccess("Account created! You can now sign in.");
    } catch (err: any) {
      setError(err.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card w-full max-w-[440px] p-10 rounded-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#f59e0b] to-transparent"></div>

      <div className="mb-stack-lg">
        <h2 className="font-h2 text-h2 text-[#f5f5f4] mb-1 uppercase-mono">Deploy Instance</h2>
        <p className="text-[#a8a29e] font-body-sm">Create your nocturnal workspace</p>
      </div>

      <form className="space-y-10" onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-lg bg-error-container/10 border border-error-container/20 p-3 text-sm text-error text-center">{error}</div>
        )}
        {success && (
          <div className="rounded-lg bg-primary-container/10 border border-primary-container/20 p-3 text-sm text-primary-container text-center">{success}</div>
        )}

        <div className="space-y-2">
          <label className="font-label-md text-label-md text-[#a8a29e] block" htmlFor="reg-username">Creator ID</label>
          <div className="relative group">
            <input
              id="reg-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-[#0e0e12] border border-glass-border focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] text-[#f5f5f4] rounded-lg py-3 px-4 outline-none transition-all placeholder:text-[#a8a29e]/30 font-mono-code text-sm"
              placeholder="choose@identifier"
            />
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#a08e7a]/30 group-focus-within:text-primary-container transition-colors">person</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-label-md text-label-md text-[#a8a29e] block" htmlFor="reg-email">Contact Node</label>
          <div className="relative group">
            <input
              id="reg-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0e0e12] border border-glass-border focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] text-[#f5f5f4] rounded-lg py-3 px-4 outline-none transition-all placeholder:text-[#a8a29e]/30 font-mono-code text-sm"
              placeholder="creator@nocturnal.studio"
            />
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#a08e7a]/30 group-focus-within:text-primary-container transition-colors">mail</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-label-md text-label-md text-[#a8a29e] block" htmlFor="reg-password">Secure Key</label>
          <div className="relative group">
            <input
              id="reg-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full bg-[#0e0e12] border border-glass-border focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] text-[#f5f5f4] rounded-lg py-3 px-4 outline-none transition-all placeholder:text-[#a8a29e]/30 font-mono-code text-sm"
              placeholder="••••••••"
            />
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#a08e7a]/30 group-focus-within:text-primary-container transition-colors">key</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#f59e0b] hover:bg-[#d97706] text-[#2a1700] py-3 rounded-lg font-h3 text-h3 amber-glow active:scale-[0.98] transition-all flex items-center justify-center gap-2 group uppercase-mono disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="inline-block w-4 h-4 border-2 border-[#2a1700] border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Initialize Workspace
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">bolt</span>
            </>
          )}
        </button>
      </form>

      <p className="mt-stack-lg pt-stack-lg border-t border-glass-border text-[#a8a29e] font-body-sm">
        Already have an instance?{" "}
        <Link href="/login" className="text-xs text-[#f59e0b] hover:underline transition-all">Access Terminal</Link>
      </p>
    </div>
  );
};

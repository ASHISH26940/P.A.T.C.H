"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api/auth";
import Link from "next/link";

export const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await loginUser({ username, password });
      router.replace(`/chat/${crypto.randomUUID()}`);
    } catch (err: any) {
      setError(err.message || "Login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card w-full max-w-[440px] p-10 rounded-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#f59e0b] to-transparent"></div>

      <div className="mb-stack-lg">
        <h2 className="font-h2 text-h2 text-[#f5f5f4] mb-1 uppercase-mono">Access Terminal</h2>
        <p className="text-[#a8a29e] font-body-sm">Sign in to your nocturnal workspace</p>
      </div>

      <form className="space-y-stack-lg" onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-lg bg-error-container/10 border border-error-container/20 p-3 text-sm text-error text-center">{error}</div>
        )}

        <div className="space-y-2">
          <label className="font-label-md text-label-md text-[#a8a29e] block" htmlFor="identifier">Creator ID</label>
          <div className="relative group">
            <input
              id="identifier"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-[#0e0e12] border border-glass-border focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] text-[#f5f5f4] rounded-lg py-3 px-4 outline-none transition-all placeholder:text-[#a8a29e]/30 font-mono-code text-sm"
              placeholder="username@nocturnal.studio"
            />
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#a08e7a]/30 group-focus-within:text-primary-container transition-colors">fingerprint</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="font-label-md text-label-md text-[#a8a29e] block" htmlFor="password">Secure Key</label>
            <a className="text-xs text-[#f59e0b] hover:underline transition-all" href="#">Lost access?</a>
          </div>
          <div className="relative group">
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#0e0e12] border border-glass-border focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] text-[#f5f5f4] rounded-lg py-3 px-4 outline-none transition-all placeholder:text-[#a8a29e]/30 font-mono-code text-sm"
              placeholder="••••••••"
            />
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#a08e7a]/30 group-focus-within:text-primary-container transition-colors">key</span>
          </div>
        </div>

        <div className="flex items-center gap-2 py-2">
          <input
            id="persistent"
            type="checkbox"
            className="w-4 h-4 rounded bg-surface-container-low border-glass-border text-primary-container focus:ring-offset-surface-container-lowest focus:ring-primary-container text-[#f5f5f4]"
          />
          <label className="font-label-md text-label-md text-[#a8a29e] block" htmlFor="persistent">Maintain deep-session persistence</label>
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
              Initialize Session
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">bolt</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-stack-lg pt-stack-lg border-t border-glass-border flex flex-col gap-stack-md">
        <p className="text-[#a8a29e] font-body-sm">Or connect via infrastructure</p>
        <div className="grid grid-cols-2 gap-stack-sm">
          <button className="flex items-center justify-center gap-2 bg-glass-fill border border-glass-border hover:bg-glass-border py-2.5 rounded-lg text-sm transition-all text-[#a8a29e]">
            <svg className="w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button className="flex items-center justify-center gap-2 bg-glass-fill border border-glass-border hover:bg-glass-border py-2.5 rounded-lg text-sm transition-all text-[#a8a29e]">
            <span className="material-symbols-outlined text-base">terminal</span>
            GitHub
          </button>
        </div>
      </div>

      <p className="mt-stack-lg text-[#a8a29e] font-body-sm">
        New to the network?{" "}
        <Link href="/register" className="text-xs text-[#f59e0b] hover:underline transition-all">Deploy instance</Link>
      </p>
    </div>
  );
};

"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api/auth";
import Link from "next/link";

export const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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

      <form className="space-y-5" onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-lg bg-error-container/10 border border-error-container/20 p-3 text-sm text-error text-center">{error}</div>
        )}

        <div className="space-y-2">
          <label className="font-label-md text-label-md text-[#a8a29e] block" htmlFor="identifier">Username</label>
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
            <label className="font-label-md text-label-md text-[#a8a29e] block" htmlFor="password">Password</label>
            <a className="text-xs text-[#f59e0b] hover:underline transition-all" href="#">Lost access?</a>
          </div>
          <div className="relative group">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#0e0e12] border border-glass-border focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] text-[#f5f5f4] rounded-lg py-3 px-4 outline-none transition-all placeholder:text-[#a8a29e]/30 font-mono-code text-sm pr-10"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a08e7a]/50 hover:text-[#f59e0b] transition-colors"
            >
              <span className="material-symbols-outlined text-lg">{showPassword ? "visibility_off" : "visibility"}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="remember"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="accent-[#f59e0b] w-4 h-4 rounded border-glass-border bg-[#0e0e12]"
          />
          <label htmlFor="remember" className="text-sm text-[#a8a29e] cursor-pointer select-none">Remember me</label>
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

      <p className="mt-stack-lg pt-stack-lg border-t border-glass-border text-[#a8a29e] font-body-sm">
        New to the network?{" "}
        <Link href="/register" className="text-xs text-[#f59e0b] hover:underline transition-all">Deploy instance</Link>
      </p>
    </div>
  );
};

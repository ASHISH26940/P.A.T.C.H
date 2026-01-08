/**
 * t3-chat-frontend/components/auth/LoginForm.tsx
 *
 * A client component for the user login form. It handles state,
 * validation, API calls, and redirection.
 */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api/auth";
import Link from "next/link";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Brain, Mail, Lock, Moon, Sun } from "lucide-react";

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
      // Login successful - redirect to chat page
      const newChatId = crypto.randomUUID();
      router.replace(`/chat/${newChatId}`);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="backdrop-blur-3xl bg-white/30  rounded-[2rem] shadow-2xl p-8 md:p-10 transition-all duration-300 border border-white/40  ring-1 ring-white/20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-sage to-brand-green shadow-lg mb-6 transform transition-transform hover:scale-105">
            <Brain className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-brand-deep  mb-2 tracking-tight">
            P.A.T.C.H
          </h1>
          <p className="text-brand-deep/70  text-sm font-medium">
            Your Personal AI Companion
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-xl bg-red-50/80 p-4 text-sm text-red-600 ring-1 ring-red-100 text-center">
              {error}
            </div>
          )}
          <div className="relative group">
            <label
              className="block text-sm font-medium text-brand-deep  mb-1 ml-1"
              htmlFor="username"
            >
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="text-brand-deep/50  w-5 h-5" />
              </div>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-3 border-none rounded-xl bg-white  text-brand-deep  placeholder-brand-deep/40  shadow-sm ring-1 ring-brand-deep/10  focus:ring-2 focus:ring-brand-green  focus:outline-hidden transition-all duration-200"
                placeholder="Enter your username"
              />
            </div>
          </div>

          <div className="relative group">
            <div className="flex justify-between items-center mb-1 ml-1">
              <label
                className="block text-sm font-medium text-brand-deep "
                htmlFor="password"
              >
                Password
              </label>
              <a
                className="text-xs font-semibold text-brand-green  hover:text-brand-deep  transition-colors"
                href="#"
              >
                Forgot?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="text-brand-deep/50  w-5 h-5" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-3 border-none rounded-xl bg-white  text-brand-deep  placeholder-brand-deep/40  shadow-sm ring-1 ring-brand-deep/10  focus:ring-2 focus:ring-brand-green  focus:outline-hidden transition-all duration-200"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center ml-1">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-brand-deep focus:ring-brand-green border-gray-300 rounded bg-white/50   checkbox-accent"
            />
            <label
              className="ml-2 block text-sm text-brand-deep/80 "
              htmlFor="remember-me"
            >
              Remember me for 30 days
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-brand-deep hover:bg-brand-dark hover:-translate-y-0.5 transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-brand-deep "
          >
            {isLoading ? <LoadingSpinner /> : "Sign in securely"}
          </button>
        </form>

        <div className="mt-8 relative">
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center"
          >
            <div className="w-full border-t border-brand-deep/10 "></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-2 text-xs text-brand-deep/60  font-medium bg-transparent backdrop-blur-sm rounded">
              Or continue with
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <button
            type="button"
            className="w-full inline-flex justify-center items-center py-2.5 px-4 rounded-xl shadow-sm bg-white border border-white/50   text-sm font-medium text-brand-deep  hover:bg-gray-50  transition-colors"
          >
            <svg
              aria-hidden="true"
              className="h-5 w-5 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"></path>
            </svg>
            Google
          </button>
          <button
            type="button"
            className="w-full inline-flex justify-center items-center py-2.5 px-4 rounded-xl shadow-sm bg-white border border-white/50   text-sm font-medium text-brand-deep  hover:bg-gray-50  transition-colors"
          >
            <svg
              aria-hidden="true"
              className="h-5 w-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                clipRule="evenodd"
                d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                fillRule="evenodd"
              ></path>
            </svg>
            GitHub
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-brand-deep/70 ">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-brand-green  hover:text-brand-deep  transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-brand-deep/40 ">
          © 2024 P.A.T.C.H AI Inc. All rights reserved.
        </p>
      </div>

      {/* Dark mode toggle - simplified for now */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => document.documentElement.classList.toggle("dark")}
          className="p-3 rounded-full bg-white/30  backdrop-blur-md shadow-lg border border-white/20 text-brand-deep  hover:bg-white/50  transition-all"
        >
          <Moon className="w-5 h-5 block " />
          <Sun className="w-5 h-5 hidden " />
        </button>
      </div>
    </>
  );
};

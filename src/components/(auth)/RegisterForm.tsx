/**
 * t3-chat-frontend/components/auth/RegisterForm.tsx
 *
 * A client component for the user registration form.
 */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { registerUser } from "@/lib/api/auth";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Mail, Lock } from "lucide-react"; // Assuming lucide-react is installed for icons

export const RegisterForm: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const username = `${firstName} ${lastName}`.trim() || email.split("@")[0]; // Simple username derivation
      await registerUser({ username, email, password });
      setSuccessMessage("Registration successful! You can now sign in.");
    } catch (err: any) {
      setError(err.message || "An unknown error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/35 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] p-8 md:p-10 rounded-[1.5rem] w-full max-w-md mx-auto relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-sage via-brand-fern to-brand-hunter opacity-80"></div>
      <div className="mb-8 text-center lg:text-left">
        <h3 className="text-2xl font-bold text-brand-deep">Create Account</h3>
        <p className="text-brand-fern text-sm mt-1">
          Begin your journey with P.A.T.C.H
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-xl bg-red-50/80 p-4 text-sm text-red-600 ring-1 ring-red-100 text-center">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="rounded-xl bg-green-50/80 p-4 text-sm text-brand-deep ring-1 ring-brand-green/20 text-center">
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="relative group">
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="peer block w-full px-4 py-3 bg-white/50 border-0 border-b-2 border-brand-fern/30 text-brand-deep rounded-t-lg focus:ring-0 focus:border-brand-fern placeholder-transparent transition-all outline-none"
              placeholder=" "
            />
            <label
              htmlFor="firstName"
              className="absolute left-4 top-3 text-gray-500 text-sm transition-all origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-5 peer-focus:text-brand-hunter peer-not-placeholder-shown:scale-90 peer-not-placeholder-shown:-translate-y-5 pointer-events-none"
            >
              First Name
            </label>
          </div>
          <div className="relative group">
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="peer block w-full px-4 py-3 bg-white/50 border-0 border-b-2 border-brand-fern/30 text-brand-deep rounded-t-lg focus:ring-0 focus:border-brand-fern placeholder-transparent transition-all outline-none"
              placeholder=" "
            />
            <label
              htmlFor="lastName"
              className="absolute left-4 top-3 text-gray-500 text-sm transition-all origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-5 peer-focus:text-brand-hunter peer-not-placeholder-shown:scale-90 peer-not-placeholder-shown:-translate-y-5 pointer-events-none"
            >
              Last Name
            </label>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="text-brand-fern/50 w-5 h-5 group-focus-within:text-brand-fern transition-colors" />
          </div>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="peer block w-full pl-10 pr-4 py-3 bg-white/50 border-0 border-b-2 border-brand-fern/30 text-brand-deep rounded-t-lg focus:ring-0 focus:border-brand-fern placeholder-transparent transition-all outline-none"
            placeholder=" "
          />
          <label
            htmlFor="email"
            className="absolute left-10 top-3 text-gray-500 text-sm transition-all origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-5 peer-focus:text-brand-hunter peer-not-placeholder-shown:scale-90 peer-not-placeholder-shown:-translate-y-5 pointer-events-none"
          >
            Email Address
          </label>
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="text-brand-fern/50 w-5 h-5 group-focus-within:text-brand-fern transition-colors" />
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="peer block w-full pl-10 pr-4 py-3 bg-white/50 border-0 border-b-2 border-brand-fern/30 text-brand-deep rounded-t-lg focus:ring-0 focus:border-brand-fern placeholder-transparent transition-all outline-none"
            placeholder=" "
          />
          <label
            htmlFor="password"
            className="absolute left-10 top-3 text-gray-500 text-sm transition-all origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-5 peer-focus:text-brand-hunter peer-not-placeholder-shown:scale-90 peer-not-placeholder-shown:-translate-y-5 pointer-events-none"
          >
            Password
          </label>
        </div>

        <div className="flex items-center mt-2">
          <input
            id="terms"
            type="checkbox"
            className="h-4 w-4 text-brand-fern focus:ring-brand-sage border-gray-300 rounded cursor-pointer"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
            I agree to the{" "}
            <a href="#" className="text-brand-fern hover:underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="text-brand-fern hover:underline">
              Privacy Policy
            </a>
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-brand-deep text-brand-light font-semibold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 flex justify-center items-center group"
        >
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <span>Initialize P.A.T.C.H</span>
              {/* Arrow right icon place holder */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-brand-fern/10 text-center">
        <p className="text-sm text-gray-600">
          Already authenticated?{" "}
          <Link
            href="/login"
            className="font-medium text-brand-deep hover:underline ml-1"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-6 flex justify-center space-x-4 opacity-70 hover:opacity-100 transition-opacity">
        <button
          type="button"
          className="p-2 rounded-full bg-white/40 hover:bg-white/60 transition-colors"
        >
          {/* Google Icon SVG */}
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
          </svg>
        </button>
        <button
          type="button"
          className="p-2 rounded-full bg-white/40 hover:bg-white/60 transition-colors"
        >
          {/* GitHub/Other Icon SVG */}
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              clipRule="evenodd"
              d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
              fillRule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

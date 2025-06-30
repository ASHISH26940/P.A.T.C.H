/**
 * t3-chat-frontend/components/auth/RegisterForm.tsx
 *
 * A client component for the user registration form.
 */
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { registerUser } from '@/lib/api/auth';
import { LoadingSpinner } from '@/components/LoadingSpinner';


export const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      await registerUser({ username, email, password });
      setSuccessMessage('Registration successful! You can now sign in.');
    } catch (err:any) {
      setError(err.message || 'An unknown error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-xl text-black bg-white p-8 shadow-2xl ring-1 ring-gray-200">
      <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
        Create an Account
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">
            {successMessage}
          </div>
        )}
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email <span className="text-xs text-gray-500">(Optional)</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !!successMessage}
          className="flex w-full items-center justify-center rounded-md border border-transparent bg-gradient-to-br from-blue-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? <LoadingSpinner /> : 'Sign Up'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-blue-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
};
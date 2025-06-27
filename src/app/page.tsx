/**
 * t3-chat-frontend/app/page.tsx
 *
 * The root page of the application. Its sole purpose is to act as an
 * intelligent entry point, redirecting users to the appropriate page
 * based on their authentication status.
 */
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken } from '@/lib/api/auth';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Check for the authentication token on the client side
    const token = getAuthToken();

    if (token) {
      // If token exists, user is likely logged in
      router.replace('/chat');
    } else {
      // If no token, redirect to the login page
      router.replace('/login');
    }
  }, [router]);

  // Render a simple loading state while the redirection logic runs
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#F0F4F9]">
      <div className="text-gray-600">Loading...</div>
    </div>
  );
}
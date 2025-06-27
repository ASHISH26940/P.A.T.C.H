/**
 * t3-chat-frontend/app/page.tsx
 *
 * The root page of the application. It now intelligently redirects
 * logged-in users to a new chat session.
 */
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken } from '@/lib/api/auth';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const token = getAuthToken();

    if (token) {
      // If token exists, redirect to a new dynamic chat page.
      const newChatId = crypto.randomUUID();
      router.replace(`/chat/${newChatId}`);
    } else {
      // If no token, redirect to the login page.
      router.replace('/login');
    }
  }, [router]);

  // Render a simple loading state while the redirection logic runs.
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#F0F4F9]">
      <div className="text-gray-600">Loading...</div>
    </div>
  );
}

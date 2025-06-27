/**
 * t3-chat-frontend/app/(auth)/login/page.tsx
 *
 * The page component for displaying the login form.
 */
import { LoginForm } from '@/components/(auth)/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In',
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center p-4">
      <LoginForm />
    </main>
  );
}
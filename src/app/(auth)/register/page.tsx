/**
 * t3-chat-frontend/app/(auth)/register/page.tsx
 *
 * The page component for displaying the registration form.
 */
import { RegisterForm } from '@/components/(auth)/RegisterForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up',
};

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center p-4">
      <RegisterForm />
    </main>
  );
}
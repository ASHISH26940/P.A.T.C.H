/**
 * t3-chat-frontend/app/(auth)/login/page.tsx
 *
 * The page component for displaying the login form.
 */
import { LoginForm } from "@/components/(auth)/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center relative overflow-hidden bg-brand-light transition-colors duration-300">
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-brand-sage/30 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob"></div>
      <div className="absolute top-[10%] right-[-5%] w-96 h-96 bg-brand-green/30 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-brand-deep/20 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 w-full max-w-md p-4">
        <LoginForm />
      </div>
    </main>
  );
}

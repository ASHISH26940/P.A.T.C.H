/**
 * t3-chat-frontend/app/(auth)/register/page.tsx
 *
 * The page component for displaying the registration form with a new split layout.
 */
import { RegisterForm } from "@/components/(auth)/RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - P.A.T.C.H",
};

export default function RegisterPage() {
  return (
    <main className="bg-brand-light min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-sage/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-float"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-brand-fern/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-float-delayed"></div>
      <div className="absolute top-[20%] right-[10%] w-64 h-64 bg-white/40 rounded-full mix-blend-overlay filter blur-[60px] opacity-50"></div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 z-10 items-center">
        {/* Left Content */}
        <div className="hidden lg:flex flex-col justify-center space-y-6 pr-8">
          <div className="inline-flex items-center space-x-3">
            <div className="w-12 h-12 bg-brand-deep rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
              <span className="text-brand-light text-2xl font-bold">P</span>
              {/* Placeholder for icon if font icon unavailable */}
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-brand-deep font-mono">
              P.A.T.C.H
            </h1>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-light text-brand-hunter leading-tight">
              Experience{" "}
              <span className="font-semibold italic">Serene Intelligence.</span>
            </h2>
            <p className="text-lg text-brand-fern max-w-md">
              Join a new era of AI companionship designed for clarity, calmness,
              and capability.
            </p>
          </div>
          <div className="flex items-center space-x-4 pt-4">
            <div className="flex -space-x-3">
              {/* Using placeholders or same images if available. Using simple colored divs as fallback if external images block. */}
              <div className="w-10 h-10 rounded-full border-2 border-brand-light bg-gray-300"></div>
              <div className="w-10 h-10 rounded-full border-2 border-brand-light bg-gray-400"></div>
              <div className="w-10 h-10 rounded-full border-2 border-brand-light bg-gray-500"></div>
            </div>
            <p className="text-sm font-medium text-brand-hunter">
              Joined by 10k+ thinkers
            </p>
          </div>
        </div>

        {/* Right Form Card */}
        <RegisterForm />
      </div>

      {/* Theme Toggle Button (Light mode only requested, but keeping simpler clean toggle or removing if 'no dark mode' means completely disabled) */}
      {/* User specifically said "no dark mode dark classes", implying a light-only design. I will omit the dark mode toggle for this page or keep it hidden. */}
    </main>
  );
}

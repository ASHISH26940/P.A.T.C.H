"use client";

import { RegisterForm } from "@/components/(auth)/RegisterForm";
import { useEffect, useRef } from "react";

export default function RegisterPage() {
  const meshRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (!meshRef.current) return;
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      meshRef.current.style.background = `
        radial-gradient(at ${x * 100}% ${y * 100}%, rgba(57, 57, 61, 0.15) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(31, 31, 35, 0.2) 0px, transparent 50%)
      `;
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <main className="font-body-md text-body-md h-screen w-full flex overflow-hidden selection:bg-primary-container selection:text-on-primary-container">
      <div
        ref={meshRef}
        className="fixed inset-0 z-0 gradient-mesh pointer-events-none"
      ></div>

      <div className="relative z-10 w-full h-full flex flex-col md:flex-row">
        {/* Left Section: 40% - Desktop only */}
        <section className="hidden md:flex md:w-[40%] h-full flex-col justify-center pl-16 pr-8 border-r border-glass-border bg-surface-container-lowest/50 relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-surface-bright/10 rounded-full blur-[100px]"></div>

          <div className="relative z-20 space-y-3">
            <div className="flex items-center gap-3">
              <span
                className="material-symbols-outlined text-primary-container text-5xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                hub
              </span>
              <h1 className="font-h1 text-[2.5rem] text-[#f5f5f4] tracking-tighter uppercase-mono">
                P.A.T.C.H.
              </h1>
            </div>
            <div>
              <p className="text-[1.6rem] font-bold leading-snug text-[#f5f5f4] mb-3">
                Your memory layer for{" "}
                <span className="text-primary-container">creating</span>
                <span className="terminal-cursor"></span>
              </p>
              <p className="text-[#a8a29e] text-base leading-relaxed">
                High-fidelity cognitive infrastructure for nocturnal creators
                and deep-work cycles.
              </p>
            </div>
          </div>

          <div className="absolute bottom-12 left-12 opacity-5 pointer-events-none">
            <div className="grid grid-cols-4 gap-2">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div
                  key={i}
                  className={`w-8 h-8 ${i === 1 || i === 7 ? "bg-primary-container" : "border border-primary-container"}`}
                ></div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Section: 60% */}
        <section className="flex-1 h-full flex items-center justify-center p-stack-lg md:p-0 relative">
          <div className="absolute top-8 left-8 md:hidden flex items-center gap-2">
            <span
              className="material-symbols-outlined text-primary-container"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              hub
            </span>
            <span className="font-h3 text-h3 text-primary-container tracking-tighter">
              P.A.T.C.H.
            </span>
          </div>

          <RegisterForm />


        </section>
      </div>
    </main>
  );
}

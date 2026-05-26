"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/lib/api/auth";

export default function RootPage() {
  const router = useRouter();
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      router.replace(`/chat/${crypto.randomUUID()}`);
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-surface-dim">
      <div className="text-on-surface-variant font-mono-code text-sm">Initializing...</div>
    </div>
  );
}

"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ChatIndex() {
  const router = useRouter();
  useEffect(() => {
    router.replace(`/chat/${crypto.randomUUID()}`);
  }, [router]);
  return null;
}

import { useState, useCallback, useRef } from "react";
import { sendChatMessage } from "@/lib/api/chat";
import { addConversation } from "@/lib/localstore";

interface UseChatOptions {
  userId: number | string;
  collectionName: string;
  chatId: string;
}

interface ChatMessage {
  id?: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
}

export function useChat({ userId, collectionName, chatId }: UseChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesRef = useRef<ChatMessage[]>([]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || !chatId) return;
      setError(null);

      const now = new Date().toISOString();
      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        timestamp: now,
      };
      messagesRef.current = [...messagesRef.current, userMsg];
      setMessages((prev) => [...prev, userMsg]);

      addConversation(chatId, content.slice(0, 32), content.slice(0, 80));

      setIsLoading(true);
      try {
        const pastMessages = messagesRef.current.slice(0, -1).map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const response = await sendChatMessage({
          user_message: content,
          collection_name: collectionName,
          user_id: String(userId),
          past_messages: pastMessages,
        });

        const aiMsg: ChatMessage = {
          id: response.message_id,
          role: "model",
          content: response.ai_response,
          timestamp: new Date().toISOString(),
        };
        messagesRef.current = [...messagesRef.current, aiMsg];
        setMessages((prev) => [...prev, aiMsg]);
      } catch (err: any) {
        setError(err.message || "Failed to get a response.");
      } finally {
        setIsLoading(false);
      }
    },
    [userId, collectionName, chatId],
  );

  return { messages, isLoading, error, sendMessage };
}

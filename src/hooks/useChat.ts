/**
 * t3-chat-frontend/hooks/useChat.ts
 *
 * This version prevents duplicate AI responses by tracking the last
 * processed message, making the API call effect idempotent and safe
 * for React's Strict Mode.
 */
import { useState, useCallback, useEffect, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';

import { Role, ChatRequest, BackendChatMessage, ApiChatMessage } from '@/types/api';
import { sendChatMessage } from '@/lib/api/chat';
import { addMessageToDB, getMessagesFromDB } from '@/lib/indexeddb/chatStore';

interface UseChatOptions {
  userId: number | string;
  collectionName: string;
  chatId: string;
}

export function useChat({ userId, collectionName, chatId }: UseChatOptions) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Ref to store the ID of the last user message that triggered an AI fetch.
  const lastProcessedMessageId = useRef<number | string | undefined>(undefined);

  const messages = useLiveQuery(
    () => getMessagesFromDB(String(userId), chatId),
    [userId, chatId],
    []
  );

  const sendMessage = useCallback(async (userMessageContent: string) => {
    if (!userMessageContent.trim() || !userId || !chatId) return;

    setError(null);

    const newUserMessage: BackendChatMessage = {
      role: Role.User,
      content: userMessageContent,
      timestamp: new Date().toISOString(),
      userId: String(userId),
      conversationId: chatId,
    };

    try {
      await addMessageToDB(newUserMessage);
    } catch (err) {
      console.error("Failed to add user message to DB", err);
      setError("Could not save your message.");
    }
  }, [userId, chatId]);

  useEffect(() => {
    const lastMessage = messages?.[messages.length - 1];

    // **CRITICAL FIX:**
    // Add a check to ensure we haven't already processed this message.
    const shouldFetch =
      lastMessage &&
      lastMessage.role === Role.User &&
      !isLoading &&
      lastMessage.id !== lastProcessedMessageId.current;

    if (shouldFetch) {
      // Mark this message as "processed" to prevent re-fetching.
      lastProcessedMessageId.current = lastMessage.id;

      const fetchAiResponse = async () => {
        setIsLoading(true);

        const historyForBackend = messages.slice(0, -1);
        
        const pastMessagesForBackend = historyForBackend
          .slice(-10)
          .filter(msg => msg.role === Role.User || msg.role === Role.Model)
          .map(msg => ({
            role: msg.role,
            content: msg.content,
          }));

        const requestPayload: ChatRequest = {
          user_message: lastMessage.content,
          collection_name: collectionName,
          user_id: String(userId),
          past_messages: pastMessagesForBackend as ApiChatMessage[],
        };

        try {
          const response = await sendChatMessage(requestPayload);
          const aiResponse: BackendChatMessage = {
            id: response.message_id,
            role: Role.Model,
            content: response.ai_response,
            timestamp: new Date().toISOString(),
            userId: String(userId),
            conversationId: chatId,
          };
          await addMessageToDB(aiResponse);
        } catch (err: any) {
          console.error('Error fetching AI response:', err);
          setError(err.message || 'Failed to get a response from the AI.');
        } finally {
          setIsLoading(false);
        }
      };

      fetchAiResponse();
    }
  }, [messages, isLoading, userId, collectionName, chatId]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
  };
}

import { useState, useCallback, useRef, useEffect } from "react";
import { sendChatMessageStream, fetchChatHistory } from "@/lib/api/chat";
import { createMemory } from "@/lib/api/memory";
import { addConversation, getMessages, saveMessages, getConversations, isConversationDeleted } from "@/lib/localstore";

interface UseChatOptions {
  userId: number | string;
  collectionName: string;
  chatId: string;
}

interface SourceDoc {
  id?: string;
  content?: string;
  metadata?: Record<string, unknown>;
  distance?: number;
  type?: string;
}

export interface ChatMessage {
  id?: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
  sourceDocuments?: SourceDoc[];
}

const SOURCE_EVENT = "patch-source-docs";

export function useChat({ userId, collectionName, chatId }: UseChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesRef = useRef<ChatMessage[]>([]);
  const chatIdRef = useRef(chatId);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!chatId) return;

    const saved = getMessages(userId, chatId) as ChatMessage[];
    messagesRef.current = saved;
    setMessages(saved);
    setError(null);
    setIsLoading(false);
    chatIdRef.current = chatId;
    abortRef.current?.abort();
    abortRef.current = null;
  }, [chatId, userId]);

  useEffect(() => {
    if (!chatId) return;

    fetchChatHistory(200).then((serverMsgs) => {
      if (!serverMsgs.length) return;

      const bySession: Record<string, ChatMessage[]> = {};
      for (const sm of serverMsgs) {
        const sid = sm.session_id || "__orphaned";
        if (!bySession[sid]) bySession[sid] = [];
        bySession[sid].push({
          id: sm.id,
          role: sm.role === "human" ? "user" : "model",
          content: sm.content,
          timestamp: sm.created_at,
        });
      }

      for (const [sid, msgs] of Object.entries(bySession)) {
        if (sid === "__orphaned") continue;
        msgs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        const existing = getMessages(userId, sid);
        const existingIds = new Set(existing.map((m) => m.id).filter(Boolean));
        const newOnes = msgs.filter((m) => m.id && !existingIds.has(m.id));
        if (newOnes.length) {
          saveMessages(userId, sid, msgs);
        }

        const convos = getConversations(userId);
        if (!convos.find((c) => c.id === sid) && !isConversationDeleted(sid)) {
          const first = msgs.find((m) => m.role === "user") || msgs[0];
          addConversation(userId, sid, first.content.slice(0, 32), first.content.slice(0, 80));
        }
      }

      const currentMsgs = bySession[chatId];
      if (currentMsgs) {
        messagesRef.current = currentMsgs;
        setMessages(currentMsgs);
      }
    });
  }, [chatId, userId]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      abortRef.current = null;
    };
  }, []);

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
      saveMessages(userId, chatId, messagesRef.current);

      addConversation(userId, chatId, content.slice(0, 32), content.slice(0, 80));

      setIsLoading(true);

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const cmdsList = "**Commands:**\n- `/add <text>` — Save text to memory\n- `/cmds` — Show this command list";

      const cmdMatch = content.match(/^\/(\w+)\s*(.+)?/);
      if (cmdMatch) {
        const cmd = cmdMatch[1];
        const args = cmdMatch[2] || "";

        if (cmd === "cmds") {
          const msg: ChatMessage = {
            id: crypto.randomUUID(),
            role: "model",
            content: cmdsList,
            timestamp: new Date().toISOString(),
          };
          messagesRef.current = [...messagesRef.current, msg];
          setMessages((prev) => [...prev, msg]);
          saveMessages(userId, chatId, messagesRef.current);
          setIsLoading(false);
          return;
        }

        if (cmd === "add") {
          try {
            await createMemory(args, "general", 0.6);
            const confirmMsg: ChatMessage = {
              id: crypto.randomUUID(),
              role: "model",
              content: `Saved to memory: _${args.slice(0, 100)}_`,
              timestamp: new Date().toISOString(),
            };
            messagesRef.current = [...messagesRef.current, confirmMsg];
            setMessages((prev) => [...prev, confirmMsg]);
            saveMessages(userId, chatId, messagesRef.current);
          } catch {
            const errMsg: ChatMessage = {
              id: crypto.randomUUID(),
              role: "model",
              content: "Failed to save to memory.",
              timestamp: new Date().toISOString(),
            };
            messagesRef.current = [...messagesRef.current, errMsg];
            setMessages((prev) => [...prev, errMsg]);
            saveMessages(userId, chatId, messagesRef.current);
          }
          setIsLoading(false);
          return;
        }

        const unknownMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "model",
          content: `Unknown command \`/${cmd}\`. Try \`/cmds\` for available commands.`,
          timestamp: new Date().toISOString(),
        };
        messagesRef.current = [...messagesRef.current, unknownMsg];
        setMessages((prev) => [...prev, unknownMsg]);
        saveMessages(userId, chatId, messagesRef.current);
        setIsLoading(false);
        return;
      }

      try {
        let created = false;
        const aiMsgId = crypto.randomUUID();
        const personaKey = chatId ? `patch_persona_${chatId}` : "patch_active_persona";
        const personaJson = typeof window !== "undefined" ? localStorage.getItem(personaKey) : null;
        const personaId = personaJson || null;
        const personaName = personaId && typeof window !== "undefined"
          ? localStorage.getItem(`patch_persona_name_${personaId}`)
          : null;

        await sendChatMessageStream(
          {
            user_message: content,
            collection_name: collectionName,
            user_id: String(userId),
            session_id: chatId,
            persona_id: personaId || undefined,
            persona_name: personaName || undefined,
          },
          {
            onToken: (text) => {
              if (!created) {
                created = true;
                setIsLoading(false);
                const aiMsg: ChatMessage = {
                  id: aiMsgId,
                  role: "model",
                  content: text,
                  timestamp: new Date().toISOString(),
                };
                messagesRef.current = [...messagesRef.current, aiMsg];
                setMessages((prev) => [...prev, aiMsg]);
              } else {
                const updated = messagesRef.current.map((m) =>
                  m.id === aiMsgId ? { ...m, content: m.content + text } : m,
                );
                messagesRef.current = updated;
                setMessages([...updated]);
              }
            },
            onDone: (result) => {
              if (created) {
                const docs = ((result.source_documents || []) as SourceDoc[])
                  .filter((d) => d.type !== "qa" && d.type !== "extraction");
                const final = messagesRef.current.map((m) =>
                  m.id === aiMsgId
                    ? { ...m, sourceDocuments: docs }
                    : m,
                );
                messagesRef.current = final;
                setMessages([...final]);
                saveMessages(userId, chatId, final);
              }
              setIsLoading(false);

              if (created && result.source_documents && result.source_documents.length > 0) {
                window.dispatchEvent(
                  new CustomEvent(SOURCE_EVENT, {
                    detail: { sourceDocuments: result.source_documents, chatId },
                  }),
                );
              }

              if (result.derivation_available) {
                window.dispatchEvent(
                  new CustomEvent("patch-derivation-available", { detail: { chatId } }),
                );
              }
            },
            onError: (text) => {
              if (created) {
                const updated = messagesRef.current.map((m) =>
                  m.id === aiMsgId ? { ...m, content: text } : m,
                );
                messagesRef.current = updated;
                setMessages([...updated]);
                saveMessages(userId, chatId, updated);
              }
              setIsLoading(false);
            },
          },
          controller.signal,
        );
      } catch {
        setIsLoading(false);
      }
    },
    [userId, collectionName, chatId],
  );

  return { messages, isLoading, error, sendMessage };
}

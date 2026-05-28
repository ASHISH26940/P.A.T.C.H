export interface StoredConversation {
  id: string;
  title: string;
  preview?: string;
  timestamp: string;
}

export interface StoredMessage {
  id?: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
  sourceDocuments?: unknown[];
}

function convKey(userId: string | number) { return `patch_convos_${userId}`; }
function msgKey(userId: string | number, chatId: string) { return `patch_msgs_${userId}_${chatId}`; }

const CONV_EVENT = "patch-conv-change";

function notify() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CONV_EVENT));
  }
}

export function getConversations(userId: string | number): StoredConversation[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(convKey(userId)) || "[]");
}

export function addConversation(userId: string | number, id: string, title: string, preview?: string) {
  const list = getConversations(userId);
  if (!list.find((c) => c.id === id)) {
    list.unshift({ id, title, preview, timestamp: new Date().toISOString() });
    localStorage.setItem(convKey(userId), JSON.stringify(list));
    notify();
  }
}

export function removeConversation(userId: string | number, id: string) {
  localStorage.setItem(
    convKey(userId),
    JSON.stringify(getConversations(userId).filter((c) => c.id !== id)),
  );
  notify();
}

export function updateConversationTitle(userId: string | number, id: string, title: string) {
  const list = getConversations(userId).map((c) =>
    c.id === id ? { ...c, title } : c,
  );
  localStorage.setItem(convKey(userId), JSON.stringify(list));
  notify();
}

// ── Per-chat message persistence ──────────────────────────────────────────

export function getMessages(userId: string | number, chatId: string): StoredMessage[] {
  if (typeof window === "undefined" || !chatId) return [];
  return JSON.parse(localStorage.getItem(msgKey(userId, chatId)) || "[]");
}

export function saveMessages(userId: string | number, chatId: string, messages: StoredMessage[]): void {
  if (typeof window === "undefined" || !chatId) return;
  localStorage.setItem(msgKey(userId, chatId), JSON.stringify(messages));
}

export function clearMessages(userId: string | number, chatId: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(msgKey(userId, chatId));
}

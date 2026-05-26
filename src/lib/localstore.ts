const CONV_KEY = "patch_convos";

export interface StoredConversation {
  id: string;
  title: string;
  preview?: string;
  timestamp: string;
}

export function getConversations(): StoredConversation[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(CONV_KEY) || "[]");
}

const CONV_EVENT = "patch-conv-change";

function notify() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CONV_EVENT));
  }
}

export function addConversation(id: string, title: string, preview?: string) {
  const list = getConversations();
  if (!list.find((c) => c.id === id)) {
    list.unshift({ id, title, preview, timestamp: new Date().toISOString() });
    localStorage.setItem(CONV_KEY, JSON.stringify(list));
    notify();
  }
}

export function removeConversation(id: string) {
  localStorage.setItem(
    CONV_KEY,
    JSON.stringify(getConversations().filter((c) => c.id !== id)),
  );
  notify();
}

export function updateConversationTitle(id: string, title: string) {
  const list = getConversations().map((c) =>
    c.id === id ? { ...c, title } : c,
  );
  localStorage.setItem(CONV_KEY, JSON.stringify(list));
  notify();
}

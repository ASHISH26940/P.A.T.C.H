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

export function addConversation(id: string, title: string, preview?: string) {
  const list = getConversations();
  if (!list.find((c) => c.id === id)) {
    list.unshift({ id, title, preview, timestamp: new Date().toISOString() });
    localStorage.setItem(CONV_KEY, JSON.stringify(list));
  }
}

export function removeConversation(id: string) {
  localStorage.setItem(
    CONV_KEY,
    JSON.stringify(getConversations().filter((c) => c.id !== id)),
  );
}

export function updateConversationTitle(id: string, title: string) {
  const list = getConversations().map((c) =>
    c.id === id ? { ...c, title } : c,
  );
  localStorage.setItem(CONV_KEY, JSON.stringify(list));
}

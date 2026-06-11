import axios from "axios";
import { ChatRequest } from "@/types/api";
import { getAuthToken } from "./auth";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:5000";

interface HistoryMessage {
  id: string;
  role: string;
  content: string;
  created_at: string;
  session_id?: string | null;
}

interface ChatHistoryResponse {
  messages: HistoryMessage[];
  total: number;
}

interface StreamCallbacks {
  onToken: (text: string) => void;
  onDone: (result: {
    message_id: string;
    source_documents?: any[];
    derivation_available?: boolean;
  }) => void;
  onError: (text: string) => void;
}

function extractErrorDetail(data: unknown): string {
  if (!data) return "An unknown error occurred";
  if (typeof data === "string") return data;
  const detail = (data as any).detail;
  if (!detail) return JSON.stringify(data);
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail.map((d: any) => d.msg || JSON.stringify(d)).join("; ");
  }
  return JSON.stringify(detail);
}

function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const serverError = error.response?.data;
    const errorMessage = extractErrorDetail(serverError) || error.message || "An unknown API error occurred";
    console.error("Chat API Error:", errorMessage, serverError);
    throw new Error(errorMessage);
  }
  console.error("An unexpected error occurred:", error);
  throw new Error("An unexpected error occurred");
}

export async function fetchChatHistory(limit = 100): Promise<HistoryMessage[]> {
  const token = getAuthToken();
  if (!token) return [];
  try {
    const res = await axios.get<ChatHistoryResponse>(
      `${BASE_URL}/v1/chat/history?limit=${limit}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return res.data.messages;
  } catch {
    return [];
  }
}

export async function sendChatMessageStream(
  request: ChatRequest,
  callbacks: StreamCallbacks,
  signal?: AbortSignal,
): Promise<void> {
  const token = getAuthToken();
  if (!token) {
    callbacks.onError("Authentication token not found. Please log in.");
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/v1/chat/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request),
      signal,
    });

    if (!response.ok) {
      const text = await response.text();
      callbacks.onError(`Request failed: ${text}`);
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      callbacks.onError("Stream not available");
      return;
    }

    signal?.addEventListener("abort", () => reader.cancel(), { once: true });

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data: ")) continue;
        try {
          const data = JSON.parse(trimmed.slice(6));
          switch (data.type) {
            case "token":
              callbacks.onToken(data.text);
              break;
            case "done":
              callbacks.onDone({
                message_id: data.message_id,
                source_documents: data.source_documents,
                derivation_available: data.derivation_available,
              });
              break;
            case "error":
              callbacks.onError(data.text);
              break;
          }
        } catch {
          // skip malformed JSON
        }
      }
    }
  } catch (error: any) {
    if (error?.name === "AbortError") return;
    callbacks.onError(error.message || "Network error");
  }
}

export async function sendChatMessage(
  request: ChatRequest
): Promise<any> {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Authentication token not found. Please log in.");
  }
  try {
    const response = await axios.post<any>(
      `${BASE_URL}/v1/chat/`,
      request,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

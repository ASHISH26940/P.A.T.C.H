import axios from "axios";
import { ChatRequest, ChatResponse } from "@/types/api";
import { getAuthToken } from "./auth";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:5000";
const DEV_MODE = false;

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

const mockResponses = [
  "To maintain the \"Gothic Shadow\" aesthetic, we utilize **Tonal Layering** across grayscale foundations. The hierarchy follows these tiers:\n\n- **Level 0:** Base canvas (#131317)\n- **Level 1:** Panels and sidebars (#1B1B1F)\n- **Level 2:** Active glass focus (blur 12px)\n\nThe glass panel approach uses `backdrop-filter: blur(12px)` with `rgba(255, 255, 255, 0.04)` fill to create depth without visual noise.",
  "Based on the P.A.T.C.H. framework documentation, the depth layering follows a strict elevation system:\n\n**Surface elevations:**\n- `surface-container-lowest` (#0e0e12) — deepest background\n- `surface-container-low` (#1b1b1f) — sidebar/memories\n- `surface-container` (#1f1f23) — default surface\n- `surface-container-high` (#2a292e) — hovered/active states\n- `surface-container-highest` (#353439) — elevated elements\n\nEach layer adds 4px of perceived depth through luminance shifts.",
  "The configuration for Level 2 glass surfaces requires:\n\n```css\n.glass-panel {\n  background: rgba(255, 255, 255, 0.04);\n  backdrop-filter: blur(12px);\n  border: 1px solid rgba(255, 255, 255, 0.08);\n}\n```\n\nApply this to cards, modals, and floating panels. The amber glow effect uses `box-shadow: 0px 0px 20px rgba(245, 158, 11, 0.25)` for primary-container accents.",
  "Memory retrieval analysis shows the following correlations:\n\n1. **Project_Overview.mp4** — 92% relevance to current query\n2. **Color Token Logic** (QA Snippet) — 65% relevance\n3. **System Logs v3** — 78% relevance\n\nThe embedding similarity search uses cosine distance with a threshold of 0.3. Memories below this threshold are excluded from context injection.",
  "The neural chat system integrates three data sources:\n\n- **System Logs** (`SYSTEM_LOGS_V3`) — operational metrics\n- **Design Guide** (`DESIGN_GUIDE.PDF`) — visual specifications\n- **User Context** — session-specific preferences\n\nEach source is embedded into a 3072-dimension vector space using Gemini Embedding-001 and queried via pgvector similarity search.",
];

export async function sendChatMessage(
  request: ChatRequest
): Promise<ChatResponse> {
  const token = getAuthToken();

  if (!token) {
    console.error("Chat API: No token found in localStorage.");
    throw new Error("Authentication token not found. Please log in.");
  }

  if (DEV_MODE) {
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200));
    const responseIndex = Math.floor(Math.random() * mockResponses.length);
    return {
      message_id: crypto.randomUUID(),
      ai_response: mockResponses[responseIndex],
      source_documents: [
        {
          id: "src-1",
          content: "System log entry: Gothic shadow tonal layering specification for workspace components.",
          metadata: { source_type: "SYSTEM_LOGS_V3", title: "System Logs v3", filename: "system_logs_v3.log" },
          distance: 0.08,
        },
        {
          id: "src-2",
          content: "Design guide: Glass panel blur thresholds and elevation system for P.A.T.C.H. framework.",
          metadata: { source_type: "DESIGN_GUIDE.PDF", title: "Design Guide", filename: "DESIGN_GUIDE.PDF" },
          distance: 0.15,
        },
      ] as any,
    };
  }

  try {
    const response = await axios.post<ChatResponse>(
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

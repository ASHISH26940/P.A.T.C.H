import axios from "axios";
import { ChatRequest, ChatResponse } from "@/types/api";
import { getAuthToken } from "./auth";

const BASE_URL = "http://127.0.0.1:5000";

function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const serverError = error.response?.data;
    const errorMessage =
      serverError?.detail || error.message || "An unknown API error occurred";
    console.error("Chat API Error:", errorMessage, serverError);
    throw new Error(errorMessage);
  }
  console.error("An unexpected error occurred:", error);
  throw new Error("An unexpected error occurred");
}

export async function sendChatMessage(
  request: ChatRequest
): Promise<ChatResponse> {
  const token = getAuthToken();

  if (!token) {
    console.error("Chat API: No token found in localStorage.");
    throw new Error("Authentication token not found. Please log in.");
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

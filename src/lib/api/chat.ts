/**
 * t3-chat-frontend/lib/api/chat.ts
 *
 * API client for making authenticated requests to the chat endpoint.
 */
import axios from "axios";
import { ChatRequest, ChatResponse } from "@/types/api";
import { getAuthToken } from "./auth"; // Utility to get the JWT from localStorage

// Direct connection to backend API - bypassing Next.js proxy to preserve Authorization headers
const BASE_URL = "http://127.0.0.1:5000";

/**
 * Handles Axios API errors, extracting a meaningful error message.
 * @param error - The error object, expected to be an AxiosError.
 */
function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    // Check for specific backend error structure
    const serverError = error.response?.data;
    const errorMessage =
      serverError?.detail || error.message || "An unknown API error occurred";
    console.error("Chat API Error:", errorMessage, serverError);
    throw new Error(errorMessage);
  }
  console.error("An unexpected error occurred:", error);
  throw new Error("An unexpected error occurred");
}

/**
 * Sends a chat message and conversation history to the backend.
 * This is an authenticated request and requires a valid JWT.
 * @param request - The chat request payload containing the user's message and context.
 * @returns The AI's response and any source documents.
 */
export async function sendChatMessage(
  request: ChatRequest
): Promise<ChatResponse> {
  const token = getAuthToken();

  // Crucially, check if the user is authenticated before making the call.
  if (!token) {
    console.error("Chat API: No token found in localStorage.");
    // In a real app, this might trigger a redirect to the login page.
    throw new Error("Authentication token not found. Please log in.");
  }

  console.log("Chat API: Preparing to send request.");
  console.log("Chat API: Token found:", !!token);
  console.log("Chat API: Token snippet:", token.substring(0, 10) + "...");
  console.log("Chat API: Target URL:", `${BASE_URL}/v1/chat/`);

  // DIAGNOSTIC: Test if the token works for the known-good auth endpoint
  try {
    await axios.get(`${BASE_URL}/v1/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Chat API: Diagnostic /v1/auth/me check PASSED.");
  } catch (e) {
    console.error("Chat API: Diagnostic /v1/auth/me check FAILED.", e);
  }

  try {
    // Add trailing slash to avoid potential redirects that might strip headers
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

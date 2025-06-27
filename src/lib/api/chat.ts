/**
 * t3-chat-frontend/lib/api/chat.ts
 *
 * API client for making authenticated requests to the chat endpoint.
 */
import axios from 'axios';
import { ChatRequest, ChatResponse } from '@/types/api';
import { getAuthToken } from './auth'; // Utility to get the JWT from localStorage



// Create an Axios instance. We can reuse the one from auth.ts if we configure
// it globally, but creating it here is also fine for modularity.
const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL ??"",
});

/**
 * Handles Axios API errors, extracting a meaningful error message.
 * @param error - The error object, expected to be an AxiosError.
 */
function handleApiError(error: unknown): never {
    if (axios.isAxiosError(error)) {
        // Check for specific backend error structure
        const serverError = error.response?.data;
        const errorMessage = serverError?.detail || error.message || 'An unknown API error occurred';
        console.error('Chat API Error:', errorMessage, serverError);
        throw new Error(errorMessage);
    }
    console.error('An unexpected error occurred:', error);
    throw new Error('An unexpected error occurred');
}


/**
 * Sends a chat message and conversation history to the backend.
 * This is an authenticated request and requires a valid JWT.
 * @param request - The chat request payload containing the user's message and context.
 * @returns The AI's response and any source documents.
 */
export async function sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
    const token = getAuthToken();

    // Crucially, check if the user is authenticated before making the call.
    if (!token) {
        // In a real app, this might trigger a redirect to the login page.
        throw new Error('Authentication token not found. Please log in.');
    }

    try {
        const response = await apiClient.post<ChatResponse>('/v1/chat/', request, {
            headers: {
                'Content-Type': 'application/json',
                // Include the JWT in the Authorization header as a Bearer token
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}
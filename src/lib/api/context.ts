/**
 * t3-chat-frontend/lib/api/context.ts
 *
 * API client for managing user-specific context data.
 * This includes retrieving, updating, and deleting a user's context.
 * All requests are authenticated.
 */
import axios from 'axios';
import { getAuthToken } from './auth';
import {
    ContextResponse,
    DynamicContext
} from '@/types/api';

const baseURL= process.env.NEXT_PUBLIC_BACKEND_URL??"";
const apiClient = axios.create({
    baseURL:baseURL,
});

// Use an interceptor to automatically add the Authorization header
apiClient.interceptors.request.use(config => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

function handleApiError(error: unknown): never {
    if (axios.isAxiosError(error)) {
        const serverError = error.response?.data;
        const errorMessage = serverError?.detail || error.message || 'An unknown API error occurred';
        console.error('Context API Error:', errorMessage, serverError);
        throw new Error(errorMessage);
    }
    console.error('An unexpected error occurred:', error);
    throw new Error('An unexpected error occurred');
}


/**
 * Retrieves the context data for a specific user.
 * Corresponds to: GET /v1/context/{user_id}
 * @param userId - The ID of the user whose context is being retrieved.
 */
export async function getUserContext(userId: string): Promise<ContextResponse> {
    try {
        const response = await apiClient.get<ContextResponse>(`/v1/context/${userId}`);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}

/**
 * Creates or updates the context data for a specific user.
 * Corresponds to: PUT /v1/context/{user_id}
 * @param userId - The ID of the user whose context is being updated.
 * @param contextData - The dynamic context object to set.
 */
export async function updateUserContext(userId: string, contextData: DynamicContext): Promise<ContextResponse> {
    try {
        const response = await apiClient.put<ContextResponse>(`/v1/context/${userId}`, contextData);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}

/**
 * Deletes the context data for a specific user.
 * Corresponds to: DELETE /v1/context/{user_id}
 * @param userId - The ID of the user whose context will be deleted.
 */
export async function deleteUserContext(userId: string): Promise<void> {
    try {
        await apiClient.delete(`/v1/context/${userId}`);
    } catch (error) {
        handleApiError(error);
    }
}
/**
 * t3-chat-frontend/lib/api/auth.ts (Patched)
 *
 * API client for authentication, updated to match OpenAPI spec.
 * Uses the /v1/auth/login endpoint and adds /v1/auth/me.
 */
import axios from 'axios';
import {
    RegisterRequest,
    LoginRequest,
    Token,
    User,
} from '@/types/api';

const baseURL= process.env.NEXT_PUBLIC_BACKEND_URL??"";
const apiClient = axios.create({
    baseURL:baseURL,
});

const TOKEN_STORAGE_KEY = 'jwt_token';

function handleApiError(error: unknown): never {
    if (axios.isAxiosError(error)) {
        const serverError = error.response?.data;
        const errorMessage = serverError?.detail || error.message || 'An unknown API error occurred';
        console.error('Backend API Error:', errorMessage, serverError);
        throw new Error(errorMessage);
    }
    console.error('An unexpected error occurred:', error);
    throw new Error('An unexpected error occurred');
}

export async function registerUser(request: RegisterRequest): Promise<User> {
    try {
        const response = await apiClient.post<User>('/v1/auth/register', request);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}

/**
 * Logs in a user, stores the token, and returns the user's data.
 * @param request - The login credentials.
 * @returns The authenticated user's data.
 */
export async function loginUser(request: LoginRequest): Promise<User> {
    const formData = new URLSearchParams();
    formData.append('username', request.username);
    formData.append('password', request.password);

    try {
        // Step 1: Authenticate and get the token
        const response = await apiClient.post<Token>('/v1/auth/login', formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        const tokenData = response.data;

        // Step 2: Store the token in localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem(TOKEN_STORAGE_KEY, tokenData.access_token);
        }

        // Step 3: Fetch the current user's data with the new token
        const userData = await getCurrentUser();
        return userData;
    } catch (error) {
        // Clear token if any part of the process fails
        logoutUser();
        handleApiError(error);
    }
}

/**
 * Fetches the currently authenticated user's details.
 * @returns The User object.
 */
export async function getCurrentUser(): Promise<User> {
    const token = getAuthToken();
    if (!token) {
        throw new Error('No authentication token found.');
    }

    try {
        const response = await apiClient.get<User>('/v1/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        // If the token is invalid, log the user out
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            logoutUser();
        }
        handleApiError(error);
    }
}

export function logoutUser(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
}

export function getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(TOKEN_STORAGE_KEY);
    }
    return null;
}

import axios from 'axios';
import { getAuthToken } from './auth';
import {
    Persona,
    PersonaCreate,
    PersonaUpdate
} from '@/types/api';

const baseURL= process.env.NEXT_PUBLIC_BACKEND_URL??"";
const apiClient = axios.create({
    baseURL:baseURL,
});

// Use an interceptor to automatically add the Authorization header to all requests
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
        console.error('Persona API Error:', errorMessage, serverError);
        throw new Error(errorMessage);
    }
    console.error('An unexpected error occurred:', error);
    throw new Error('An unexpected error occurred');
}

/**
 * Retrieves a list of all available personas.
 * Corresponds to: GET /v1/persona/
 */
export async function getAllPersonas(): Promise<Persona[]> {
    try {
        const response = await apiClient.get<Persona[]>('/v1/persona/');
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}

/**
 * Creates a new persona.
 * Corresponds to: POST /v1/persona/
 * @param personaData - The data for the new persona.
 */
export async function createPersona(personaData: PersonaCreate): Promise<Persona> {
    try {
        const response = await apiClient.post<Persona>('/v1/persona/', personaData);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}

/**
 * Retrieves a single persona by its unique ID.
 * Corresponds to: GET /v1/persona/{persona_id}
 * @param personaId - The ID of the persona to retrieve.
 */
export async function getPersonaById(personaId: string): Promise<Persona> {
    try {
        const response = await apiClient.get<Persona>(`/v1/persona/${personaId}`);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}

/**
 * Updates an existing persona.
 * Corresponds to: PUT /v1/persona/{persona_id}
 * @param personaId - The ID of the persona to update.
 * @param personaData - The data to update the persona with.
 */
export async function updatePersona(personaId: string, personaData: PersonaUpdate): Promise<Persona> {
    try {
        const response = await apiClient.put<Persona>(`/v1/persona/${personaId}`, personaData);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}

/**
 * Deletes a persona by its unique ID.
 * Corresponds to: DELETE /v1/persona/{persona_id}
 * @param personaId - The ID of the persona to delete.
 */
export async function deletePersona(personaId: string): Promise<void> {
    try {
        await apiClient.delete(`/v1/persona/${personaId}`);
    } catch (error) {
        handleApiError(error);
    }
}
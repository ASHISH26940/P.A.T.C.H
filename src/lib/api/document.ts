import axios from 'axios';
import { getAuthToken } from './auth';
import {
    DocumentCollectionCreate,
    BackendDocument,
    DocumentsAddedResponse,
    DocumentQuery,
    DocumentQueryResult,
} from '@/types/api';


const baseURL= process.env.NEXT_PUBLIC_BACKEND_URL??"";
const apiClient = axios.create({
    baseURL:baseURL,
});

// A helper to add the auth token to requests
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
        console.error('Documents API Error:', errorMessage, serverError);
        throw new Error(errorMessage);
    }
    console.error('An unexpected error occurred:', error);
    throw new Error('An unexpected error occurred');
}

/**
 * Creates a new document collection.
 * @param collectionData - The data for the new collection.
 */
export async function createCollection(collectionData: DocumentCollectionCreate): Promise<any> {
    try {
        const response = await apiClient.post('/v1/documents/collections', collectionData);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}


/**
 * Deletes an entire document collection.
 * @param collectionName - The name of the collection to delete.
 */
export async function deleteCollection(collectionName: string): Promise<void> {
    try {
        await apiClient.delete(`/v1/documents/collections/${collectionName}`);
    } catch (error) {
        handleApiError(error);
    }
}

/**
 * Adds one or more documents to a specific collection.
 * @param collectionName - The name of the target collection.
 * @param documents - An array of documents to add.
 */
export async function addDocumentsToCollection(collectionName: string, documents: BackendDocument[]): Promise<DocumentsAddedResponse> {
    try {
        // The endpoint likely expects a specific payload structure, e.g., { documents: [...] }
        const response = await apiClient.post<DocumentsAddedResponse>(`/v1/documents/${collectionName}/documents`, { documents });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}

/**
 * Deletes specific documents from a collection based on their IDs.
 * @param collectionName - The name of the target collection.
 * @param documentIds - An array of document IDs to delete.
 */
export async function deleteDocumentsFromCollection(collectionName: string, documentIds: string[]): Promise<void> {
    try {
        await apiClient.delete(`/v1/documents/${collectionName}/documents`, {
            data: { document_ids: documentIds } // Send document IDs in the request body for a DELETE request
        });
    } catch (error) {
        handleApiError(error);
    }
}

/**
 * Queries a collection with a given text to find relevant documents.
 * @param collectionName - The name of the collection to query.
 * @param query - The query object containing the text and other parameters.
 */
export async function queryDocumentsInCollection(collectionName: string, query: DocumentQuery): Promise<DocumentQueryResult[]> {
    try {
        const response = await apiClient.post<DocumentQueryResult[]>(`/v1/documents/${collectionName}/query`, query);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}
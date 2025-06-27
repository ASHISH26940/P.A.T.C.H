/**
 * t3-chat-frontend/types/api.ts
 *
 * Fully synced and consolidated Backend API Type Definitions.
 * This file precisely mirrors the provided Pydantic models to ensure
 * perfect data contract alignment between frontend and backend.
 */

//================================
// Enums
//================================
export enum Role {
  User = 'user',
  Model = 'model',
  Assistant = 'assistant',
}

//================================
// Authentication & User Schemas
//================================

// Matches the User model in user.py
export interface User {
  id: number; // Correctly typed as number based on user.py
  username: string;
  email?: string;
}

export interface UserCreate {
  username: string;
  email?: string;
  password?: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

//================================
// Chat Schemas
//================================

/**
 * Represents a chat message specifically for the API payload, as defined in chat.py.
 * The backend only expects `role` and `content` for past messages.
 */
export interface ApiChatMessage {
    role: Role;
    content: string;
}

/**
 * Represents a rich chat message object for use in the frontend,
 * particularly for storing in IndexedDB. It contains more metadata.
 */
export interface BackendChatMessage {
  id?: number | string;
  role: Role;
  content: string;
  timestamp: string;
  userId: string; // The user ID is stored as a string in the DB
  conversationId?: string; // ID for grouping messages in a single chat
}

export interface ChatRequest {
  user_message: string;
  collection_name: string;
  user_id: string;
  past_messages?: ApiChatMessage[]; // Uses the new, correct type for the API
}

export interface ChatResponse {
  ai_response: string;
  source_documents?: DocumentQueryResult[];
  message_id: string;
}


//================================
// Document & Collection Schemas
//================================
export interface BackendDocument {
  id?: string;
  content: string;
  metadata: { [key: string]: any };
}

export interface DocumentCollectionCreate {
    name: string;
    metadata?: { [key: string]: any };
}

export interface DocumentQueryResult {
  document: BackendDocument;
  distance?: number;
}

export interface DocumentsAddedResponse {
    collection_name: string;
    added_count: number;
    ids: string[];
}

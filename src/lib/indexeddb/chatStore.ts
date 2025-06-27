/**
 * t3-chat-frontend/lib/indexeddb/chatStore.ts
 *
 * This version removes the rename functionality and only includes delete.
 */
import Dexie, { Table } from 'dexie';
import { BackendChatMessage } from '@/types/api';

// Interface for the conversation list in the sidebar
export interface Conversation {
    id: string;
    title: string;
    timestamp: string;
}

export class ChatDatabase extends Dexie {
  chatHistory!: Table<BackendChatMessage, number>;

  constructor() {
    super('t3ChatDB');
    this.version(3).stores({
      chatHistory: '++id, userId, conversationId, timestamp',
    });
  }
}

export const db = new ChatDatabase();

export async function addMessageToDB(message: BackendChatMessage): Promise<number> {
  try {
    const id = await db.chatHistory.add(message);
    return id;
  } catch (error) {
    console.error('Failed to add message to Dexie:', error);
    throw error;
  }
}

export async function getMessagesFromDB(userId: string, chatId: string): Promise<BackendChatMessage[]> {
  if (!userId || !chatId) {
    return [];
  }
  try {
    return await db.chatHistory
      .where({
        userId: userId,
        conversationId: chatId,
      })
      .sortBy('timestamp');
  } catch (error) {
    console.error(`Failed to get messages for chat ${chatId} from Dexie:`, error);
    throw error;
  }
}

export async function getConversationList(userId: string): Promise<Conversation[]> {
    if (!userId) return [];

    const allMessages = await db.chatHistory
        .where('userId')
        .equals(userId)
        .sortBy('timestamp');
    
    if (!allMessages.length) return [];

    const conversationMap = new Map<string, Conversation>();

    for (const message of allMessages) {
        if (message.conversationId) {
            if (!conversationMap.has(message.conversationId)) {
                conversationMap.set(message.conversationId, {
                    id: message.conversationId,
                    title: message.content,
                    timestamp: message.timestamp,
                });
            }
        }
    }
    return Array.from(conversationMap.values()).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

/**
 * Deletes all messages associated with a specific conversation.
 * @param userId - The ID of the user.
 * @param conversationId - The ID of the conversation to delete.
 */
export async function deleteConversation(userId: string, conversationId: string): Promise<void> {
    await db.chatHistory
        .where({ userId, conversationId })
        .delete();
    console.log(`Deleted conversation ${conversationId}`);
}


export async function clearHistoryFromDB(userId: string): Promise<void> {
  try {
    await db.chatHistory
      .where('userId')
      .equals(userId)
      .delete();
  } catch (error) {
    console.error(`Failed to clear history for user ${userId} from Dexie:`, error);
    throw error;
  }
}

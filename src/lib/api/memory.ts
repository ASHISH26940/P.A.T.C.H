import axios from "axios";
import { getAuthToken } from "./auth";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:5000";

function authHeaders() {
  const token = getAuthToken();
  if (!token) throw new Error("Not authenticated");
  return { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } };
}

export interface MemoryItem {
  id: string; user_id: string; memory_type: string; content: string;
  importance: number; created_at: string;
}

export interface SearchRequest { query: string; n_results?: number; memory_type?: string; }

const memoryUrl = (path: string) => `${BASE_URL}/v1/memory${path}`;

export async function createMemory(content: string, memoryType = "general", importance = 0.5): Promise<MemoryItem> {
  const res = await axios.post(memoryUrl("/memories"), { content, memory_type: memoryType, importance }, authHeaders());
  return res.data;
}

export async function searchMemories(req: SearchRequest): Promise<{ results: MemoryItem[] }> {
  const res = await axios.post(memoryUrl("/memories/search"), req, authHeaders());
  return res.data;
}

export async function getRecentMemories(limit = 10, memoryType?: string): Promise<MemoryItem[]> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (memoryType) params.set("memory_type", memoryType);
  const res = await axios.get(memoryUrl(`/memories/recent?${params}`), authHeaders());
  return res.data;
}

export async function getMemory(id: string): Promise<MemoryItem> {
  const res = await axios.get(memoryUrl(`/memories/${id}`), authHeaders());
  return res.data;
}

export async function deleteMemory(id: string): Promise<void> {
  await axios.delete(memoryUrl(`/memories/${id}`), authHeaders());
}

export interface MemoryLink {
  id: string; source_memory_id: string; target_memory_id: string;
  relationship: string; created_at: string;
}

export async function createLink(sourceId: string, targetId: string, relationship = "related_to"): Promise<MemoryLink> {
  const res = await axios.post(memoryUrl("/links"), { source_memory_id: sourceId, target_memory_id: targetId, relationship }, authHeaders());
  return res.data;
}

export async function getLinks(memoryId: string, relationship?: string): Promise<{ links: MemoryLink[] }> {
  const params = relationship ? `?relationship=${relationship}` : "";
  const res = await axios.get(memoryUrl(`/links/${memoryId}${params}`), authHeaders());
  return res.data;
}

export async function deleteLink(linkId: string): Promise<void> {
  await axios.delete(memoryUrl(`/links/${linkId}`), authHeaders());
}

export interface VideoIngestResult {
  video_title: string; channel?: string; duration?: number;
  subtitles_available: boolean; memories: { id: string; content: string; memory_type: string; importance: number }[];
}

export async function ingestVideo(url: string): Promise<VideoIngestResult> {
  const res = await axios.post(`${BASE_URL}/v1/video/ingest`, { url }, authHeaders());
  return res.data;
}

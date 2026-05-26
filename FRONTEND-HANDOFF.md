# P.A.T.C.H Frontend — Backend Handoff

> Backend lives at `~/code/patch/P.A.T.C.H-backend` on `http://localhost:5000` (Docker) or `http://localhost:8000` (dev). All routes prefixed with `/v1`.

---

## Auth

Register a user, then login to get a JWT. Send it as `Authorization: Bearer <token>` on all protected endpoints.

| Method | Route | Body | Response |
|--------|-------|------|----------|
| POST | `/v1/auth/register` | `{username, password, email?}` | `201` — user object |
| POST | `/v1/auth/login` | form fields `username`, `password` | `{access_token, token_type:"bearer"}` |
| GET | `/v1/auth/me` | — | `{id, username, email}` — current user |

**Auth flow**: `POST /v1/auth/login` → store `access_token` → send `Authorization: Bearer <token>` header on every subsequent request.

---

## Chat

Full conversational chat with memory — single endpoint. Sends message, gets response with grounding info.

| Method | Route | Body | Response |
|--------|-------|------|----------|
| POST | `/v1/chat/` | `{user_message, collection_name, user_id, past_messages?}` | `{ai_response, source_documents?, message_id}` |

**Notes**:
- `collection_name` is legacy (formerly ChromaDB) — pass any string like `"default"`.
- `user_id` is the authenticated username (match from `/v1/auth/me`).
- `past_messages` is optional — frontend can pass locally-cached history.
- Response `source_documents` contains relevant memories used for grounding.
- The backend auto-extracts 📝 memories from the AI's response (no extra call).

---

## Memory (Knowledge Base)

CRUD for individual memory items + semantic search.

| Method | Route | Body / Params | Response |
|--------|-------|---------------|----------|
| POST | `/v1/memory/memories` | `{content, memory_type?, importance?}` | `MemoryResponse` |
| POST | `/v1/memory/memories/search` | `{query, n_results?, memory_type?}` | `{results: [MemoryResponse]}` |
| GET | `/v1/memory/memories/recent` | query: `limit=10`, `memory_type?` | `[MemoryResponse]` |
| GET | `/v1/memory/memories/{id}` | path: memory UUID | `MemoryResponse` |
| DELETE | `/v1/memory/memories/{id}` | path: memory UUID | `204` |

`MemoryResponse` shape: `{id, user_id, memory_type, content, importance, created_at}`

**Search** does semantic (cosine similarity) + recency + importance ranking. Use it for the "ask my memory" feature.

---

## Memory Links (Knowledge Graph)

Connect memories with relationship labels.

| Method | Route | Body / Params | Response |
|--------|-------|---------------|----------|
| POST | `/v1/memory/links` | `{source_memory_id, target_memory_id, relationship?}` | `MemoryLinkResponse` |
| GET | `/v1/memory/links/{memory_id}` | query: `relationship?` | `{links: [MemoryLinkResponse]}` |
| DELETE | `/v1/memory/links/{link_id}` | path: link UUID | `204` |

`MemoryLinkResponse` shape: `{id, source_memory_id, target_memory_id, relationship, created_at}`

**Relationship examples**: `related_to`, `depends_on`, `contradicts`, `supports`, `example_of`. Free-text field — keep consistent.

---

## Video Ingestion

Extract memories from a YouTube video (metadata only — no download).

| Method | Route | Body | Response |
|--------|-------|------|----------|
| POST | `/v1/video/ingest` | `{url}` | `VideoIngestResponse` |

`VideoIngestResponse` shape: `{video_title, channel?, duration?, subtitles_available, memories: [{id, content, memory_type, importance}]}`

**Flow**: Submit YouTube URL → backend runs `yt-dlp --dump-json --skip-download` (metadata only) → Gemini extracts actionable insights → stored as memories. No video files, no subtitles download.

---

## Persona

Personas define the AI's character/role.

| Method | Route | Body / Params | Response |
|--------|-------|---------------|----------|
| POST | `/v1/persona/` | `{name, description?, traits?, goals?}` | `PersonaInDB` |
| GET | `/v1/persona/` | — | `[PersonaInDB]` |
| GET | `/v1/persona/{id}` | path: persona UUID | `PersonaInDB` |
| PUT | `/v1/persona/{id}` | `{name?, description?, traits?, goals?}` — partial update | `PersonaInDB` |
| DELETE | `/v1/persona/{id}` | path: persona UUID | `204` |

`PersonaInDB` shape: `{id, name, description, traits: [str], goals: [str]}`

---

## Context

Arbitrary key-value context per user (e.g., current project, preferences).

| Method | Route | Body / Params | Response |
|--------|-------|---------------|----------|
| PUT | `/v1/context/{user_id}` | `{context_data: {}}` — upsert | `ContextResponse` |
| GET | `/v1/context/{user_id}` | — | `ContextResponse` |
| DELETE | `/v1/context/{user_id}` | — | `204` |

`ContextResponse` shape: `{user_id, context_data: {}, updated_at}`

---

## Health

| Method | Route | Response |
|--------|-------|----------|
| GET | `/v1/health/` | `"Hello world"` (plain text) |

---

## Quick Reference

```
                    Auth needed?
POST /v1/auth/register    ✗
POST /v1/auth/login       ✗
GET  /v1/auth/me          ✓
POST /v1/chat/            ✓
POST /v1/memory/memories  ✓
POST /v1/memory/memories/search  ✓
GET  /v1/memory/memories/recent  ✓
GET  /v1/memory/memories/{id}    ✓
DELETE /v1/memory/memories/{id}  ✓
POST /v1/memory/links     ✓
GET  /v1/memory/links/{memory_id}  ✓
DELETE /v1/memory/links/{link_id}  ✓
POST /v1/video/ingest     ✓
POST /v1/persona/         ✓
GET  /v1/persona/         ✓
GET  /v1/persona/{id}     ✓
PUT  /v1/persona/{id}     ✓
DELETE /v1/persona/{id}   ✓
PUT  /v1/context/{user_id}  ✓
GET  /v1/context/{user_id}  ✓
DELETE /v1/context/{user_id} ✓
GET  /v1/health/          ✗
```

---

## What Frontend Currently Has

Check current frontend code at `~/code/patch/P.A.T.C.H/src/` for existing API calls and UI components. Likely needs wiring for:

1. **Video ingest** — URL input form → `POST /v1/video/ingest` → display extracted memories
2. **Knowledge graph** — visual graph view of memory links, ability to link/unlink memories
3. **Memory search** — search bar that does semantic search via `POST /v1/memory/memories/search`
4. **Auth** — register/login flow with JWT storage (probably already exists)

---

## Running the Backend Locally

```bash
# Option 1: Docker (full stack with Postgres)
cd ~/code/patch/P.A.T.C.H-backend && docker compose up --build

# Option 2: Dev mode (venv, needs local Postgres)
cd ~/code/patch/P.A.T.C.H-backend && source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

Swagger docs at `http://localhost:5000/docs` (Docker) or `http://localhost:8000/docs` (dev).

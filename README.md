# P.A.T.C.H

**Personal AI That Can Hear** — Full-stack creator memory platform with RAG, video ingestion, and knowledge graphs.

P.A.T.C.H is a vertical memory infrastructure for video creators. It ingests video metadata, extracts structured insights, stores them in a vector-backed knowledge graph, and makes everything recallable via chat. Built with the philosophy that **memory is table stakes — the differentiator is the creator workflow.**

---

## Features

- **Video Ingestion:** Paste a YouTube URL → LLM extracts insights (hooks, techniques, stats, tactics) → stored as structured memories
- **Memory System:** pgvector-powered semantic search with time-weighted re-ranking across all memories
- **Knowledge Graph:** Link related memories with typed relationships for associative recall
- **RAG Chat:** Chat with your memory — every response is grounded in your extracted knowledge
- **Persona System:** Create personas with traits/goals; switch personas per conversation
- **Per-chat Personas:** Each chat retains its own persona selection
- **Derived Personas:** AI suggests personas based on chat history patterns
- **File Attachments:** Drop text files into chat for inline analysis
- **Auto-extraction:** Inline 📝 markers let the LLM self-curate notable information without extra API calls
- **Post-session Learning:** Every chat generates Q&A pairs and extractions — the system improves over time
- **Dark UI:** Midnight Velvet theme — glassmorphism cards, amber accents, deep grayscale surfaces

---

## Tech Stack

| Layer | Tech | Purpose |
|-------|------|---------|
| UI | Next.js 16 / React 19 / TypeScript / Tailwind v4 | Chat interface, memory browser, video ingestion |
| API | FastAPI / Python 3.12 | Async REST endpoints |
| LLM | Gemma 4 26B (Google AI Studio) | Chat model |
| Embeddings | gemini-embedding-001 (3072d) | Semantic search |
| Vector DB | pgvector (in PostgreSQL) | Cosine similarity search |
| Persistence | PostgreSQL 16 | Users, personas, memories, chat history, context |
| Auth | JWT (bcrypt hashing) | User authentication |

---

## Architecture

```
Browser (Next.js 16) ──HTTP/JWT──> FastAPI Backend
                                       │
                            ┌──────────┼──────────┐
                            │          │          │
                        PostgreSQL   Gemini     Gemma 4
                       (pgvector)  Embedding    26B LLM
                        memories    Service    Chat Model
                        personas
                        chat_history
                        contexts
```

**Before (5 services):** PostgreSQL + Redis + ChromaDB + Caddy + Backend  
**After (2 services):** PostgreSQL + Backend

The backend handles everything: authentication, chat with RAG, memory CRUD, video ingestion, persona management, context management, and vector search — all against a single PostgreSQL instance with pgvector.

---

## Setup

### Prerequisites

- Node.js 20+
- Python 3.12+
- PostgreSQL 16+ with pgvector extension
- Google AI Studio API key (for Gemma 4)
- Google Gemini API key (for embeddings)

### Frontend

```bash
git clone https://github.com/ashish26940/p.a.t.c.h.git
cd p.a.t.c.h
npm install
```

Create `.env.local`:

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8001
```

```bash
npm run dev
```

### Backend

The backend lives in a separate repository. To run locally:

```bash
git clone <backend-repo>
cd <backend-dir>
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
```

Create `.env`:

```
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/patch
GEMINI_API_KEY=<your-gemini-api-key>
GOOGLE_API_KEY=<your-google-ai-studio-key>
```

```bash
uvicorn app.main:app --reload --port 8001
```

---

## API Overview

| Group | Auth | Endpoints |
|-------|------|-----------|
| Health | No | `GET /v1/health` |
| Auth | No/Yes | `POST /register`, `POST /login`, `GET /me` |
| Persona | Yes | Full CRUD `/v1/persona`, `POST /derive`, `POST /save-derived` |
| Context | Yes | `GET/PUT/DELETE /v1/context/{user_id}` |
| Documents | Yes | CRUD collections & docs `/v1/documents/*` |
| Chat | Yes | `POST /v1/chat/`, `GET /v1/chat/history` |
| Memories | Yes | `POST/GET/DELETE /v1/memory/*` |
| Memory Links | Yes | `POST/GET/DELETE /v1/memory/links` |
| Video | Yes | `POST /v1/video/ingest` |

---

## Deployment

Deployed on Render with a `render.yaml` blueprint:

- **Web Service:** FastAPI (gunicorn, 1 worker for 512MB free tier)
- **PostgreSQL:** Managed Postgres 16 with pgvector extension
- **Env vars:** `DATABASE_URL`, `GEMINI_API_KEY`, `GOOGLE_API_KEY`, `JWT_SECRET`

No Redis. No ChromaDB. No Caddy. Two services, zero waste.

---

## Market Position

P.A.T.C.H fills a gap no existing product owns:

1. **Video-native** content understanding — not just text, but extracted creator insights
2. **Creator-vertical** workflows — hook analysis, retention benchmarks, technique tracking
3. **Outcome tracking** — tried X → got Y, linked across sessions

Cross-session memory is table stakes (ChatGPT, Claude, Mem0, etc.). The differentiator is **vertical: memory for video creators.**


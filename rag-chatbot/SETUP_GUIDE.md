# 🤖 RAG Chatbot — Complete Setup Guide
## Ollama + ChromaDB + FastAPI + Next.js Integration

---

## ⚙️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    USER / RECRUITER                      │
└────────────────────────┬────────────────────────────────┘
                         │ question
                         ▼
┌─────────────────────────────────────────────────────────┐
│              NEXT.JS FRONTEND (Port 3000)                │
│          ChatBot.tsx — Glassmorphism UI                  │
└────────────────────────┬────────────────────────────────┘
                         │ POST /api/chat
                         ▼
┌─────────────────────────────────────────────────────────┐
│           FASTAPI BACKEND (Port 8001)                    │
│              api/server.py                               │
└────────────┬────────────────────────┬───────────────────┘
             │                        │
             ▼                        ▼
┌────────────────────┐   ┌────────────────────────────────┐
│   CHROMADB         │   │   OLLAMA (Local LLM)            │
│   Vector Store     │   │   llama3 / mistral              │
│   Embeddings       │   │   nomic-embed-text              │
│   Similarity Search│   │   Generation                    │
└────────────────────┘   └────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────────────┐
│         KNOWLEDGE BASE (data/knowledge_base.py)         │
│   22 structured chunks: skills, projects, experience,   │
│   certifications, education, role fit, contact          │
└────────────────────────────────────────────────────────┘
```

---

## 🚀 Step 1 — Install Ollama

### macOS
```bash
brew install ollama
```

### Linux
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

### Windows
Download from: https://ollama.ai/download

### Start Ollama service
```bash
ollama serve
```

---

## 🧠 Step 2 — Pull Required Models

```bash
# Primary LLM (choose one based on your RAM)
ollama pull llama3          # Best quality — needs 8GB+ RAM
ollama pull mistral         # Fast & light — works with 4GB RAM
ollama pull llama3.1        # Latest Llama — needs 8GB+ RAM
ollama pull phi3            # Very fast — works with 4GB RAM

# Embedding model (required for RAG)
ollama pull nomic-embed-text

# Verify models are available
ollama list
```

**RAM Guide:**
| Model | RAM Required | Speed |
|---|---|---|
| phi3 | 4 GB | Fast |
| mistral | 4-6 GB | Fast |
| llama3 | 8 GB | Good |
| llama3.1 | 8 GB | Best |

---

## 📦 Step 3 — Install Python Dependencies

```bash
cd rag-chatbot/

# Create virtual environment
python3 -m venv venv
source venv/bin/activate    # macOS/Linux
# OR: venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt
```

---

## ⚙️ Step 4 — Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
# Choose your model (must match what you pulled)
OLLAMA_MODEL=llama3              # or mistral, phi3

# Embedding model
OLLAMA_EMBED_MODEL=nomic-embed-text

# These defaults work fine:
CHROMA_PERSIST_DIR=./chroma_db
RETRIEVAL_TOP_K=6
RETRIEVAL_MIN_SCORE=0.25
OLLAMA_TEMPERATURE=0.1           # Low = factual
```

---

## 🗄️ Step 5 — Index the Knowledge Base

The knowledge base is auto-indexed on first startup, but you can pre-index:

```bash
python -c "
from rag.pipeline import RAGPipeline
rag = RAGPipeline()
print(f'Indexed {rag.vector_store.collection.count()} chunks')
"
```

Expected output:
```
✅ Ollama embed model ready: nomic-embed-text
⚙️  Indexing 22 knowledge chunks...
✅ Indexed 22 chunks successfully
Indexed 22 chunks
```

---

## 🚀 Step 6 — Start the Backend Server

```bash
# With virtual environment activated
python main.py
```

Expected output:
```
============================================================
🤖 Anurag Swain — Portfolio RAG Chatbot API
============================================================
✅ Directories ready
✅ Ollama models ready: llama3, nomic-embed-text
🚀 Starting server at http://0.0.0.0:8001
📚 Docs: http://localhost:8001/docs
```

---

## 🌐 Step 7 — Configure Next.js Frontend

In your Next.js project `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8001
```

Replace your `src/components/ai/ChatBot.tsx` with the new `ChatBot.tsx` from this package.

---

## ✅ Step 8 — Test the System

### Health check
```bash
curl http://localhost:8001/api/health
```
Expected:
```json
{
  "status": "healthy",
  "ollama": "connected",
  "chromadb": "connected",
  "indexed_chunks": 22,
  "model": "llama3"
}
```

### Test chat
```bash
curl -X POST http://localhost:8001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What are Anurag strongest skills?"}'
```

### Interactive API docs
Open: http://localhost:8001/docs

---

## 🔧 Troubleshooting

### Ollama not starting
```bash
# Check if running
curl http://localhost:11434/api/tags

# Restart
pkill ollama && ollama serve
```

### Model not found
```bash
# List available models
ollama list

# Pull if missing
ollama pull llama3
ollama pull nomic-embed-text
```

### ChromaDB errors
```bash
# Reset the vector store
rm -rf chroma_db/
python main.py  # Auto re-indexes on startup
```

### Slow responses
```bash
# Switch to faster model
# In .env:
OLLAMA_MODEL=mistral        # or phi3 for fastest
OLLAMA_TEMPERATURE=0.1
OLLAMA_NUM_CTX=2048         # Reduce context window
```

### Python package conflicts
```bash
pip install --upgrade chromadb sentence-transformers
```

---

## 📊 RAG Pipeline Details

### Knowledge chunks (22 total)
| Category | Chunks | Topics |
|---|---|---|
| experience | 8 | 5 internships × 1-2 chunks each |
| skills | 5 | programming, web, AI/ML/DL, data science, DB/cloud |
| project | 5 | all GitHub projects |
| certifications | 1 | all 7 certs |
| education | 2 | B.Tech, school |
| identity | 2 | personal info, headline |
| github | 1 | all repos and stats |
| value_proposition | 1 | role fit analysis |
| personal | 1 | hobbies, languages |

### Retrieval flow
1. Query → classify category (skills/project/experience/etc.)
2. Embed query with `nomic-embed-text`
3. ChromaDB cosine similarity search (top-6 chunks)
4. Filter by `MIN_SCORE=0.25` threshold
5. Build context prompt → send to Ollama `llama3`
6. Return structured response with sources + confidence score

---

## 🔁 Adding New Knowledge

To update the chatbot with new information:

1. Edit `data/knowledge_base.py` — add new chunk:
```python
{
    "id": "new-unique-id",
    "category": "skills",  # or experience, project, etc.
    "topic": "new_topic",
    "content": "New information here...",
    "keywords": ["keyword1", "keyword2"],
}
```

2. Trigger reindex:
```bash
curl -X POST "http://localhost:8001/api/reindex?secret=portfolio-reindex-2025"
```

---

## 🚀 Production Deployment

### Docker (recommended)
```bash
# Build
docker build -t anurag-chatbot .

# Run (requires Ollama running on host)
docker run -p 8001:8001 \
  -e OLLAMA_BASE_URL=http://host.docker.internal:11434 \
  -v ./chroma_db:/app/chroma_db \
  anurag-chatbot
```

### Environment: VPS / Railway / Render
1. Deploy FastAPI backend to any Python-compatible host
2. For Ollama: use a GPU-enabled server OR switch to OpenAI fallback
3. Set `OPENAI_API_KEY` as fallback if no local Ollama

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/chat` | Send message, get RAG response |
| `GET` | `/api/chat/history/{id}` | Get session history |
| `DELETE` | `/api/chat/history/{id}` | Clear session |
| `GET` | `/api/chat/suggestions` | Get suggested questions |
| `GET` | `/api/health` | System health check |
| `GET` | `/api/stats` | Pipeline statistics |
| `POST` | `/api/reindex` | Rebuild vector index |

### POST /api/chat — Request body
```json
{
  "message": "What are his strongest AI skills?",
  "session_id": "optional-uuid-for-history",
  "role_context": "AI Engineer",
  "top_k": 6
}
```

### POST /api/chat — Response
```json
{
  "reply": "Anurag's strongest AI skills include...",
  "session_id": "uuid-v4",
  "sources": [
    {"category": "skills", "topic": "ai_ml_dl_skills", "score": 0.89},
    {"category": "experience", "topic": "microgenesis_internship", "score": 0.76}
  ],
  "confidence": 0.82,
  "cached": false,
  "timestamp": "2025-08-01T12:00:00"
}
```

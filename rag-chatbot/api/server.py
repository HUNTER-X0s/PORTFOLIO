"""
api/server.py
FastAPI server for the RAG chatbot backend.
Endpoints: POST /api/chat, GET /api/chat/history, GET /api/health, POST /api/reindex
"""

import os
import uuid
import logging
import asyncio
from datetime import datetime
from typing import Optional
from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel, Field
import diskcache
from dotenv import load_dotenv

load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("chatbot-api")

import threading

# ── Lazy-load RAG pipeline (heavy initialization) ─────────────
_rag_pipeline = None
_rag_lock = threading.Lock()

def get_rag():
    global _rag_pipeline
    with _rag_lock:
        if _rag_pipeline is None:
            from rag.pipeline import RAGPipeline
            logger.info("⚙️  Initializing RAG pipeline...")
            _rag_pipeline = RAGPipeline()
            logger.info("✅ RAG pipeline ready")
        return _rag_pipeline

# ── In-memory session store ───────────────────────────────────
Path(os.getenv("CACHE_DIR", "./cache")).mkdir(parents=True, exist_ok=True)
session_store = diskcache.Cache(os.path.join(os.getenv("CACHE_DIR", "./cache"), "sessions"))

# ── Lifespan ──────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 Starting RAG Chatbot API...")
    # Warm up pipeline in background
    asyncio.create_task(asyncio.to_thread(get_rag))
    yield
    logger.info("👋 Shutting down...")

# ── App ───────────────────────────────────────────────────────
app = FastAPI(
    title="Anurag Swain — Portfolio AI Chatbot API",
    description="RAG-powered chatbot answering questions about Anurag's skills, projects, and experience",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
allowed_origins_raw = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,https://anurag07.vercel.app"
)
allowed_origins = [o.strip() for o in allowed_origins_raw.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Pydantic models ───────────────────────────────────────────
class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000, description="User query")
    session_id: Optional[str] = Field(None, description="Conversation session ID")
    role_context: Optional[str] = Field("", description="Role the recruiter is hiring for")
    top_k: Optional[int] = Field(6, ge=1, le=12, description="Number of context chunks to retrieve")
    stream: Optional[bool] = Field(False, description="Whether to stream the response")

class ChatMessage(BaseModel):
    role: str
    content: str
    timestamp: str

class ChatResponse(BaseModel):
    reply: str
    session_id: str
    sources: list[dict]
    confidence: float
    cached: bool
    timestamp: str

class HistoryResponse(BaseModel):
    session_id: str
    messages: list[ChatMessage]
    total: int

class HealthResponse(BaseModel):
    status: str
    ollama: str
    chromadb: str
    indexed_chunks: int
    model: str

# ── Suggested questions ───────────────────────────────────────
SUGGESTED_QUESTIONS = [
    "What are Anurag's strongest technical skills?",
    "Explain his best project in detail",
    "What role is he best suited for?",
    "Summarize his internship experience",
    "What AI/ML projects has he built?",
    "Is he available for full-time roles?",
    "What deep learning experience does he have?",
    "Tell me about his GitHub contributions",
]

# ── Rate limiting (simple in-memory) ─────────────────────────
from collections import defaultdict
import time

request_counts: dict = defaultdict(list)

def check_rate_limit(ip: str, max_per_minute: int = 20) -> bool:
    now = time.time()
    minute_ago = now - 60
    request_counts[ip] = [t for t in request_counts[ip] if t > minute_ago]
    if len(request_counts[ip]) >= max_per_minute:
        return False
    request_counts[ip].append(now)
    return True

# ══════════════════════════════════════════════════════════════
# ENDPOINTS
# ══════════════════════════════════════════════════════════════

@app.get("/", include_in_schema=False)
async def root():
    return {"message": "Anurag Swain Portfolio AI — RAG Chatbot API v1.0", "docs": "/docs"}


@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint — verifies Ollama, ChromaDB connectivity."""
    try:
        rag = get_rag()
        chunk_count = rag.vector_store.collection.count()
        ollama_status = "connected" if rag.embedder._check_ollama() else "fallback (sentence-transformers)"
        return HealthResponse(
            status="healthy",
            ollama=ollama_status,
            chromadb="connected",
            indexed_chunks=chunk_count,
            model=os.getenv("OLLAMA_MODEL", "llama3"),
        )
    except Exception as e:
        return JSONResponse(
            status_code=503,
            content={"status": "degraded", "error": str(e)},
        )


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: Request, body: ChatRequest):
    """
    Main chat endpoint.
    - Retrieves relevant context from ChromaDB
    - Generates response via Ollama LLM
    - Maintains session-based conversation history
    """
    # Rate limit check
    client_ip = request.client.host if request.client else "unknown"
    if not check_rate_limit(client_ip):
        raise HTTPException(status_code=429, detail="Too many requests. Please slow down.")

    # Validate message
    message = body.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    # Session management
    session_id = body.session_id or str(uuid.uuid4())

    # Get or init session history
    history: list[dict] = session_store.get(session_id, [])

    try:
        rag = get_rag()

        if body.stream:
            async def generate_stream():
                full_reply = ""
                # Get the synchronous generator from the thread pool (since answer_stream does I/O)
                # To avoid blocking the event loop while yielding, we can run the chunks in a thread.
                # Actually, RAGPipeline.answer_stream is a generator. We need to iterate it.
                import json
                gen = rag.answer_stream(
                    query=message,
                    history=history,
                    role_context=body.role_context or "",
                    top_k=body.top_k or 6,
                    use_cache=len(history) == 0,
                )
                
                # Iterate the generator in a thread-safe way, or just iterate it (it blocks during LLM generation).
                # Since Ollama client.chat(stream=True) uses requests which blocks, yielding here blocks the event loop.
                # In FastAPI, StreamingResponse runs in a thread pool if it's a sync generator!
                pass

            def sync_generate_stream():
                full_reply = ""
                gen = rag.answer_stream(
                    query=message,
                    history=history,
                    role_context=body.role_context or "",
                    top_k=body.top_k or 6,
                    use_cache=len(history) == 0,
                )
                import json
                for chunk in gen:
                    # we must capture the full text to save history
                    if chunk.startswith("data: "):
                        try:
                            data = json.loads(chunk[6:])
                            if "text" in data:
                                full_reply += data["text"]
                        except:
                            pass
                    yield chunk
                
                # Update history after stream finishes
                history.append({"role": "user", "content": message})
                history.append({"role": "assistant", "content": full_reply})
                if len(history) > 20:
                    del history[:-20]
                session_store.set(session_id, history, expire=3600)

            return StreamingResponse(sync_generate_stream(), media_type="text/event-stream")

        # Generate answer (non-streaming)
        result = await asyncio.to_thread(
            rag.answer,
            query=message,
            history=history,
            role_context=body.role_context or "",
            top_k=body.top_k or 6,
            use_cache=len(history) == 0,  # cache only first messages
        )

        # Update session history
        history.append({"role": "user", "content": message})
        history.append({"role": "assistant", "content": result["reply"]})

        # Keep last 20 messages per session
        if len(history) > 20:
            history = history[-20:]

        session_store.set(session_id, history, expire=3600)  # 1h session TTL

        return ChatResponse(
            reply=result["reply"],
            session_id=session_id,
            sources=result.get("sources", []),
            confidence=result.get("confidence", 0.0),
            cached=result.get("cached", False),
            timestamp=datetime.utcnow().isoformat(),
        )

    except Exception as e:
        logger.error(f"Chat error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")



@app.get("/api/chat/history/{session_id}", response_model=HistoryResponse)
async def get_history(session_id: str):
    """Retrieve conversation history for a session."""
    history: list = session_store.get(session_id, [])
    messages = [
        ChatMessage(role=m["role"], content=m["content"], timestamp="")
        for m in history
    ]
    return HistoryResponse(
        session_id=session_id,
        messages=messages,
        total=len(messages),
    )


@app.delete("/api/chat/history/{session_id}")
async def clear_history(session_id: str):
    """Clear conversation history for a session."""
    session_store.delete(session_id)
    return {"message": "Session cleared", "session_id": session_id}


@app.get("/api/chat/suggestions")
async def get_suggestions():
    """Return suggested questions for the chatbot UI."""
    return {"suggestions": SUGGESTED_QUESTIONS}


@app.post("/api/reindex")
async def reindex(background_tasks: BackgroundTasks, secret: str = ""):
    """Trigger a full reindex of the knowledge base (admin only)."""
    expected = os.getenv("REINDEX_SECRET", "portfolio-reindex-2025")
    if secret != expected:
        raise HTTPException(status_code=403, detail="Invalid secret")

    def do_reindex():
        try:
            rag = get_rag()
            rag.reindex()
            logger.info("✅ Reindex completed")
        except Exception as e:
            logger.error(f"Reindex failed: {e}")

    background_tasks.add_task(do_reindex)
    return {"message": "Reindex started in background"}


@app.get("/api/stats")
async def get_stats():
    """Get pipeline statistics."""
    try:
        rag = get_rag()
        collection_name = os.getenv("CHROMA_COLLECTION", "anurag_portfolio")
        from data.knowledge_base import KNOWLEDGE_CHUNKS
        return {
            "collection": collection_name,
            "indexed_chunks": rag.vector_store.collection.count(),
            "total_knowledge_chunks": len(KNOWLEDGE_CHUNKS),
            "model": os.getenv("GROQ_MODEL", "llama-3.1-8b-instant"),
            "embed_model": os.getenv("OLLAMA_EMBED_MODEL", "nomic-embed-text"),
            "top_k": int(os.getenv("RETRIEVAL_TOP_K", "6")),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Run ───────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "api.server:app",
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", "8001")),
        reload=os.getenv("ENV", "development") == "development",
        log_level="info",
    )

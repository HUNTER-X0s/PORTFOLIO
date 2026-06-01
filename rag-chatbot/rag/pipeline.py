"""
rag/pipeline.py
Complete RAG pipeline: chunking → embedding → ChromaDB storage → retrieval
Uses Ollama for embeddings + generation, with sentence-transformers fallback.
"""

import os
import json
import hashlib
import logging
import re
from typing import Optional
from pathlib import Path

import chromadb
from chromadb.config import Settings
from chromadb.utils.embedding_functions import DefaultEmbeddingFunction
import ollama
import diskcache

from data.knowledge_base import KNOWLEDGE_CHUNKS

logger = logging.getLogger(__name__)

# ── Config ────────────────────────────────────────────────────
CHROMA_DIR      = os.getenv("CHROMA_PERSIST_DIR", "./chroma_db")
COLLECTION_NAME = os.getenv("CHROMA_COLLECTION", "anurag_portfolio")
TOP_K           = int(os.getenv("RETRIEVAL_TOP_K", "6"))
MIN_SCORE       = float(os.getenv("RETRIEVAL_MIN_SCORE", "0.25"))
CACHE_DIR       = os.getenv("CACHE_DIR", "./cache")
EMBED_MODEL     = os.getenv("EMBED_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
OLLAMA_URL      = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_EMBED    = os.getenv("OLLAMA_EMBED_MODEL", "nomic-embed-text")

# ── Embedding provider ────────────────────────────────────────
class EmbeddingProvider:
    """Tries Ollama nomic-embed-text first; falls back to sentence-transformers."""

    def __init__(self):
        self._default_ef = None
        self._ollama_ok: Optional[bool] = None
        self._cache = diskcache.Cache(Path(CACHE_DIR) / "embeddings")
        self._active_backend: tuple[str, str] | None = None

    def _check_ollama(self) -> bool:
        # Only cache successful connections; always retry on failure
        if self._ollama_ok is True:
            return True
        try:
            client = ollama.Client(host=OLLAMA_URL)
            client.list()
            self._ollama_ok = True
            logger.info(f"✅ Ollama embed model ready: {OLLAMA_EMBED}")
        except Exception as e:
            logger.warning(f"⚠️  Ollama not available ({e}), using sentence-transformers")
            self._ollama_ok = False
        return self._ollama_ok

    def _st_embed(self, texts: list[str]) -> list[list[float]]:
        if self._default_ef is None:
            logger.info(f"Loading Chroma DefaultEmbeddingFunction (ONNX)")
            self._default_ef = DefaultEmbeddingFunction()
        return self._default_ef(texts)

    def _ollama_embed(self, texts: list[str]) -> list[list[float]]:
        client = ollama.Client(host=OLLAMA_URL)
        results = []
        for text in texts:
            resp = client.embeddings(model=OLLAMA_EMBED, prompt=text)
            results.append(resp["embedding"])
        return results

    def _select_backend(self) -> tuple[str, str]:
        # Prefer sentence-transformers to avoid Ollama model swapping (VRAM thrashing)
        # which causes massive latency on local machines with limited VRAM.
        if os.getenv("USE_OLLAMA_EMBED", "false").lower() == "true":
            if self._check_ollama():
                return ("ollama", OLLAMA_EMBED)
        return ("sentence-transformers", EMBED_MODEL)

    def _cache_key(self, text: str, backend: str, model: str) -> str:
        raw = f"{backend}:{model}:{text}"
        return hashlib.md5(raw.encode()).hexdigest()

    @property
    def active_backend(self) -> str:
        if self._active_backend is None:
            return "unknown"
        backend, model = self._active_backend
        return f"{backend}:{model}"

    def embed(self, texts: list[str]) -> list[list[float]]:
        """Embed list of texts, using cache where available."""
        backend, model = self._select_backend()
        self._active_backend = (backend, model)

        results = [None] * len(texts)
        uncached_indices = []
        uncached_texts = []

        for i, text in enumerate(texts):
            key = self._cache_key(text, backend, model)
            cached = self._cache.get(key)
            if cached is not None:
                results[i] = cached
            else:
                uncached_indices.append(i)
                uncached_texts.append(text)

        if uncached_texts:
            try:
                if backend == "ollama":
                    embeddings = self._ollama_embed(uncached_texts)
                else:
                    embeddings = self._st_embed(uncached_texts)
            except Exception as e:
                logger.warning(f"Ollama embed failed ({e}), falling back to sentence-transformers")
                self._ollama_ok = False
                backend, model = ("sentence-transformers", EMBED_MODEL)
                self._active_backend = (backend, model)
                embeddings = self._st_embed(uncached_texts)

            for idx, emb in zip(uncached_indices, embeddings):
                text = texts[idx]
                key = self._cache_key(text, backend, model)
                self._cache.set(key, emb, expire=86400)  # 24h cache
                results[idx] = emb

        return results

    def embed_single(self, text: str) -> list[float]:
        return self.embed([text])[0]


# ── ChromaDB manager ──────────────────────────────────────────
class VectorStore:
    def __init__(self, embedder: EmbeddingProvider):
        Path(CHROMA_DIR).mkdir(parents=True, exist_ok=True)
        self.client = chromadb.PersistentClient(
            path=CHROMA_DIR,
            settings=Settings(anonymized_telemetry=False),
        )
        self.embedder = embedder
        self.collection = self._get_or_create_collection()

    def _collection_metadata(self, embedding_dimension: int | None = None) -> dict:
        metadata = {"hnsw:space": "cosine"}
        if embedding_dimension is not None:
            metadata["embedding_dimension"] = embedding_dimension
            metadata["embedding_backend"] = self.embedder.active_backend
        return metadata

    def _get_or_create_collection(self, embedding_dimension: int | None = None):
        try:
            col = self.client.get_collection(COLLECTION_NAME)
            logger.info(f"📚 Loaded existing ChromaDB collection: {COLLECTION_NAME} ({col.count()} docs)")
            return col
        except Exception:
            logger.info(f"📚 Creating new ChromaDB collection: {COLLECTION_NAME}")
            return self.client.create_collection(
                name=COLLECTION_NAME,
                metadata=self._collection_metadata(embedding_dimension),
            )

    def _reset_collection(self, embedding_dimension: int):
        try:
            self.client.delete_collection(COLLECTION_NAME)
        except Exception as e:
            logger.warning(f"Could not delete existing ChromaDB collection: {e}")
        self.collection = self.client.create_collection(
            name=COLLECTION_NAME,
            metadata=self._collection_metadata(embedding_dimension),
        )

    def _collection_matches_embedding(self, sample_embedding: list[float]) -> bool:
        existing_count = self.collection.count()
        if existing_count == 0:
            return True

        expected_dim = len(sample_embedding)
        metadata = self.collection.metadata or {}
        stored_dim = metadata.get("embedding_dimension")
        if stored_dim is not None:
            try:
                if int(stored_dim) != expected_dim:
                    logger.warning(
                        "ChromaDB embedding dimension mismatch: collection=%s active=%s",
                        stored_dim,
                        expected_dim,
                    )
                    return False
            except (TypeError, ValueError):
                pass

        try:
            self.collection.query(
                query_embeddings=[sample_embedding],
                n_results=1,
                include=["distances"],
            )
            return True
        except Exception as e:
            if "dimension" in str(e).lower():
                logger.warning(f"ChromaDB collection uses a different embedding dimension: {e}")
                return False
            raise

    def index_knowledge_base(self, force: bool = False):
        """Index all knowledge chunks into ChromaDB."""
        sample_text = KNOWLEDGE_CHUNKS[0]["content"].strip()
        sample_embedding = self.embedder.embed_single(sample_text)
        embedding_dimension = len(sample_embedding)

        existing_count = self.collection.count()
        if force or not self._collection_matches_embedding(sample_embedding):
            logger.info("🔄 Rebuilding ChromaDB collection for the active embedding model...")
            self._reset_collection(embedding_dimension)
            existing_count = 0

        if existing_count >= len(KNOWLEDGE_CHUNKS) and not force:
            logger.info(f"✅ Knowledge base already indexed ({existing_count} chunks). Skipping.")
            return

        logger.info(f"⚙️  Indexing {len(KNOWLEDGE_CHUNKS)} knowledge chunks...")

        # Clear existing if rebuilding
        if force and existing_count > 0:
            self._reset_collection(embedding_dimension)

        ids, documents, metadatas, embeddings_list = [], [], [], []

        for chunk in KNOWLEDGE_CHUNKS:
            doc_text = chunk["content"].strip()
            # Enhanced document: prepend category and topic for better retrieval
            enhanced = f"[{chunk['category'].upper()}] [{chunk['topic']}]\n{doc_text}"

            ids.append(chunk["id"])
            documents.append(enhanced)
            metadatas.append({
                "id": chunk["id"],
                "category": chunk["category"],
                "topic": chunk["topic"],
                "keywords": ",".join(chunk.get("keywords", [])),
            })

        # Batch embed
        raw_texts = [c["content"].strip() for c in KNOWLEDGE_CHUNKS]
        embeddings_list = self.embedder.embed(raw_texts)

        # Upsert in batches of 50
        batch_size = 50
        for i in range(0, len(ids), batch_size):
            self.collection.upsert(
                ids=ids[i:i+batch_size],
                documents=documents[i:i+batch_size],
                metadatas=metadatas[i:i+batch_size],
                embeddings=embeddings_list[i:i+batch_size],
            )

        logger.info(f"✅ Indexed {len(ids)} chunks successfully")

    def retrieve(
        self,
        query: str,
        top_k: int = TOP_K,
        category_filter: Optional[str] = None,
    ) -> list[dict]:
        """Retrieve top-K relevant chunks for a query."""
        query_embedding = self.embedder.embed_single(query)

        where_filter = {"category": category_filter} if category_filter else None

        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
            where=where_filter,
            include=["documents", "metadatas", "distances"],
        )

        chunks = []
        if not results or not results["documents"]:
            return chunks

        for doc, meta, dist in zip(
            results["documents"][0],
            results["metadatas"][0],
            results["distances"][0],
        ):
            similarity = 1.0 - dist  # cosine distance → similarity
            if similarity >= MIN_SCORE:
                chunks.append({
                    "content": doc,
                    "category": meta.get("category", ""),
                    "topic": meta.get("topic", ""),
                    "similarity": round(similarity, 4),
                })

        # Sort by similarity (already sorted by ChromaDB, but ensure)
        chunks.sort(key=lambda x: x["similarity"], reverse=True)
        return chunks


# ── RAG pipeline ──────────────────────────────────────────────
class RAGPipeline:
    """
    Full RAG pipeline:
    query → query analysis → retrieval → context assembly → generation
    """

    def __init__(self):
        self.embedder = EmbeddingProvider()
        self.vector_store = VectorStore(self.embedder)
        self._query_cache = diskcache.Cache(Path(CACHE_DIR) / "queries")

        # Ensure indexed
        self.vector_store.index_knowledge_base()
        logger.info("✅ RAG pipeline initialized")

    def _classify_query(self, query: str) -> str:
        """Classify query to narrow ChromaDB retrieval."""
        q = query.lower()
        if any(w in q for w in ["skill", "know", "tech", "language", "can he", "proficient"]):
            return "skills"
        if any(w in q for w in ["project", "built", "created", "developed", "work on", "github"]):
            return "project"
        if any(w in q for w in ["internship", "experience", "work", "company", "infosys", "eisystems", "microgenesis", "edunet", "shadow"]):
            return "experience"
        if any(w in q for w in ["cert", "certificate", "credential", "award", "ibm", "aicte"]):
            return "certifications"
        if any(w in q for w in ["education", "college", "university", "degree", "cgpa", "gpa", "school"]):
            return "education"
        if any(w in q for w in ["hire", "available", "role", "position", "job", "opportunity", "suit", "best for"]):
            return "value_proposition"
        if any(w in q for w in ["hobby", "interest", "sport", "personal", "language spoken", "about him"]):
            return "personal"
        return None  # no filter — search all

    def _build_system_prompt(self, role_context: str = "") -> str:
        return f"""You are an AI assistant representing Anurag Swain's professional portfolio.
Your job is to help recruiters and potential employers understand Anurag's skills, experience, and suitability for roles.

CRITICAL RULES:
1. You have access to Anurag's portfolio context. If the user asks about Anurag, his skills, projects, or experience, use the context to provide accurate answers.
2. If the user asks a general programming, tech, or conversational question NOT related to Anurag, answer it normally using your vast general AI knowledge. You are a helpful AI assistant.
3. Be professional, concise, and recruiter-friendly.
4. Use bullet points for lists. Keep answers focused and scannable.
5. When mentioning projects, always include the GitHub URL if available.
6. Speak in third person about Anurag (e.g., "Anurag has..." not "I have...").
7. Highlight measurable achievements (stars, CGPA, duration, certifications) when relevant.
{f'8. The recruiter is viewing Anurag as a {role_context} candidate — tailor your answer accordingly.' if role_context else ''}

Current candidate: Anurag Swain | B.Tech CSE @ GCE Kalahandi | CGPA 8.10 | 4 Internships (2025)"""

    def _build_user_prompt(self, query: str, context_chunks: list[dict], history: list[dict]) -> str:
        # Format retrieved context
        context_text = "\n\n".join([
            f"[Source: {c['category']} / {c['topic']} | Relevance: {c['similarity']:.2f}]\n{c['content'][:600]}"
            for c in context_chunks[:2]
        ])

        # Format conversation history (last 2 exchanges)
        history_text = ""
        if history:
            recent = history[-4:]  # last 2 user+assistant pairs
            history_text = "\n".join([
                f"{'User' if m['role'] == 'user' else 'Assistant'}: {m['content']}"
                for m in recent
            ])

        prompt = f"""CONTEXT:
{context_text}

{'RECENT CHAT:' if history_text else ''}
{history_text}

QUESTION: {query}

Provide a well-structured, highly readable response. Use Markdown, bold text for emphasis, and bullet points where appropriate to make the answer easy to scan and read. If the question is about Anurag, base your answer on the CONTEXT."""
        return prompt



    def answer(
        self,
        query: str,
        history: list[dict] = None,
        role_context: str = "",
        top_k: int = TOP_K,
        use_cache: bool = True,
    ) -> dict:
        """
        Full RAG answer generation.
        Returns: {reply, sources, confidence, cached}
        """
        history = history or []

        # Cache check (only for queries without conversation history)
        cache_key = hashlib.md5(f"{query}:{role_context}".encode()).hexdigest()
        if use_cache and not history:
            cached = self._query_cache.get(cache_key)
            if cached:
                logger.info(f"📦 Cache hit for query: {query[:50]}...")
                return {**cached, "cached": True}

        # 1. Classify query for smarter retrieval
        category_hint = self._classify_query(query)
        logger.info(f"🔍 Query classified as: {category_hint or 'general'}")

        # 2. Retrieve relevant chunks
        chunks = self.vector_store.retrieve(query, top_k=top_k, category_filter=category_hint)

        # If too few results with filter, retry without filter
        if len(chunks) < 2 and category_hint:
            chunks = self.vector_store.retrieve(query, top_k=top_k)

        logger.info(f"📄 Retrieved {len(chunks)} relevant chunks (min score: {MIN_SCORE})")

        # 3. Confidence calculation
        avg_confidence = 0.0
        if chunks and chunks[0]["similarity"] >= MIN_SCORE:
            avg_confidence = sum(c["similarity"] for c in chunks[:3]) / min(3, len(chunks))
        else:
            # If no confident chunks, we pass empty context so the LLM can answer from general knowledge
            chunks = []

        # 4. Build prompts
        system_prompt = self._build_system_prompt(role_context)
        user_prompt = self._build_user_prompt(query, chunks, history)

        # 5. Generate with Ollama (with API fallback)
        reply = self._generate(system_prompt, user_prompt)

        # 6. Cache & return
        result = {
            "reply": reply,
            "sources": [{"category": c["category"], "topic": c["topic"], "score": c["similarity"]} for c in chunks[:3]],
            "confidence": round(avg_confidence, 3),
            "cached": False,
        }

        if use_cache and not history and reply.strip() and not reply.startswith("I'm currently unable to generate a response"):
            self._query_cache.set(cache_key, result, expire=3600)  # 1h cache

        return result

    import json
    def answer_stream(
        self,
        query: str,
        history: list[dict] = None,
        role_context: str = "",
        top_k: int = TOP_K,
        use_cache: bool = True,
    ):
        """
        Streaming version of RAG answer generation.
        Yields SSE formatted strings: data: {"text": "..."}\n\n
        At the end, yields: data: {"done": true, "sources": [...], "confidence": ...}\n\n
        """
        history = history or []

        # Cache check
        cache_key = hashlib.md5(f"{query}:{role_context}".encode()).hexdigest()
        if use_cache and not history:
            cached = self._query_cache.get(cache_key)
            if cached:
                logger.info(f"📦 Cache hit for query: {query[:50]}...")
                # Yield it all at once to mimic stream completion
                yield f"data: {json.dumps({'text': cached['reply']})}\n\n"
                yield f"data: {json.dumps({'done': True, 'sources': cached['sources'], 'confidence': cached['confidence'], 'cached': True})}\n\n"
                return

        category_hint = self._classify_query(query)
        chunks = self.vector_store.retrieve(query, top_k=top_k, category_filter=category_hint)

        if len(chunks) < 2 and category_hint:
            chunks = self.vector_store.retrieve(query, top_k=top_k)

        avg_confidence = 0.0
        if chunks and chunks[0]["similarity"] >= MIN_SCORE:
            avg_confidence = sum(c["similarity"] for c in chunks[:3]) / min(3, len(chunks))
        else:
            chunks = []

        system_prompt = self._build_system_prompt(role_context)
        user_prompt = self._build_user_prompt(query, chunks, history)

        sources = [{"category": c["category"], "topic": c["topic"], "score": c["similarity"]} for c in chunks[:3]]
        
        full_reply = ""
        for chunk in self._generate_stream(system_prompt, user_prompt):
            full_reply += chunk
            yield f"data: {json.dumps({'text': chunk})}\n\n"

        result = {
            "reply": full_reply,
            "sources": sources,
            "confidence": round(avg_confidence, 3),
            "cached": False,
        }

        if use_cache and not history and full_reply.strip() and not full_reply.startswith("I'm currently unable to generate a response"):
            self._query_cache.set(cache_key, result, expire=3600)
            
        yield f"data: {json.dumps({'done': True, 'sources': sources, 'confidence': round(avg_confidence, 3), 'cached': False})}\n\n"



    def _generate(self, system_prompt: str, user_prompt: str) -> str:
        """Use Groq API for generation with automatic rate-limit retry."""
        import httpx, time
        api_key = os.getenv("GROQ_API_KEY", "")
        if not api_key:
            return "Please provide a GROQ_API_KEY in the environment variables."

        for attempt in range(3):  # retry up to 3 times
            try:
                resp = httpx.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
                    json={
                        "model": os.getenv("GROQ_MODEL", "llama-3.1-8b-instant"),
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_prompt},
                        ],
                        "temperature": float(os.getenv("OLLAMA_TEMPERATURE", "0.1")),
                        "max_tokens": 800,
                    },
                    timeout=30,
                )
                if resp.status_code == 429:
                    retry_after = float(resp.headers.get("retry-after", 6))
                    logger.warning(f"⏳ Groq rate limit hit. Retrying in {retry_after:.1f}s (attempt {attempt+1}/3)")
                    time.sleep(min(retry_after, 10))
                    continue
                resp.raise_for_status()
                return resp.json()["choices"][0]["message"]["content"].strip()
            except Exception as e:
                if attempt < 2:
                    time.sleep(2 ** attempt)
                    continue
                logger.warning(f"Groq generation failed after retries: {e}")
                try:
                    client = ollama.Client(host=OLLAMA_URL)
                    ollama_model = os.getenv("OLLAMA_MODEL", "llama3")
                    r = client.chat(model=ollama_model, messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ])
                    return r["message"]["content"].strip()
                except Exception as e2:
                    return "I'm temporarily rate-limited. Please try again in a few seconds!"
        return "I'm temporarily rate-limited. Please try again in a few seconds!"

    def _generate_stream(self, system_prompt: str, user_prompt: str):
        """Streaming version using Groq API."""
        api_key = os.getenv("GROQ_API_KEY", "")
        if not api_key:
            yield "Please provide a GROQ_API_KEY in the environment variables."
            return

        try:
            import httpx
            import json
            with httpx.stream(
                "POST",
                "https://api.groq.com/openai/v1/chat/completions",
                headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
                json={
                    "model": os.getenv("GROQ_MODEL", "llama-3.1-8b-instant"),
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                    "temperature": float(os.getenv("OLLAMA_TEMPERATURE", "0.1")),
                    "max_tokens": 2048,
                    "stream": True,
                },
                timeout=60,
            ) as response:
                response.raise_for_status()
                for line in response.iter_lines():
                    if line.startswith("data: "):
                        data_str = line[6:]
                        if data_str == "[DONE]":
                            break
                        try:
                            data = json.loads(data_str)
                            delta = data["choices"][0].get("delta", {}).get("content", "")
                            if delta:
                                yield delta
                        except json.JSONDecodeError:
                            continue
            return
        except Exception as e:
            logger.warning(f"Groq streaming failed: {e}. Falling back to Ollama local stream.")
            try:
                client = ollama.Client(host=OLLAMA_URL)
                ollama_model = os.getenv("OLLAMA_MODEL", "llama3")
                stream = client.chat(
                    model=ollama_model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                    stream=True
                )
                for chunk in stream:
                    content = chunk["message"]["content"]
                    if content:
                        yield content
                return
            except Exception as e2:
                logger.error(f"Ollama fallback also failed: {e2}")
                error_details = str(e)
                if hasattr(e, "response") and hasattr(e.response, "text"):
                    error_details = e.response.text
                yield f"data: {json.dumps({'chunk': f'Groq Error Details: {error_details}'})}\n\n"
                return

    def reindex(self):
        """Force rebuild the entire vector index."""
        logger.info("🔄 Force reindexing knowledge base...")
        self.vector_store.index_knowledge_base(force=True)
        self._query_cache.clear()
        logger.info("✅ Reindex complete")

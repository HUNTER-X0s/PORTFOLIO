"""
rag/pipeline.py
Complete RAG pipeline: chunking → embedding → ChromaDB storage → retrieval
Uses Ollama for embeddings + generation, with sentence-transformers fallback.
"""

import os
import json
import hashlib
import logging
from typing import Optional
from pathlib import Path

import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer
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
        self._st_model: Optional[SentenceTransformer] = None
        self._ollama_ok: Optional[bool] = None
        self._cache = diskcache.Cache(Path(CACHE_DIR) / "embeddings")

    def _check_ollama(self) -> bool:
        if self._ollama_ok is not None:
            return self._ollama_ok
        try:
            client = ollama.Client(host=OLLAMA_URL)
            # Quick ping
            client.list()
            self._ollama_ok = True
            logger.info(f"✅ Ollama embed model ready: {OLLAMA_EMBED}")
        except Exception as e:
            logger.warning(f"⚠️  Ollama not available ({e}), using sentence-transformers")
            self._ollama_ok = False
        return self._ollama_ok

    def _st_embed(self, texts: list[str]) -> list[list[float]]:
        if self._st_model is None:
            logger.info(f"Loading SentenceTransformer: {EMBED_MODEL}")
            self._st_model = SentenceTransformer(EMBED_MODEL)
        return self._st_model.encode(texts, show_progress_bar=False).tolist()

    def _ollama_embed(self, texts: list[str]) -> list[list[float]]:
        client = ollama.Client(host=OLLAMA_URL)
        results = []
        for text in texts:
            resp = client.embeddings(model=OLLAMA_EMBED, prompt=text)
            results.append(resp["embedding"])
        return results

    def embed(self, texts: list[str]) -> list[list[float]]:
        """Embed list of texts, using cache where available."""
        results = [None] * len(texts)
        uncached_indices = []
        uncached_texts = []

        for i, text in enumerate(texts):
            key = hashlib.md5(text.encode()).hexdigest()
            cached = self._cache.get(key)
            if cached is not None:
                results[i] = cached
            else:
                uncached_indices.append(i)
                uncached_texts.append(text)

        if uncached_texts:
            try:
                if self._check_ollama():
                    embeddings = self._ollama_embed(uncached_texts)
                else:
                    embeddings = self._st_embed(uncached_texts)
            except Exception as e:
                logger.warning(f"Ollama embed failed ({e}), falling back to sentence-transformers")
                self._ollama_ok = False
                embeddings = self._st_embed(uncached_texts)

            for idx, emb in zip(uncached_indices, embeddings):
                text = texts[idx]
                key = hashlib.md5(text.encode()).hexdigest()
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

    def _get_or_create_collection(self):
        try:
            col = self.client.get_collection(COLLECTION_NAME)
            logger.info(f"📚 Loaded existing ChromaDB collection: {COLLECTION_NAME} ({col.count()} docs)")
            return col
        except Exception:
            logger.info(f"📚 Creating new ChromaDB collection: {COLLECTION_NAME}")
            return self.client.create_collection(
                name=COLLECTION_NAME,
                metadata={"hnsw:space": "cosine"},
            )

    def index_knowledge_base(self, force: bool = False):
        """Index all knowledge chunks into ChromaDB."""
        existing_count = self.collection.count()
        if existing_count >= len(KNOWLEDGE_CHUNKS) and not force:
            logger.info(f"✅ Knowledge base already indexed ({existing_count} chunks). Skipping.")
            return

        logger.info(f"⚙️  Indexing {len(KNOWLEDGE_CHUNKS)} knowledge chunks...")

        # Clear existing if rebuilding
        if force and existing_count > 0:
            self.client.delete_collection(COLLECTION_NAME)
            self.collection = self._get_or_create_collection()

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
1. ONLY answer based on the provided context. Never invent or hallucinate information.
2. If the context does not contain the answer, say: "I don't have that specific information in Anurag's portfolio data."
3. Be professional, concise, and recruiter-friendly.
4. Use bullet points for lists. Keep answers focused and scannable.
5. When mentioning projects, always include the GitHub URL if available.
6. Speak in third person about Anurag (e.g., "Anurag has..." not "I have...").
7. Highlight measurable achievements (stars, CGPA, duration, certifications) when relevant.
{f'8. The recruiter is viewing Anurag as a {role_context} candidate — tailor your answer accordingly.' if role_context else ''}

Current candidate: Anurag Swain | B.Tech CSE @ GCE Kalahandi | CGPA 8.10 | 5 Internships (2025)"""

    def _build_user_prompt(self, query: str, context_chunks: list[dict], history: list[dict]) -> str:
        # Format retrieved context
        context_text = "\n\n".join([
            f"[Source: {c['category']} / {c['topic']} | Relevance: {c['similarity']:.2f}]\n{c['content']}"
            for c in context_chunks
        ])

        # Format conversation history (last 3 exchanges)
        history_text = ""
        if history:
            recent = history[-6:]  # last 3 user+assistant pairs
            history_text = "\n".join([
                f"{'User' if m['role'] == 'user' else 'Assistant'}: {m['content']}"
                for m in recent
            ])

        prompt = f"""CONTEXT FROM PORTFOLIO DATA:
{context_text}

{'CONVERSATION HISTORY:' if history_text else ''}
{history_text}

USER QUESTION: {query}

Answer based ONLY on the context above. Be concise and recruiter-friendly:"""
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

        # 3. Confidence check
        if not chunks or chunks[0]["similarity"] < MIN_SCORE:
            return {
                "reply": "I don't have that specific information in Anurag's portfolio data. You can reach him directly at anurag.swain35@gmail.com or view his full profile at https://github.com/HUNTER-X0s.",
                "sources": [],
                "confidence": 0.0,
                "cached": False,
            }

        avg_confidence = sum(c["similarity"] for c in chunks[:3]) / min(3, len(chunks))

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

        if use_cache and not history:
            self._query_cache.set(cache_key, result, expire=3600)  # 1h cache

        return result

    def _generate(self, system_prompt: str, user_prompt: str) -> str:
        """Try Ollama; fall back to OpenAI if available."""
        model = os.getenv("OLLAMA_MODEL", "llama3")
        temperature = float(os.getenv("OLLAMA_TEMPERATURE", "0.1"))
        num_ctx = int(os.getenv("OLLAMA_NUM_CTX", "4096"))

        try:
            client = ollama.Client(host=OLLAMA_URL)
            response = client.chat(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                options={
                    "temperature": temperature,
                    "top_k": int(os.getenv("OLLAMA_TOP_K", "40")),
                    "top_p": float(os.getenv("OLLAMA_TOP_P", "0.9")),
                    "num_ctx": num_ctx,
                },
            )
            return response["message"]["content"].strip()

        except Exception as e:
            logger.warning(f"⚠️  Ollama generation failed ({e}). Trying fallback...")
            return self._openai_fallback(system_prompt, user_prompt)

    def _openai_fallback(self, system_prompt: str, user_prompt: str) -> str:
        """OpenAI fallback if Ollama is unavailable."""
        api_key = os.getenv("OPENAI_API_KEY", "")
        if not api_key:
            return (
                "I'm currently unable to process your request — the AI service is temporarily unavailable. "
                "Please contact Anurag directly at anurag.swain35@gmail.com."
            )
        try:
            import httpx
            resp = httpx.post(
                "https://api.openai.com/v1/chat/completions",
                headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
                json={
                    "model": os.getenv("OPENAI_MODEL", "gpt-3.5-turbo"),
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                    "temperature": 0.1,
                    "max_tokens": 800,
                },
                timeout=30,
            )
            return resp.json()["choices"][0]["message"]["content"].strip()
        except Exception as e2:
            logger.error(f"OpenAI fallback also failed: {e2}")
            return (
                "I'm unable to generate a response right now. "
                "Please contact Anurag at anurag.swain35@gmail.com."
            )

    def reindex(self):
        """Force rebuild the entire vector index."""
        logger.info("🔄 Force reindexing knowledge base...")
        self.vector_store.index_knowledge_base(force=True)
        self._query_cache.clear()
        logger.info("✅ Reindex complete")

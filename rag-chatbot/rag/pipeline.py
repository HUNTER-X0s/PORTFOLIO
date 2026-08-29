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
        self._last_ollama_check: float = 0.0
        self._cache = diskcache.Cache(Path(CACHE_DIR) / "embeddings")
        self._active_backend: tuple[str, str] | None = None

    def _check_ollama(self) -> bool:
        import time
        now = time.time()
        # If checked within last 60 seconds, reuse cached status
        if self._ollama_ok is not None and (now - self._last_ollama_check) < 60:
            return self._ollama_ok

        self._last_ollama_check = now
        try:
            import httpx
            # Fast 500ms timeout check instead of hanging
            resp = httpx.get(f"{OLLAMA_URL}/api/tags", timeout=0.5)
            if resp.status_code == 200:
                self._ollama_ok = True
                logger.info(f"✅ Ollama embed model ready: {OLLAMA_EMBED}")
                return True
        except Exception:
            pass

        self._ollama_ok = False
        return False

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
        # Prefer fast local embeddings unless Ollama is confirmed running
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
        where_filter = {"category": category_filter} if category_filter else None
        try:
            query_embedding = self.embedder.embed_single(query)
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=top_k,
                where=where_filter,
                include=["documents", "metadatas", "distances"],
            )
        except Exception as e:
            if "dimension" in str(e).lower() or "dimensionality" in str(e).lower():
                logger.warning(f"ChromaDB dimension mismatch ({e}), auto-reindexing for current embedder...")
                self.index_knowledge_base(force=True)
                query_embedding = self.embedder.embed_single(query)
                results = self.collection.query(
                    query_embeddings=[query_embedding],
                    n_results=top_k,
                    where=where_filter,
                    include=["documents", "metadatas", "distances"],
                )
            else:
                logger.warning(f"ChromaDB retrieval error: {e}")
                return []

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

    def _detect_query_complexity(self, query: str) -> str:
        """
        Detect how detailed the response should be.
        Returns: 'quick' | 'medium' | 'detailed'

        quick   → single-fact lookup (name, CGPA, email, Instagram, phone, city)
        medium  → summary of 1-2 topics (list of skills, list of internships, college name)
        detailed → deep dive requiring full explanation (explain project, why hire, skill breakdown)
        """
        q = query.lower().strip()

        # ── Quick / single-fact patterns ──────────────────────────────────
        QUICK_PATTERNS = [
            # Identity
            r"\bwhat.*his name\b", r"\bwho is\b", r"\bname\b",
            # Contact
            r"\bemail\b", r"\bphone\b", r"\bmobile\b", r"\bnumber\b",
            r"\blinkedin\b", r"\bgithub.*link\b", r"\btwitter\b", r"\binstagram\b",
            r"\bx\.com\b", r"\bcontact\b",
            # Education single-fact
            r"\bcgpa\b", r"\bgpa\b", r"\bgrade\b",
            r"\bcollege name\b", r"\buniversity name\b", r"\bschool name\b",
            r"\bgraduat.*year\b", r"\bwhen.*graduat\b",
            r"\bdegree name\b", r"\bwhat.*degree\b",
            # Location
            r"\blocation\b", r"\bcity\b", r"\bstate\b", r"\bwhere.*from\b",
            r"\bwhere.*live\b", r"\bwhere.*based\b",
            # Simple yes/no / availability
            r"\bfreelance\b", r"\bavailab\b", r"\bopen to\b",
            r"\bhow many intern", r"\bhow many project",
        ]
        for pat in QUICK_PATTERNS:
            if re.search(pat, q):
                return "quick"

        # ── Detailed / deep-dive patterns ─────────────────────────────────
        DETAILED_PATTERNS = [
            r"\bexplain\b", r"\bdescribe\b", r"\btell me (more|everything|all)\b",
            r"\bwhy (hire|choose|should)\b", r"\bhow.*project\b",
            r"\bdetail\b", r"\bin depth\b", r"\bcomprehensive\b",
            r"\bstrongest skill\b", r"\bbest project\b", r"\btop project\b",
            r"\bsummari[zs]e.*intern\b", r"\bsummari[zs]e.*experience\b",
            r"\ball.*project\b", r"\ball.*skill\b", r"\ball.*intern\b",
            r"\bwhat.*built\b", r"\bwhat.*creat\b", r"\bwhat.*develop\b",
            r"\bhow.*implement\b", r"\btechni\w+\s+skill\b",
            r"\bvalue proposi\b", r"\bwhy.*good\b", r"\bwhy.*fit\b",
            r"\bwhat.*know\b", r"\bwhat.*learn\b",
            r"\bai.*project\b", r"\bml.*project\b",
        ]
        for pat in DETAILED_PATTERNS:
            if re.search(pat, q):
                return "detailed"

        # ── Medium: anything else (1-2 topic overview) ────────────────────
        return "medium"

    def _get_max_tokens(self, complexity: str) -> int:
        """Dynamic token limit based on query complexity."""
        return {
            "quick":   512,   # ample token buffer so models never hit length limits
            "medium":  1200,  # solid, comprehensive answer
            "detailed": 2500, # long, deep-dive recruiter-grade response with all details
        }[complexity]

    def _build_system_prompt(self, role_context: str = "", complexity: str = "medium") -> str:
        # Specialized prompt for Jarvis voice mode (brief, point-wise, NO # headings)
        if "jarvis" in role_context.lower() or "voice" in role_context.lower():
            return f"""You are Jarvis, Anurag Swain's official AI voice assistant.
Your responses will be spoken aloud to the user via speech synthesis.

CRITICAL VOICE INSTRUCTIONS (strictly follow):
1. Keep responses BRIEF, concise, and strictly point-wise (3-4 bullet points maximum).
2. STRICT PROHIBITION: DO NOT use any markdown headings (`#`, `##`, `###`) or horizontal rules (`---`). The text-to-speech engine reads them out literally.
3. Use simple bullet points format: `- **Topic**: brief description`.
4. For quick fact questions (CGPA, college, name, contact), output a single direct 1-line bullet point.
5. Speak in third person ("Anurag is...", "He built...").
6. Base all facts on the candidate context provided.

Candidate Snapshot: Anurag Swain | B.Tech CSE @ Government College of Engineering, Kalahandi (CGPA 8.10/10.00) | 5 Internships (2025)"""

        length_guide = {
            "quick": (
                "RESPONSE LENGTH & FORMAT: This is a quick single-fact lookup (e.g. CGPA, college, name, social handle, email). "
                "Reply in 1-2 lines maximum. Give ONLY the direct answer — no preamble, no filler sentences."
            ),
            "medium": (
                "RESPONSE LENGTH & FORMAT: This is a moderate question. "
                "Write a structured, point-wise answer using markdown bullet points (`-`) and bold labels. "
                "NO prose paragraphs — every piece of information must be a bullet point or sub-bullet."
            ),
            "detailed": (
                "RESPONSE LENGTH & FORMAT: This is a deep-dive question requiring a thorough response. "
                "Write a comprehensive, fully structured answer. "
                "STRICT RULE: Use ONLY markdown bullet points (`-`), bold labels, and `###` section headers. "
                "Absolutely NO prose paragraphs — every sentence must be a bullet point. "
                "Include metrics, tech stack names, and measurable outcomes wherever possible."
            ),
        }[complexity]

        return f"""You are the official AI assistant representing Anurag Swain's professional portfolio.
Your role is to help recruiters, engineering managers, and technical peers understand Anurag in full depth.

CRITICAL INSTRUCTIONS (follow strictly):
1. Start your response IMMEDIATELY with the answer — no preamble, no restating the question, no <think> tags.
2. NEVER output prose paragraphs. ALL responses must use markdown bullet points (`-`) and bold labels.
3. Quick fact queries (name, CGPA, college, handle, email): answer in 1-2 lines only.
4. All other queries: use `###` section headers + `-` bullet points. Each fact = one bullet.

{length_guide}

FORMATTING RULES (non-negotiable):
- Use `- **Label**: value` format for every data point
- Use `### Section Title` for grouping related points
- Use `---` horizontal rules to separate major sections
- Bold all technology names, project names, and key figures
- NEVER write multi-sentence prose paragraphs

CORE PRINCIPLES:
1. Speak in third person ("Anurag is...", "He has built...").
2. Base all candidate facts on the CONTEXT provided.
3. When referencing projects, include repository links and measurable outcomes.
{f'4. Recruiter context: Evaluating Anurag for a {role_context} position — emphasize relevant strengths.' if role_context else ''}

Candidate Snapshot: Anurag Swain | B.Tech CSE @ Government College of Engineering, Kalahandi (CGPA 8.10/10.00) | 5 Internships (2025)"""

    def _build_user_prompt(self, query: str, context_chunks: list[dict], history: list[dict], complexity: str = "medium", role_context: str = "") -> str:
        context_text = "\n\n".join([
            f"[Source: {c['category']} / {c['topic']} | Relevance: {c['similarity']:.2f}]\n{c['content']}"
            for c in context_chunks[:4]
        ])

        history_text = ""
        if history:
            recent = history[-4:]
            history_text = "\n".join([
                f"{'User' if m['role'] == 'user' else 'Assistant'}: {m['content']}"
                for m in recent
            ])

        if "jarvis" in role_context.lower() or "voice" in role_context.lower():
            prompt = f"""CONTEXT:
{context_text}

{'RECENT CONVERSATION:' if history_text else ''}
{history_text}

QUESTION: {query}

INSTRUCTION: Provide a brief, point-wise response with 2-4 bullet points maximum. STRICTLY DO NOT use any # headings, section headers, or prose paragraphs. Keep it brief and clear for voice readout."""
            return prompt

        response_hint = {
            "quick": (
                "Answer in 1-2 lines with only the specific fact. No extra sentences."
            ),
            "medium": (
                "Answer using ONLY markdown bullet points (`-`) and bold labels. "
                "Organise into short `###` sections if needed. "
                "NO prose paragraphs — every piece of information must be its own bullet point."
            ),
            "detailed": (
                "Answer with a fully structured, comprehensive breakdown. "
                "Use `###` section headers and `-` bullet points throughout. "
                "Every fact must be a bullet — no prose paragraphs at all. "
                "Include tech stack, metrics, and outcomes for each item."
            ),
        }[complexity]

        prompt = f"""CONTEXT:
{context_text}

{'RECENT CONVERSATION:' if history_text else ''}
{history_text}

QUESTION: {query}

INSTRUCTION: {response_hint} Output your answer directly — no preamble, no restating the question."""
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
            if cached and isinstance(cached, dict) and cached.get("reply"):
                reply_txt = cached["reply"]
                if not any(err in reply_txt for err in ["GROQ_API_KEY", "Groq Error", "model_not_found", "invalid_request_error"]):
                    logger.info(f"📦 Cache hit for query: {query[:50]}...")
                    return {**cached, "cached": True}

        # 1. Detect complexity for adaptive response length
        complexity = self._detect_query_complexity(query)
        max_tokens = self._get_max_tokens(complexity)
        logger.info(f"🎯 Query complexity: {complexity} | max_tokens: {max_tokens}")

        # 2. Classify query for smarter retrieval
        category_hint = self._classify_query(query)
        logger.info(f"🔍 Query classified as: {category_hint or 'general'}")

        # 3. Retrieve relevant chunks
        chunks = self.vector_store.retrieve(query, top_k=top_k, category_filter=category_hint)

        # If too few results with filter, retry without filter
        if len(chunks) < 2 and category_hint:
            chunks = self.vector_store.retrieve(query, top_k=top_k)

        logger.info(f"📄 Retrieved {len(chunks)} relevant chunks (min score: {MIN_SCORE})")

        # 4. Confidence calculation
        avg_confidence = 0.0
        if chunks and chunks[0]["similarity"] >= MIN_SCORE:
            avg_confidence = sum(c["similarity"] for c in chunks[:3]) / min(3, len(chunks))
        else:
            chunks = []

        # 5. Build adaptive prompts
        system_prompt = self._build_system_prompt(role_context, complexity)
        user_prompt = self._build_user_prompt(query, chunks, history, complexity, role_context=role_context)

        # 6. Generate with LLM
        reply, mode = self._generate(system_prompt, user_prompt, query=query, chunks=chunks, max_tokens=max_tokens)

        # 7. Cache & return
        result = {
            "reply": reply,
            "mode": mode,
            "sources": [{"category": c["category"], "topic": c["topic"], "score": c["similarity"]} for c in chunks[:3]],
            "confidence": round(avg_confidence, 3),
            "cached": False,
        }

        if use_cache and not history and reply.strip() and not any(err in reply for err in ["GROQ_API_KEY", "Groq Error", "model_not_found"]):
            self._query_cache.set(cache_key, result, expire=3600)

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
            if cached and isinstance(cached, dict) and cached.get("reply"):
                reply_txt = cached["reply"]
                if not any(err in reply_txt for err in ["GROQ_API_KEY", "Groq Error", "model_not_found"]):
                    logger.info(f"📦 Cache hit for query: {query[:50]}...")
                    yield f"data: {json.dumps({'text': cached['reply']})}\n\n"
                    yield f"data: {json.dumps({'done': True, 'mode': cached.get('mode', 'groq'), 'sources': cached['sources'], 'confidence': cached['confidence'], 'cached': True})}\n\n"
                    return

        # 1. Detect complexity for adaptive streaming
        complexity = self._detect_query_complexity(query)
        max_tokens = self._get_max_tokens(complexity)
        logger.info(f"🎯 Stream complexity: {complexity} | max_tokens: {max_tokens}")

        category_hint = self._classify_query(query)
        chunks = self.vector_store.retrieve(query, top_k=top_k, category_filter=category_hint)

        if len(chunks) < 2 and category_hint:
            chunks = self.vector_store.retrieve(query, top_k=top_k)

        avg_confidence = 0.0
        if chunks and chunks[0]["similarity"] >= MIN_SCORE:
            avg_confidence = sum(c["similarity"] for c in chunks[:3]) / min(3, len(chunks))
        else:
            chunks = []

        system_prompt = self._build_system_prompt(role_context, complexity)
        user_prompt = self._build_user_prompt(query, chunks, history, complexity, role_context=role_context)

        sources = [{"category": c["category"], "topic": c["topic"], "score": c["similarity"]} for c in chunks[:3]]
        
        full_reply = ""
        self._current_stream_mode = "synthesis"
        for chunk_text in self._filter_think_stream(self._generate_stream(system_prompt, user_prompt, query=query, chunks=chunks, max_tokens=max_tokens)):
            full_reply += chunk_text
            yield f"data: {json.dumps({'text': chunk_text})}\n\n"

        reply_mode = getattr(self, "_current_stream_mode", "groq")

        result = {
            "reply": full_reply,
            "mode": reply_mode,
            "sources": sources,
            "confidence": round(avg_confidence, 3),
            "cached": False,
        }

        if use_cache and not history and full_reply.strip():
            self._query_cache.set(cache_key, result, expire=3600)
            
        yield f"data: {json.dumps({'done': True, 'mode': reply_mode, 'sources': sources, 'confidence': round(avg_confidence, 3), 'cached': False})}\n\n"



    def _synthesize_from_rag_knowledge(self, query: str, chunks: list[dict]) -> str:
        """
        High-quality deterministic fallback synthesizer that grounds answers directly
        in Anurag Swain's comprehensive structured knowledge chunks.
        """
        q = query.lower().strip()

        # ── Direct Single-Fact Lookups (Quick Queries) ────────────────────
        if any(w in q for w in ["cgpa", "gpa", "grade", "percentage", "academic score"]):
            return "Anurag Swain's CGPA is **8.10 / 10.00** in B.Tech Computer Science and Engineering at Government College of Engineering, Kalahandi (GCEK)."

        if any(w in q for w in ["college name", "university name", "institution", "where does he study", "which college"]):
            return "Anurag is studying at **Government College of Engineering, Kalahandi (GCEK)**, affiliated with BPUT Odisha, India (Class of 2027)."

        if any(w in q for w in ["his name", "what is your name", "who are you", "who is he", "candidate name"]):
            return "His name is **Anurag Swain**, a 3rd-year B.Tech CSE student, AI/ML researcher, and full-stack software developer."

        if any(w in q for w in ["instagram", "insta"]):
            return "Anurag's Instagram handle is [**@_vi_ll_a_in_**](https://www.instagram.com/_vi_ll_a_in/)."

        if any(w in q for w in ["email", "mail"]):
            return "Anurag's email address is [**anurag.swain35@gmail.com**](mailto:anurag.swain35@gmail.com) *(Alternate: anuragswain01@outlook.com)*."

        if any(w in q for w in ["github", "github profile", "repo"]):
            return "Anurag's GitHub profile is [**github.com/HUNTER-X0s**](https://github.com/HUNTER-X0s) featuring all his open-source AI, ML, and web projects."

        if any(w in q for w in ["linkedin", "linkedin profile"]):
            return "Anurag's LinkedIn profile is [**linkedin.com/in/anurag-swain-cse07**](https://www.linkedin.com/in/anurag-swain-cse07/)."

        if any(w in q for w in ["phone", "mobile", "contact number", "call"]):
            return "Anurag's phone number is **+91-7008973337**."

        if any(w in q for w in ["location", "city", "where live", "where based", "state"]):
            return "Anurag is based in **Bhubaneswar, Odisha, India** (PIN 751002)."

        if any(w in q for w in ["degree", "branch", "major", "field of study"]):
            return "Anurag is pursuing a **Bachelor of Technology (B.Tech)** in **Computer Science and Engineering (CSE)** (2023–2027)."

        # ── Comprehensive Multi-Section Answers (Detailed Queries) ────────
        
        # 1. Skills / Tech Stack
        if any(w in q for w in ["skill", "tech", "stack", "language", "python", "react", "framework", "tool", "strongest", "coding"]):
            return (
                "**Anurag Swain's Technical Skills & Core Competencies:**\n\n"
                "• **Programming Languages:** Python (88%), JavaScript (82%), C (80%), C++ (78%), Java (75%), SQL (80%)\n"
                "• **AI / Machine Learning / Deep Learning:** Scikit-Learn (82%), TensorFlow (80%), PyTorch (78%), NLP, OpenCV, ChromaDB, Ollama, HuggingFace, Retrieval-Augmented Generation (RAG)\n"
                "• **Web & Full-Stack Development:** React.js (78%), Next.js 14 (74%), Node.js (73%), Express.js, REST APIs, TailwindCSS, MongoDB, HTML5/CSS3\n"
                "• **Data Science & Analytics:** Pandas (85%), NumPy (85%), Matplotlib (80%), Seaborn (78%), Jupyter, Exploratory Data Analysis (EDA)\n"
                "• **Tools & Platforms:** Git, GitHub, VS Code, Linux, Docker, Postman, Vercel\n\n"
                "💡 *Anurag has applied these skills across 5 real-world internships and multiple production-grade projects.*"
            )

        # 2. Projects
        if any(w in q for w in ["project", "best project", "explain", "ai chat bot", "ev", "demand", "research agent", "portfolio"]):
            return (
                "**Anurag Swain's Key Featured Projects:**\n\n"
                "1. 🤖 **AI Chat Bot** (NLP & Multi-Turn Dialogue System)\n"
                "   • *Tech:* Python, NLP, LLMs, Intent Classification, Session Memory\n"
                "   • *Details:* Context-aware dialogue system built during his Infosys AI Internship with custom preprocessing, entity recognition, and multi-turn state management.\n"
                "   • *GitHub:* [github.com/HUNTER-X0s/AI_CHAT_BOT](https://github.com/HUNTER-X0s/AI_CHAT_BOT) (⭐1)\n\n"
                "2. 🚗 **EV Charging Demand Prediction**\n"
                "   • *Tech:* Python, Scikit-Learn, Pandas, NumPy, Machine Learning\n"
                "   • *Details:* ML pipeline predicting electric vehicle charging station loads to optimize grid energy distribution ($R^2=0.86$, RMSE reduction of 18%).\n"
                "   • *GitHub:* [github.com/HUNTER-X0s/EV-VEHICLE-CHARGING-DEMAND-PREDICTION](https://github.com/HUNTER-X0s/EV-VEHICLE-CHARGING-DEMAND-PREDICTION) (⭐1)\n\n"
                "3. 🔍 **Autonomous Research Agent**\n"
                "   • *Tech:* Python, AI Agents, NLP, Web Scraping\n"
                "   • *Details:* Capstone project for IBM SkillsBuild that autonomously parses, synthesizes, and cross-references multi-source research papers into executive briefs.\n\n"
                "4. 🌐 **AI-Powered 3D Interactive Portfolio Platform**\n"
                "   • *Tech:* Next.js 14, React, Three.js, RAG AI Pipeline, Web Speech API (Jarvis Mode), TailwindCSS\n"
                "   • *Details:* Fully interactive 3D web experience with real-time local/cloud RAG intelligence, voice control, and dynamic space physics."
            )

        # 3. Internships / Experience
        if any(w in q for w in ["experience", "intern", "internship", "company", "infosys", "eisystems", "edunet", "microgenesis", "shadowfox", "work", "summary"]):
            return (
                "**Anurag Swain's Professional Experience (5 Internships in 2025):**\n\n"
                "1. 🏢 **Infosys** — *Artificial Intelligence Intern* (Aug 2025 – Oct 2025, 3 mos, Remote)\n"
                "   • Engineered a conversational NLP AI chatbot with multi-turn dialogue management and evaluated intent classification with precision/recall metrics.\n\n"
                "2. 💻 **EISystems Technologies** — *Web Development Intern* (May 2025 – Jul 2025, 3 mos, Remote)\n"
                "   • Developed responsive full-stack web applications, implemented client-side state, and integrated REST APIs.\n\n"
                "3. ☁️ **Edunet Foundation & IBM** — *Artificial Intelligence Intern* (Jun 2025 – Jul 2025, 2 mos, Remote)\n"
                "   • IBM SkillsBuild AI program: built an autonomous multi-source research agent and trained text summarization models.\n\n"
                "4. 🧠 **MicroGenesis CADSoft, Bangalore** — *Deep Learning Intern* (May 2025 – Jun 2025, 2 mos, Hybrid)\n"
                "   • Built CNN architectures with PyTorch and TensorFlow for image classification and feature extraction.\n\n"
                "5. 📊 **ShadowFox** — *Data Science Intern* (Apr 2025 – May 2025, 1 mo, Remote)\n"
                "   • Conducted exploratory data analysis (EDA), data cleaning pipelines, and predictive analytics on complex datasets."
            )

        # 4. Education / College / CGPA
        if any(w in q for w in ["education", "college", "cgpa", "gpa", "degree", "university", "bput", "gcek", "school", "grade", "academic"]):
            return (
                "**Anurag Swain's Educational Background:**\n\n"
                "• **Degree:** Bachelor of Technology (B.Tech) in **Computer Science and Engineering (CSE)**\n"
                "• **Institution:** Government College of Engineering, Kalahandi (GCEK), affiliated with BPUT Odisha, India\n"
                "• **Academic Performance:** **CGPA: 8.10 / 10.00**\n"
                "• **Duration:** 2023 – 2027 (Currently in 3rd Year)\n"
                "• **Relevant Coursework:** Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems (DBMS), Operating Systems, Artificial Intelligence, Machine Learning, Computer Networks."
            )

        # 5. Availability / Hire / Role
        if any(w in q for w in ["hire", "available", "role", "looking for", "job", "opportunity", "suited", "best suited", "why hire"]):
            return (
                "**Anurag Swain's Career Availability & Best-Fit Roles:**\n\n"
                "✅ **Actively Available for Opportunities!**\n\n"
                "• **Target Roles:** Software Development Engineer (SDE), AI/ML Engineer, Full-Stack Developer, Data Scientist\n"
                "• **Why Hire Anurag?**\n"
                "  1. **Proven Track Record:** Completed 5 competitive internships across AI, Deep Learning, and Web Development in 2025 alone.\n"
                "  2. **Strong Academic Foundation:** 8.10 CGPA in B.Tech CSE at GCE Kalahandi.\n"
                "  3. **End-to-End Builder:** Can take ideas from ML pipeline and RAG architecture all the way to production full-stack deployment.\n"
                "• **Contact:** [anurag.swain35@gmail.com](mailto:anurag.swain35@gmail.com) | +91-7008973337"
            )

        # 6. Contact / Socials / Resume
        if any(w in q for w in ["contact", "email", "phone", "linkedin", "github", "location", "resume", "reach", "who is", "about"]):
            return (
                "**Anurag Swain's Contact Information & Profile:**\n\n"
                "• 📧 **Email:** [anurag.swain35@gmail.com](mailto:anurag.swain35@gmail.com) *(Alternate: anuragswain01@outlook.com)*\n"
                "• 📱 **Phone:** +91-7008973337\n"
                "• 📍 **Location:** Bhubaneswar, Odisha, India (PIN 751002)\n"
                "• 🐙 **GitHub:** [github.com/HUNTER-X0s](https://github.com/HUNTER-X0s)\n"
                "• 💼 **LinkedIn:** [linkedin.com/in/anurag-swain-cse07](https://www.linkedin.com/in/anurag-swain-cse07/)\n"
                "• 🐦 **X (Twitter):** [@Anurag_hunter07](https://x.com/Anurag_hunter07)\n"
                "• 📸 **Instagram:** [@_vi_ll_a_in_](https://www.instagram.com/_vi_ll_a_in/)"
            )

        # 7. Certifications
        if any(w in q for w in ["certif", "badge", "license", "course"]):
            return (
                "**Anurag Swain's Verified Certifications & Credentials:**\n\n"
                "1. 🏆 **Infosys Springboard AI Virtual Internship Certificate** — Infosys (2025)\n"
                "2. 🏆 **IBM SkillsBuild Artificial Intelligence Capstone** — IBM & Edunet (2025)\n"
                "3. 🏆 **Machine Learning & Deep Learning Certification** — MicroGenesis CADSoft (2025)\n"
                "4. 🏆 **Web Development Foundations & Applications** — EISystems Technologies (2025)\n"
                "5. 🏆 **Python (Basic) & Problem Solving** — HackerRank\n"
                "6. 🏆 **Cisco Introduction to Cybersecurity** — Cisco Networking Academy"
            )

        # 8. Clubs & Extracurriculars
        if any(w in q for w in ["club", "robotic", "kilobots", "activity", "extracurricular", "volunteer"]):
            return (
                "**Anurag Swain's Clubs & Extracurricular Activities:**\n\n"
                "• 🤖 **KiloBots (Robotics Club):** Active technical member at GCE Kalahandi contributing to hardware automation, embedded systems, and robotics hackathons.\n"
                "• 🏸 **Sports & Cultural Events:** Volunteered in collegiate fests and active in competitive badminton and chess."
            )

        # 9. Generic RAG Chunk Extraction Fallback
        if chunks:
            extracted_text = "\n\n".join(c["content"].strip() for c in chunks[:2])
            return (
                f"**Based on Anurag Swain's verified portfolio records:**\n\n"
                f"{extracted_text}\n\n"
                f"💡 *Feel free to ask about his specific projects, internships, technical skills, or education!*"
            )

        return (
            "Anurag Swain is a 3rd-year B.Tech CSE student at GCE Kalahandi (CGPA 8.10/10.00) with 5 internships in AI, Web Dev, and Data Science. "
            "You can ask me about his **skills**, **projects (AI Chatbot, EV Prediction)**, **internships (Infosys, IBM, MicroGenesis)**, or **contact details**!"
        )

    def _generate(self, system_prompt: str, user_prompt: str, query: str = "", chunks: list[dict] = None, max_tokens: int = 1024) -> tuple[str, str]:
        """
        Use Groq API for generation, Ollama fallback, then intelligent RAG synthesis.
        Returns (reply_text, mode) where mode is 'groq' | 'ollama' | 'synthesis'.
        """
        chunks = chunks or []
        api_key = os.getenv("GROQ_API_KEY", "").strip().strip('"').strip("'")

        # ── 1. Try Groq (high-speed cloud LLM) ────────────────────────
        if api_key and not api_key.startswith("your_"):
            models_to_try = [
                os.getenv("GROQ_MODEL", "openai/gpt-oss-120b"),
                "groq/compound-mini",
                "qwen/qwen3.6-27b",
                "qwen/qwen3.8-27b",
            ]
            for model_name in models_to_try:
                try:
                    import httpx
                    resp = httpx.post(
                        "https://api.groq.com/openai/v1/chat/completions",
                        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
                        json={
                            "model": model_name,
                            "messages": [
                                {"role": "system", "content": system_prompt},
                                {"role": "user", "content": user_prompt},
                            ],
                            "temperature": float(os.getenv("OLLAMA_TEMPERATURE", "0.1")),
                            "max_tokens": max_tokens,
                        },
                        timeout=10.0,
                    )
                    if resp.status_code == 200:
                        content = resp.json()["choices"][0]["message"]["content"].strip()
                        content = re.sub(r"<think>[\s\S]*?</think>", "", content).strip()
                        if "<think>" in content:
                            content = content.split("<think>")[-1].strip()
                        if content:
                            logger.info(f"✅ Groq [{model_name}] answered successfully")
                            return content, "groq"
                    elif resp.status_code in (401, 403):
                        logger.warning(f"Groq API Key unauthorized ({resp.status_code}), skipping cloud.")
                        break
                    else:
                        logger.warning(f"Groq [{model_name}] returned {resp.status_code}, trying next model")
                except Exception as e:
                    logger.warning(f"Groq [{model_name}] skipped: {e}")
                    continue

        # ── 2. Try local Ollama (only if server is reachable AND request completes fast) ──
        if self.embedder._check_ollama():
            try:
                import httpx
                ollama_model = os.getenv("OLLAMA_MODEL", "llama3")
                resp = httpx.post(
                    f"{OLLAMA_URL}/api/chat",
                    json={
                        "model": ollama_model,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_prompt},
                        ],
                        "stream": False,
                    },
                    timeout=15.0,
                )
                if resp.status_code == 200:
                    content = resp.json().get("message", {}).get("content", "").strip()
                    content = re.sub(r"<think>[\s\S]*?</think>", "", content).strip()
                    if content:
                        logger.info(f"✅ Ollama [{ollama_model}] answered successfully")
                        return content, "ollama"
            except Exception as e2:
                logger.info(f"Ollama chat failed (fast timeout): {e2}")

        # ── 3. High-quality deterministic RAG synthesis fallback (<1ms) ──
        logger.info("📚 Using deterministic RAG synthesis (offline fallback)")
        return self._synthesize_from_rag_knowledge(query, chunks), "synthesis"

    def _filter_think_stream(self, token_generator):
        """Filters out <think>...</think> reasoning blocks in real-time from streamed tokens."""
        in_think = False
        buf = ""

        for delta in token_generator:
            buf += delta

            if in_think:
                if "</think>" in buf:
                    after = buf.split("</think>", 1)[1].lstrip()
                    in_think = False
                    buf = ""
                    if after:
                        yield after
            else:
                if "<think>" in buf or buf.strip().startswith("<think"):
                    if "</think>" in buf:
                        after = buf.split("</think>", 1)[1].lstrip()
                        buf = ""
                        if after:
                            yield after
                    else:
                        in_think = True
                elif buf.strip().startswith("<") and len(buf.strip()) < 8 and "think".startswith(buf.strip()[1:]):
                    continue
                else:
                    yield buf
                    buf = ""

        if buf and not in_think:
            clean = re.sub(r"<think>[\s\S]*?</think>", "", buf).strip()
            if clean:
                yield clean

    def _generate_stream(self, system_prompt: str, user_prompt: str, query: str = "", chunks: list[dict] = None, max_tokens: int = 1024):
        """Streaming version using Groq API with Ollama fallback and deterministic RAG synthesis."""
        chunks = chunks or []
        api_key = os.getenv("GROQ_API_KEY", "").strip().strip('"').strip("'")
        self._current_stream_mode = "synthesis"

        # ── 1. Stream from Groq (high-speed cloud LLM) ────────────────────
        if api_key and not api_key.startswith("your_"):
            models_to_try = [
                os.getenv("GROQ_MODEL", "openai/gpt-oss-120b"),
                "groq/compound-mini",
                "qwen/qwen3.6-27b",
                "qwen/qwen3.8-27b",
            ]
            for model_name in models_to_try:
                try:
                    import httpx
                    with httpx.stream(
                        "POST",
                        "https://api.groq.com/openai/v1/chat/completions",
                        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
                        json={
                            "model": model_name,
                            "messages": [
                                {"role": "system", "content": system_prompt},
                                {"role": "user", "content": user_prompt},
                            ],
                            "temperature": float(os.getenv("OLLAMA_TEMPERATURE", "0.1")),
                            "max_tokens": max_tokens,
                            "stream": True,
                        },
                        timeout=12.0,
                    ) as response:
                        if response.status_code == 200:
                            self._current_stream_mode = "groq"
                            for line in response.iter_lines():
                                if line.startswith("data: "):
                                    data_str = line[6:]
                                    if data_str == "[DONE]":
                                        return
                                    try:
                                        data = json.loads(data_str)
                                        delta = data["choices"][0].get("delta", {}).get("content", "")
                                        if delta:
                                            yield delta
                                    except json.JSONDecodeError:
                                        continue
                            return
                        elif response.status_code in (401, 403):
                            logger.warning(f"Groq API Key unauthorized ({response.status_code}), skipping stream.")
                            break
                except Exception as e:
                    logger.warning(f"Groq stream [{model_name}] skipped: {e}")
                    continue

        # ── 2. Try local Ollama stream (with timeout protection) ──────────
        if self.embedder._check_ollama():
            try:
                import httpx
                ollama_model = os.getenv("OLLAMA_MODEL", "llama3")
                with httpx.stream(
                    "POST",
                    f"{OLLAMA_URL}/api/chat",
                    json={
                        "model": ollama_model,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_prompt},
                        ],
                        "stream": True,
                    },
                    timeout=15.0,
                ) as resp:
                    if resp.status_code == 200:
                        self._current_stream_mode = "ollama"
                        for line in resp.iter_lines():
                            if not line:
                                continue
                            try:
                                data = json.loads(line)
                                content = data.get("message", {}).get("content", "")
                                if content:
                                    yield content
                                if data.get("done"):
                                    return
                            except json.JSONDecodeError:
                                continue
                        return
            except Exception as e2:
                logger.info(f"Ollama stream failed: {e2}")

        # ── 3. Deterministic RAG synthesis — stream word-by-word ──────────
        self._current_stream_mode = "synthesis"
        fallback_text = self._synthesize_from_rag_knowledge(query, chunks)
        words = fallback_text.split(" ")
        for i in range(0, len(words), 3):
            chunk = " ".join(words[i:i+3]) + " "
            yield chunk

    def reindex(self):
        """Force rebuild the entire vector index."""
        logger.info("🔄 Force reindexing knowledge base...")
        self.vector_store.index_knowledge_base(force=True)
        self._query_cache.clear()
        logger.info("✅ Reindex complete")



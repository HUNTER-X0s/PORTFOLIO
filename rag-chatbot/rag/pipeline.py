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
        # Specialized prompt for Jarvis voice mode (cool, decent, formal, highly intelligent, spoken-friendly)
        if "jarvis" in role_context.lower() or "voice" in role_context.lower():
            return f"""You are Jarvis — Anurag Swain's official AI Voice Assistant.
You are inspired by J.A.R.V.I.S.: calm, composed, ultra-polite, formal, intelligent, and effortlessly cool.
Your responses are spoken aloud to the user via speech synthesis.

CRITICAL VOICE & PERSONA INSTRUCTIONS (strictly follow):
1. PERSONA & TONE: Speak with refined elegance, confidence, and formal courtesy. Begin naturally with respectful phrasing when appropriate (e.g., "Certainly,", "According to records,", "Anurag is currently...").
2. SHARP CONTEXTUAL INTELLIGENCE: Directly address what the user asked with high precision. If asked about hiring or availability, directly state availability and target roles without dumping unnecessary clutter.
3. POINT-WISE STRUCTURE: Deliver 2 to 5 crisp, high-impact bullet points maximum using the format `- **Topic**: concise description`.
4. STRICT PROHIBITION FOR SPEECH SYNTHESIS:
   - DO NOT use markdown section headings (`#`, `##`, `###`).
   - DO NOT use horizontal dividers (`---`) or markdown tables.
   - DO NOT output raw URLs or bracketed markdown links (say "his GitHub" or "his email", not raw links).
   - DO NOT include numeric skill percentages in your responses (e.g., NEVER say "Python 88%" or "Python at 88%" or "JavaScript (82%)"). Simply name the skill or technology — e.g., "Python, JavaScript, C++, Machine Learning". Proficiency numbers are visual-only and NOT suitable for spoken output.
5. THIRD PERSON: Speak in third person ("Anurag is...", "He has engineered...").
6. ACCURACY: Base candidate details on Anurag's verified portfolio.

Candidate Snapshot: Anurag Swain | 3rd-Year B.Tech CSE @ GCE Kalahandi (CGPA 8.10/10.00) | 5 Internships in 2025 (Infosys AI, EISystems Web, IBM/Edunet AI, MicroGenesis DL, Shadow Fox Data Science) | Available for SDE, AI/ML, Full-Stack roles."""

        length_guide = {
            "quick": (
                "QUERY SCOPE: Direct fact or simple inquiry. "
                "Provide a sharp, direct, 1-2 line answer focusing exclusively on the specific question asked. "
                "Do NOT dump unrelated background information."
            ),
            "medium": (
                "QUERY SCOPE: Standard topic overview. "
                "Provide a clean, pointed, structured response using markdown bullet points (`-`) and bold labels. "
                "Include ONLY information directly relevant to the user's inquiry."
            ),
            "detailed": (
                "QUERY SCOPE: Comprehensive analysis / deep-dive inquiry. "
                "Provide an in-depth, well-organized breakdown using `###` section headers and `-` bullet points. "
                "Include metrics, architectural workflows, and key outcomes while staying strictly relevant to the question."
            ),
        }[complexity]

        return f"""You are Nexus, the official intelligent AI representative for Anurag Swain's portfolio, powered by modern LLM intelligence (comparable to ChatGPT and Gemini models).
You are capable of answering any technical, portfolio, career, or general question with exceptional sharpness, precision, and intelligence.

CORE INTELLIGENCE & RELEVANCE RULES:
1. SHARP CONTEXTUAL RELEVANCE: Answer EXACTLY what the user asks. Provide only the relevant context needed for that specific query. NEVER dump unrelated resume sections, unrequested grades, or irrelevant project listings.
2. ADAPTIVE INTELLIGENCE:
   - If asked about hiring/availability (e.g. "Is Anurag available for hire?"), answer directly with a clear "Yes, Anurag is actively available for hire..." followed by targeted details (target roles, experience highlights, contact channels).
   - If asked technical or coding questions (e.g. "Explain RAG", "Compare Next.js vs React"), explain smartly with clear, structured bullet points.
   - If asked for quick facts (CGPA, college name, email, GitHub), answer directly in 1-2 points without fluff.
3. STRICT POINTED FORMATTING & NO TABLES (CRITICAL):
   - Format all responses using markdown bullet points (`- **Key**: Details`) and clean `###` section headers where applicable.
   - STRICT PROHIBITION: NEVER generate markdown tables (no `| col | col |` syntax). Tables break layout and overflow in compact chat windows. Always present metrics, model architectures, comparisons, evaluations, and technical stats as clean BULLET POINTS (e.g. `- **XGBoost (Best)**: MAPE 12.3% · RMSE 2.12 kWh · R² 0.71`).
   - Avoid long monolithic prose paragraphs; keep points easily scannable and executive-ready.
4. TONE & ACCURACY:
   - Professional, articulate, intelligent, polite, and confident.
   - Speak in third person ("Anurag is...", "He developed...").
{f'5. Recruiter Perspective: Emphasize strengths and competencies relevant to a {role_context} role.' if role_context else ''}

{length_guide}

Candidate Snapshot: Anurag Swain | 3rd-Year B.Tech CSE @ GCE Kalahandi (CGPA 8.10/10.00) | 5 Internships in 2025 (Infosys AI, EISystems Web, IBM/Edunet AI, MicroGenesis DL, Shadow Fox Data Science) | Available for SDE, AI/ML, Full-Stack roles."""

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

INSTRUCTION: Provide a brief, point-wise response with 2-4 bullet points maximum. STRICTLY DO NOT use any # headings, markdown tables, or prose paragraphs. Keep it brief and clear for voice readout."""
            return prompt

        response_hint = {
            "quick": (
                "Answer directly with 1-2 pointed lines. Provide only the specific information requested. DO NOT use markdown tables."
            ),
            "medium": (
                "Provide a smart, well-organized response in pointed format using `- **Label**: Description` and `###` headers if helpful. DO NOT use markdown tables; use bullet points for metrics and comparisons."
            ),
            "detailed": (
                "Provide a comprehensive, high-depth breakdown in structured bullet points with `###` headers, metrics, and outcomes. DO NOT use markdown tables under any circumstance; present all metrics, model architectures, and evaluations as clean bullet points (`- **Model/Metric**: Details`)."
            ),
        }[complexity]

        prompt = f"""CONTEXT:
{context_text}

{'RECENT CONVERSATION:' if history_text else ''}
{history_text}

USER QUESTION: {query}

INSTRUCTION: {response_hint} Answer intelligently and directly in clean pointed format (STRICTLY NO TABLES)."""
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
                "### 💡 Technical Skills & Core Competencies\n\n"
                "#### 🐍 Programming Languages\n"
                "- **Python (88%)**: Primary language for AI/ML, NLP, data pipelines, and backend APIs\n"
                "- **JavaScript (82%)**: Core web development, dynamic DOM, and asynchronous workflows\n"
                "- **C / C++ (80% / 78%)**: Core algorithms, Data Structures, and systems programming\n"
                "- **Java (75%)**: Object-oriented software design and enterprise fundamentals\n"
                "- **SQL (80%)**: Relational schema design, complex joins, and query optimization\n"
                "- **PHP (60%)**: Server-side scripting\n\n"
                "#### 🤖 AI / Machine Learning / Deep Learning\n"
                "- **Scikit-Learn (82%)**: Supervised regression, classification, and Random Forest\n"
                "- **TensorFlow & Keras (80%)**: Deep neural network architecture design and training\n"
                "- **PyTorch (78%)**: Custom CNN architectures (VGG, ResNet)\n"
                "- **Computer Vision (75%)**: OpenCV image preprocessing and feature extraction\n"
                "- **NLP & RAG Systems**: Multi-turn dialogue, vector embeddings, and ChromaDB\n\n"
                "#### 🌐 Full-Stack Web Development\n"
                "- **React.js (78%)**: Custom hooks, state management, component architecture\n"
                "- **Next.js 14 (74%)**: Server-Side Rendering (SSR), App Router, dynamic routes\n"
                "- **Node.js (73%) & Express.js**: RESTful API design and backend services\n"
                "- **Python FastAPI**: High-speed asynchronous AI/RAG microservices\n"
                "- **Databases**: MongoDB (70%) NoSQL modeling and MySQL (78%) relational DBs\n"
                "- **Styling**: Tailwind CSS (75%), HTML5/CSS3 (85%), responsive design\n\n"
                "#### 📊 Data Science & Analytics\n"
                "- **Pandas & NumPy (85%)**: Data ingestion, manipulation, and numerical computing\n"
                "- **Matplotlib & Seaborn (80%)**: Statistical data visualization and EDA\n"
                "- **Jupyter Notebook (85%)**: Reproducible analysis workflows\n"
                "- **Tableau (74%)**: Interactive business intelligence dashboards\n"
                "- **Power BI (68%)**: KPI tracking and analytics reports\n\n"
                "#### 🛠️ Tools & DevOps\n"
                "- **Git & GitHub (82%)**: Version control, branch management, collaborative workflows\n"
                "- **Docker**: Containerization and reproducible deployment\n"
                "- **Cloud & Deployment**: Vercel Edge, Render.com, IBM Watson Cloud APIs\n"
                "- **Operating Systems**: Linux / Ubuntu (68%) CLI proficiency\n"
                "- **Dev Tools**: VS Code (88%), Postman API testing, Figma wireframing"
            )

        # 2. Projects
        if any(w in q for w in ["project", "best project", "explain", "ai chat bot", "ev", "demand", "research agent", "portfolio"]):
            return (
                "### 🚀 Key Featured Projects\n\n"
                "#### 1. 🤖 AI Chat Bot (Conversational NLP System)\n"
                "- **Tech Stack**: Python, NLP, LLM API Integration, Session Dialogue Management\n"
                "- **Role**: Developed during Infosys AI Internship\n"
                "- **Highlights**: Multi-turn context memory, intent parsing, and entity recognition\n"
                "- **GitHub**: [github.com/HUNTER-X0s/AI_CHAT_BOT](https://github.com/HUNTER-X0s/AI_CHAT_BOT) (⭐1)\n\n"
                "#### 2. 🚗 EV Vehicle Charging Demand Prediction\n"
                "- **Tech Stack**: Python, Scikit-Learn, Random Forest, Pandas, Matplotlib\n"
                "- **Role**: Developed under AICTE Internship Cycle-2 at Edunet Foundation\n"
                "- **Accuracy**: Achieved $R^2=0.86$ (86% variance explained) with 18% RMSE reduction\n"
                "- **GitHub**: [github.com/HUNTER-X0s/EV-VEHICLE-CHARGING-DEMAND-PREDICTION](https://github.com/HUNTER-X0s/EV-VEHICLE-CHARGING-DEMAND-PREDICTION) (⭐1)\n\n"
                "#### 3. 🔍 Autonomous Research Agent\n"
                "- **Tech Stack**: Python, IBM Watson Cloud APIs, NLP Summarization\n"
                "- **Role**: Capstone project for IBM SkillsBuild\n"
                "- **Highlights**: Multi-source research synthesis, automated extraction, and executive brief drafting\n"
                "- **GitHub**: [github.com/HUNTER-X0s/RESEARCH_AGENT](https://github.com/HUNTER-X0s/RESEARCH_AGENT)\n\n"
                "#### 4. 💱 Currency Converter Web Application\n"
                "- **Tech Stack**: Vanilla JavaScript, HTML5, CSS3, Live Exchange Rate APIs\n"
                "- **Highlights**: Real-time currency conversions across 150+ currencies with localStorage caching\n"
                "- **Live Demo**: [hunter-x0s.github.io/Currency_Converter](https://hunter-x0s.github.io/Currency_Converter/) (⭐1)\n\n"
                "#### 5. 🌐 AI-Powered 3D Portfolio Platform\n"
                "- **Tech Stack**: Next.js 14, Three.js, RAG AI Pipeline, Web Speech API (Jarvis Voice), TailwindCSS\n"
                "- **Highlights**: 60fps particle physics, dual-mode RAG chatbot, voice control, command palette"
            )

        # 3. Internships / Experience
        if any(w in q for w in ["experience", "intern", "internship", "company", "infosys", "eisystems", "edunet", "microgenesis", "shadowfox", "work", "summary"]):
            return (
                "### 💼 Professional Experience (5 Internships in 2025)\n\n"
                "#### 1. 🏢 Infosys — AI Intern\n"
                "- **Duration**: August 2025 – October 2025 (3 months · Remote)\n"
                "- **Project**: Developed conversational AI Chat Bot with multi-turn dialogue management\n"
                "- **Tech**: Python, NLP Preprocessing, LLM APIs, Intent Classification\n"
                "- **Credential**: Infosys Springboard Virtual Internship 2.0 Completion Certificate\n\n"
                "#### 2. 💻 EISystems Technologies — Web Development Intern\n"
                "- **Duration**: July 2025 – September 2025 (3 months · Remote)\n"
                "- **Project**: Built production full-stack web applications\n"
                "- **Tech**: React.js, Next.js, Node.js, Express.js, MongoDB, RESTful APIs\n"
                "- **Optimizations**: Applied code splitting, lazy loading, and component-driven architecture\n\n"
                "#### 3. ☁️ Edunet Foundation & IBM — AI & Analytics Intern\n"
                "- **Duration**: July 2025 – August 2025 (2 months · Remote)\n"
                "- **Project 1**: AICTE-certified EV Charging Demand Prediction ML pipeline ($R^2=0.86$)\n"
                "- **Project 2**: Autonomous Research Agent for IBM SkillsBuild\n"
                "- **Tech**: Python, Scikit-Learn, Tableau, Microsoft Power BI, IBM Watson Cloud APIs\n\n"
                "#### 4. 🧠 MicroGenesis TechSoft, Bangalore — Deep Learning Intern\n"
                "- **Duration**: June 2025 – July 2025 (2 months · Hybrid In-Person)\n"
                "- **Project**: Computer Vision and Convolutional Neural Networks\n"
                "- **Tech**: PyTorch, TensorFlow, Keras, OpenCV, Python\n"
                "- **Recognition**: 12+ technical skill endorsements on LinkedIn\n\n"
                "#### 5. 📊 Shadow Fox — Data Science Intern\n"
                "- **Duration**: 2025 (1 month · Remote)\n"
                "- **Project**: End-to-end exploratory data analysis (EDA) and predictive modeling\n"
                "- **Tech**: Python, Pandas, NumPy, Scikit-Learn, Matplotlib, Seaborn\n\n"
                "#### ⏱️ Aggregate Industry Experience\n"
                "- **Total Duration**: ~12 months of structured industry work across AI, Web Dev, DL, and Data Science"
            )

        # 4. Education / College / CGPA
        if any(w in q for w in ["education", "college", "cgpa", "gpa", "degree", "university", "bput", "gcek", "school", "grade", "academic"]):
            return (
                "### 🎓 Educational Background\n\n"
                "#### 1. 🏫 Undergraduate Degree (2023 – 2027)\n"
                "- **Degree**: Bachelor of Technology (B.Tech) in Computer Science and Engineering (CSE)\n"
                "- **Institution**: Government College of Engineering, Kalahandi (GCEK)\n"
                "- **Affiliation**: Biju Patnaik University of Technology (BPUT), Odisha\n"
                "- **Academic Metric**: **CGPA: 8.10 / 10.00**\n"
                "- **Extracurricular**: Active technical member of **KiloBots Robotics Club**\n\n"
                "#### 2. 🏫 Senior Secondary / Class XII (2023)\n"
                "- **School**: Kendriya Vidyalaya No-6, Pokhariput, Bhubaneswar\n"
                "- **Board**: CBSE (Science — Physics, Chemistry, Mathematics, Biology)\n"
                "- **Leadership**: Appointed **Ashoka House Sports Captain**\n\n"
                "#### 3. 🏫 Secondary / Class X (2021)\n"
                "- **School**: Kendriya Vidyalaya No-6, Pokhariput, Bhubaneswar\n"
                "- **Board**: CBSE"
            )

        # 5. Availability / Hire / Role
        if any(w in q for w in ["hire", "available", "role", "looking for", "job", "opportunity", "suited", "best suited", "why hire"]):
            return (
                "### ✅ Candidate Availability & Value Proposition\n\n"
                "#### 🟢 Current Status\n"
                "- **Availability**: Actively open for Internships, Part-Time, and Full-Time positions\n"
                "- **Target Roles**: Software Development Engineer (SDE), AI/ML Engineer, Full-Stack Developer, Data Scientist\n"
                "- **Work Modes**: Remote, Hybrid, or Relocation across India\n\n"
                "#### ⭐ Top 5 Reasons to Hire Anurag:\n"
                "- **1. Rare Experience**: Completed 5 competitive internships in 2025 across AI, Deep Learning, Full-Stack, and Data Science\n"
                "- **2. Strong Academics**: 8.10 / 10.00 CGPA in B.Tech CSE at Government College of Engineering, Kalahandi\n"
                "- **3. Full-Stack + AI Depth**: Can build both the machine learning model / RAG pipeline and the production web app\n"
                "- **4. Verified Credentials**: Certified by IBM, AICTE, Infosys, and MicroGenesis TechSoft\n"
                "- **5. Prolific Builder**: 14+ public GitHub repositories with community recognition\n\n"
                "#### 📬 Get in Touch:\n"
                "- **Email**: [anurag.swain35@gmail.com](mailto:anurag.swain35@gmail.com)\n"
                "- **Phone**: +91-7008973337\n"
                "- **Response Window**: Within 24 hours"
            )

        # 6. Contact / Socials / Resume
        if any(w in q for w in ["contact", "email", "phone", "linkedin", "github", "location", "resume", "reach", "who is", "about"]):
            return (
                "### 📬 Contact & Connect with Anurag Swain\n\n"
                "#### 📞 Direct Channels\n"
                "- **Primary Email**: [anurag.swain35@gmail.com](mailto:anurag.swain35@gmail.com)\n"
                "- **Alternate Email**: [anuragswain01@outlook.com](mailto:anuragswain01@outlook.com)\n"
                "- **Phone / WhatsApp**: +91-7008973337\n"
                "- **Location**: OldTown, Bhubaneswar, Odisha, India (PIN 751002)\n"
                "- **Response Time**: Under 24 hours guaranteed\n\n"
                "#### 🌐 Social & Developer Profiles\n"
                "- **LinkedIn**: [linkedin.com/in/anurag-swain-cse07](https://www.linkedin.com/in/anurag-swain-cse07/)\n"
                "- **GitHub**: [github.com/HUNTER-X0s](https://github.com/HUNTER-X0s)\n"
                "- **Twitter / X**: [@Anurag_hunter07](https://x.com/Anurag_hunter07)\n"
                "- **Instagram**: [@_vi_ll_a_in_](https://www.instagram.com/_vi_ll_a_in/)\n"
                "- **Threads**: [@_vi_ll_a_in_](https://www.threads.com/@_vi_ll_a_in_)"
            )

        # 7. Certifications
        if any(w in q for w in ["certif", "badge", "license", "course"]):
            return (
                "### 🏆 Verified Certifications & Credentials\n\n"
                "#### 🏢 Professional Internship Certifications (2025)\n"
                "- **Infosys**: Artificial Intelligence Virtual Internship 2.0 Certificate\n"
                "- **MicroGenesis TechSoft**: Deep Learning Internship Certificate (Bangalore)\n"
                "- **EISystems Technologies**: Full-Stack Web Development Internship Certificate\n"
                "- **Edunet Foundation**: AI & Data Analytics Internship Certificate\n"
                "- **IBM SkillsBuild**: AI & Cloud Technologies Capstone Credential\n"
                "- **AICTE**: Internship Cycle-2 Certificate (EV Demand Prediction)\n"
                "- **Shadow Fox**: Data Science Internship Certificate\n\n"
                "#### 💻 Platform & Technical Certifications\n"
                "- **HackerRank**: Python & Problem Solving Certifications\n"
                "- **Cisco Networking Academy**: Cybersecurity Fundamentals\n\n"
                "#### 📁 Verified Credentials Repository\n"
                "- **GitHub**: [github.com/HUNTER-X0s/CERTIFICATIONS](https://github.com/HUNTER-X0s/CERTIFICATIONS)"
            )

        # 8. Clubs & Extracurriculars
        if any(w in q for w in ["club", "robotic", "kilobots", "activity", "extracurricular", "volunteer"]):
            return (
                "### 🏅 Clubs & Extracurricular Activities\n\n"
                "- **KiloBots Robotics Club (GCE Kalahandi)**: Active technical member contributing to autonomous robotics, embedded systems, and competitions\n"
                "- **Sports Leadership**: Former Ashoka House Sports Captain; active competitive player in badminton and chess\n"
                "- **Hackathons & Fests**: Active participant and volunteer at collegiate engineering fests and tech hackathons"
            )

        # 9. Generic RAG Chunk Extraction Fallback
        if chunks:
            extracted_text = "\n\n".join(c["content"].strip() for c in chunks[:2])
            return (
                f"### 📋 Verified Portfolio Records\n\n"
                f"{extracted_text}\n\n"
                f"💡 *Feel free to ask about specific projects, internships, technical skills, or education!*"
            )

        return (
            "Anurag Swain is a 3rd-year B.Tech CSE student at GCE Kalahandi (CGPA 8.10/10.00) with 5 internships in AI, Web Dev, and Data Science. "
            "You can ask me about his **skills**, **projects (AI Chatbot, EV Prediction)**, **internships (Infosys, IBM, MicroGenesis)**, or **contact details**!"
        )

    def _clean_response_text(self, text: str) -> str:
        """Strip <think> blocks, markdown thinking dumps, reasoning preambles, and convert markdown tables to bullets."""
        if not text:
            return ""
        cleaned = re.sub(r"<think>[\s\S]*?</think>", "", text).strip()
        if "<think>" in cleaned:
            cleaned = cleaned.split("<think>")[-1].strip()
        if "</think>" in cleaned:
            cleaned = cleaned.split("</think>")[-1].strip()

        # If plain text chain-of-thought is emitted
        if "thinking process" in cleaned.lower() or "thought process" in cleaned.lower():
            markers = [
                r"(?i)(?:\[Output Generation\]|\bOutput generation\.?|\bFinal Output:?|\bOutput:?)\s*(?:->\s*\*?[A-Za-z]+\*?)?\s*[\"']?",
                r"(?i)(?:\bDraft:\s*\n)(?=[\s\S]*?(?:- \*\*|###))",
            ]
            for m in markers:
                parts = re.split(m, cleaned)
                if len(parts) > 1 and parts[-1].strip():
                    candidate = parts[-1].strip().strip('"').strip("'")
                    if len(candidate) > 20:
                        cleaned = candidate
                        break

            if re.match(r"(?i)^\s*(?:Here(?:'s| is) a thinking process|Thinking Process)", cleaned):
                matches = list(re.finditer(r"(?m)^(?:Certainly\b|Anurag\b|- \*\*|### )", cleaned))
                if matches:
                    cleaned = cleaned[matches[-1].start():].strip()

        # Convert any residual markdown tables to clean bulleted format
        if "|" in cleaned:
            lines = cleaned.split("\n")
            new_lines = []
            table_rows = []
            in_table = False

            def process_table(rows):
                if not rows:
                    return []
                valid_rows = [r for r in rows if not all(re.match(r"^[-:\s]+$", cell.strip()) for cell in r)]
                if len(valid_rows) <= 1:
                    return [" · ".join(c.strip() for c in r if c.strip()) for r in valid_rows]
                headers = [h.strip() for h in valid_rows[0]]
                output = []
                for row in valid_rows[1:]:
                    cells = [c.strip() for c in row]
                    if not any(cells):
                        continue
                    title = cells[0] if cells[0] else "Metric"
                    details = []
                    for j in range(1, len(cells)):
                        if cells[j]:
                            header_label = f"**{headers[j]}**: " if j < len(headers) and headers[j] else ""
                            details.append(f"{header_label}{cells[j]}")
                    if details:
                        output.append(f"- **{title}** — {' · '.join(details)}")
                    else:
                        output.append(f"- **{title}**")
                return output

            for line in lines:
                trimmed = line.strip()
                if trimmed.startswith("|") and trimmed.endswith("|"):
                    in_table = True
                    cells = [c.strip() for c in trimmed[1:-1].split("|")]
                    table_rows.append(cells)
                else:
                    if in_table:
                        new_lines.extend(process_table(table_rows))
                        table_rows = []
                        in_table = False
                    new_lines.append(line)
            if in_table and table_rows:
                new_lines.extend(process_table(table_rows))
            cleaned = "\n".join(new_lines)

        return cleaned.strip()

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
                "openai/gpt-oss-120b",
                "groq/compound-mini",
                "qwen/qwen3.8-27b",
                "openai/gpt-oss-20b",
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
                        raw_content = resp.json()["choices"][0]["message"]["content"]
                        content = self._clean_response_text(raw_content)
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



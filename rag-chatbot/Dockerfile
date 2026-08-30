# ============================================================
# DOCKERFILE — RAG Chatbot Backend (Python / FastAPI)
# Deployed on Render via runtime: docker
# dockerfilePath: ./rag-chatbot/Dockerfile
# dockerContext:  ./rag-chatbot
# ============================================================

FROM python:3.11-slim

# Set working directory
WORKDIR /app

# System dependencies (build tools + curl for healthcheck)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip
RUN pip install --no-cache-dir --upgrade pip

# Install Python dependencies
COPY requirements.txt .
RUN pip install --default-timeout=180 --no-cache-dir -r requirements.txt

# Pre-download the ONNX embedding model during build (no PyTorch / no Ollama needed)
# This ensures the first user request is instant on Render cold starts
RUN python -c "\
from chromadb.utils.embedding_functions import DefaultEmbeddingFunction; \
ef = DefaultEmbeddingFunction(); \
ef(['warmup']); \
print('ONNX embedding model pre-loaded successfully')"

# Copy entire application
COPY . .

# Create required runtime directories
RUN mkdir -p chroma_db cache uploads logs

# Render assigns PORT=10000 by default
EXPOSE 10000

# Healthcheck — waits 120s for startup (ONNX warmup + ChromaDB index load)
HEALTHCHECK --interval=30s --timeout=15s --start-period=180s --retries=5 \
  CMD curl -f http://localhost:${PORT:-10000}/api/health || exit 1

# Entrypoint: run as python main.py (reads HOST/PORT from env)
CMD ["sh", "-c", "python main.py"]

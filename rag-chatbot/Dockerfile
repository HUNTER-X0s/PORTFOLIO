FROM python:3.11-slim

WORKDIR /app

# System dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies (trimmed — no TensorFlow)
COPY requirements.txt .
RUN pip install --default-timeout=180 --no-cache-dir -r requirements.txt

# Pre-download the ultra-lightweight ONNX model for embeddings (no PyTorch required!)
RUN python -c "from chromadb.utils.embedding_functions import DefaultEmbeddingFunction; DefaultEmbeddingFunction()"

# Copy application
COPY . .

# Create required directories
RUN mkdir -p chroma_db cache uploads logs

# Expose Render's default port
EXPOSE 10000

# Health check
HEALTHCHECK --interval=30s --timeout=15s --start-period=120s --retries=3 \
  CMD curl -f http://localhost:${PORT:-10000}/api/health || exit 1

# Run
CMD ["sh", "-c", "python main.py"]

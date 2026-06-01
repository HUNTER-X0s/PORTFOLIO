FROM python:3.11-slim

WORKDIR /app

# System dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --default-timeout=120 --no-cache-dir -r requirements.txt

# Pre-download sentence-transformers model so it's baked into the image
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')"

# Copy application
COPY . .

# Create required directories
RUN mkdir -p chroma_db cache uploads logs

# Expose Render's default port
EXPOSE 10000

# Health check
HEALTHCHECK --interval=30s --timeout=15s --start-period=120s --retries=3 \
  CMD curl -f http://localhost:${PORT:-10000}/api/health || exit 1

# Run — use PORT env var so Render can override it
CMD ["sh", "-c", "python main.py"]

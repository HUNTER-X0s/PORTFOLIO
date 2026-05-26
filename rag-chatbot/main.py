"""
main.py — Entry point for the RAG Chatbot API
Run: python main.py
"""
import os
import sys
import logging
import uvicorn
from dotenv import load_dotenv
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler("chatbot.log", encoding="utf-8"),
    ],
)

logger = logging.getLogger("main")

def check_ollama():
    """Check if Ollama is running and the model is available."""
    try:
        import ollama
        client = ollama.Client(host=os.getenv("OLLAMA_BASE_URL", "http://localhost:11434"))
        models = client.list()
        model_names = [m["name"] for m in models.get("models", [])]
        target = os.getenv("OLLAMA_MODEL", "llama3")
        embed_target = os.getenv("OLLAMA_EMBED_MODEL", "nomic-embed-text")

        logger.info(f"📦 Available Ollama models: {model_names}")

        missing = []
        if not any(target.split(":")[0] in m for m in model_names):
            missing.append(target)
        if not any(embed_target.split(":")[0] in m for m in model_names):
            missing.append(embed_target)

        if missing:
            logger.warning(f"⚠️  Models not found: {missing}")
            for m in missing:
                logger.warning(f"   Run: ollama pull {m}")
        else:
            logger.info(f"✅ Ollama models ready: {target}, {embed_target}")

    except Exception as e:
        logger.warning(f"⚠️  Ollama not available: {e}")
        logger.warning("    Will fall back to sentence-transformers for embeddings")
        logger.warning("    Start Ollama with: ollama serve")


def create_directories():
    """Ensure required directories exist."""
    dirs = [
        os.getenv("CHROMA_PERSIST_DIR", "./chroma_db"),
        os.getenv("CACHE_DIR", "./cache"),
        "./uploads",
        "./logs",
    ]
    for d in dirs:
        Path(d).mkdir(parents=True, exist_ok=True)
    logger.info("✅ Directories ready")


if __name__ == "__main__":
    logger.info("=" * 60)
    logger.info("🤖 Anurag Swain — Portfolio RAG Chatbot API")
    logger.info("=" * 60)

    create_directories()
    check_ollama()

    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8001"))
    env  = os.getenv("ENV", "development")

    logger.info(f"🚀 Starting server at http://{host}:{port}")
    logger.info(f"📚 Docs: http://localhost:{port}/docs")
    logger.info(f"🔧 Environment: {env}")

    uvicorn.run(
        "api.server:app",
        host=host,
        port=port,
        reload=(env == "development"),
        reload_dirs=["api", "rag"],
        log_level="info",
        access_log=True,
    )

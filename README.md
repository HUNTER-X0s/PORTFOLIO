# 🚀 Anurag Swain — AI Portfolio Platform

A futuristic AI-powered personal brand platform combining:
- **Next.js 14** frontend with Three.js, GSAP, Framer Motion
- **Express.js + MongoDB** backend with JWT auth
- **RAG Chatbot** powered by Ollama + ChromaDB + FastAPI
- **Admin Panel** for full CMS management
- **Docker + CI/CD** for production deployment

## Quick Start (5 minutes)

```bash
# 1. Start Ollama
ollama serve
ollama pull llama3
ollama pull nomic-embed-text

# 2. Frontend
cd portfolio && npm install && npm run dev
# → http://localhost:3000

# 3. Backend
cd server && npm install && npm run dev
# → http://localhost:5001

# 4. RAG Chatbot
cd rag-chatbot && pip install -r requirements.txt && python main.py
# → http://localhost:8001

# 5. Admin Panel
cd admin && npm install && npm run dev
# → http://localhost:3001
```

## Project Structure

```
ANURAG_PORTFOLIO/
├── portfolio/          ← Next.js frontend (main portfolio)
├── server/             ← Express.js backend
├── rag-chatbot/        ← RAG AI chatbot (Python/FastAPI)
├── admin/              ← Admin CMS panel
├── docker/             ← Docker Compose + configs
├── nginx/              ← Nginx reverse proxy config
├── .github/workflows/  ← CI/CD pipeline
└── docs/               ← All documentation
```

## Documentation
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [System Architecture](SYSTEM_COMPLETE.md)
- [RAG Chatbot Setup](docs/SETUP_GUIDE.md)
- [Certifications Upload](docs/CERTIFICATIONS_SETUP.md)
- [Resume Variations](docs/resumes-all-roles.txt)

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | Next.js 14, React, Tailwind, Three.js, GSAP, Framer Motion |
| Backend | Node.js, Express.js, MongoDB, JWT, Nodemailer |
| AI/RAG | FastAPI, Ollama (llama3), ChromaDB, sentence-transformers |
| Admin | Next.js 14, Zustand, React-hot-toast |
| DevOps | Docker, Nginx, GitHub Actions, Vercel, Render |

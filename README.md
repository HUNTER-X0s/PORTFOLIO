# 🚀 Anurag Swain — AI Portfolio Platform

A futuristic AI-powered developer portfolio platform built with modern full-stack technologies, AI integrations, and production-ready deployment architecture.

---

## ✨ Features

- ⚡ Next.js 14 Portfolio Frontend
- 🎨 Three.js + GSAP + Framer Motion Animations
- 🤖 AI Chatbot powered by RAG + Ollama
- 🔐 JWT Authentication System
- 📊 Admin CMS Dashboard
- 📩 Contact & Email System
- 🧠 Vector Search with ChromaDB
- 🐳 Dockerized Microservices
- 🚀 CI/CD Deployment Pipeline
- 📱 Fully Responsive UI

---

# 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, React, Tailwind CSS, Three.js |
| Animation | GSAP, Framer Motion |
| Backend | Node.js, Express.js, MongoDB |
| Authentication | JWT |
| AI/RAG | Ollama, FastAPI, ChromaDB |
| Admin Panel | Next.js, Zustand |
| DevOps | Docker, Nginx, GitHub Actions |
| Deployment | Vercel, Render |

---

# 📂 Project Structure

```bash
ANURAG_PORTFOLIO/
├── portfolio/          # Main Next.js Portfolio
├── server/             # Express.js Backend
├── rag-chatbot/        # AI RAG Chatbot (FastAPI)
├── admin/              # Admin Dashboard CMS
├── docker/             # Docker Configurations
├── nginx/              # Reverse Proxy Config
├── .github/workflows/  # CI/CD Pipelines
└── docs/               # Documentation
```

---

# ⚡ Quick Start

## 1️⃣ Start Ollama

```bash
ollama serve
ollama pull llama3
ollama pull nomic-embed-text
```

---

## 2️⃣ Start Frontend

```bash
cd portfolio
npm install
npm run dev
```

➡ Frontend: `http://localhost:3000`

---

## 3️⃣ Start Backend

```bash
cd server
npm install
npm run dev
```

➡ Backend: `http://localhost:5001`

---

## 4️⃣ Start RAG Chatbot

```bash
cd rag-chatbot
pip install -r requirements.txt
python main.py
```

➡ AI API: `http://localhost:8001`

---

## 5️⃣ Start Admin Panel

```bash
cd admin
npm install
npm run dev
```

➡ Admin Dashboard: `http://localhost:3001`

---

# 📸 Screenshots

## 🌌 Portfolio Homepage
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/df06b53a-4b0e-402f-8450-0bb4e5935806" />


## 🤖 AI Chatbot
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/582a9396-9adb-4ffc-b7d7-83b9ed779c1c" />


## 📊 Admin Dashboard
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/1cba2d62-8000-4b47-a9f4-cc44f12c663c" />


---

# 🚀 Deployment

- Frontend → Vercel
- Backend → Render
- AI Chatbot → VPS / Docker
- Database → MongoDB Atlas

---

# 📚 Documentation

- Deployment Guide
- System Architecture
- RAG Chatbot Setup
- Certifications Upload
- Resume Variations

---

# 🔐 Environment Variables

Create `.env.local` inside `/portfolio`

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_CHATBOT_URL=
```

Create `.env` inside `/server`

```env
MONGODB_URI=
JWT_SECRET=
EMAIL_USER=
EMAIL_PASS=
```

---

# 🐳 Docker Support

```bash
docker-compose up --build
```

---

# 👨‍💻 Author

## Anurag Swain

- AI Engineer
- Full Stack Developer
- Data Scientist 

---

# ⭐ Support

If you like this project, give it a ⭐ on GitHub.

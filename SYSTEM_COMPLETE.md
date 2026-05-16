# 🏗️ COMPLETE SYSTEM ARCHITECTURE
## Anurag Swain — AI Portfolio Platform
## Final Folder Structure & System Documentation

---

## 📁 Complete Project Structure

```
portfolio-platform/                     ← Root monorepo
│
├── portfolio/                          ← FRONTEND (Next.js 14)
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx              ← Root layout + fonts + SEO metadata
│   │   │   ├── page.tsx                ← Main page assembly
│   │   │   ├── sitemap.ts              ← Auto-generated /sitemap.xml
│   │   │   ├── robots.ts               ← Auto-generated /robots.txt
│   │   │   └── api/
│   │   │       ├── contact/route.ts    ← Contact form API
│   │   │       └── github/route.ts     ← GitHub stats proxy
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── button.tsx          ← ShadCN-style Button
│   │   │   │   └── card.tsx            ← Badge, GlowCard, StatCard
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx          ← Role selector + scroll progress
│   │   │   │   ├── CustomCursor.tsx    ← Glow cursor with spring physics
│   │   │   │   ├── CommandPalette.tsx  ← Ctrl+K command palette
│   │   │   │   ├── MusicModal.tsx      ← Ambient sound modal
│   │   │   │   └── ScrollProgress.tsx  ← Side scroll indicators
│   │   │   ├── sections/
│   │   │   │   ├── Hero.tsx            ← Holographic avatar + terminal
│   │   │   │   ├── About.tsx           ← Bio + GSAP counter stats
│   │   │   │   ├── Skills.tsx          ← Radar chart + animated bars
│   │   │   │   ├── Projects.tsx        ← Filterable cards + modal
│   │   │   │   ├── Experience.tsx      ← Timeline + expandable projects
│   │   │   │   ├── GitHub.tsx          ← Live stats + contribution calendar
│   │   │   │   ├── ValueProp.tsx       ← Dynamic per-role content
│   │   │   │   ├── Analytics.tsx       ← Certs + code metrics bar chart
│   │   │   │   ├── Blog.tsx            ← Tag-filtered blog grid
│   │   │   │   └── Contact.tsx         ← Validated contact form
│   │   │   ├── animations/
│   │   │   │   └── ScrollReveal.tsx    ← GSAP + Framer Motion wrappers
│   │   │   ├── three/
│   │   │   │   ├── ParticleField.tsx   ← Three.js neural particle background
│   │   │   │   └── HolographicSphere.tsx ← 3D hero sphere
│   │   │   └── ai/
│   │   │       └── ChatBot.tsx         ← RAG-connected floating chatbot
│   │   ├── data/
│   │   │   └── portfolio.ts            ← ALL CONTENT (Anurag's real data)
│   │   ├── hooks/
│   │   │   └── index.ts                ← useSound, useScrollProgress, etc.
│   │   ├── lib/
│   │   │   ├── utils.ts                ← cn(), formatDate, skillLevelLabel
│   │   │   └── animations.ts           ← Framer Motion variant library
│   │   ├── store/
│   │   │   └── usePortfolioStore.ts    ← Zustand global state
│   │   └── types/
│   │       └── index.ts                ← All TypeScript types
│   ├── public/
│   │   ├── images/
│   │   │   ├── anurag.png              ← Profile photo
│   │   │   ├── projects/               ← Project screenshots
│   │   │   └── logos/                  ← Company logos
│   │   ├── og-image.jpg                ← Open Graph preview image
│   │   └── resume.pdf                  ← Downloadable resume
│   ├── Dockerfile                      ← Multi-stage production build
│   ├── next.config.js                  ← Next.js config + optimization
│   ├── tailwind.config.js              ← Full design token system
│   └── .env.local                      ← Environment variables
│
├── server/                             ← BACKEND (Express.js)
│   ├── controllers/
│   │   ├── authController.js           ← JWT login, bcrypt
│   │   ├── projectController.js        ← CRUD + image upload
│   │   ├── blogController.js           ← Markdown blog CRUD
│   │   ├── contactController.js        ← Form + Nodemailer emails
│   │   ├── resumeController.js         ← PDF upload per role
│   │   ├── certificationController.js  ← Cert management
│   │   ├── experienceController.js     ← Experience data
│   │   ├── githubController.js         ← GitHub API + Redis cache
│   │   └── adminController.js          ← Dashboard stats
│   ├── routes/
│   │   ├── auth.js, projects.js        ← Route definitions
│   │   ├── blogs.js, contact.js        ←
│   │   ├── resume.js, certifications.js←
│   │   └── admin.js, github.js         ←
│   ├── models/
│   │   ├── User.js                     ← Admin schema (bcrypt, lockout)
│   │   ├── Project.js                  ← Project schema (indexed)
│   │   └── index.js                    ← Blog, Message, Resume, Cert, Exp, Chat
│   ├── middlewares/
│   │   ├── auth.js                     ← JWT protect, restrictTo, optionalAuth
│   │   └── index.js                    ← Rate limit, multer, validation, errors
│   ├── utils/
│   │   ├── email.js                    ← Nodemailer templates
│   │   └── seed.js                     ← Admin user seeder
│   ├── config/
│   │   └── db.js                       ← MongoDB connection
│   ├── uploads/                        ← File storage (resumes, images)
│   ├── Dockerfile                      ← Node production container
│   └── server.js                       ← Express app entry point
│
├── rag-chatbot/                        ← AI CHATBOT (FastAPI + Python)
│   ├── rag/
│   │   └── pipeline.py                 ← Full RAG: embed → ChromaDB → Ollama
│   ├── api/
│   │   └── server.py                   ← FastAPI endpoints
│   ├── data/
│   │   └── knowledge_base.py           ← 22 knowledge chunks (Anurag's data)
│   ├── scripts/
│   │   └── test_rag.py                 ← Automated pipeline tests
│   ├── chroma_db/                      ← ChromaDB vector store (auto-created)
│   ├── cache/                          ← Embedding + query cache
│   ├── main.py                         ← Server entrypoint
│   ├── requirements.txt                ← Python dependencies
│   ├── Dockerfile                      ← Python production container
│   └── .env                            ← Ollama + ChromaDB config
│
├── admin/                              ← ADMIN PANEL (Next.js 14)
│   ├── app/
│   │   ├── layout.tsx                  ← Sidebar layout + auth guard
│   │   ├── login/page.tsx              ← Secure login page
│   │   ├── dashboard/page.tsx          ← Stats overview
│   │   ├── projects/page.tsx           ← CRUD with image upload
│   │   ├── blogs/page.tsx              ← Markdown editor
│   │   ├── messages/page.tsx           ← Contact form inbox
│   │   ├── resumes/page.tsx            ← PDF upload per role
│   │   └── certifications/page.tsx     ← Cert management
│   ├── lib/
│   │   └── auth.ts                     ← JWT auth store + Axios API client
│   ├── middleware.ts                   ← Route protection
│   ├── Dockerfile                      ← Admin container
│   └── .env.local                      ← Admin config
│
├── docker/
│   ├── docker-compose.yml              ← Full stack orchestration
│   ├── Dockerfile.frontend             ← Multi-stage Next.js build
│   └── nginx.conf                      ← Reverse proxy + SSL + gzip
│
├── .github/
│   └── workflows/
│       └── deploy.yml                  ← CI/CD: lint → test → build → deploy
│
└── docs/
    ├── DEPLOYMENT_GUIDE.md             ← Step-by-step deployment
    ├── CERTIFICATIONS_SETUP.md         ← How to upload certificates
    └── SETUP_GUIDE.md                  ← RAG chatbot setup
```

---

## 🎯 Feature Checklist (All Implemented)

### Frontend
- [x] Futuristic dark UI with glassmorphism
- [x] Three.js particle field + holographic sphere
- [x] Custom glow cursor with spring physics
- [x] Multi-role selector (9 roles, dynamic content)
- [x] Ctrl+K command palette
- [x] Ambient sound system (Web Audio API)
- [x] Hero with animated terminal + holographic avatar
- [x] About with GSAP counter animations
- [x] Skills with Recharts radar + animated bars
- [x] Projects with role/tech filtering + modal
- [x] Experience with expandable internship projects
- [x] GitHub live stats + contribution calendar
- [x] Dynamic "Why Hire Me" per role
- [x] Certifications with LinkedIn-style cards
- [x] Blog with tag filtering
- [x] Contact form with validation
- [x] Floating RAG chatbot UI

### Backend
- [x] JWT authentication (bcrypt, lockout)
- [x] All CRUD APIs (projects, blogs, messages, resumes, certs)
- [x] Nodemailer contact emails (admin notify + auto-reply)
- [x] Multer file uploads (PDFs, images)
- [x] Rate limiting, Helmet, CORS
- [x] GitHub API integration with Redis cache
- [x] Error handling middleware
- [x] MongoDB schemas (all optimized + indexed)

### RAG Chatbot
- [x] 22 knowledge chunks (all Anurag's real data)
- [x] ChromaDB vector store with cosine similarity
- [x] Ollama llama3/mistral local LLM
- [x] sentence-transformers fallback
- [x] Query classification for smarter retrieval
- [x] Session-based conversation history
- [x] Confidence scoring + anti-hallucination
- [x] OpenAI API fallback
- [x] Embedding + query caching

### Admin Panel
- [x] Secure JWT login page
- [x] Animated sidebar with route highlighting
- [x] Dashboard with stats overview
- [x] Projects CRUD + image upload
- [x] Blog markdown editor
- [x] Messages inbox with reply
- [x] Resume upload per role
- [x] Certifications management

### SEO
- [x] Next.js metadata API (all pages)
- [x] Open Graph + Twitter cards
- [x] JSON-LD structured data (Person, WebSite, ProfilePage)
- [x] Dynamic sitemap.xml
- [x] robots.txt
- [x] Keyword optimization (AI Engineer India, etc.)
- [x] Canonical URLs

### DevOps
- [x] Multi-stage Dockerfiles
- [x] Docker Compose full stack
- [x] Nginx reverse proxy + SSL config
- [x] GitHub Actions CI/CD pipeline
- [x] Vercel + Render deployment configs

---

## 🚀 5-Minute Local Start

```bash
# 1. Clone
git clone https://github.com/HUNTER-X0s/portfolio.git
cd portfolio

# 2. Start Ollama
ollama serve && ollama pull llama3 && ollama pull nomic-embed-text

# 3. Start all services
cd server && npm install && npm run dev &
cd rag-chatbot && pip install -r requirements.txt && python main.py &
cd portfolio && npm install && npm run dev

# 4. Open http://localhost:3000
# 5. Admin: http://localhost:3001
```

---

## 🎯 Recruiter Impact Summary

This platform demonstrates:
1. **Full-Stack Engineering** — Next.js + Express + MongoDB + Docker
2. **AI/ML Engineering** — RAG pipeline, ChromaDB, Ollama, embeddings
3. **System Architecture** — Microservices, Docker Compose, Nginx, CI/CD
4. **Product Thinking** — 9 role-based views, dynamic content, UX polish
5. **DevOps** — GitHub Actions, multi-stage Docker, production deployment
6. **Data Engineering** — Structured knowledge base, vector similarity search
7. **Frontend Mastery** — Three.js, GSAP, Framer Motion, Tailwind design system
8. **Security** — JWT auth, bcrypt, rate limiting, Helmet, input validation

> "Every section answers: **Why should we hire this person?**"

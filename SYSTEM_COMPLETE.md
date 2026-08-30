# 🏗️ COMPLETE SYSTEM ARCHITECTURE
## Anurag Swain — AI Portfolio Platform
## Final Folder Structure & System Documentation

> **Last Updated:** August 30, 2026

---

## 📁 Complete Project Structure

```
ANURAG_PORTFOLIO/                       ← Root monorepo
│
├── portfolio/                          ← FRONTEND (Next.js 14)
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx              ← Root layout + fonts + SEO metadata + all JSON-LD schemas
│   │   │   ├── page.tsx                ← Main page assembly
│   │   │   ├── opengraph-image.tsx     ← Dynamic OG image (Edge runtime)
│   │   │   ├── sitemap.ts              ← Auto-generated /sitemap.xml (sections + projects + blog)
│   │   │   ├── robots.ts               ← Bot-specific rules (Google, Bing, social crawlers)
│   │   │   ├── manifest.ts             ← PWA manifest (shortcuts, icons, categories)
│   │   │   └── api/
│   │   │       ├── contact/route.ts    ← Contact form API
│   │   │       └── github/route.ts     ← GitHub stats proxy
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── button.tsx          ← ShadCN-style Button
│   │   │   │   └── card.tsx            ← Badge, GlowCard, StatCard
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx          ← Role selector + native smooth scroll nav
│   │   │   │   ├── CustomCursor.tsx    ← On-demand rAF glow cursor (sleeps when idle)
│   │   │   │   ├── CommandPalette.tsx  ← Ctrl+K command palette
│   │   │   │   ├── AmbientSound.tsx    ← Ambient sound system
│   │   │   │   ├── MusicModal.tsx      ← Music modal UI
│   │   │   │   └── ScrollProgress.tsx  ← GPU-direct scaleX progress bar (zero re-renders)
│   │   │   ├── sections/
│   │   │   │   ├── Hero.tsx            ← Holographic avatar + terminal (no scroll prompt)
│   │   │   │   ├── About.tsx           ← Bio + GSAP counter stats
│   │   │   │   ├── Skills.tsx          ← Radar chart + animated bars
│   │   │   │   ├── Projects.tsx        ← Filterable cards + modal
│   │   │   │   ├── Experience.tsx      ← Timeline + expandable internship projects
│   │   │   │   ├── GitHub.tsx          ← Live stats + contribution calendar
│   │   │   │   ├── ValueProp.tsx       ← Dynamic per-role content
│   │   │   │   ├── Analytics.tsx       ← Certs + code metrics bar chart
│   │   │   │   ├── Blog.tsx            ← Tag-filtered blog grid
│   │   │   │   └── Contact.tsx         ← Validated contact form
│   │   │   ├── animations/
│   │   │   │   ├── Dynamic3DCard.tsx   ← On-hover GPU layer allocation (idle = flat)
│   │   │   │   ├── Dynamic3DText.tsx   ← On-hover 3D text (idle = flat)
│   │   │   │   └── ScrollReveal.tsx    ← GSAP + Framer Motion wrappers
│   │   │   ├── three/
│   │   │   │   ├── ParticleField.tsx   ← Tiered Three.js (DPR 0.65 desktop, GPU-tuned counts)
│   │   │   │   └── HolographicSphere.tsx ← 3D hero sphere
│   │   │   ├── voice/
│   │   │   │   └── VoiceAssistant.tsx  ← Jarvis AI voice assistant + Close button
│   │   │   └── ai/
│   │   │       └── ChatBot.tsx         ← RAG-connected floating chatbot
│   │   ├── data/
│   │   │   └── portfolio.ts            ← ALL CONTENT (Anurag's real data)
│   │   ├── hooks/
│   │   │   └── index.ts                ← useSound, useScrollProgress, etc.
│   │   ├── lib/
│   │   │   ├── utils.ts                ← cn(), formatDate, skillLevelLabel
│   │   │   ├── seo.ts                  ← Full SEO config: metadata, 6 JSON-LD schemas, FAQ
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
│   │   ├── icons/                      ← PWA icons (192px, 512px, apple-touch)
│   │   ├── certificates/               ← Certificate files
│   │   ├── music/                      ← Ambient sound tracks
│   │   ├── browserconfig.xml           ← Microsoft Edge / Bing tile config
│   │   ├── resume.pdf                  ← Downloadable resume
│   │   └── icon.svg                    ← SVG favicon
│   ├── Dockerfile                      ← Multi-stage production build
│   ├── next.config.js                  ← Next.js config + HSTS + security headers
│   ├── tailwind.config.js              ← Full design token system
│   └── .env.local                      ← Environment variables
│
├── server/                             ← BACKEND (Express.js)
│   ├── middleware/
│   │   └── auth.js                     ← JWT protect middleware
│   ├── routes/
│   │   ├── auth.js                     ← Auth routes
│   │   ├── projects.js                 ← Projects CRUD
│   │   ├── blogs.js                    ← Blog CRUD
│   │   ├── contact.js                  ← Contact form
│   │   ├── resume.js                   ← Resume upload
│   │   ├── certifications.js           ← Cert management
│   │   └── admin.js                    ← Admin stats
│   ├── models/
│   │   ├── Admin.js                    ← Admin schema
│   │   ├── Blog.js                     ← Blog schema
│   │   ├── Certification.js            ← Certification schema
│   │   ├── Contact.js                  ← Contact message schema
│   │   ├── Project.js                  ← Project schema
│   │   └── Resume.js                   ← Resume schema
│   ├── uploads/                        ← File storage (resumes, images)
│   ├── Dockerfile                      ← Node production container
│   └── server.js                       ← Express app entry point
│
├── rag-chatbot/                        ← AI CHATBOT (FastAPI + Python)
│   ├── rag/
│   │   └── knowledge_base.py           ← 22 knowledge chunks (Anurag's data)
│   ├── api/
│   │   └── server.py                   ← FastAPI endpoints
│   ├── data/
│   │   └── __init__.py                 ← Data module
│   ├── scripts/
│   │   └── test_rag.py                 ← Automated pipeline tests
│   ├── chroma_db/                      ← ChromaDB vector store (auto-created)
│   ├── chroma_db_ollama/               ← Ollama-specific ChromaDB store
│   ├── cache/                          ← SQLite embedding + query cache
│   ├── main.py                         ← Server entrypoint
│   ├── requirements.txt                ← Python dependencies
│   ├── Dockerfile                      ← Python production container
│   ├── render.yaml                     ← Render.com deployment config
│   └── .env                            ← Ollama + ChromaDB config
│
├── admin/                              ← ADMIN PANEL (Next.js 14)
│   ├── app/
│   │   ├── layout.tsx                  ← Sidebar layout + auth guard
│   │   ├── login/                      ← Secure login page
│   │   ├── dashboard/                  ← Stats overview
│   │   ├── projects/                   ← CRUD with image upload
│   │   ├── blogs/                      ← Markdown editor
│   │   ├── messages/                   ← Contact form inbox
│   │   ├── resumes/                    ← PDF upload per role
│   │   ├── certifications/             ← Cert management
│   │   └── settings/                   ← Admin settings
│   ├── lib/
│   │   └── auth.ts                     ← JWT auth store + Axios API client
│   ├── middleware.ts                   ← Route protection
│   └── Dockerfile                      ← Admin container
│
├── nginx/
│   ├── nginx.conf                      ← Reverse proxy + SSL + gzip
│   └── ssl/                            ← SSL certificates (fullchain + privkey)
│
├── docs/
│   ├── DEPLOYMENT_GUIDE.md             ← Step-by-step deployment
│   ├── FRONTEND_README.md              ← Frontend documentation
│   ├── CERTIFICATIONS_SETUP.md         ← How to upload certificates
│   ├── SETUP_GUIDE.md                  ← RAG chatbot setup
│   ├── VOICE_SETUP.md                  ← Voice assistant setup
│   └── resumes-all-roles.txt           ← Resume source for RAG knowledge base
│
├── .github/
│   └── workflows/
│       └── deploy.yml                  ← CI/CD: lint → test → build → deploy
│
├── docker-compose.yml                  ← Full stack orchestration (root)
├── run_all.bat                         ← Windows one-click start script
├── DEPLOYMENT_GUIDE.md                 ← Root deployment reference
├── README.md                           ← Project overview
└── SYSTEM_COMPLETE.md                  ← This file
```

---

## 🎯 Feature Checklist (All Implemented)

### Frontend
- [x] Futuristic dark UI with glassmorphism
- [x] Three.js particle field — tiered GPU tuning (DPR 0.65 desktop)
- [x] Holographic sphere in Hero
- [x] Custom glow cursor — on-demand rAF (sleeps when idle, zero CPU when still)
- [x] Multi-role selector (9 roles, dynamic content)
- [x] Ctrl+K command palette
- [x] Ambient sound system (Web Audio API)
- [x] Hero with animated terminal + holographic avatar (scroll prompt removed)
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
- [x] Jarvis AI Voice Assistant with fixed "Close Jarvis Mode" button

### Performance (Desktop 1920×1080)
- [x] Dynamic3DCard — GPU layer only on active hover (50+ idle cards → 0 layers)
- [x] Dynamic3DText — GPU layer only on active hover
- [x] Removed global translateZ(0) on noise-overlay (eliminated 115MB GPU texture)
- [x] ScrollProgress — direct GPU scaleX, zero React re-renders
- [x] Navbar — native scrollIntoView, no state re-renders on scroll
- [x] CustomCursor — on-demand rAF loop, sleeps when mouse is still
- [x] ParticleField — DPR 0.65 on standard desktop (58% fill-rate reduction)
- [x] section-optimized — contain: style on desktop

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
- [x] Embedding + query caching (SQLite)

### Admin Panel
- [x] Secure JWT login page
- [x] Animated sidebar with route highlighting
- [x] Dashboard with stats overview
- [x] Projects CRUD + image upload
- [x] Blog markdown editor
- [x] Messages inbox with reply
- [x] Resume upload per role
- [x] Certifications management

### SEO (Production-Grade)
- [x] Next.js Metadata API — full title, description, keywords, canonical, hreflang
- [x] Open Graph (profile type) + Twitter large card — with secure image URLs
- [x] JSON-LD structured data: `Person`, `WebSite`, `ProfilePage`, `ItemList` (projects + blog), `FAQPage`
- [x] `Person` schema: `hasOccupation`, `seeks`, `ImageObject`, `alumniOf`, `knowsAbout` (50 topics)
- [x] `WebSite` schema with `SearchAction` (Google Sitelinks Searchbox eligible)
- [x] `FAQPage` schema — 5 rich-snippet Q&As appear directly in Google SERPs
- [x] Expanded sitemap — root + all section anchors + featured projects + blog posts with priorities
- [x] `robots.ts` — per-bot rules (Googlebot, Googlebot-Image, Bingbot, Twitterbot, Facebook, LinkedIn)
- [x] Comprehensive keyword matrix — brand + role + tech stack + location + hire intent queries
- [x] Geo meta tags (`geo.region`, `geo.placename`, `geo.position`, `ICBM`) for Bing/Yandex
- [x] PWA manifest with `shortcuts`, `categories`, `display_override`, `lang`, `dir`
- [x] `browserconfig.xml` — Microsoft Edge / Bing tile
- [x] Security headers: HSTS, X-Frame-Options, Permissions-Policy, CORP, XSS-Protection
- [x] `images.remotePatterns` (migrated from deprecated `images.domains`)
- [x] Google Search Console + Bing Webmaster Tools verification env vars ready

### DevOps
- [x] Multi-stage Dockerfiles (portfolio, server, rag-chatbot, admin)
- [x] Docker Compose full stack (root)
- [x] Nginx reverse proxy + SSL config
- [x] GitHub Actions CI/CD pipeline
- [x] Vercel + Render deployment configs

---

## 🚀 5-Minute Local Start

```bash
# 1. Clone
git clone https://github.com/HUNTER-X0s/portfolio.git
cd ANURAG_PORTFOLIO

# 2. Start Ollama (for AI chatbot)
ollama serve && ollama pull llama3 && ollama pull nomic-embed-text

# 3. Start all services
cd server && npm install && npm run dev &
cd rag-chatbot && pip install -r requirements.txt && python main.py &
cd portfolio && npm install && npm run dev

# 4. Open http://localhost:3000
# 5. Admin: http://localhost:3001
```

Or use the Windows one-click script:
```bat
run_all.bat
```

---

## 🌐 SEO Quick Actions (Post-Deploy)

1. Add `GOOGLE_SITE_VERIFICATION` to `portfolio/.env.local` → verify in [Google Search Console](https://search.google.com/search-console)
2. Add `BING_SITE_VERIFICATION` to `portfolio/.env.local` → verify in [Bing Webmaster Tools](https://www.bing.com/webmasters)
3. Submit `https://anuragswain.vercel.app/sitemap.xml` in both consoles
4. Test rich snippets: [Rich Results Test](https://search.google.com/test/rich-results)

---

## 🎯 Recruiter Impact Summary

This platform demonstrates:
1. **Full-Stack Engineering** — Next.js 14 + Express.js + MongoDB + Docker
2. **AI/ML Engineering** — RAG pipeline, ChromaDB, Ollama LLM, sentence-transformers
3. **Voice AI** — Jarvis-style voice assistant with ElevenLabs integration
4. **System Architecture** — Microservices, Docker Compose, Nginx, CI/CD
5. **Product Thinking** — 9 role-based views, dynamic content, UX polish
6. **DevOps** — GitHub Actions, multi-stage Docker, production deployment
7. **Data Engineering** — Structured knowledge base, vector similarity search
8. **Frontend Mastery** — Three.js, GSAP, Framer Motion, Tailwind design system
9. **Performance Engineering** — GPU layer management, on-demand rAF, DPR tuning
10. **SEO Engineering** — JSON-LD schemas, FAQ rich snippets, comprehensive sitemap, security headers
11. **Security** — JWT auth, bcrypt, rate limiting, Helmet, HSTS, input validation

> "Every section answers: **Why should we hire this person?**"

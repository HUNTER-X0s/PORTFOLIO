# 🚀 Deployment Guide — Anurag Swain Portfolio Platform
## Complete Step-by-Step Production Deployment

---

## 🏗️ Architecture

```
Internet
   │
   ▼
Nginx (reverse proxy + SSL)
   ├── / ─────────────────────► Next.js Frontend (Vercel / Docker)
   ├── /api/ ────────────────── Express Backend (Render / Docker)
   ├── /chat/ ───────────────── RAG Chatbot (Render / Docker)
   └── admin.* ──────────────── Admin Panel (private)
                                     │
                     ┌───────────────┼──────────────────┐
                     ▼               ▼                  ▼
              MongoDB Atlas    ChromaDB (local)    Ollama (LLM)
              (cloud DB)       (vector store)     (or OpenAI fallback)
```

---

## OPTION A: Vercel + Render (Recommended — Free Tier)

### Step 1 — MongoDB Atlas (Database)

1. Go to https://cloud.mongodb.com
2. Create a free cluster (M0 — Free)
3. Add database user: Settings → Database Access → Add User
4. Whitelist all IPs: Network Access → 0.0.0.0/0
5. Get connection string:
   ```
   mongodb+srv://user:password@cluster.mongodb.net/portfolio?retryWrites=true
   ```

---

### Step 2 — Deploy Backend to Render

1. Go to https://render.com → New → Web Service
2. Connect your GitHub repository
3. Configure:
   - **Root Directory**: `server`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free (or $7/mo Starter for no sleep)

4. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=<generate: openssl rand -base64 64>
   ADMIN_EMAIL=anurag.swain35@gmail.com
   ADMIN_PASSWORD=<strong password>
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your@gmail.com
   SMTP_PASS=your_app_password
   CONTACT_EMAIL=anurag.swain35@gmail.com
   CLIENT_URL=https://anuragswain.dev
   GITHUB_USERNAME=HUNTER-X0s
   ```

5. Copy the service URL: `https://portfolio-backend-xxxx.onrender.com`

---

### Step 3 — Deploy RAG Chatbot to Render

1. New → Web Service → Connect repo
2. Configure:
   - **Root Directory**: `rag-chatbot`
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python main.py`
   - **Plan**: Starter ($7/mo) — needs memory for model

3. Environment Variables:
   ```
   PORT=8001
   OLLAMA_BASE_URL=http://localhost:11434   # won't work on free tier
   OPENAI_API_KEY=sk-...                    # use OpenAI fallback for cloud
   OPENAI_MODEL=gpt-3.5-turbo
   CHROMA_PERSIST_DIR=./chroma_db
   ```

   > 💡 **Cloud tip**: For Render/Railway, use OpenAI fallback instead of Ollama.
   > Set `OPENAI_API_KEY` and leave `OLLAMA_BASE_URL` empty.

4. Copy URL: `https://portfolio-chatbot-xxxx.onrender.com`

---

### Step 4 — Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd portfolio
vercel

# Production deploy
vercel --prod
```

Or: Connect GitHub repo at https://vercel.com/new

**Environment Variables in Vercel dashboard:**
```
NEXT_PUBLIC_APP_URL=https://anuragswain.dev
NEXT_PUBLIC_API_URL=https://portfolio-backend-xxxx.onrender.com
NEXT_PUBLIC_CHATBOT_URL=https://portfolio-chatbot-xxxx.onrender.com
NEXT_PUBLIC_GITHUB_USERNAME=HUNTER-X0s
GITHUB_TOKEN=ghp_...
MONGODB_URI=mongodb+srv://...
```

---

### Step 5 — Custom Domain (Vercel)

1. Vercel Dashboard → Domains → Add `anuragswain.dev`
2. Add DNS records at your registrar:
   ```
   A     @    76.76.19.61
   CNAME www  cname.vercel-dns.com
   ```
3. SSL is automatic via Let's Encrypt

---

### Step 6 — Seed Admin User

```bash
# After backend is deployed
curl -X POST https://your-backend.onrender.com/api/auth/seed \
  -H "Content-Type: application/json" \
  -d '{"secret": "your-seed-secret"}'
```

Or run locally:
```bash
cd server && node utils/seed.js
```

---

## OPTION B: Docker Self-Hosted (VPS)

### Requirements
- VPS: 2 vCPU, 4GB RAM minimum (8GB for Ollama LLM)
- Ubuntu 22.04
- Domain with DNS pointed to server IP

### Step 1 — Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Nginx (optional if using Docker Nginx)
sudo apt install -y nginx certbot python3-certbot-nginx
```

### Step 2 — SSL Certificate
```bash
sudo certbot --nginx -d anuragswain.dev -d www.anuragswain.dev -d admin.anuragswain.dev
```

### Step 3 — Clone & Configure
```bash
git clone https://github.com/HUNTER-X0s/portfolio.git
cd portfolio

# Create env files
cp portfolio/.env.local.example portfolio/.env.local
cp server/.env.example server/.env
cp rag-chatbot/.env.example rag-chatbot/.env

# Edit each .env file with your values
nano server/.env
```

### Step 4 — Pull Ollama Models
```bash
# Start Ollama container first
docker-compose up -d ollama

# Pull models
docker exec portfolio-ollama ollama pull llama3
docker exec portfolio-ollama ollama pull nomic-embed-text
```

### Step 5 — Start All Services
```bash
docker-compose up -d

# Verify all running
docker-compose ps

# Check logs
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f chatbot
```

### Step 6 — Seed Admin & Index RAG
```bash
# Seed admin user
docker exec portfolio-backend node utils/seed.js

# Index RAG knowledge base
curl -X POST http://localhost:8001/api/reindex?secret=portfolio-reindex-2025
```

---

## CI/CD Setup (GitHub Actions)

### Required GitHub Secrets
```
VERCEL_TOKEN              # vercel.com → Settings → Tokens
VERCEL_ORG_ID             # .vercel/project.json after `vercel link`
VERCEL_PROJECT_ID         # .vercel/project.json after `vercel link`
RENDER_DEPLOY_HOOK_BACKEND  # Render → Service → Settings → Deploy Hooks
RENDER_DEPLOY_HOOK_CHATBOT  # Render → Service → Settings → Deploy Hooks
NEXT_PUBLIC_APP_URL       # https://anuragswain.dev
NEXT_PUBLIC_API_URL       # https://your-backend.onrender.com
```

### Activate CI/CD
```bash
# Create GitHub Actions directory
mkdir -p .github/workflows

# Copy workflow
cp ci-cd/.github-workflows-deploy.yml .github/workflows/deploy.yml

# Push to trigger
git add .
git commit -m "feat: add CI/CD pipeline"
git push origin main
```

---

## Performance & SEO Checklist

### Lighthouse Target: 90+
- [ ] Enable Next.js image optimization (`next/image`)
- [ ] Add `output: 'standalone'` in `next.config.js`
- [ ] Enable compression middleware in Express
- [ ] Use WebP images for project screenshots
- [ ] Lazy load Three.js particle field
- [ ] Add `next/font` for zero-layout-shift fonts

### SEO Checklist
- [ ] Add `src/app/sitemap.ts` (auto-generates `/sitemap.xml`)
- [ ] Add `src/app/robots.ts` (auto-generates `/robots.txt`)
- [ ] Add JSON-LD in `src/app/layout.tsx` (use `seo.ts` schemas)
- [ ] Set `NEXT_PUBLIC_APP_URL` to actual domain
- [ ] Submit sitemap to Google Search Console
- [ ] Add `GOOGLE_SITE_VERIFICATION` env var

### Google Search Console
1. Go to https://search.google.com/search-console
2. Add property → URL prefix → `https://anuragswain.dev`
3. Download verification HTML file → place in `/public/`
4. Submit sitemap: `https://anuragswain.dev/sitemap.xml`
5. Request indexing for key pages

---

## Environment Variables Summary

### portfolio/.env.local
```env
NEXT_PUBLIC_APP_URL=https://anuragswain.dev
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
NEXT_PUBLIC_CHATBOT_URL=https://your-chatbot.onrender.com
NEXT_PUBLIC_GITHUB_USERNAME=HUNTER-X0s
GITHUB_TOKEN=ghp_...
GOOGLE_SITE_VERIFICATION=...
```

### server/.env
```env
PORT=5001
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<64-char random string>
ADMIN_EMAIL=anurag.swain35@gmail.com
ADMIN_PASSWORD=<strong password>
SMTP_HOST=smtp.gmail.com
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password
CLIENT_URL=https://anuragswain.dev
GITHUB_USERNAME=HUNTER-X0s
```

### rag-chatbot/.env
```env
PORT=8001
OLLAMA_MODEL=llama3
OPENAI_API_KEY=sk-...   # fallback
CHROMA_PERSIST_DIR=./chroma_db
```

---

## Quick Health Check (After Deploy)

```bash
# Frontend
curl https://anuragswain.dev

# Backend
curl https://your-backend.onrender.com/api/health

# Chatbot
curl https://your-chatbot.onrender.com/api/health

# Test chat
curl -X POST https://your-chatbot.onrender.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What are Anurag strongest skills?"}'
```

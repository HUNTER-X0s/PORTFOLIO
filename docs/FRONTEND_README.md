# 🚀 AI Portfolio Platform — Setup Guide

## Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB (optional — for contact form persistence)
- GitHub Personal Access Token (optional — for live stats)

---

## 1. Clone & Install

```bash
cd portfolio
npm install
```

---

## 2. Environment Variables

```bash
cp .env.local.example .env.local
```

Fill in your details:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_GITHUB_USERNAME=yourusername
GITHUB_TOKEN=ghp_your_token_here          # Get from GitHub Settings > Tokens
MONGODB_URI=mongodb://localhost:27017/portfolio
NEXT_PUBLIC_API_URL=http://localhost:5001
```

---

## 3. Customize Your Content

All content lives in **one file**:

```
src/data/portfolio.ts
```

Update these sections:
- `personalInfo` — your name, bio, email, social links
- `projects` — your projects with live URLs (**required**)
- `experiences` — your internships and jobs
- `education` — your degrees
- `certifications` — your certs
- `skillGroups` — your skills and levels
- `blogPosts` — your articles
- `githubStats` — fallback stats (overridden by API)

---

## 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 5. Production Build

```bash
npm run build
npm run start
```

---

## 6. Deploy to Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

Add environment variables in Vercel dashboard → Settings → Environment Variables.

---

## 7. Folder Structure

```
src/
├── app/
│   ├── globals.css          # Full design system
│   ├── layout.tsx           # Root layout + fonts
│   ├── page.tsx             # Main page assembly
│   └── api/
│       ├── contact/route.ts # Contact form API
│       └── github/route.ts  # GitHub stats API
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx       # Navigation + role selector
│   │   ├── CustomCursor.tsx # Glowing custom cursor
│   │   ├── CommandPalette.tsx # Ctrl+K palette
│   │   ├── MusicModal.tsx   # Ambient sound prompt
│   │   └── ScrollProgress.tsx
│   ├── sections/
│   │   ├── Hero.tsx         # Cinematic hero + terminal
│   │   ├── About.tsx        # Bio + education
│   │   ├── Skills.tsx       # Animated skill bars
│   │   ├── Projects.tsx     # Project cards + modal
│   │   ├── Experience.tsx   # Timeline
│   │   ├── GitHub.tsx       # Stats + calendar
│   │   ├── ValueProp.tsx    # Why hire me (dynamic)
│   │   ├── Analytics.tsx    # Certifications + metrics
│   │   ├── Blog.tsx         # Blog posts
│   │   └── Contact.tsx      # Contact form
│   ├── ai/
│   │   └── ChatBot.tsx      # Floating AI chatbot
│   └── three/
│       └── ParticleField.tsx # 3D particle background
├── data/
│   └── portfolio.ts         # ⭐ ALL YOUR CONTENT HERE
├── hooks/
│   └── index.ts             # Custom hooks
├── lib/
│   └── utils.ts             # Utilities
├── store/
│   └── usePortfolioStore.ts # Zustand global state
└── types/
    └── index.ts             # TypeScript types
```

---

## 8. Key Features

| Feature | Description |
|---|---|
| 🎯 Role Selector | 9 roles — hero, skills, projects, why-hire-me update dynamically |
| ⌨️ Ctrl+K | Full command palette — navigate, search projects, open socials |
| 🤖 AI Chatbot | Floating chatbot that answers questions about you |
| 🎨 Custom Cursor | Glowing cursor with spring physics |
| 🌌 3D Background | Three.js particle field with neural network lines |
| 🎵 Ambient Sound | Web Audio API drone on first visit |
| 📊 GitHub Stats | Live GitHub contribution calendar + language stats |
| ✨ Animations | GSAP + Framer Motion throughout |
| 📱 Responsive | Mobile-first, works on all devices |

---

## 9. Customization

### Change color scheme
Edit `src/app/globals.css` → `:root` section:
```css
--cyan: #00E5FF;     /* Primary accent */
--violet: #7C3AED;  /* Secondary accent */
```

### Add a new role
In `src/data/portfolio.ts`:
1. Add to `roles` array
2. Add to `roleContents` object
3. Update `RoleId` type in `src/types/index.ts`

### Connect real AI for chatbot
In `src/components/ai/ChatBot.tsx`, replace `getBotResponse()` with:
```typescript
const res = await fetch('/api/chat', { method: 'POST', body: JSON.stringify({ message }) })
```
Then create `src/app/api/chat/route.ts` using OpenAI SDK.

---

## 10. Performance Tips

- Images: Use Next.js `<Image>` component with WebP format
- Fonts: Already using `display: 'swap'` via next/font
- Three.js: Reduce particle count on mobile (already handled)
- Bundle: `optimizePackageImports` configured in next.config.js

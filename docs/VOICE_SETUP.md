# 🎙️ Jarvis Voice Assistant — Setup Guide

## Overview

The Jarvis Voice Mode adds a real-time voice interface to the portfolio using:
- **Web Speech API** — browser-native STT (zero cost, offline-capable)
- **SpeechSynthesis API** — browser-native TTS (zero cost)
- **RAG Chatbot** — existing `/api/chat` endpoint for AI answers
- **ElevenLabs** *(optional)* — premium realistic voice output

---

## Architecture Flow

```
User Speaks
    │
    ▼
Web Speech API (SpeechRecognition)
    │  transcript
    ▼
parseVoiceCommand()
    │
    ├── Navigation command? ──► scrollToSection(id)
    ├── Role switch?        ──► setActiveRole(roleId)
    ├── Action command?     ──► download / open link / etc.
    └── Query?              ──► POST /api/chat (RAG pipeline)
                                     │
                                     ▼
                              AI Response text
                                     │
                                     ▼
                         SpeechSynthesis.speak()
                         (or ElevenLabs TTS)
```

---

## Files Added

| File | Description |
|---|---|
| `src/components/voice/VoiceAssistant.tsx` | Main Jarvis Mode UI component |
| `src/components/voice/VoiceWaveform.tsx` | Canvas waveform + pulse orb |
| `src/hooks/useVoiceAssistant.ts` | Core voice engine hook |
| `src/lib/voiceCommands.ts` | Intent detection + command mapping |
| `src/lib/elevenlabs.ts` | Optional premium TTS integration |

---

## Integration (2 Steps)

### Step 1 — Add to page.tsx

```tsx
import VoiceAssistant from '@/components/voice/VoiceAssistant'

// At the bottom of your JSX (after ChatBot):
<ChatBot />
<VoiceAssistant />
```

### Step 2 — Update store (if needed)

Ensure `usePortfolioStore` exports these actions:
```ts
setActiveRole: (role: RoleId) => void
setChatOpen: (open: boolean) => void
setActiveProjectId: (id: string | null) => void
```

---

## Environment Variables (add to .env.local)

```env
# RAG Chatbot endpoint (already configured)
NEXT_PUBLIC_API_URL=http://localhost:8001

# TTS customization (optional)
NEXT_PUBLIC_TTS_RATE=1.0        # speech speed 0.5–2.0
NEXT_PUBLIC_TTS_PITCH=1.0       # voice pitch 0.0–2.0

# ElevenLabs premium voice (optional — leave blank to use Web Speech)
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_api_key_here
NEXT_PUBLIC_ELEVENLABS_VOICE_ID=pNInz6obpgDQGcFmaJgB
```

---

## Browser Support

| Browser | STT | TTS | Status |
|---|---|---|---|
| Chrome 90+ | ✅ | ✅ | **Recommended** |
| Edge 90+ | ✅ | ✅ | Full support |
| Safari 15+ | ✅ (limited) | ✅ | Partial |
| Firefox | ❌ | ✅ | TTS only |
| Mobile Chrome | ✅ | ✅ | Works well |

---

## Voice Commands Reference

| Command | Action |
|---|---|
| "Go to projects" | Scrolls to projects section |
| "Show skills" | Scrolls to skills section |
| "Open contact" | Scrolls to contact section |
| "View as AI engineer" | Switches portfolio role |
| "Download resume" | Opens resume PDF |
| "Open GitHub" | Opens GitHub profile |
| "What are his skills?" | Asks RAG chatbot |
| "Tell me about the EV project" | Opens EV project details |
| "Stop" | Stops listening / speaking |
| "Help" | Lists available commands |

---

## ElevenLabs Setup (Optional Premium Voice)

1. Go to https://elevenlabs.io → Sign up (free tier: 10k chars/month)
2. API Keys → Generate key → copy to `.env.local`
3. Choose a voice from the Voice Library → copy Voice ID
4. Set both env vars → rebuild

```env
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_key
NEXT_PUBLIC_ELEVENLABS_VOICE_ID=pNInz6obpgDQGcFmaJgB
```

The system automatically uses ElevenLabs when the key is present, with Web Speech API as fallback.

---

## Testing

```bash
# Start the portfolio
cd portfolio && npm run dev

# Start the RAG chatbot (for AI answers)
cd rag-chatbot && python main.py

# Open http://localhost:3000
# Click the mic icon (bottom-left)
# Allow microphone permission
# Say: "What are his skills?"
```

---

## Performance Notes

- STT response: ~300ms (browser-native, near instant)
- RAG processing: 1–3s depending on Ollama model speed
- TTS output: starts immediately after response
- Total round-trip: typically under 3 seconds

To improve RAG speed:
```env
OLLAMA_MODEL=mistral    # faster than llama3
OLLAMA_NUM_CTX=2048     # smaller context = faster
RETRIEVAL_TOP_K=4       # fewer chunks = faster
```

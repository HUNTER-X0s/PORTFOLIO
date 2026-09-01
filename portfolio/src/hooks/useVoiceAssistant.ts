'use client'

// ============================================================
// hooks/useVoiceAssistant.ts
// Core voice assistant engine:
//   SpeechRecognition (STT) + SpeechSynthesis (TTS)
//   + RAG API integration + command dispatch
// ============================================================

import { useState, useRef, useEffect, useCallback } from 'react'
import { parseVoiceCommand, scrollToSection, type VoiceCommandAction } from '@/lib/voiceCommands'
import { usePortfolioStore } from '@/store/usePortfolioStore'
import type { RoleId } from '@/types'

const API_URL   = process.env.NEXT_PUBLIC_CHATBOT_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'
const RATE      = process.env.NEXT_PUBLIC_TTS_RATE   ? parseFloat(process.env.NEXT_PUBLIC_TTS_RATE)  : 1.02
const PITCH     = process.env.NEXT_PUBLIC_TTS_PITCH  ? parseFloat(process.env.NEXT_PUBLIC_TTS_PITCH) : 0.94
const LANG      = 'en-US'

// ── Types ──────────────────────────────────────────────────────
export type VoiceStatus =
  | 'idle'        // mic off, silent
  | 'listening'   // recording user speech
  | 'processing'  // sent to RAG, awaiting response
  | 'speaking'    // TTS playing response
  | 'error'       // something went wrong

export interface VoiceMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  timestamp: Date
  actionTaken?: string
}

export interface UseVoiceAssistantReturn {
  status: VoiceStatus
  transcript: string          // live interim transcript
  finalTranscript: string     // confirmed user speech
  messages: VoiceMessage[]
  isSupported: boolean
  hasPermission: boolean | null
  isSpeaking: boolean
  audioLevel: number          // 0–1 for waveform
  sessionId: string | null
  error: string | null
  startListening: () => void
  stopListening: () => void
  stopSpeaking: () => void
  clearHistory: () => void
  speak: (text: string) => void
  greet: () => void
  requestPermission: () => Promise<boolean>
  executeAction: (action: any, rawText: string) => Promise<void>
}

// ── Browser support check ──────────────────────────────────────
function checkSupport() {
  if (typeof window === 'undefined') return false
  return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
}

// ── Mobile / tablet detection ──────────────────────────────────
function isMobileOrTablet() {
  if (typeof navigator === 'undefined') return false
  return /android|iphone|ipad|ipod|mobile|tablet/i.test(navigator.userAgent)
}

// ── iOS Safari detection ────────────────────────────────────────
function isIOSSafari() {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  return /iP(hone|od|ad)/i.test(ua) && /Safari/i.test(ua)
}

// ── Strip markdown & polish pronunciation for clean Jarvis TTS ─
function stripMarkdown(text: string): string {
  return text
    // Strip links: [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Strip raw URLs
    .replace(/https?:\/\/\S+/g, '')
    // ── Strip skill percentages — don't read "Python at 88%" ─────
    // Patterns: (88%), 88%, at 88%, – 88%, / 10.00 on CGPA
    .replace(/\s*\(\d{1,3}%\)/g, '')          // (88%)
    .replace(/\s+at\s+\d{1,3}%/gi, '')        // at 88%
    .replace(/\s*[–-]\s*\d{1,3}%/g, '')       // – 88%  or  - 88%
    .replace(/\b\d{1,3}%/g, '')               // bare 88%
    .replace(/\s*\/\s*10\.00/g, '')            // / 10.00 (CGPA)
    .replace(/\s*\/\s*10\b/g, '')              // / 10
    // Acronyms and terminology clean phonetic pronunciations
    .replace(/\bB\.Tech\b/gi, 'B-Tech')
    .replace(/\bM\.Tech\b/gi, 'M-Tech')
    .replace(/\bCGPA\b/gi, 'C-G-P-A')
    .replace(/\bGPA\b/gi, 'G-P-A')
    .replace(/\bSDE\b/gi, 'S-D-E')
    .replace(/\bCNNs?\b/gi, 'C-N-N')
    .replace(/\bRNNs?\b/gi, 'R-N-N')
    .replace(/\bNLP\b/gi, 'N-L-P')
    .replace(/\bLLMs?\b/gi, 'L-L-M')
    .replace(/\bAPI\b/gi, 'A-P-I')
    .replace(/\bAPIs\b/gi, 'A-P-Is')
    .replace(/\bUI\b/gi, 'U-I')
    .replace(/\bUX\b/gi, 'U-X')
    .replace(/\bCSE\b/gi, 'C-S-E')
    .replace(/\bGCE\b/gi, 'G-C-E')
    .replace(/\bAICTE\b/gi, 'A-I-C-T-E')
    .replace(/\bIBM\b/gi, 'I-B-M')
    .replace(/\bR²\b|\$R\^2\$/gi, 'R-squared')
    .replace(/anurag\.swain35@gmail\.com/gi, 'anurag dot swain 35 at gmail dot com')
    .replace(/\+91-?7008973337/g, 'plus 91 70089 73337')
    // Markdown formatting
    .replace(/[-=_*#~]{3,}/g, '')
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/#{1,6}/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^[-•·*+]\s?/gm, '')
    .replace(/[$*#⭐⚡→✓✔︎✨🤖💡📌🏆🔥]/g, '')
    .replace(/\n{2,}/g, '. ')
    .replace(/\n/g, '. ')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

// ── Pick the coolest, most formal, refined voice available ────
function pickVoice(): SpeechSynthesisVoice | null {
  if (!window.speechSynthesis) return null
  const voices = window.speechSynthesis.getVoices()

  // Priority list — sophisticated, formal British & natural English voices
  const preferred = [
    'Microsoft Ryan Online (Natural) - English (United Kingdom)',
    'Microsoft Oliver Online (Natural) - English (United Kingdom)',
    'Google UK English Male',
    'Microsoft Guy Online (Natural) - English (United States)',
    'Microsoft Christopher Online (Natural) - English (United States)',
    'Google US English',
    'Daniel',
    'Arthur',
    'Microsoft David - English (United States)',
    'Alex',
  ]

  for (const name of preferred) {
    const v = voices.find((v) => v.name === name || v.name.includes(name))
    if (v) return v
  }

  // Find any British male or natural English voice
  const ukVoice = voices.find((v) => v.lang === 'en-GB' && !v.name.includes('Female'))
  if (ukVoice) return ukVoice

  const usVoice = voices.find((v) => v.lang === 'en-US' && !v.name.includes('Female') && (v.name.includes('Natural') || v.name.includes('Male')))
  if (usVoice) return usVoice

  // Fallback: any English voice
  return voices.find((v) => v.lang.startsWith('en')) || voices[0] || null
}

// ── Main hook ──────────────────────────────────────────────────
export function useVoiceAssistant(): UseVoiceAssistantReturn {
  const [status,          setStatus]          = useState<VoiceStatus>('idle')
  const [transcript,      setTranscript]      = useState('')
  const [finalTranscript, setFinalTranscript] = useState('')
  const [messages,        setMessages]        = useState<VoiceMessage[]>([])
  const [hasPermission,   setHasPermission]   = useState<boolean | null>(null)
  const [isSpeaking,      setIsSpeaking]      = useState(false)
  const [audioLevel,      setAudioLevel]      = useState(0)
  const [sessionId,       setSessionId]       = useState<string | null>(null)
  const [error,           setError]           = useState<string | null>(null)

  const recognitionRef    = useRef<any>(null)
  const synthRef          = useRef<SpeechSynthesisUtterance | null>(null)
  const analyserRef       = useRef<AnalyserNode | null>(null)
  const animFrameRef      = useRef<number>(0)
  const streamRef         = useRef<MediaStream | null>(null)
  const transcriptRef     = useRef('')
  const finalTranscriptRef = useRef('')
  const utterancesRef     = useRef<SpeechSynthesisUtterance[]>([]) // Fix Chrome TTS GC bug
  const isSupported       = checkSupport()

  // Store actions
  const { setActiveRole, setChatOpen, setActiveProjectId } = usePortfolioStore()

  // ── Audio level analyser (waveform) ─────────────────────────
  const startAnalyser = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const ctx = new AudioContext()
      const source = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      analyserRef.current = analyser

      const tick = () => {
        const data = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteFrequencyData(data)
        const avg = data.reduce((s, v) => s + v, 0) / data.length
        setAudioLevel(avg / 128)  // normalize 0–1
        animFrameRef.current = requestAnimationFrame(tick)
      }
      tick()
    } catch {}
  }, [])

  const stopAnalyser = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current)
    setAudioLevel(0)
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    analyserRef.current = null
  }, [])

  // ── Text-to-Speech ───────────────────────────────────────────
  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (!window.speechSynthesis) return

    const clean = stripMarkdown(text)
    if (!clean) {
      onEnd?.()
      return
    }

    // Limit TTS length to avoid very long monologue
    const truncated = clean.length > 600
      ? clean.slice(0, 597) + '…'
      : clean

    const utter = new SpeechSynthesisUtterance(truncated)
    utter.lang   = LANG
    utter.rate   = RATE
    utter.pitch  = PITCH
    utter.volume = 1.0

    // Assign best voice (voices may load async)
    const setVoiceAndSpeak = () => {
      const voice = pickVoice()
      if (voice) utter.voice = voice
      synthRef.current = utter
      utterancesRef.current.push(utter)

      utter.onstart = () => { setIsSpeaking(true); setStatus('speaking') }
      utter.onend   = () => { 
        // Remove from reference array to prevent memory leak
        const idx = utterancesRef.current.indexOf(utter)
        if (idx > -1) utterancesRef.current.splice(idx, 1)
        
        // Only set idle if nothing else is playing or queued
        if (!window.speechSynthesis.speaking && window.speechSynthesis.pending === false) {
          setIsSpeaking(false); setStatus('idle')
        }
        onEnd?.() 
      }
      utter.onerror = () => { 
        const idx = utterancesRef.current.indexOf(utter)
        if (idx > -1) utterancesRef.current.splice(idx, 1)
        if (!window.speechSynthesis.speaking && window.speechSynthesis.pending === false) {
          setIsSpeaking(false); setStatus('idle')
        }
      }

      window.speechSynthesis.speak(utter)
    }

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = setVoiceAndSpeak
    } else {
      setVoiceAndSpeak()
    }
  }, [])

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel()
    utterancesRef.current = []
    setIsSpeaking(false)
    setStatus('idle')
  }, [])

  // ── Jarvis Greeting ──────────────────────────────────────────
  const greet = useCallback(() => {
    const greetingDisplay = "- **Jarvis**: Hello! I'm Jarvis. How can I help you?"
    const spokenGreeting = "Hello! I'm Jarvis. How can I help you?"
    setMessages((prev) => {
      if (prev.length > 0) return prev
      return [{
        id: crypto.randomUUID(),
        role: 'assistant',
        text: greetingDisplay,
        timestamp: new Date(),
        actionTaken: 'Jarvis Online',
      }]
    })
    speak(spokenGreeting)
  }, [speak])

  // ── Execute voice command ────────────────────────────────────
  const executeAction = useCallback(async (action: VoiceCommandAction, rawText: string) => {
    let responseText = ''
    let actionDesc = ''

    switch (action.type) {
      case 'stop':
        stopSpeaking()
        setStatus('idle')
        return

      case 'help':
        responseText = "- **Voice Commands**: Try saying 'Show projects', 'Go to contact', or 'View as AI engineer'\n- **Candidate Questions**: Ask about Anurag's skills, projects, internships, and CGPA"
        actionDesc = 'Help displayed'
        break

      case 'navigate':
        scrollToSection(action.section)
        responseText = `- **Navigation**: Switched to the **${action.section}** section.`
        actionDesc = `Navigated → ${action.section}`
        break

      case 'switchRole':
        setActiveRole(action.roleId as RoleId)
        const roleLabels: Record<string, string> = {
          fullstack: 'Full Stack Developer', frontend: 'Frontend Developer',
          backend: 'Backend Developer', ai_engineer: 'AI Engineer',
          ml_engineer: 'Machine Learning Engineer', dl_engineer: 'Deep Learning Engineer',
          data_scientist: 'Data Scientist', data_analyst: 'Data Analyst', cloud: 'Cloud Engineer',
        }
        responseText = `- **Role View**: Switched to **${roleLabels[action.roleId] || action.roleId}** view.`
        actionDesc = `Role → ${action.roleId}`
        break

      case 'openChat':
        setChatOpen(true)
        responseText = "- **Chat**: Opening the text chat interface for you."
        actionDesc = 'Chat opened'
        break

      case 'openProject':
        scrollToSection('projects')
        if (action.projectId) setActiveProjectId(action.projectId)
        responseText = "- **Projects**: Showing the projects section now."
        actionDesc = `Project opened: ${action.projectId || 'projects'}`
        break

      case 'downloadResume':
        window.open('/resume.pdf', '_blank')
        responseText = "- **Resume**: Opening Anurag's resume for download."
        actionDesc = 'Resume download triggered'
        break

      case 'openLink':
        window.open(action.url, '_blank')
        responseText = `- **Link**: Opening ${action.url} in a new tab.`
        actionDesc = `Link opened: ${action.url}`
        break

      case 'query':
      default: {
        setStatus('processing')
        
        // Add a placeholder message for the assistant
        const assistantMsgId = crypto.randomUUID()
        setMessages((prev) => [...prev, {
          id: assistantMsgId,
          role: 'assistant',
          text: '',
          timestamp: new Date(),
          actionTaken: 'RAG query',
        }])

        try {
          const abortCtrl = new AbortController()
          const res = await fetch(`${API_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: action.text || rawText,
              session_id: sessionId,
              role_context: 'jarvis_voice',
              top_k: 3,
              stream: true,
            }),
            signal: abortCtrl.signal,
          })

          if (res.ok && res.body) {
            const reader = res.body.getReader()
            const decoder = new TextDecoder('utf-8')
            let done = false
            let buffer = ''
            let fullText = ''
            let sentenceBuffer = ''

            while (!done) {
              const { value, done: readerDone } = await reader.read()
              done = readerDone
              if (value) {
                buffer += decoder.decode(value, { stream: true })
                const lines = buffer.split('\n')
                buffer = lines.pop() || ''

                for (const line of lines) {
                  if (line.startsWith('data: ')) {
                    try {
                      const data = JSON.parse(line.slice(6))
                      if (data.text) {
                        fullText += data.text
                        sentenceBuffer += data.text
                        
                        // Update message in UI
                        setMessages((prev) => prev.map(m => 
                          m.id === assistantMsgId ? { ...m, text: fullText } : m
                        ))

                        // Speak completed sentences or lines (markdown bullets)
                        if (/[.!?]\s|\n/.test(sentenceBuffer) || (data.done && sentenceBuffer.trim())) {
                          const sentences = sentenceBuffer.split(/(?<=[.!?])\s+|\n+/)
                          // If not done, keep the last incomplete chunk in the buffer
                          if (!data.done && sentences.length > 1) {
                            sentenceBuffer = sentences.pop() || ''
                          } else {
                            sentenceBuffer = ''
                          }
                          
                          // Speak all complete sentences
                          for (const sentence of sentences) {
                            if (sentence.trim().length > 1) { // avoid speaking empty bullets or single chars
                              speak(sentence.trim())
                            }
                          }
                        }
                      }
                      if (data.done) {
                        if (!sessionId && data.session_id) setSessionId(data.session_id)
                        // If there's any remaining text, speak it
                        if (sentenceBuffer.trim()) {
                          speak(sentenceBuffer.trim())
                          sentenceBuffer = ''
                        }
                      }
                    } catch (e) {
                      // ignore parse errors
                    }
                  }
                }
              }
            }
            return // We already updated state and spoke
          } else {
            responseText = getLocalFallback(rawText)
          }
        } catch {
          responseText = getLocalFallback(rawText)
        }
        actionDesc = 'RAG query (Fallback)'
        break
      }
    }

    if (responseText) {
      const assistantMsg: VoiceMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        text: responseText,
        timestamp: new Date(),
        actionTaken: actionDesc,
      }
      setMessages((prev) => [...prev, assistantMsg])
      speak(responseText)
    }
  }, [sessionId, speak, stopSpeaking, setActiveRole, setChatOpen, setActiveProjectId])

  // ── Local fallback — Full Pointed Elaborated Responses (Mirrors Chatbot Fallback Engine) ───
  function getLocalFallback(query: string): string {
    const q = query.toLowerCase().trim()

    // ── Helper: word-boundary keyword scorer ──────────────
    const score = (keywords: string[]) => keywords.reduce((acc, kw) => {
      const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp(`\\b${escaped}\\b`)
      return acc + (regex.test(q) ? 1 : 0)
    }, 0)

    // ── GREETING ─────────────────────────────────────────
    if (score(['hi', 'hello', 'hey', 'greet', 'good morning', 'good evening', 'howdy', 'sup', 'who are you', 'what is jarvis']) >= 1)
      return `### 👋 Greetings! I am Jarvis — Anurag Swain's AI Voice Assistant\n\n- **Operational Mode**: High-precision offline fallback engine\n- **Domain Knowledge**: Complete portfolio records of Anurag's engineering skills, machine learning projects, internships, and background\n- **Status**: All systems operational and at your command\n\n#### 🎯 Suggested Topics to Explore:\n- **Technical Skills**: *"What are his strongest skills?"*\n- **Internships**: *"Summarize his 5 internships"*\n- **Projects**: *"Tell me about the EV charging prediction project"*\n- **Education**: *"What is his CGPA and college?"*\n- **Certifications**: *"What credentials does he hold?"*\n- **Hiring & Availability**: *"Is he available for hire?"*`

    // ── WHO IS HE / IDENTITY ──────────────────────────────
    if (score(['who is', 'who are', 'about him', 'introduce', 'tell me about', 'who is anurag', 'overview', 'summary', 'profile']) >= 1)
      return `### 🧑‍💻 Anurag Swain — Full-Stack Developer & AI/ML Engineer\n\n#### 👤 Core Identity\n- **Full Name**: Anurag Swain\n- **Age / Birthday**: 19 years old (Born 16 January 2006)\n- **Location**: Bhubaneswar, Odisha, India\n- **Current Status**: 3rd-Year B.Tech in CSE @ GCE Kalahandi (BPUT)\n- **Academic CGPA**: **8.10 / 10.00** (Graduating in 2027)\n\n#### 💼 Professional Experience\n- **5 Internships Completed (2025)**: Across AI, Deep Learning, Full-Stack, and Data Science\n- **AI & NLP Research**: Built production NLP chatbot at Infosys and computer vision CNNs at MicroGenesis\n- **Full-Stack Engineering**: React.js, Next.js 14, Node.js, Express, FastAPI, MongoDB, MySQL\n- **Open Source**: 14+ GitHub repositories with community recognition\n- **Certified**: IBM SkillsBuild, AICTE, and Infosys Springboard`

    // ── CONTACT ───────────────────────────────────────────
    if (score(['contact', 'email', 'mail', 'reach', 'phone', 'call', 'get in touch', 'connect', 'message him']) >= 1)
      return `### 📬 Contact & Connect with Anurag Swain\n\n#### 📞 Direct Channels\n- **Primary Email**: [anurag.swain35@gmail.com](mailto:anurag.swain35@gmail.com)\n- **Alternate Email**: [anuragswain01@outlook.com](mailto:anuragswain01@outlook.com)\n- **Phone / WhatsApp**: +91-7008973337\n- **Location**: OldTown, Bhubaneswar, Odisha, India (PIN 751002)\n- **Response Time**: Under 24 hours guaranteed\n\n#### 🌐 Social & Developer Profiles\n- **LinkedIn**: [linkedin.com/in/anurag-swain-cse07](https://www.linkedin.com/in/anurag-swain-cse07/)\n- **GitHub**: [github.com/HUNTER-X0s](https://github.com/HUNTER-X0s)\n- **Twitter / X**: [@Anurag_hunter07](https://x.com/Anurag_hunter07)\n- **Instagram**: [@_vi_ll_a_in_](https://www.instagram.com/_vi_ll_a_in/)\n- **Threads**: [@_vi_ll_a_in_](https://www.threads.com/@_vi_ll_a_in_)`

    // ── INSTAGRAM ─────────────────────────────────────────
    if (score(['instagram', 'insta']) >= 1)
      return `### 📸 Social & Community Profiles\n\n- **Instagram**: [@_vi_ll_a_in_](https://www.instagram.com/_vi_ll_a_in/)\n- **Threads**: [@_vi_ll_a_in_](https://www.threads.com/@_vi_ll_a_in/)\n- **Twitter / X**: [@Anurag_hunter07](https://x.com/Anurag_hunter07)\n- **LinkedIn**: [anurag-swain-cse07](https://www.linkedin.com/in/anurag-swain-cse07/)\n- **GitHub**: [HUNTER-X0s](https://github.com/HUNTER-X0s)`

    // ── GITHUB ────────────────────────────────────────────
    if (score(['github', 'repository', 'repo', 'open source', 'code', 'hunter-x0s']) >= 1)
      return `### 🐙 GitHub Overview — [github.com/HUNTER-X0s](https://github.com/HUNTER-X0s)\n\n- **Public Repositories**: 14 open-source repositories\n- **Community Recognition**: 3 starred repositories\n- **Primary Languages**: Python, JavaScript, Jupyter Notebook, C++, Java\n\n#### 📦 Featured Repositories:\n- **AI_CHAT_BOT**: NLP conversational chatbot built at Infosys (Python, ⭐1) → [View](https://github.com/HUNTER-X0s/AI_CHAT_BOT)\n- **EV-VEHICLE-CHARGING-DEMAND-PREDICTION**: ML regression pipeline ($R^2=0.86$, ⭐1) → [View](https://github.com/HUNTER-X0s/EV-VEHICLE-CHARGING-DEMAND-PREDICTION)\n- **RESEARCH_AGENT**: Autonomous multi-source research synthesis agent (IBM SkillsBuild) → [View](https://github.com/HUNTER-X0s/RESEARCH_AGENT)\n- **Currency_Converter**: Real-time 150+ currency converter web app (⭐1) → [View](https://hunter-x0s.github.io/Currency_Converter/)\n- **SHADOW-FOX_DATASCIENCE_INTERNSHIP**: Complete data science & predictive modeling notebooks → [View](https://github.com/HUNTER-X0s/SHADOW-FOX_DATASCIENCE_INTERNSHIP)\n- **CERTIFICATIONS**: Centralized repository of all official certificates → [View](https://github.com/HUNTER-X0s/CERTIFICATIONS)`

    // ── LINKEDIN ──────────────────────────────────────────
    if (score(['linkedin']) >= 1)
      return `### 💼 LinkedIn Profile Overview\n\n- **Profile URL**: [linkedin.com/in/anurag-swain-cse07](https://www.linkedin.com/in/anurag-swain-cse07/)\n- **Skill Endorsements**: 12+ verified technical endorsements from MicroGenesis TechSoft Bangalore\n- **Certifications**: All 5 professional internship credentials listed (Infosys, EISystems, Edunet/IBM, MicroGenesis, Shadow Fox)\n- **Networking**: Open for technical networking, internship inquiries, and engineering opportunities`

    // ── LOCATION ──────────────────────────────────────────
    if (score(['location', 'where', 'city', 'bhubaneswar', 'odisha', 'india', 'based', 'live']) >= 1)
      return `### 📍 Location & Relocation Information\n\n- **Current Residence**: Bhubaneswar, Odisha, India (PIN: 751002)\n- **College Campus**: Government College of Engineering, Kalahandi, Odisha\n- **Past On-Site Work**: Bangalore (MicroGenesis TechSoft, Golden Enclave, Old Airport Road)\n- **Relocation Availability**: Fully open to relocate for full-time and on-site internship roles (Bangalore, Hyderabad, Pune, NCR, Remote)`

    // ── AGE / DOB ─────────────────────────────────────────
    if (score(['age', 'born', 'birthday', 'dob', 'date of birth', 'old is he', 'how old']) >= 1)
      return `### 🎂 Personal Details\n\n- **Date of Birth**: 16 January 2006\n- **Current Age**: 19 years old\n- **Hometown**: Bhubaneswar, Odisha, India\n- **Academic Year**: 3rd Year B.Tech Computer Science (2023–2027)`

    // ── CGPA / ACADEMICS ─────────────────────────────────
    if (score(['cgpa', 'gpa', 'grade', 'marks', 'academic', 'percentage', 'score', 'rank']) >= 1)
      return `### 🎓 Academic Standing & Performance\n\n- **Cumulative GPA (CGPA)**: **8.10 / 10.00**\n- **Degree**: Bachelor of Technology (B.Tech) in Computer Science and Engineering\n- **College**: Government College of Engineering, Kalahandi (GCEK)\n- **University**: Biju Patnaik University of Technology (BPUT), Odisha\n- **Graduation Year**: 2027\n\n#### 📚 Core CS Coursework:\n- **Data Structures & Algorithms (DSA)**\n- **Object-Oriented Programming (OOP in C++ & Java)**\n- **Database Management Systems (DBMS & SQL)**\n- **Operating Systems & Linux Systems**\n- **Computer Networks (CN)**\n- **Artificial Intelligence & Machine Learning**`

    // ── EDUCATION ─────────────────────────────────────────
    if (score(['education', 'college', 'university', 'school', 'degree', 'study', 'gcek', 'bput', 'kendriya vidyalaya', 'class 10', 'class 12', 'cbse']) >= 1)
      return `### 🎓 Educational Background\n\n#### 1. 🏫 Undergraduate Degree (2023 – 2027)\n- **Degree**: B.Tech in Computer Science and Engineering (CSE)\n- **Institution**: Government College of Engineering, Kalahandi (GCEK)\n- **University**: BPUT Odisha\n- **Academic Performance**: **CGPA 8.10 / 10.00**\n- **Extracurricular**: Active technical member of **KiloBots Robotics Club**\n\n#### 2. 🏫 Senior Secondary / Class XII (2023)\n- **School**: Kendriya Vidyalaya No-6, Pokhariput, Bhubaneswar\n- **Board**: CBSE (Science — Physics, Chemistry, Mathematics, Biology)\n- **Leadership**: Appointed **Ashoka House Sports Captain**\n\n#### 3. 🏫 Secondary / Class X (2021)\n- **School**: Kendriya Vidyalaya No-6, Pokhariput, Bhubaneswar\n- **Board**: CBSE`

    // ── SKILLS / TECH STACK ───────────────────────────────
    if (score(['skill', 'tech', 'stack', 'language', 'strongest', 'good at', 'expertise', 'proficient', 'technology', 'know', 'what can he do']) >= 1)
      return `### 💡 Technical Skills & Core Competencies\n\n#### 🐍 Programming Languages\n- **Python (88%)**: Primary language for AI/ML, NLP, data analysis, and backend APIs\n- **JavaScript (82%)**: Core web development, dynamic DOM, asynchronous workflows\n- **C / C++ (80% / 78%)**: Algorithms, Data Structures, and systems programming\n- **Java (75%)**: Object-oriented software design and enterprise fundamentals\n- **SQL (80%)**: Relational schema design, complex joins, and query optimization\n- **PHP (60%)**: Server-side scripting\n\n#### 🤖 AI / Machine Learning / Deep Learning\n- **Scikit-Learn (82%)**: Supervised regression, classification, and Random Forest\n- **TensorFlow & Keras (80%)**: Deep neural network architecture design and training\n- **PyTorch (78%)**: Custom CNN architectures (VGG, ResNet)\n- **Computer Vision (75%)**: OpenCV image preprocessing and feature extraction\n- **NLP & RAG Systems**: Multi-turn dialogue, vector embeddings, and ChromaDB\n\n#### 🌐 Full-Stack Web Development\n- **React.js (78%)**: Custom hooks, state management, component architecture\n- **Next.js 14 (74%)**: Server-Side Rendering (SSR), App Router, dynamic routes\n- **Node.js (73%) & Express.js**: RESTful API design and backend services\n- **Python FastAPI**: High-speed asynchronous AI/RAG microservices\n- **Databases**: MongoDB (70%) NoSQL modeling and MySQL (78%) relational DBs\n- **Styling**: Tailwind CSS (75%), HTML5/CSS3 (85%), responsive design\n\n#### 📊 Data Science & Analytics\n- **Pandas & NumPy (85%)**: Data ingestion, manipulation, and numerical computing\n- **Matplotlib & Seaborn (80%)**: Statistical data visualization and EDA\n- **Jupyter Notebook (85%)**: Reproducible analysis workflows\n- **Tableau (74%)**: Interactive business intelligence dashboards\n- **Power BI (68%)**: KPI tracking and analytics reports\n\n#### 🛠️ Tools & DevOps\n- **Git & GitHub (82%)**: Version control, branch management, collaborative workflows\n- **Docker**: Containerization and reproducible deployment\n- **Cloud & Deployment**: Vercel Edge, Render.com, IBM Watson Cloud APIs\n- **Operating Systems**: Linux / Ubuntu (68%) CLI proficiency\n- **Dev Tools**: VS Code (88%), Postman API testing, Figma wireframing`

    // ── PROJECTS ──────────────────────────────────────────
    if (score(['project', 'built', 'made', 'created', 'developed', 'work', 'portfolio', 'github project', 'demo']) >= 1)
      return `### 🚀 Key Featured Projects\n\n#### 1. 🤖 AI Chat Bot (Conversational NLP System)\n- **Tech Stack**: Python, NLP, LLM API Integration, Session Dialogue Management\n- **Role**: Developed during Infosys AI Internship\n- **Highlights**: Multi-turn context memory, intent parsing, and entity recognition\n- **GitHub**: [HUNTER-X0s/AI_CHAT_BOT](https://github.com/HUNTER-X0s/AI_CHAT_BOT) (⭐1)\n\n#### 2. 🚗 EV Vehicle Charging Demand Prediction\n- **Tech Stack**: Python, Scikit-Learn, Random Forest, Pandas, Matplotlib\n- **Role**: Developed under AICTE Internship Cycle-2 at Edunet Foundation\n- **Accuracy**: Achieved $R^2=0.86$ (86% variance explained) with 18% RMSE reduction\n- **GitHub**: [HUNTER-X0s/EV-VEHICLE-CHARGING-DEMAND-PREDICTION](https://github.com/HUNTER-X0s/EV-VEHICLE-CHARGING-DEMAND-PREDICTION) (⭐1)\n\n#### 3. 🔍 Autonomous Research Agent\n- **Tech Stack**: Python, IBM Watson Cloud APIs, NLP Summarization\n- **Role**: Capstone project for IBM SkillsBuild\n- **Highlights**: Multi-source research synthesis, automated extraction, and executive brief drafting\n- **GitHub**: [HUNTER-X0s/RESEARCH_AGENT](https://github.com/HUNTER-X0s/RESEARCH_AGENT)\n\n#### 4. 💱 Currency Converter Web Application\n- **Tech Stack**: Vanilla JavaScript, HTML5, CSS3, Live Exchange Rate APIs\n- **Highlights**: Real-time currency conversions across 150+ currencies with localStorage caching\n- **Live Demo**: [hunter-x0s.github.io/Currency_Converter](https://hunter-x0s.github.io/Currency_Converter/) (⭐1)\n\n#### 5. 🌐 AI-Powered 3D Portfolio Platform\n- **Tech Stack**: Next.js 14, Three.js, RAG AI Pipeline, Web Speech API (Jarvis Voice), TailwindCSS\n- **Highlights**: 60fps particle physics, dual-mode RAG chatbot, voice control, command palette`

    // ── EV PROJECT ────────────────────────────────────────
    if (score(['ev', 'electric vehicle', 'charging demand', 'demand prediction']) >= 1)
      return `### 🚗 EV Vehicle Charging Demand Prediction Project\n\n- **Objective**: Forecast electric vehicle charging station loads to optimize smart grid power distribution\n- **Program**: AICTE Internship Cycle-2 at Edunet Foundation\n- **Model Architecture**: Random Forest Regressor & Ridge Regression with temporal feature engineering\n- **Performance Metric**: Achieved an **$R^2$ Score of 0.86** (86% variance explained) with an 18% RMSE reduction\n- **Tech Stack**: Python, Scikit-Learn, Pandas, NumPy, Matplotlib, Seaborn, Jupyter Notebook\n- **Repository**: [github.com/HUNTER-X0s/EV-VEHICLE-CHARGING-DEMAND-PREDICTION](https://github.com/HUNTER-X0s/EV-VEHICLE-CHARGING-DEMAND-PREDICTION) (⭐1)`

    // ── AI CHATBOT PROJECT ────────────────────────────────
    if (score(['ai chat', 'chatbot project', 'chat bot', 'nlp project', 'infosys project']) >= 1)
      return `### 🤖 AI Chat Bot Project (Infosys AI Internship)\n\n- **Objective**: Design and deploy a context-aware conversational agent for customer support workflows\n- **Program**: Infosys Springboard Virtual Internship 2.0 (August – October 2025)\n- **Key Features**:\n  - Multi-turn context and state tracking\n  - Custom intent classification and named entity recognition (NER)\n  - Integration with LLM APIs for enhanced answer generation\n  - Evaluated with precision and recall metrics\n- **Tech Stack**: Python, NLP libraries, LLM APIs, Jupyter Notebook\n- **Repository**: [github.com/HUNTER-X0s/AI_CHAT_BOT](https://github.com/HUNTER-X0s/AI_CHAT_BOT) (⭐1)`

    // ── INTERNSHIP / EXPERIENCE ───────────────────────────
    if (score(['intern', 'experience', 'company', 'work', 'job', 'employer', 'worked at', 'past role', 'professional']) >= 1)
      return `### 💼 Professional Experience (5 Internships in 2025)\n\n#### 1. 🏢 Infosys — AI Intern\n- **Duration**: August 2025 – October 2025 (3 months · Remote)\n- **Project**: Developed conversational AI Chat Bot with multi-turn dialogue management\n- **Tech**: Python, NLP Preprocessing, LLM APIs, Intent Classification\n- **Credential**: Infosys Springboard Virtual Internship 2.0 Completion Certificate\n\n#### 2. 💻 EISystems Technologies — Web Development Intern\n- **Duration**: July 2025 – September 2025 (3 months · Remote)\n- **Project**: Built production full-stack web applications\n- **Tech**: React.js, Next.js, Node.js, Express.js, MongoDB, RESTful APIs\n- **Optimizations**: Applied code splitting, lazy loading, and component-driven architecture\n\n#### 3. ☁️ Edunet Foundation & IBM — AI & Analytics Intern\n- **Duration**: July 2025 – August 2025 (2 months · Remote)\n- **Project 1**: AICTE-certified EV Charging Demand Prediction ML pipeline ($R^2=0.86$)\n- **Project 2**: Autonomous Research Agent for IBM SkillsBuild\n- **Tech**: Python, Scikit-Learn, Tableau, Microsoft Power BI, IBM Watson Cloud APIs\n\n#### 4. 🧠 MicroGenesis TechSoft, Bangalore — Deep Learning Intern\n- **Duration**: June 2025 – July 2025 (2 months · Hybrid In-Person)\n- **Project**: Computer Vision and Convolutional Neural Networks\n- **Tech**: PyTorch, TensorFlow, Keras, OpenCV, Python\n- **Recognition**: 12+ technical skill endorsements on LinkedIn\n\n#### 5. 📊 Shadow Fox — Data Science Intern\n- **Duration**: 2025 (1 month · Remote)\n- **Project**: End-to-end exploratory data analysis (EDA) and predictive modeling\n- **Tech**: Python, Pandas, NumPy, Scikit-Learn, Matplotlib, Seaborn\n\n#### ⏱️ Aggregate Industry Experience\n- **Total Duration**: ~12 months of structured industry work across AI, Web Dev, DL, and Data Science`

    // ── INFOSYS ───────────────────────────────────────────
    if (score(['infosys']) >= 1)
      return `### 🏢 Infosys AI Internship Summary\n\n- **Role**: Artificial Intelligence Intern\n- **Duration**: August – October 2025 (3 months · Remote)\n- **Program**: Infosys Springboard Virtual Internship 2.0\n- **Key Deliverable**: Developed the AI Chat Bot project featuring context tracking and intent recognition\n- **Technologies**: Python, NLP Preprocessing, LLM API integration, Session Memory\n- **Certificate**: Infosys Virtual Internship 2.0 Completion Certificate\n- **Repository**: [github.com/HUNTER-X0s/AI_CHAT_BOT](https://github.com/HUNTER-X0s/AI_CHAT_BOT) (⭐1)`

    // ── MICROGENESIS / DEEP LEARNING ──────────────────────
    if (score(['microgenesis', 'deep learning', 'bangalore', 'computer vision', 'cnn', 'tensorflow', 'pytorch', 'opencv']) >= 1)
      return `### 🧠 MicroGenesis TechSoft — Deep Learning Internship\n\n- **Role**: Deep Learning Intern\n- **Location**: Bangalore (Golden Enclave, Old Airport Road) — Hybrid Setup\n- **Duration**: June – July 2025 (2 months)\n- **Work Focus**: Computer Vision, Transfer Learning, and Neural Network Architectures\n- **Models Trained**: VGG16, ResNet50, and custom convolutional architectures\n- **Computer Vision**: Image preprocessing, feature extraction, and augmentation using OpenCV\n- **Tech Stack**: PyTorch, TensorFlow, Keras, OpenCV, Python\n- **Recognition**: 12+ technical skill endorsements from MicroGenesis team`

    // ── HIRE / AVAILABILITY ───────────────────────────────
    if (score(['hire', 'available', 'opportunity', 'looking', 'open to', 'job', 'recruit', 'position', 'role', 'offer', 'candidate']) >= 1)
      return `### ✅ Candidate Availability & Value Proposition\n\n#### 🟢 Current Status\n- **Availability**: Actively open for Internships, Part-Time, and Full-Time positions\n- **Target Roles**: Software Development Engineer (SDE), AI/ML Engineer, Full-Stack Developer, Data Scientist\n- **Work Modes**: Remote, Hybrid, or Relocation across India\n\n#### ⭐ Top 5 Reasons to Hire Anurag:\n- **1. Rare Experience**: Completed 5 competitive internships in 2025 across AI, Deep Learning, Full-Stack, and Data Science\n- **2. Strong Academics**: 8.10 / 10.00 CGPA in B.Tech CSE at Government College of Engineering, Kalahandi\n- **3. Full-Stack + AI Depth**: Can build both the machine learning model / RAG pipeline and the production web app\n- **4. Verified Credentials**: Certified by IBM, AICTE, Infosys, and MicroGenesis TechSoft\n- **5. Prolific Builder**: 14+ public GitHub repositories with community recognition\n\n#### 📬 Get in Touch:\n- **Email**: [anurag.swain35@gmail.com](mailto:anurag.swain35@gmail.com)\n- **Phone**: +91-7008973337\n- **Response Window**: Within 24 hours`

    // ── CERTIFICATIONS ────────────────────────────────────
    if (score(['certif', 'badge', 'course', 'credential', 'award', 'achievement', 'ibm', 'aicte', 'hackerrank']) >= 1)
      return `### 🏆 Verified Certifications & Credentials\n\n#### 🏢 Professional Internship Certifications (2025)\n- **Infosys**: Artificial Intelligence Virtual Internship 2.0 Certificate\n- **MicroGenesis TechSoft**: Deep Learning Internship Certificate (Bangalore)\n- **EISystems Technologies**: Full-Stack Web Development Internship Certificate\n- **Edunet Foundation**: AI & Data Analytics Internship Certificate\n- **IBM SkillsBuild**: AI & Cloud Technologies Capstone Credential\n- **AICTE**: Internship Cycle-2 Certificate (EV Demand Prediction)\n- **Shadow Fox**: Data Science Internship Certificate\n\n#### 💻 Platform & Technical Certifications\n- **HackerRank**: Python & Problem Solving Certifications\n- **Cisco Networking Academy**: Cybersecurity Fundamentals\n\n#### 📁 Verified Credentials Repository\n- **GitHub**: [github.com/HUNTER-X0s/CERTIFICATIONS](https://github.com/HUNTER-X0s/CERTIFICATIONS)`

    // ── SALARY / COMPENSATION ─────────────────────────────
    if (score(['salary', 'stipend', 'pay', 'ctc', 'compensation', 'package', 'money', 'expect']) >= 1)
      return `### 💰 Compensation & Stipend Expectations\n\n- **Internship Roles**: Standard market-rate monthly stipend (typically ₹12,000 – ₹25,000/month depending on scope & location)\n- **Full-Time SDE/AI Roles**: Competitive fresher industry compensation bands\n- **Candidate Priorities**: High-impact engineering work, learning curve, and tech stack alignment\n- **Direct Discussion**: Reach out directly at [anurag.swain35@gmail.com](mailto:anurag.swain35@gmail.com) or +91-7008973337`

    // ── HOBBIES / PERSONAL ────────────────────────────────
    if (score(['hobby', 'interest', 'outside work', 'personal', 'sport', 'like to do', 'free time', 'fun', 'chess', 'cricket', 'gaming']) >= 1)
      return `### 🎮 Extracurricular Interests & Activities\n\n#### ♟️ Strategic & Competitive Sports\n- **Competitive Chess**: Strategic tactical thinking and rapid chess analysis\n- **Cricket & Badminton**: Active competitive player and former Ashoka House Sports Captain\n- **Football & Volleyball**: Team sports enthusiast\n\n#### 🏞️ Outdoor & Creative\n- **Cycling & Trekking**: Outdoor endurance enthusiast\n- **Swimming**: Regular fitness activity\n- **Photography**: Capturing nature, cityscapes, and visual aesthetics\n- **Robotics**: Contributing to hardware and automation projects in GCEK KiloBots Club`

    // ── LANGUAGES SPOKEN ──────────────────────────────────
    if (score(['language', 'speak', 'fluent', 'odia', 'hindi', 'bengali', 'english', 'multilingual']) >= 1)
      return `### 🗣️ Spoken Language Proficiencies\n\n- **English**: Professional Working Proficiency (Fluent for technical documentation, client dialogue, and presentations)\n- **Hindi**: Native / Bilingual Proficiency\n- **Odia**: Native / Bilingual Proficiency (Home state language)\n- **Bengali**: Conversational / Intermediate Proficiency`

    // ── PORTFOLIO TECH STACK ──────────────────────────────
    if (score(['this website', 'this portfolio', 'portfolio site', 'how was this built', 'tech behind', 'next.js', 'three.js', 'jarvis', 'nexus']) >= 1)
      return `### 🌐 Portfolio Architecture & Tech Stack\n\n#### ⚛️ Frontend Engineering\n- **Next.js 14 (App Router)**: Server-side rendering, code splitting, and React Server Components\n- **Three.js & WebGL**: Dynamic 3D interactive particle fields and physics\n- **Framer Motion**: High-performance hardware-accelerated animations\n- **TailwindCSS**: Modern utility-based design system with glassmorphism\n\n#### 🤖 AI Intelligence & Voice\n- **Nexus Chatbot**: Dual-mode RAG engine with ChromaDB vector search + Groq LLaMA 3\n- **Jarvis Voice Assistant**: Web Speech API integration for natural voice commands\n- **Ambient Audio Engine**: Web Audio synthesizer and procedural soundscapes\n- **Command Palette**: Global keyboard navigation interface (Ctrl + K)\n\n#### ☁️ Infrastructure & Hosting\n- **Frontend**: Hosted on **Vercel Edge Network**\n- **Backend**: Hosted on **Render.com** (Python FastAPI RAG Service)`

    // ── STRENGTHS / WHY HIRE ──────────────────────────────
    if (score(['strength', 'why hire', 'value', 'best', 'recommend', 'good candidate', 'should i hire', 'what makes', 'unique', 'stand out', 'advantage']) >= 1)
      return `### ⭐ Why Anurag Swain Stands Out\n\n- **1. Exceptional Experience for a 3rd-Year Student**: 5 professional internships completed in 2025 across AI, Deep Learning, Full-Stack, and Data Science\n- **2. Production AI Capability**: Real-world experience building NLP chatbots at Infosys, computer vision at MicroGenesis, and regression models for AICTE\n- **3. Full-Stack Mastery**: Able to architect end-to-end web apps from React/Next.js frontends down to Node/FastAPI backends and databases\n- **4. Strong CS Core**: 8.10 CGPA demonstrating solid foundations in algorithms, OOP, database design, and systems\n- **5. Execution Speed**: 14 public GitHub repositories delivering production-ready, well-documented code`

    // ── CLUBS / ACTIVITIES ────────────────────────────────
    if (score(['club', 'robot', 'kilobot', 'extra', 'activity', 'volunteer', 'fest', 'competition', 'sports captain']) >= 1)
      return `### 🏅 Clubs & Leadership Activities\n\n- **KiloBots Robotics Club (GCE Kalahandi)**: Active technical member contributing to autonomous robotics and embedded systems\n- **Sports Leadership**: Served as **Ashoka House Sports Captain** at Kendriya Vidyalaya\n- **Hackathons & Fests**: Active participant and volunteer at collegiate engineering fests and tech hackathons`

    // ── SOCIAL PROFILES ───────────────────────────────────
    if (score(['social', 'twitter', 'x.com', 'threads', 'profile', 'follow', 'handle', 'username']) >= 1)
      return `### 🌐 Official Online Profiles\n\n- **LinkedIn**: [linkedin.com/in/anurag-swain-cse07](https://www.linkedin.com/in/anurag-swain-cse07/)\n- **GitHub**: [github.com/HUNTER-X0s](https://github.com/HUNTER-X0s)\n- **Twitter / X**: [@Anurag_hunter07](https://x.com/Anurag_hunter07)\n- **Instagram**: [@_vi_ll_a_in_](https://www.instagram.com/_vi_ll_a_in/)\n- **Threads**: [@_vi_ll_a_in_](https://www.threads.com/@_vi_ll_a_in_)\n- **Portfolio Website**: [anuragswain.vercel.app](https://anuragswain.vercel.app)`

    // ── RESUME ────────────────────────────────────────────
    if (score(['resume', 'cv', 'curriculum vitae', 'download', 'pdf']) >= 1)
      return `### 📄 Anurag Swain's Resume\n\n- **Direct Download**: Click **"Download Resume"** in the **Hero Section** or the **Footer Resources** section\n- **Email Request**: [anurag.swain35@gmail.com](mailto:anurag.swain35@gmail.com)\n\n#### 📋 Resume Highlights:\n- **Academics**: 3rd-Year B.Tech CSE @ GCE Kalahandi (CGPA 8.10)\n- **Experience**: 5 Internships (Infosys, EISystems, Edunet/IBM, MicroGenesis, Shadow Fox)\n- **Skills**: Python, React, Next.js, TensorFlow, PyTorch, Scikit-Learn, MongoDB\n- **Credentials**: 7+ Verified Certifications\n- **Code**: 14 Open-Source GitHub Repositories`

    // ── PYTHON SKILLS ─────────────────────────────────────
    if (score(['python']) >= 1)
      return `### 🐍 Python Proficiency & Stack\n\n- **Proficiency Level**: **88%** (Primary and most utilized language)\n\n#### 🤖 AI & Machine Learning Stack:\n- **Scikit-Learn**: Supervised regression, classification, Random Forest\n- **TensorFlow & PyTorch**: Deep neural networks and CNN architectures\n- **NLTK & NLP Tools**: Text tokenization, intent classification, entity recognition\n- **Vector Databases**: ChromaDB and semantic embedding pipelines\n\n#### 📊 Data Science & Analytics Stack:\n- **Pandas & NumPy**: Data cleaning, wrangling, and multi-dimensional arrays\n- **Matplotlib & Seaborn**: Statistical visualizations and distribution plots\n- **Jupyter Notebook**: Data exploration and reproducible research\n\n#### 🌐 Backend Engineering:\n- **FastAPI**: Asynchronous Python API powering the RAG chatbot server\n\n#### 📦 Featured Python Repositories:\n- [AI_CHAT_BOT](https://github.com/HUNTER-X0s/AI_CHAT_BOT)\n- [EV-VEHICLE-CHARGING-DEMAND-PREDICTION](https://github.com/HUNTER-X0s/EV-VEHICLE-CHARGING-DEMAND-PREDICTION)\n- [RESEARCH_AGENT](https://github.com/HUNTER-X0s/RESEARCH_AGENT)\n- [SHADOW-FOX_DATASCIENCE_INTERNSHIP](https://github.com/HUNTER-X0s/SHADOW-FOX_DATASCIENCE_INTERNSHIP)`

    // ── AI / ML SKILLS ────────────────────────────────────
    if (score(['ai', 'machine learning', 'ml', 'deep learning', 'neural network', 'model', 'llm', 'nlp', 'generative', 'artificial intelligence']) >= 1)
      return `### 🤖 AI, Machine Learning & Deep Learning Expertise\n\n#### 🧠 Machine Learning (82%)\n- **Algorithms**: Random Forest, Ridge/Lasso Regression, Gradient Boosting, SVM, K-Means\n- **Techniques**: Feature engineering, hyperparameter tuning, cross-validation, and metrics evaluation\n\n#### 🔬 Deep Learning & Computer Vision (80% / 78%)\n- **Architectures**: Convolutional Neural Networks (CNNs), VGG16, ResNet50\n- **Frameworks**: PyTorch, TensorFlow, Keras\n- **Computer Vision**: OpenCV (75%) for image filtering, preprocessing, and feature maps\n\n#### 💬 Natural Language Processing & Generative AI (75%)\n- **Dialogue Systems**: Multi-turn conversation tracking, intent classification, entity parsing\n- **RAG Architectures**: Vector similarity search (ChromaDB), prompt orchestration, and LLM inference\n\n#### 🚀 Practical Projects:\n- **AI Chat Bot** (Infosys) → [View](https://github.com/HUNTER-X0s/AI_CHAT_BOT)\n- **EV Demand Predictor** (AICTE) → [View](https://github.com/HUNTER-X0s/EV-VEHICLE-CHARGING-DEMAND-PREDICTION)\n- **Research Agent** (IBM) → [View](https://github.com/HUNTER-X0s/RESEARCH_AGENT)`

    // ── WEB DEVELOPMENT ───────────────────────────────────
    if (score(['web', 'react', 'next', 'frontend', 'backend', 'full stack', 'node', 'javascript', 'html', 'css', 'mongodb', 'api']) >= 1)
      return `### 🌐 Full-Stack Web Development Skills\n\n#### ⚛️ Frontend Architecture\n- **React.js (78%)**: Custom hooks, state management, component lifecycles\n- **Next.js 14 (74%)**: Server-Side Rendering (SSR), App Router, dynamic routing\n- **Styling**: HTML5/CSS3 (85%), Tailwind CSS (75%), Bootstrap (72%)\n- **Visuals & 3D**: Three.js WebGL canvas, Framer Motion\n\n#### 🟢 Backend & Database\n- **Node.js (73%) & Express.js**: RESTful API endpoints, middleware, authentication\n- **Python FastAPI**: Asynchronous AI model serving and RAG endpoints\n- **MongoDB (70%)**: NoSQL document schema design and aggregation pipelines\n- **MySQL (78%)**: Relational schema design, normalization, complex SQL joins\n\n#### 💼 Real-World Experience\n- **EISystems Technologies**: 3-month Web Development Internship building full-stack web applications`

    // ── DATA SCIENCE ──────────────────────────────────────
    if (score(['data science', 'data analyst', 'pandas', 'numpy', 'matplotlib', 'tableau', 'power bi', 'eda', 'visualization', 'statistics']) >= 1)
      return `### 📊 Data Science & Analytics Competencies\n\n#### 🐼 Python Data Stack\n- **Pandas & NumPy (85%)**: Data ingestion, cleaning, multi-dimensional transformations\n- **Matplotlib & Seaborn (80% / 78%)**: Exploratory data visualization and statistical charts\n- **Jupyter Notebook (85%)**: Reusable analysis workflows and pipeline documentation\n\n#### 📈 BI & Reporting Tools\n- **Tableau (74%)**: Interactive business dashboards and stakeholder reports\n- **Microsoft Power BI (68%)**: KPI metrics tracking and business intelligence\n\n#### 💼 Applied Industry Experience\n- **Shadow Fox**: Data Science Intern (Full EDA & predictive modeling pipeline)\n- **Edunet Foundation**: AI & Data Analytics Intern (Tableau + IBM Watson)`

    // ── CLOUD / TOOLS ─────────────────────────────────────
    if (score(['cloud', 'ibm', 'docker', 'vercel', 'deploy', 'devops', 'linux', 'git', 'postman', 'tool']) >= 1)
      return `### ☁️ Tools, Cloud & DevOps Proficiency\n\n- **Git & GitHub (82%)**: Version control, branch management, pull requests\n- **Cloud Platforms**: IBM Cloud / Watson APIs, Vercel Edge Network, Render.com\n- **Containers**: Docker containerization fundamentals\n- **Operating Systems**: Linux / Ubuntu (68%) CLI proficiency since school level\n- **Developer Tools**: VS Code (88%), Postman API testing, Jupyter Notebook\n- **UI Design**: Figma & Canva wireframing`

    // ── NAME / IDENTITY SIMPLE ────────────────────────────
    if (score(['name', 'what is his name', 'who are you', 'candidate']) >= 1)
      return `### 👤 Candidate Identity\n\n- **Name**: Anurag Swain\n- **Status**: 3rd-Year B.Tech CSE Student (CGPA: 8.10 / 10.00)\n- **Role**: Full-Stack Developer & AI/ML Engineer\n- **Location**: Bhubaneswar, Odisha, India\n- **Email**: [anurag.swain35@gmail.com](mailto:anurag.swain35@gmail.com)\n- **Phone**: +91-7008973337`

    // ── SHADOW FOX / DATA SCIENCE INTERNSHIP ─────────────
    if (score(['shadow fox', 'shadowfox']) >= 1)
      return `### 📊 Shadow Fox — Data Science Internship\n\n- **Role**: Data Science Intern\n- **Timeline**: 2025 (Remote)\n- **Scope of Work**: End-to-end data science lifecycle from data ingestion to model deployment\n- **Key Tasks**: Exploratory data analysis (EDA), data cleaning, feature engineering, and statistical modeling\n- **Tech Stack**: Python, Pandas, NumPy, Scikit-Learn, Matplotlib, Seaborn, Jupyter Notebook\n- **Repository**: [github.com/HUNTER-X0s/SHADOW-FOX_DATASCIENCE_INTERNSHIP](https://github.com/HUNTER-X0s/SHADOW-FOX_DATASCIENCE_INTERNSHIP)`

    // ── EISYSTEMS ─────────────────────────────────────────
    if (score(['eisystems', 'ei systems', 'web intern']) >= 1)
      return `### 💻 EISystems Technologies — Web Development Internship\n\n- **Role**: Web Development Intern\n- **Timeline**: July – September 2025 (3 months · Remote)\n- **Scope of Work**: Full-stack web application development and component design\n- **Frontend Stack**: React.js, Next.js, HTML5, CSS3, JavaScript\n- **Backend Stack**: Node.js, Express.js, MongoDB, RESTful APIs\n- **Key Achievements**: Applied React hooks, component-driven UI architecture, and code splitting for faster load times\n- **Credential**: Web Development Internship Certificate`

    // ── DEFAULT COMPREHENSIVE FALLBACK ────────────────────
    return `### 👋 Jarvis AI — Anurag Swain Portfolio Assistant\n\n#### 🎓 Candidate Profile at a Glance:\n- **Student**: Anurag Swain — 3rd-Year B.Tech CSE @ GCE Kalahandi (CGPA: **8.10 / 10.00**)\n- **Experience**: 5 Internships across AI, Web Dev, Deep Learning, and Data Science in 2025\n- **Core Skills**: Python (88%), React/Next.js, TensorFlow, PyTorch, Scikit-Learn, MongoDB\n- **Location**: Bhubaneswar, Odisha, India\n- **Status**: Actively open for Internships and SDE / AI opportunities\n\n#### 💡 Suggested Pointed Queries:\n- *"What are his strongest technical skills?"*\n- *"Summarize his 5 internships"*\n- *"Tell me about the EV charging prediction project"*\n- *"Why should we hire Anurag?"*\n- *"How can I contact him?"*\n\n- **Direct Email**: [anurag.swain35@gmail.com](mailto:anurag.swain35@gmail.com)`
  }

  // ── Speech Recognition ───────────────────────────────────────
  const initRecognition = useCallback(() => {
    if (!isSupported) return null
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const rec = new SR()
    rec.lang           = LANG
    rec.interimResults = true
    // On mobile: use continuous=true so the mic stays open longer;
    // on desktop: continuous=false is fine since there's no auto-stop issue.
    rec.continuous      = isMobileOrTablet() ? true : false
    rec.maxAlternatives = isMobileOrTablet() ? 1 : 3

    rec.onstart = () => {
      setStatus('listening')
      setTranscript('')
      setError(null)
    }

    rec.onresult = (e: any) => {
      let interim = ''
      let final   = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript
        if (e.results[i].isFinal) final += t
        else interim += t
      }
      const current = interim || final
      setTranscript(current)
      transcriptRef.current = current
      if (final) {
        setFinalTranscript(final)
        finalTranscriptRef.current = final
        // On mobile with continuous=true, auto-submit when we get a final result
        if (isMobileOrTablet()) {
          rec.stop()
        }
      }
    }

    rec.onerror = (e: any) => {
      // On mobile, 'aborted' errors are normal lifecycle events — ignore them
      if (e.error === 'aborted') return
      // 'no-speech' on mobile is common if the user pauses; don't treat as fatal
      if (e.error === 'no-speech') {
        setError('No speech detected. Please tap the mic and speak clearly.')
        setStatus('idle')
        return
      }
      const msg = e.error === 'not-allowed'
        ? 'Microphone permission denied. Please allow microphone access in your browser settings.'
        : e.error === 'network'
        ? 'Network error. Please check your connection and try again.'
        : e.error === 'audio-capture'
        ? 'Microphone not found. Please ensure your device has a working mic.'
        : e.error === 'service-not-allowed'
        ? 'Speech recognition not allowed. Ensure you are on HTTPS.'
        : `Voice error: ${e.error}`
      setError(msg)
      setStatus('error')
    }

    rec.onend = () => {
      const recognized = finalTranscriptRef.current || transcriptRef.current
      if (recognized.trim()) {
        const userMsg: VoiceMessage = {
          id: crypto.randomUUID(),
          role: 'user',
          text: recognized.trim(),
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, userMsg])
        const action = parseVoiceCommand(recognized.trim())
        executeAction(action, recognized.trim())
      } else {
        setStatus('idle')
      }
      setTranscript('')
    }

    return rec
  }, [isSupported, executeAction])

  // ── Start listening ───────────────────────────────────────────
  const startListening = useCallback(async () => {
    if (!isSupported) return
    setError(null)

    // Stop any ongoing speech synthesis first.
    // On mobile, TTS and SpeechRecognition cannot run simultaneously.
    // Wait briefly after stopping TTS to let the audio hardware release.
    if (window.speechSynthesis?.speaking || window.speechSynthesis?.pending) {
      window.speechSynthesis.cancel()
      utterancesRef.current = []
      setIsSpeaking(false)
      // Give the audio subsystem time to release on mobile
      await new Promise<void>((resolve) => setTimeout(resolve, isMobileOrTablet() ? 400 : 100))
    }

    try {
      // Abort any existing recognition session
      if (recognitionRef.current) {
        try { recognitionRef.current.abort() } catch {}
        recognitionRef.current = null
        // Brief pause for mobile browsers to fully release mic
        if (isMobileOrTablet()) {
          await new Promise<void>((resolve) => setTimeout(resolve, 250))
        }
      }

      // On iOS Safari, request mic permission explicitly first
      if (isIOSSafari() && hasPermission !== true) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
          stream.getTracks().forEach((t) => t.stop())
          setHasPermission(true)
        } catch {
          setHasPermission(false)
          setError('Microphone permission denied. Please allow microphone access.')
          setStatus('error')
          return
        }
      }

      const rec = initRecognition()
      if (!rec) return
      recognitionRef.current = rec
      transcriptRef.current = ''
      finalTranscriptRef.current = ''
      setFinalTranscript('')

      // Start recognition — wrap in try/catch for mobile 'InvalidStateError'
      try {
        rec.start()
      } catch (startErr: any) {
        // InvalidStateError: recognition already started — abort and retry once
        if (startErr?.name === 'InvalidStateError') {
          try { rec.abort() } catch {}
          await new Promise<void>((resolve) => setTimeout(resolve, 300))
          try { rec.start() } catch {}
        } else {
          throw startErr
        }
      }

      await startAnalyser()
    } catch (e: any) {
      setError('Could not start microphone. Please tap the mic button again.')
      setStatus('error')
    }
  }, [isSupported, hasPermission, initRecognition, stopSpeaking, startAnalyser])

  // ── Stop listening ────────────────────────────────────────────
  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    stopAnalyser()
    setStatus('idle')
    setTranscript('')
  }, [stopAnalyser])

  // ── Request microphone permission ────────────────────────────
  const requestPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach((t) => t.stop())
      setHasPermission(true)
      return true
    } catch {
      setHasPermission(false)
      setError('Microphone access denied. Please enable it in your browser settings.')
      return false
    }
  }, [])

  // ── Proactively check/request mic permission on startup ──────
  useEffect(() => {
    if (typeof navigator === 'undefined' || !isSupported) return
    // Use the Permissions API if available (non-blocking)
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'microphone' as PermissionName })
        .then((result) => {
          if (result.state === 'granted') setHasPermission(true)
          else if (result.state === 'denied') setHasPermission(false)
          // 'prompt' means we leave it null until user taps mic
          result.addEventListener('change', () => {
            if (result.state === 'granted') setHasPermission(true)
            else if (result.state === 'denied') setHasPermission(false)
          })
        })
        .catch(() => {/* permissions API not available — leave null */})
    }
  }, [isSupported])

  const clearHistory = useCallback(() => {
    setMessages([])
    setSessionId(null)
    setTranscript('')
    setFinalTranscript('')
    setError(null)
  }, [])

  // ── Cleanup on unmount ────────────────────────────────────────
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop()
      stopSpeaking()
      stopAnalyser()
    }
  }, [stopSpeaking, stopAnalyser])

  return {
    status, transcript, finalTranscript, messages,
    isSupported, hasPermission, isSpeaking, audioLevel,
    sessionId, error,
    startListening, stopListening, stopSpeaking,
    clearHistory, speak, greet, requestPermission, executeAction,
  }
}

// @ts-nocheck
'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Send, Sparkles, RotateCcw, Bot, User,
  ChevronDown, Loader2, Wifi, WifiOff, Zap, ExternalLink
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { usePortfolioStore } from '@/store/usePortfolioStore'
import { useSound } from '@/hooks'
import type { ChatMessage } from '@/types'
import { generateId } from '@/lib/utils'
import { roles } from '@/data/portfolio'

// ── Config ────────────────────────────────────────────────────
const API_URL = process.env.NEXT_PUBLIC_CHATBOT_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'
const API_TIMEOUT = 120_000

// ── Suggested prompts ─────────────────────────────────────────
const SUGGESTED_PROMPTS = [
  { icon: '⚡', text: "What are his strongest skills?" },
  { icon: '🚀', text: "Explain his best project" },
  { icon: '🎯', text: "What role is he best suited for?" },
  { icon: '✅', text: "Is he available for hire?" },
  { icon: '💼', text: "Summarize his internship experience" },
  { icon: '🎓', text: "What is his educational background and CGPA?" },
]

// ── RAG source badge ──────────────────────────────────────────
function SourceBadge({ source }: { source: { category: string; topic: string; score: number } }) {
  const catColors: Record<string, string> = {
    experience: '#00E5FF',
    skills: '#7C3AED',
    project: '#00FF87',
    certifications: '#FFE500',
    education: '#FF6B2B',
    value_proposition: '#FF2D9C',
    personal: '#8B8BA7',
    github: '#6e5494',
  }
  const color = catColors[source.category] || '#8B8BA7'
  return (
    <span
      className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded font-mono"
      style={{ background: `${color}12`, color, border: `1px solid ${color}22` }}
    >
      {source.category} · {Math.round(source.score * 100)}%
    </span>
  )
}

// ── Clean content helper ──────────────────────────────────────
function cleanMessageContent(text: string): string {
  if (!text) return ''
  return text.replace(/<think>[\s\S]*?(?:<\/think>|$)/gi, '').trimStart()
}

// ── Message bubble ────────────────────────────────────────────
function MessageBubble({
  message,
  isStreaming,
  isLatest,
}: {
  message: ChatMessage & { sources?: any[]; confidence?: number }
  isStreaming?: boolean
  isLatest?: boolean
}) {
  const isUser = message.role === 'user'
  const displayContent = isUser ? message.content : cleanMessageContent(message.content)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: [0.19, 1, 0.22, 1] }}
      className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {/* Bot avatar */}
      {!isUser && (
        <div className="w-6 h-6 rounded-lg bg-cyan/15 border border-cyan/25 flex items-center justify-center flex-shrink-0 mt-1 shadow-[0_0_12px_rgba(0,229,255,0.15)]">
          <Bot size={12} className="text-cyan" />
        </div>
      )}

      <div className="max-w-[86%] space-y-1.5 overflow-hidden">
        <div
          className="px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed overflow-hidden break-words"
          style={isUser ? {
            background: 'linear-gradient(135deg, rgba(0,229,255,0.16), rgba(124,58,237,0.16))',
            border: '1px solid rgba(0,229,255,0.25)',
            color: '#F0F0FF',
            borderBottomRightRadius: '4px',
            boxShadow: '0 4px 20px rgba(0,229,255,0.06)',
          } : {
            background: 'rgba(12, 16, 32, 0.92)',
            border: '1px solid rgba(255,255,255,0.09)',
            color: '#D4D4EC',
            borderBottomLeftRadius: '4px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="space-y-1.5 markdown-content">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className="text-sm sm:text-base font-bold text-white mt-3 mb-1.5 pb-1 border-b border-cyan/20">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xs sm:text-sm font-bold text-cyan-300 mt-2.5 mb-1 flex items-center gap-1.5">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-xs sm:text-xs font-semibold text-cyan-400 mt-2 mb-0.5">{children}</h3>,
                  h4: ({ children }) => <h4 className="text-xs font-semibold text-white/90 mt-1.5 mb-0.5">{children}</h4>,
                  p: ({ children }) => <p className="mb-1.5 last:mb-0 leading-relaxed text-text-primary text-xs sm:text-sm">{children}</p>,
                  strong: ({ children }) => <strong className="text-cyan font-semibold">{children}</strong>,
                  em: ({ children }) => <em className="text-text-primary not-italic font-medium">{children}</em>,
                  ul: ({ children }) => <ul className="my-2 space-y-1.5 pl-0.5">{children}</ul>,
                  ol: ({ children }) => <ol className="my-2 space-y-1.5 list-decimal list-inside pl-0.5 text-text-secondary text-xs sm:text-sm">{children}</ol>,
                  li: ({ children }) => (
                    <li className="flex items-start gap-2 text-xs sm:text-sm text-text-primary leading-relaxed">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan flex-shrink-0 mt-1.5 shadow-[0_0_6px_#00e5ff]" />
                      <span className="flex-1">{children}</span>
                    </li>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-0.5 text-cyan hover:text-cyan-300 underline underline-offset-2 transition-colors font-mono text-xs"
                    >
                      {children}
                      <ExternalLink size={10} className="inline ml-0.5 opacity-70 flex-shrink-0" />
                    </a>
                  ),
                  table: ({ children }) => (
                    <div className="my-2.5 overflow-x-auto rounded-xl border border-white/10 bg-surface-2/70 backdrop-blur-sm shadow-md">
                      <table className="min-w-full divide-y divide-white/10 text-xs font-mono">{children}</table>
                    </div>
                  ),
                  thead: ({ children }) => <thead className="bg-cyan/10">{children}</thead>,
                  tbody: ({ children }) => <tbody className="divide-y divide-white/5">{children}</tbody>,
                  tr: ({ children }) => <tr className="hover:bg-white/[0.02] transition-colors">{children}</tr>,
                  th: ({ children }) => <th className="px-2.5 py-1.5 text-left text-[10px] font-bold text-cyan tracking-wider uppercase">{children}</th>,
                  td: ({ children }) => <td className="px-2.5 py-1.5 text-[11px] text-text-secondary whitespace-normal">{children}</td>,
                  code: ({ children }) => (
                    <code className="px-1.5 py-0.5 rounded bg-black/60 border border-white/10 text-cyan-300 font-mono text-[11px]">{children}</code>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="my-2 pl-3 border-l-2 border-cyan/50 text-text-secondary italic text-xs bg-cyan/[0.04] py-1 rounded-r-lg">{children}</blockquote>
                  ),
                  hr: () => <hr className="my-2.5 border-white/10" />
                }}
              >
                {displayContent}
              </ReactMarkdown>
              {isStreaming && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="inline-block w-1.5 h-3.5 ml-1 align-middle bg-cyan rounded-sm shadow-[0_0_8px_#00e5ff]"
                />
              )}
            </div>
          )}
        </div>

        {/* Sources & confidence (bot only) */}
        {!isUser && (message as any).sources?.length > 0 && (
          <div className="flex flex-wrap gap-1 px-1">
            {(message as any).sources.slice(0, 3).map((s: any, i: number) => (
              <SourceBadge key={i} source={s} />
            ))}
            {(message as any).confidence && (
              <span className="text-[9px] font-mono text-text-tertiary px-1">
                {Math.round((message as any).confidence * 100)}% conf
              </span>
            )}
          </div>
        )}
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="w-6 h-6 rounded-lg bg-violet-dim border border-violet/20 flex items-center justify-center flex-shrink-0 mt-1">
          <User size={11} className="text-violet" />
        </div>
      )}
    </motion.div>
  )
}

// ── Typing / Analyzing indicator (Short & Crisp) ──────────────
function TypingIndicator() {
  const steps = ['Searching...', 'Thinking...', 'Generating...']
  const [stepIdx, setStepIdx] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIdx((prev) => (prev + 1) % steps.length)
    }, 1200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex gap-2 justify-start items-center">
      {/* Bot avatar with subtle pulse */}
      <div className="w-6 h-6 rounded-lg bg-cyan/15 border border-cyan/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_10px_rgba(0,229,255,0.2)]">
        <Bot size={12} className="text-cyan animate-pulse" />
      </div>

      {/* Short & crisp status pill */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="px-3 py-1.5 rounded-full flex items-center gap-2"
        style={{
          background: 'rgba(10, 15, 30, 0.9)',
          border: '1px solid rgba(0,229,255,0.25)',
          boxShadow: '0 2px 12px rgba(0,229,255,0.06)',
        }}
      >
        <div className="flex gap-1 items-center h-3">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-cyan"
              animate={{
                y: [0, -3, 0],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 0.6,
                delay: i * 0.12,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        <span className="text-[11px] font-mono font-medium text-cyan-300 tracking-wide">
          {steps[stepIdx]}
        </span>
      </motion.div>
    </div>
  )
}

// ── Connection status ─────────────────────────────────────────
function ConnectionBadge({ connected, mode }: { connected: boolean | null, mode?: string }) {
  const isOnline = connected !== false && mode !== 'synthesis'
  const label = isOnline
    ? (mode === 'ollama' ? '🤖 AI Online' : '⚡ AI Online')
    : '📚 Fallback'
  const colorClass = isOnline ? 'text-neon-green' : 'text-neon-yellow'

  return (
    <div className="flex items-center gap-1 text-[9px] font-mono">
      {isOnline
        ? <><Wifi size={8} className="text-neon-green" /><span className={colorClass}>{label}</span></>
        : <><WifiOff size={8} className="text-neon-yellow" /><span className={colorClass}>{label}</span></>
      }
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// MAIN CHATBOT COMPONENT
// ══════════════════════════════════════════════════════════════
export default function ChatBot() {
  const { isChatOpen, setChatOpen, chatMessages, addChatMessage, updateChatMessage, clearChat } = usePortfolioStore()
  const activeRole = usePortfolioStore((s) => s.activeRole)
  const { playClick } = useSound()

  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState<{
    id: string
    role: 'assistant'
    content: string
    sources?: any[]
    confidence?: number
  } | null>(null)

  const [sessionId, setSessionId] = useState<string | null>(null)
  const [connected, setConnected] = useState<boolean | null>(true)
  const [aiMode, setAiMode] = useState<string>('groq')
  const [showScrollBtn, setShowScrollBtn] = useState(false)

  const bottomRef  = useRef<HTMLDivElement>(null)
  const messagesRef = useRef<HTMLDivElement>(null)
  const inputRef   = useRef<HTMLInputElement>(null)
  const abortRef   = useRef<AbortController | null>(null)

  const currentRole = roles.find((r) => r.id === activeRole)

  // ── Health check on mount ─────────────────────────────────
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch(`${API_URL}/api/health`, { signal: AbortSignal.timeout(4000) })
        if (res.ok) {
          const data = await res.json()
          setConnected(true)
          setAiMode(data.mode || 'groq')
        } else {
          setConnected(false)
          setAiMode('synthesis')
        }
      } catch {
        setConnected(false)
        setAiMode('synthesis')
      }
    }
    checkHealth()
  }, [])

  // ── Welcome message ───────────────────────────────────────
  useEffect(() => {
    if (isChatOpen && chatMessages.length === 0) {
      addChatMessage({
        id: generateId(),
        role: 'assistant',
        content: `Hi! 👋 I'm an AI assistant powered by **RAG** (Retrieval-Augmented Generation) with Anurag Swain's complete portfolio data.\n\nI can answer questions about his **skills, projects, internships, certifications**, and whether he's the right fit for your role. What would you like to know?`,
        timestamp: new Date(),
      })
    }
  }, [isChatOpen, chatMessages.length, addChatMessage])

  // ── Auto-focus input ──────────────────────────────────────
  useEffect(() => {
    if (isChatOpen) setTimeout(() => inputRef.current?.focus(), 300)
  }, [isChatOpen])

  // ── Auto scroll (Jitter-free during streaming) ──────────────
  useEffect(() => {
    if (streamingMessage) {
      // Direct scroll assignment during streaming avoids smooth animation collision stutter
      if (messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight
      }
    } else {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatMessages, streamingMessage, isTyping])

  const handleScroll = () => {
    const el = messagesRef.current
    if (!el) return
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 100)
  }

  // ── Send message (Fluid 60fps SSE streaming) ─────────────────
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isTyping || streamingMessage) return
    playClick()

    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    }
    addChatMessage(userMsg)
    setInput('')
    setIsTyping(true)
    setStreamingMessage(null)

    // Abort previous in-flight request
    abortRef.current?.abort()
    abortRef.current = new AbortController()

    const assistantId = generateId()

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content.trim(),
          session_id: sessionId,
          role_context: currentRole?.label || '',
          top_k: 6,
          stream: true,
        }),
        signal: abortRef.current.signal,
      })

      if (!res.ok) throw new Error(`API error: ${res.status}`)

      const contentType = res.headers.get('content-type') || ''

      // ── SSE streaming path ─────────────────────────────────
      if (contentType.includes('text/event-stream') && res.body) {
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let targetText = ''
        let currentText = ''
        let buffer = ''
        let firstToken = false
        let finalSources: any[] | undefined
        let finalConfidence: number | undefined
        let streamDone = false

        // Smooth 60fps typewriter — constant 4 chars/tick = ~240 chars/sec, no jumps or glitches
        const typewriterTimer = setInterval(() => {
          if (currentText.length < targetText.length) {
            // Always advance by a small fixed amount — smooth, even pace, no catch-up jumps
            const CHARS_PER_TICK = 4
            currentText = targetText.slice(0, currentText.length + CHARS_PER_TICK)
            setStreamingMessage({
              id: assistantId,
              role: 'assistant',
              content: currentText,
              timestamp: new Date(),
            })
          } else if (streamDone) {
            clearInterval(typewriterTimer)
            const cleanFinal = targetText.replace(/<think>[\s\S]*?(?:<\/think>|$)/gi, '').trim() || getLocalFallback(content)
            addChatMessage({
              id: assistantId,
              role: 'assistant',
              content: cleanFinal,
              timestamp: new Date(),
              ...(finalSources && { sources: finalSources }),
              ...(finalConfidence && { confidence: finalConfidence }),
            } as any)
            setStreamingMessage(null)
          }
        }, 16)

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop() ?? ''

            for (const line of lines) {
              if (!line.startsWith('data: ')) continue
              const raw = line.slice(6).trim()
              if (!raw || raw === '[DONE]') continue

              try {
                const chunk = JSON.parse(raw)

                if (chunk.text) {
                  const cleaned = chunk.text.replace(/<think>[\s\S]*?(?:<\/think>|$)/gi, '')
                  targetText += cleaned
                  if (targetText.trim() && !firstToken) {
                    firstToken = true
                    setIsTyping(false) // Dismiss searching indicator only when real answer tokens arrive!
                  }
                }

                if (chunk.done) {
                  const mode = chunk.mode || (targetText ? 'groq' : 'synthesis')
                  setAiMode(mode)
                  setConnected(mode !== 'synthesis')
                  if (!sessionId && chunk.session_id) setSessionId(chunk.session_id)
                  if (chunk.sources) finalSources = chunk.sources
                  if (chunk.confidence) finalConfidence = chunk.confidence
                }
              } catch {
                // skip malformed json
              }
            }
          }
        } finally {
          setIsTyping(false)
          streamDone = true
          if (!targetText.trim()) {
            targetText = getLocalFallback(content)
            setConnected(false)
            setAiMode('synthesis')
          }
        }
        return
      }

      // ── JSON fallback path ─────────────────────────────────
      const data = await res.json()
      if (!sessionId && data.session_id) setSessionId(data.session_id)

      const mode = data.mode || 'synthesis'
      setAiMode(mode)
      setConnected(mode !== 'synthesis')
      setIsTyping(false)

      let replyContent = data.reply || ''
      if (!replyContent.trim() || replyContent.includes('model_not_found') || replyContent.includes('GROQ_API_KEY') || replyContent.includes('Groq Error')) {
        replyContent = getLocalFallback(content)
      }

      addChatMessage({
        id: assistantId,
        role: 'assistant',
        content: replyContent,
        timestamp: new Date(),
        ...(data.sources && { sources: data.sources }),
        ...(data.confidence && { confidence: data.confidence }),
      } as any)
      setStreamingMessage(null)

    } catch (err: any) {
      if (err.name === 'AbortError') return
      setConnected(false)
      setAiMode('synthesis')
      setIsTyping(false)
      setStreamingMessage(null)

      addChatMessage({
        id: assistantId,
        role: 'assistant',
        content: getLocalFallback(content),
        timestamp: new Date(),
      })
    }
  }, [isTyping, streamingMessage, sessionId, currentRole, addChatMessage, playClick])


  // ── Local fallback ────────────────────────────────────────
  const getLocalFallback = (query: string): string => {
    const q = query.toLowerCase().trim()

    // Direct single-fact lookups
    if (q.includes('cgpa') || q.includes('gpa') || q.includes('grade') || q.includes('percentage'))
      return "Anurag Swain's CGPA is **8.10 / 10.00** in B.Tech Computer Science and Engineering at Government College of Engineering, Kalahandi (GCEK)."
    
    if (q.includes('college') || q.includes('university') || q.includes('institution') || q.includes('gcek') || q.includes('bput'))
      return "Anurag is studying at **Government College of Engineering, Kalahandi (GCEK)**, affiliated with BPUT Odisha, India (B.Tech CSE, 2023–2027)."

    if (q.includes('his name') || q.includes('who are you') || q.includes('who is he') || q.includes('what is his name') || q.includes('candidate name'))
      return "His name is **Anurag Swain**, a 3rd-year B.Tech CSE student, AI/ML researcher, and full-stack software developer."

    if (q.includes('instagram') || q.includes('insta'))
      return "Anurag's Instagram handle is [**@_vi_ll_a_in_**](https://www.instagram.com/_vi_ll_a_in/)."

    if (q.includes('email') || q.includes('mail'))
      return "Anurag's email address is [**anurag.swain35@gmail.com**](mailto:anurag.swain35@gmail.com) *(Alternate: anuragswain01@outlook.com)*."

    if (q.includes('github'))
      return "Anurag's GitHub profile is [**github.com/HUNTER-X0s**](https://github.com/HUNTER-X0s) featuring all his open-source AI, ML, and web projects."

    if (q.includes('linkedin'))
      return "Anurag's LinkedIn profile is [**linkedin.com/in/anurag-swain-cse07**](https://www.linkedin.com/in/anurag-swain-cse07/)."

    if (q.includes('phone') || q.includes('mobile') || q.includes('contact number') || q.includes('call'))
      return "Anurag's phone number is **+91-7008973337**."

    if (q.includes('location') || q.includes('where live') || q.includes('where based') || q.includes('city') || q.includes('bhubaneswar'))
      return "Anurag is based in **Bhubaneswar, Odisha, India** (PIN 751002)."

    // Comprehensive detailed responses
    if (q.includes('skill') || q.includes('tech') || q.includes('stack') || q.includes('language') || q.includes('strongest'))
      return "**Anurag Swain's Technical Skills & Core Competencies:**\n\n• **Programming Languages:** Python (88%), JavaScript (82%), C (80%), C++ (78%), Java (75%), SQL (80%)\n• **AI / Machine Learning / Deep Learning:** Scikit-Learn (82%), TensorFlow (80%), PyTorch (78%), NLP, OpenCV, ChromaDB, Ollama, HuggingFace, RAG\n• **Web & Full-Stack Development:** React.js (78%), Next.js 14 (74%), Node.js (73%), Express.js, REST APIs, TailwindCSS, MongoDB, HTML5/CSS3\n• **Data Science & Analytics:** Pandas (85%), NumPy (85%), Matplotlib (80%), Seaborn (78%), Jupyter, EDA\n• **Tools & Platforms:** Git, GitHub, VS Code, Linux, Docker, Postman, Vercel"
    if (q.includes('project') || q.includes('chat bot') || q.includes('ev') || q.includes('research agent'))
      return "**Anurag's Key Featured Projects:**\n\n1. 🤖 **AI Chat Bot** — Conversational NLP chatbot with multi-turn dialogue management built during Infosys AI Internship (⭐1) → [GitHub](https://github.com/HUNTER-X0s/AI_CHAT_BOT)\n2. 🚗 **EV Charging Demand Prediction** — ML pipeline with Ridge Regression predicting EV charging loads ($R^2=0.86$, ⭐1) → [GitHub](https://github.com/HUNTER-X0s/EV-VEHICLE-CHARGING-DEMAND-PREDICTION)\n3. 🔍 **Autonomous Research Agent** — Multi-source research synthesis agent for IBM SkillsBuild\n4. 🌐 **3D Interactive Portfolio Platform** — Built with Next.js 14, Three.js, RAG AI, and Web Speech Jarvis Mode"
    if (q.includes('hire') || q.includes('available') || q.includes('role') || q.includes('job') || q.includes('opportunity'))
      return "**✅ Actively Available for Opportunities!**\n\n• **Target Roles:** Software Development Engineer (SDE), AI/ML Engineer, Full-Stack Developer, Data Scientist\n• **Why Hire Anurag?** Completed 5 competitive internships in 2025 across AI, Deep Learning, and Web Development with a strong 8.10 CGPA.\n• **Contact:** [anurag.swain35@gmail.com](mailto:anurag.swain35@gmail.com) | +91-7008973337"
    if (q.includes('education') || q.includes('degree') || q.includes('school'))
      return "**Anurag's Educational Background:**\n\n• **Degree:** Bachelor of Technology (B.Tech) in **Computer Science and Engineering (CSE)**\n• **Institution:** Government College of Engineering, Kalahandi (GCEK), affiliated with BPUT Odisha\n• **Academic Performance:** **CGPA: 8.10 / 10.00** (Graduation: 2027)\n• **Relevant Coursework:** DSA, OOP, DBMS, OS, AI, ML, Computer Networks."
    if (q.includes('experience') || q.includes('intern') || q.includes('company') || q.includes('infosys') || q.includes('work'))
      return "**Anurag's Professional Experience (5 Internships in 2025):**\n\n1. 🏢 **Infosys** — *AI Intern* (Aug–Oct 2025, 3 mos, Remote) • NLP Chatbot & Dialogue Management\n2. 💻 **EISystems Technologies** — *Web Dev Intern* (May–Jul 2025, 3 mos, Remote) • Full-stack web apps\n3. ☁️ **Edunet Foundation & IBM** — *AI Intern* (Jun–Jul 2025, 2 mos, Remote) • Autonomous Research Agent\n4. 🧠 **MicroGenesis CADSoft, Bangalore** — *Deep Learning Intern* (May–Jun 2025, 2 mos, Hybrid) • CNN architectures & Object Detection\n5. 📊 **ShadowFox** — *Data Science Intern* (Apr–May 2025, 1 mo, Remote) • EDA & Predictive modeling"
    if (q.includes('contact') || q.includes('about') || q.includes('reach'))
      return "**Anurag Swain's Contact Information & Profile:**\n\n• 📧 **Email:** [anurag.swain35@gmail.com](mailto:anurag.swain35@gmail.com)\n• 📱 **Phone:** +91-7008973337\n• 📍 **Location:** Bhubaneswar, Odisha, India\n• 🐙 **GitHub:** [github.com/HUNTER-X0s](https://github.com/HUNTER-X0s)\n• 💼 **LinkedIn:** [linkedin.com/in/anurag-swain-cse07](https://www.linkedin.com/in/anurag-swain-cse07/)\n• 🐦 **X:** [@Anurag_hunter07](https://x.com/Anurag_hunter07)"
    if (q.includes('certif') || q.includes('badge') || q.includes('course'))
      return "**Verified Certifications:**\n\n1. 🏆 **Infosys Springboard AI Virtual Internship** — Infosys (2025)\n2. 🏆 **IBM SkillsBuild Artificial Intelligence Capstone** — IBM & Edunet (2025)\n3. 🏆 **Machine Learning & Deep Learning** — MicroGenesis CADSoft (2025)\n4. 🏆 **Web Development Foundations** — EISystems Technologies (2025)\n5. 🏆 **Python & Problem Solving** — HackerRank\n6. 🏆 **Cybersecurity** — Cisco Networking Academy"
    if (q.includes('club') || q.includes('robot') || q.includes('kilobot') || q.includes('activity'))
      return "**Clubs & Activities:**\n\n• 🤖 **KiloBots (Robotics Club):** Active technical member at GCE Kalahandi contributing to automation, embedded systems, and robotics hackathons.\n• 🏸 **Sports & Fests:** Volunteered in collegiate fests and active in competitive badminton and chess."
    return "Anurag Swain is a 3rd-year B.Tech CSE student at GCE Kalahandi (CGPA 8.10/10.00) with 5 internships across AI, Web Dev, and Data Science. Ask me anything about his **skills**, **projects**, **internships**, **education**, or **contact info**!"
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) }
  }

  // ── Render ────────────────────────────────────────────────
  return (
    <>
      {/* FAB Button */}
      <motion.button
        onClick={() => { setChatOpen(!isChatOpen); playClick() }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.93 }}
        className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 md:bottom-6 md:right-6 z-[70] w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-transform"
        style={{
          background: 'linear-gradient(135deg, rgba(0,229,255,0.18), rgba(124,58,237,0.18))',
          border: '1px solid rgba(0,229,255,0.38)',
          backdropFilter: 'blur(16px)',
          boxShadow: isChatOpen
            ? '0 8px 32px rgba(0,229,255,0.25)'
            : '0 8px 32px rgba(0,229,255,0.15)',
        }}
        title="Chat with Portfolio AI"
      >
        <AnimatePresence mode="wait">
          {isChatOpen
            ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X size={18} className="text-cyan sm:w-5 sm:h-5" /></motion.div>
            : <motion.div key="s" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><Sparkles size={18} className="text-cyan sm:w-5 sm:h-5" /></motion.div>}
        </AnimatePresence>
        {!isChatOpen && (
          <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-cyan border-2 border-surface-1 animate-pulse" />
        )}
        {!isChatOpen && (
          <div className="absolute -top-4 sm:-top-5 left-1/2 -translate-x-1/2 text-[7px] sm:text-[8px] font-mono text-white/60 whitespace-nowrap tracking-wider">
            NEXUS
          </div>
        )}
      </motion.button>

      {/* Chat Window — Dynamically scaled for all screen dimensions */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ duration: 0.25, ease: [0.19, 1, 0.22, 1] }}
            className="fixed inset-x-2 bottom-16 top-14 sm:inset-auto sm:bottom-20 md:bottom-24 sm:right-4 md:right-6 z-[70] w-auto sm:w-[clamp(340px,28vw,460px)] h-auto sm:h-[clamp(520px,68vh,720px)] sm:max-h-[82vh] flex flex-col rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(8, 8, 20, 0.97)',
              border: '1px solid rgba(0,229,255,0.22)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.85), 0 0 50px rgba(0,229,255,0.1)',
              backdropFilter: 'blur(24px)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3.5 sm:px-4 py-3 sm:py-3.5 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="relative">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-cyan/25 to-violet/25 border border-cyan/25 flex items-center justify-center">
                    <Bot size={15} className="text-cyan sm:w-4 sm:h-4" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-neon-green border-2 border-surface-1 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <p className="text-xs sm:text-sm font-semibold text-text-primary">Portfolio AI</p>
                    <div className="flex items-center gap-1 text-[8px] sm:text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan/8 border border-cyan/15 text-cyan">
                      <Zap size={7} /> RAG
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5">
                    <p className="text-[9px] sm:text-[10px] text-text-secondary">Anurag Portfolio AI</p>
                    <ConnectionBadge connected={connected} mode={aiMode} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {chatMessages.length > 1 && (
                  <button
                    onClick={() => { clearChat(); setSessionId(null); playClick() }}
                    className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.05] transition-all"
                    title="Clear history"
                  >
                    <RotateCcw size={12} />
                  </button>
                )}
                <button
                  onClick={() => { setChatOpen(false); playClick() }}
                  className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.05] transition-all"
                  title="Close chat"
                >
                  <X size={13} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={messagesRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto no-scrollbar px-3.5 sm:px-4 py-3 sm:py-4 space-y-2.5 sm:space-y-3"
            >
              {chatMessages.map((msg, i) => (
                <MessageBubble
                  key={msg.id}
                  message={msg as any}
                  isLatest={i === chatMessages.length - 1 && !streamingMessage}
                />
              ))}
              {streamingMessage && (
                <MessageBubble
                  key={streamingMessage.id}
                  message={streamingMessage as any}
                  isStreaming={true}
                  isLatest={true}
                />
              )}
              {isTyping && !streamingMessage && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>

            {/* Scroll to bottom */}
            <AnimatePresence>
              {showScrollBtn && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="absolute bottom-16 sm:bottom-20 right-3.5 sm:right-4 w-7 h-7 rounded-full glass border border-white/[0.1] flex items-center justify-center z-10"
                >
                  <ChevronDown size={12} className="text-text-secondary" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Suggested prompts (show when conversation just started) */}
            {chatMessages.length <= 1 && (
              <div className="px-3 sm:px-3.5 pb-2">
                <p className="text-[8px] sm:text-[9px] font-mono text-text-tertiary uppercase tracking-wider mb-1.5">
                  Ask me anything:
                </p>
                <div className="flex flex-wrap gap-1 sm:gap-1.5 max-h-[90px] sm:max-h-[120px] overflow-y-auto no-scrollbar">
                  {SUGGESTED_PROMPTS.slice(0, 6).map((q) => (
                    <button
                      key={q.text}
                      onClick={() => sendMessage(q.text)}
                      className="flex items-center gap-1 text-[9px] sm:text-[10px] px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-text-secondary border border-white/[0.07] bg-white/[0.02] hover:border-cyan/20 hover:text-cyan transition-all"
                    >
                      <span>{q.icon}</span>
                      <span className="line-clamp-1">{q.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div className="px-3 sm:px-3.5 pb-3 pt-2 border-t border-white/[0.05]">
              <div className="flex items-center gap-2 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] focus-within:border-cyan/25 transition-all">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about skills, projects, experience…"
                  maxLength={500}
                  className="flex-1 bg-transparent text-xs sm:text-sm text-text-primary placeholder-text-tertiary outline-none font-body"
                  disabled={isTyping}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isTyping}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all disabled:opacity-30 flex-shrink-0"
                  style={{
                    background: input.trim() && !isTyping ? 'rgba(0,229,255,0.15)' : 'transparent',
                    color: input.trim() && !isTyping ? '#00E5FF' : '#4B4B6A',
                  }}
                >
                  {isTyping
                    ? <Loader2 size={13} className="animate-spin text-text-tertiary" />
                    : <Send size={13} />
                  }
                </button>
              </div>
              <p className="text-[8px] sm:text-[9px] font-mono text-text-tertiary text-center mt-1.5">
                Powered by Ollama + ChromaDB · Local RAG
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
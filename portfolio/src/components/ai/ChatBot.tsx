// @ts-nocheck
'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Send, Sparkles, RotateCcw, Bot, User,
  ChevronDown, Loader2, Wifi, WifiOff, Zap
} from 'lucide-react'
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
  { icon: '💼', text: "Summarize his internship experience" },
  { icon: '🤖', text: "What AI/ML projects has he built?" },
  { icon: '✅', text: "Is he available for hire?" },
  { icon: '🧠', text: "What is his experience with Deep Learning and NLP?" },
  { icon: '🎓', text: "What is his educational background and CGPA?" },
  { icon: '🏆', text: "Tell me about his certifications." },
  { icon: '♟️', text: "What are his hobbies outside of coding?" },
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

// ── Message bubble ────────────────────────────────────────────
function MessageBubble({
  message,
  isLatest,
}: {
  message: ChatMessage & { sources?: any[]; confidence?: number }
  isLatest?: boolean
}) {
  const isUser = message.role === 'user'

  // Render **bold** and bullet formatting
  const formatContent = (text: string) => {
    const lines = text.split('\n')
    return lines.map((line, lineIdx) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g)
      const formatted = parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={i} className="text-cyan font-semibold">{part.slice(2, -2)}</strong>
          : <span key={i}>{part}</span>
      )
      return (
        <span key={lineIdx} className="block">
          {formatted}
          {lineIdx < lines.length - 1 && line.trim() === '' ? null : null}
        </span>
      )
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.19, 1, 0.22, 1] }}
      className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {/* Bot avatar */}
      {!isUser && (
        <div className="w-6 h-6 rounded-lg bg-cyan/10 border border-cyan/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Bot size={11} className="text-cyan" />
        </div>
      )}

      <div className="max-w-[84%] space-y-1.5">
        <div
          className="px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words overflow-hidden"
          style={isUser ? {
            background: 'linear-gradient(135deg, rgba(0,229,255,0.14), rgba(124,58,237,0.14))',
            border: '1px solid rgba(0,229,255,0.2)',
            color: '#F0F0FF',
            borderBottomRightRadius: '4px',
          } : {
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            color: '#8B8BA7',
            borderBottomLeftRadius: '4px',
          }}
        >
          {isUser ? message.content : formatContent(message.content)}
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
        <div className="w-6 h-6 rounded-lg bg-violet-dim border border-violet/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <User size={11} className="text-violet" />
        </div>
      )}
    </motion.div>
  )
}

// ── Typing indicator ──────────────────────────────────────────
function TypingIndicator() {
  const thinkingTexts = ['Thinking', 'Analyzing', 'Searching knowledge']
  const [textIdx, setTextIdx] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIdx((prev) => (prev + 1) % thinkingTexts.length)
    }, 2400)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex gap-2.5 justify-start">
      {/* Bot avatar with pulse ring */}
      <div className="relative flex-shrink-0 mt-0.5">
        <motion.div
          className="absolute inset-0 rounded-lg"
          style={{ background: 'rgba(0,229,255,0.15)' }}
          animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="w-6 h-6 rounded-lg bg-cyan/10 border border-cyan/20 flex items-center justify-center relative z-10">
          <Bot size={11} className="text-cyan" />
        </div>
      </div>

      {/* Thinking bubble */}
      <motion.div
        className="px-4 py-3 rounded-2xl rounded-bl-sm"
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(0,229,255,0.15)',
          boxShadow: '0 0 20px rgba(0,229,255,0.05)',
        }}
        animate={{ borderColor: ['rgba(0,229,255,0.15)', 'rgba(0,229,255,0.3)', 'rgba(0,229,255,0.15)'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="flex items-center gap-2.5">
          {/* Waving dots */}
          <div className="flex gap-1 items-center h-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-[5px] h-[5px] rounded-full"
                style={{ background: '#00E5FF' }}
                animate={{
                  y: [0, -6, 0],
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.15,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          {/* Animated text label */}
          <AnimatePresence mode="wait">
            <motion.span
              key={textIdx}
              className="text-[10px] font-mono tracking-wide"
              style={{ color: 'rgba(0,229,255,0.7)' }}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
            >
              {thinkingTexts[textIdx]}…
            </motion.span>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

// ── Connection status ─────────────────────────────────────────
function ConnectionBadge({ connected }: { connected: boolean | null }) {
  if (connected === null) return null
  return (
    <div className="flex items-center gap-1 text-[9px] font-mono">
      {connected
        ? <><Wifi size={8} className="text-neon-green" /><span className="text-neon-green">AI Online</span></>
        : <><WifiOff size={8} className="text-neon-yellow" /><span className="text-neon-yellow">Fallback</span></>
      }
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// MAIN CHATBOT COMPONENT
// ══════════════════════════════════════════════════════════════
export default function ChatBot() {
  const { isChatOpen, setChatOpen, chatMessages, addChatMessage, clearChat } = usePortfolioStore()
  const activeRole = usePortfolioStore((s) => s.activeRole)
  const { playClick } = useSound()

  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [connected, setConnected] = useState<boolean | null>(null)
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
        const res = await fetch(`${API_URL}/api/health`, { signal: AbortSignal.timeout(5000) })
        setConnected(res.ok)
      } catch {
        setConnected(false)
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

  // ── Auto scroll ───────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, isTyping])

  const handleScroll = () => {
    const el = messagesRef.current
    if (!el) return
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 100)
  }

  // ── Send message ──────────────────────────────────────────
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isTyping) return
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

    // Abort previous request
    abortRef.current?.abort()
    abortRef.current = new AbortController()

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content.trim(),
          session_id: sessionId,
          role_context: currentRole?.label || '',
          top_k: 6,
        }),
        signal: AbortSignal.timeout(API_TIMEOUT),
      })

      if (!res.ok) throw new Error(`API error: ${res.status}`)

      const data = await res.json()

      if (!sessionId && data.session_id) setSessionId(data.session_id)
      setConnected(true)

      setIsTyping(false)
      addChatMessage({
        id: generateId(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date(),
        ...(data.sources && { sources: data.sources }),
        ...(data.confidence && { confidence: data.confidence }),
      } as any)
    } catch (err: any) {
      if (err.name === 'AbortError') return
      setConnected(false)
      setIsTyping(false)

      // Local fallback response
      const localReply = getLocalFallback(content)
      addChatMessage({
        id: generateId(),
        role: 'assistant',
        content: localReply,
        timestamp: new Date(),
      })
    }
  }, [isTyping, sessionId, currentRole, addChatMessage, playClick])

  // ── Local fallback ────────────────────────────────────────
  const getLocalFallback = (query: string): string => {
    const q = query.toLowerCase()
    if (q.includes('skill') || q.includes('tech'))
      return "**Anurag's top skills:** Python (88%), React.js/Next.js (78%/74%), Scikit-Learn (82%), TensorFlow/PyTorch (80%/78%), Node.js (73%), Pandas (85%). Hands-on across AI/ML, full-stack, and data science from 5 internships."
    if (q.includes('project'))
      return "**Key projects:**\n• **AI Chat Bot** — NLP chatbot (⭐1) → github.com/HUNTER-X0s/AI_CHAT_BOT\n• **EV Demand Prediction** — AICTE ML pipeline (⭐1) → github.com/HUNTER-X0s/EV-VEHICLE-CHARGING-DEMAND-PREDICTION\n• **Research Agent** — IBM Skills Build capstone\n• **Currency Converter** — Live JS web app (⭐1)"
    if (q.includes('hire') || q.includes('available') || q.includes('role'))
      return "**Yes, actively available!** Anurag is open to SDE, AI/ML Engineer, and Full-Stack Developer roles. Email: anurag.swain35@gmail.com | CGPA 8.10 | 5 internships completed in 2025."
    if (q.includes('experience') || q.includes('intern'))
      return "**5 internships in 2025:** Infosys (AI — 3mo), EISystems (Web Dev — 3mo), Edunet/IBM (AI + Cloud — 2mo), MicroGenesis Bangalore (Deep Learning — 2mo, Hybrid), Shadow Fox (Data Science). ~12 months total."
    return "The AI backend isn't reachable right now. Contact Anurag at **anurag.swain35@gmail.com** or view his GitHub at **github.com/HUNTER-X0s**."
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
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[70] w-14 h-14 rounded-2xl flex items-center justify-center"
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
            ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X size={20} className="text-cyan" /></motion.div>
            : <motion.div key="s" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><Sparkles size={20} className="text-cyan" /></motion.div>}
        </AnimatePresence>
        {!isChatOpen && (
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan border-2 border-surface-1 animate-pulse" />
        )}
        {!isChatOpen && (
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] font-mono text-white/60 whitespace-nowrap tracking-wider">
            NEXUS
          </div>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 20 }}
            transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
            className="fixed bottom-0 right-0 sm:bottom-24 sm:right-6 z-[70] w-full sm:w-[380px] h-full sm:h-[580px] sm:max-h-[80vh] flex flex-col sm:rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(8, 8, 20, 0.97)',
              border: '1px solid rgba(0,229,255,0.2)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.8), 0 0 50px rgba(0,229,255,0.08)',
              backdropFilter: 'blur(24px)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan/25 to-violet/25 border border-cyan/25 flex items-center justify-center">
                    <Bot size={16} className="text-cyan" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-neon-green border-2 border-surface-1 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-text-primary">Portfolio AI</p>
                    <div className="flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan/8 border border-cyan/15 text-cyan">
                      <Zap size={7} /> RAG
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-[10px] text-text-secondary">Anurag Portfolio AI</p>
                    <ConnectionBadge connected={connected} />
                  </div>
                </div>
              </div>
                <div className="flex items-center gap-1.5">
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
                    <X size={12} />
                  </button>
                </div>
            </div>

            {/* Messages */}
            <div
              ref={messagesRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-3"
            >
              {chatMessages.map((msg, i) => (
                <MessageBubble
                  key={msg.id}
                  message={msg as any}
                  isLatest={i === chatMessages.length - 1}
                />
              ))}
              {isTyping && <TypingIndicator />}
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
                  className="absolute bottom-20 right-4 w-7 h-7 rounded-full glass border border-white/[0.1] flex items-center justify-center z-10"
                >
                  <ChevronDown size={12} className="text-text-secondary" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Suggested prompts (show when conversation just started) */}
            {chatMessages.length <= 1 && (
              <div className="px-3 pb-2">
                <p className="text-[9px] font-mono text-text-tertiary uppercase tracking-wider mb-1.5">
                  Ask me anything:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_PROMPTS.slice(0, 8).map((q) => (
                    <button
                      key={q.text}
                      onClick={() => sendMessage(q.text)}
                      className="flex items-center gap-1 text-[10px] px-2.5 py-1.5 rounded-lg text-text-secondary border border-white/[0.07] bg-white/[0.02] hover:border-cyan/20 hover:text-cyan transition-all"
                    >
                      <span>{q.icon}</span>
                      {q.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="px-3 pb-3 pt-2 border-t border-white/[0.05]">
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] focus-within:border-cyan/25 transition-all">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about skills, projects, experience…"
                  maxLength={500}
                  className="flex-1 bg-transparent text-sm text-text-primary placeholder-text-tertiary outline-none font-body"
                  disabled={isTyping}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isTyping}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
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
              <p className="text-[9px] font-mono text-text-tertiary text-center mt-1.5">
                Powered by Ollama + ChromaDB · Local RAG
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
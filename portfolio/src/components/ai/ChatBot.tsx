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
import { generateId, cn } from '@/lib/utils'
import { roles } from '@/data/portfolio'
import ShuttleIconUI from './ShuttleIconUI'

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


// ── Convert markdown tables to clean bullet points ───────────
function convertTablesToBullets(text: string): string {
  if (!text || !text.includes('|')) return text

  const lines = text.split('\n')
  const newLines: string[] = []
  let tableRows: string[][] = []
  let inTable = false

  const processTable = (rows: string[][]) => {
    if (rows.length === 0) return []
    // Filter out separator lines (like |---|---|)
    const validRows = rows.filter(r => !r.every(cell => /^[-: ]+$/.test(cell.trim())))
    if (validRows.length <= 1) {
      return rows.map(r => r.join(' · ').trim()).filter(Boolean)
    }
    const headers = validRows[0].map(h => h.trim())
    const output: string[] = []
    for (let i = 1; i < validRows.length; i++) {
      const cells = validRows[i].map(c => c.trim())
      if (cells.length === 0 || cells.every(c => !c)) continue
      const title = cells[0] || `Item ${i}`
      const details: string[] = []
      for (let j = 1; j < cells.length; j++) {
        if (cells[j]) {
          const headerLabel = headers[j] ? `**${headers[j]}**: ` : ''
          details.push(`${headerLabel}${cells[j]}`)
        }
      }
      if (details.length > 0) {
        output.push(`- **${title}** — ${details.join(' · ')}`)
      } else {
        output.push(`- **${title}**`)
      }
    }
    return output
  }

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim()
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      inTable = true
      const cells = trimmed.slice(1, -1).split('|')
      tableRows.push(cells)
    } else {
      if (inTable) {
        newLines.push(...processTable(tableRows))
        tableRows = []
        inTable = false
      }
      newLines.push(lines[i])
    }
  }
  if (inTable && tableRows.length > 0) {
    newLines.push(...processTable(tableRows))
  }

  return newLines.join('\n')
}

// ── Auto-link URLs, Emails, and Social IDs into valid markdown links ──
function autoLinkContent(text: string): string {
  if (!text) return ''

  let processed = text

  // 1. Convert unlinked email addresses to mailto: links (e.g. anurag.swain35@gmail.com)
  processed = processed.replace(
    /(?<!\[.*\]\()(?<!href=["'])\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/g,
    '[$1](mailto:$1)'
  )

  // 2. Convert unlinked GitHub handles / IDs (e.g. GitHub: HUNTER_X0s or GitHub: HUNTER-X0s)
  processed = processed.replace(
    /(?:GitHub:\s*)(?!\[)(HUNTER[-_]X0s[A-Za-z0-9_/-]*)/gi,
    (match, id) => `GitHub: [${id}](https://github.com/${id.replace(/_/g, '-')})`
  )

  // 3. Convert unlinked LinkedIn handles/urls (e.g. LinkedIn: anurag-swain-cse07 or linkedin.com/in/...)
  processed = processed.replace(
    /(?:LinkedIn:\s*)(?!\[)(?:https?:\/\/(?:www\.)?linkedin\.com\/in\/|linkedin\.com\/in\/)?([a-zA-Z0-9_-]+)/gi,
    (match, id) => `LinkedIn: [${id}](https://www.linkedin.com/in/${id})`
  )

  // 4. Convert unlinked Twitter/X handles (e.g. Twitter/X: @Anurag_hunter07 or Anurag_hunter07)
  processed = processed.replace(
    /(?:Twitter(?:\/X)?:\s*)(?!\[)(?:https?:\/\/(?:www\.)?(?:twitter|x)\.com\/|@)?([a-zA-Z0-9_]+)/gi,
    (match, id) => `Twitter/X: [@${id}](https://x.com/${id})`
  )

  // 5. Convert unlinked Instagram handles (e.g. Instagram: vi_ll_a_in or @_vi_ll_a_in_)
  processed = processed.replace(
    /(?:Instagram:\s*)(?!\[)(?:https?:\/\/(?:www\.)?instagram\.com\/|@)?([a-zA-Z0-9_]+)/gi,
    (match, id) => {
      const handle = id.startsWith('_') ? id : `_${id}_`
      return `Instagram: [@${handle}](https://www.instagram.com/${handle})`
    }
  )

  // 6. Convert any remaining unlinked domain URLs (e.g. github.com/... or linkedin.com/...)
  processed = processed.replace(
    /(?<!\[.*?\]\()(?<!href=["'])((?:https?:\/\/|www\.)[^\s<>)"]+|(?:github\.com|linkedin\.com|x\.com|twitter\.com|instagram\.com|vercel\.app|render\.com)\/[^\s<>)"]+)/gi,
    (match, url) => {
      const cleanUrl = url.replace(/[.,;:]+$/, '')
      const href = cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`
      return `[${cleanUrl}](${href})`
    }
  )

  return processed
}

// ── Clean content helper ──────────────────────────────────────
function cleanMessageContent(text: string): string {
  if (!text) return ''
  const stripped = text.replace(/<think>[\s\S]*?(?:<\/think>|$)/gi, '').trimStart()
  const tableConverted = convertTablesToBullets(stripped)
  return autoLinkContent(tableConverted)
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

      <div className="max-w-[92%] sm:max-w-[88%] min-w-0 space-y-1.5 overflow-hidden">
        <div
          className="px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed break-words [overflow-wrap:anywhere] [word-break:break-word] overflow-hidden"
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
            <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{message.content}</p>
          ) : (
            <div className="space-y-1.5 markdown-content break-words [overflow-wrap:anywhere]">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className="text-sm sm:text-base font-bold text-white mt-3 mb-1.5 pb-1 border-b border-cyan/20 break-words [overflow-wrap:anywhere]">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xs sm:text-sm font-bold text-cyan-300 mt-2.5 mb-1 flex items-center gap-1.5 break-words [overflow-wrap:anywhere]">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-xs sm:text-xs font-semibold text-cyan-400 mt-2 mb-0.5 break-words [overflow-wrap:anywhere]">{children}</h3>,
                  h4: ({ children }) => <h4 className="text-xs font-semibold text-white/90 mt-1.5 mb-0.5 break-words [overflow-wrap:anywhere]">{children}</h4>,
                  p: ({ children }) => <p className="mb-1.5 last:mb-0 leading-relaxed text-text-primary text-xs sm:text-sm break-words [overflow-wrap:anywhere]">{children}</p>,
                  strong: ({ children }) => <strong className="text-cyan font-semibold">{children}</strong>,
                  em: ({ children }) => <em className="text-text-primary not-italic font-medium">{children}</em>,
                  ul: ({ children }) => <ul className="my-2 space-y-1.5 pl-0.5 max-w-full overflow-hidden">{children}</ul>,
                  ol: ({ children }) => <ol className="my-2 space-y-1.5 list-decimal list-inside pl-0.5 text-text-secondary text-xs sm:text-sm max-w-full overflow-hidden">{children}</ol>,
                  li: ({ children }) => (
                    <li className="flex items-start gap-2 text-xs sm:text-sm text-text-primary leading-relaxed min-w-0 w-full">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan flex-shrink-0 mt-1.5 shadow-[0_0_6px_#00e5ff]" />
                      <span className="flex-1 min-w-0 break-words [overflow-wrap:anywhere]">{children}</span>
                    </li>
                  ),
                  a: ({ href, children }) => {
                    let targetHref = (href || '').trim()

                    // Handle direct email or phone protocols
                    if (targetHref.startsWith('mailto:') || targetHref.startsWith('tel:')) {
                      return (
                        <a
                          href={targetHref}
                          className="inline-flex items-center gap-0.5 text-cyan hover:text-cyan-300 underline underline-offset-2 transition-colors font-mono text-xs break-all"
                        >
                          {children}
                        </a>
                      )
                    }

                    // Normalize IDs or bare handles into full external URLs
                    if (targetHref === 'HUNTER_X0s' || targetHref === 'HUNTER-X0s') {
                      targetHref = 'https://github.com/HUNTER-X0s'
                    } else if (targetHref === 'vi_ll_a_in' || targetHref === '_vi_ll_a_in_') {
                      targetHref = 'https://www.instagram.com/_vi_ll_a_in/'
                    } else if (targetHref === 'Anurag_hunter07' || targetHref === '@Anurag_hunter07') {
                      targetHref = 'https://x.com/Anurag_hunter07'
                    } else if (targetHref.includes('anurag-swain') && !targetHref.startsWith('http')) {
                      targetHref = `https://www.linkedin.com/in/anurag-swain-dev/`
                    } else if (!targetHref.startsWith('http://') && !targetHref.startsWith('https://')) {
                      targetHref = `https://${targetHref}`
                    }

                    return (
                      <a
                        href={targetHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.stopPropagation()
                        }}
                        className="inline-flex items-center gap-0.5 text-cyan hover:text-cyan-300 underline underline-offset-2 transition-colors font-mono text-xs break-all hover:underline cursor-pointer relative z-20 pointer-events-auto"
                      >
                        {children}
                        <ExternalLink size={10} className="inline ml-0.5 opacity-70 flex-shrink-0" />
                      </a>
                    )
                  },
                  table: ({ children }) => (
                    <div className="my-2.5 overflow-x-auto rounded-xl border border-white/10 bg-surface-2/70 backdrop-blur-sm shadow-md">
                      <table className="min-w-full divide-y divide-white/10 text-xs font-mono">{children}</table>
                    </div>
                  ),
                  thead: ({ children }) => <thead className="bg-cyan/10">{children}</thead>,
                  tbody: ({ children }) => <tbody className="divide-y divide-white/5">{children}</tbody>,
                  tr: ({ children }) => <tr className="hover:bg-white/[0.02] transition-colors">{children}</tr>,
                  th: ({ children }) => <th className="px-2.5 py-1.5 text-left text-[10px] font-bold text-cyan tracking-wider uppercase">{children}</th>,
                  td: ({ children }) => <td className="px-2.5 py-1.5 text-[11px] text-text-secondary whitespace-normal break-words">{children}</td>,
                  code: ({ children }) => (
                    <code className="px-1.5 py-0.5 rounded bg-black/60 border border-white/10 text-cyan-300 font-mono text-[11px] break-all">{children}</code>
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
  const [isBtnHovered, setIsBtnHovered] = useState(false)

  const bottomRef  = useRef<HTMLDivElement>(null)
  const messagesRef = useRef<HTMLDivElement>(null)
  const inputRef   = useRef<HTMLInputElement>(null)
  const abortRef   = useRef<AbortController | null>(null)

  const currentRole = roles.find((r) => r.id === activeRole)

  // ── Health check on mount and on chat open ───────────────
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch(`${API_URL}/api/health`, { signal: AbortSignal.timeout(4000) })
        if (res.ok) {
          const data = await res.json()
          setConnected(true)
          setAiMode(data.mode || 'groq')
        }
      } catch {
        // Keep optimistic online status until a query actually requires fallback
      }
    }
    checkHealth()
  }, [isChatOpen])

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

  // ── Shared 60fps typewriter — used by BOTH SSE and local fallback ──
  const streamText = useCallback((
    text: string,
    assistantId: string,
    opts?: { sources?: any[]; confidence?: number }
  ) => {
    let currentText = ''
    const targetText = text
    const CHARS_PER_TICK = 4
    setIsTyping(false)
    const timer = setInterval(() => {
      if (currentText.length < targetText.length) {
        currentText = targetText.slice(0, currentText.length + CHARS_PER_TICK)
        setStreamingMessage({
          id: assistantId,
          role: 'assistant',
          content: currentText,
          timestamp: new Date(),
        })
      } else {
        clearInterval(timer)
        addChatMessage({
          id: assistantId,
          role: 'assistant',
          content: targetText,
          timestamp: new Date(),
          ...(opts?.sources && { sources: opts.sources }),
          ...(opts?.confidence && { confidence: opts.confidence }),
        } as any)
        setStreamingMessage(null)
      }
    }, 16)
  }, [addChatMessage])

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
            const cleanFinal = targetText.replace(/<think>[\s\S]*?(?:<\/think>|$)/gi, '').trim()
            if (cleanFinal) {
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
            // else: empty stream — handled in finally block below
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
          streamDone = true
          if (!targetText.trim()) {
            // Backend returned empty — stream fallback with typewriter, same experience
            setIsTyping(false)
            setConnected(false)
            setAiMode('synthesis')
            streamText(getLocalFallback(content), assistantId)
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

      let replyContent = data.reply || ''
      const needsFallback = !replyContent.trim()
        || replyContent.includes('model_not_found')
        || replyContent.includes('GROQ_API_KEY')
        || replyContent.includes('Groq Error')
      if (needsFallback) {
        replyContent = getLocalFallback(content)
        setConnected(false)
        setAiMode('synthesis')
      }

      // Stream JSON replies through the same 60fps typewriter
      streamText(replyContent, assistantId, {
        sources: data.sources,
        confidence: data.confidence,
      })

    } catch (err: any) {
      if (err.name === 'AbortError') return
      setConnected(false)
      setAiMode('synthesis')
      setIsTyping(false)
      setStreamingMessage(null)

      // Stream the fallback — same typewriter experience as online mode
      streamText(getLocalFallback(content), assistantId)
    }
  }, [isTyping, streamingMessage, sessionId, currentRole, addChatMessage, playClick, streamText])


  // ── Local fallback — Full Pointed Elaborated Responses ───
  const getLocalFallback = (query: string): string => {
    const q = query.toLowerCase().trim()

    // ── Helper: word-boundary keyword scorer ──────────────
    // Uses \b so 'hi' won't match 'his', 'ai' won't match 'mail', etc.
    const score = (keywords: string[]) => keywords.reduce((acc, kw) => {
      const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp(`\\b${escaped}\\b`)
      return acc + (regex.test(q) ? 1 : 0)
    }, 0)

    // ── GREETING ─────────────────────────────────────────
    if (score(['hi', 'hello', 'hey', 'greet', 'good morning', 'good evening', 'howdy', 'sup']) >= 1)
      return `### 👋 Hi there! I'm Nexus — Anurag Swain's Portfolio AI\n\n- **Operational Mode**: High-precision offline fallback engine\n- **Domain Knowledge**: Complete database of Anurag's skills, projects, internships, and education\n\n#### 🎯 Suggested Topics to Explore:\n- **Technical Skills**: *"What are his strongest skills?"*\n- **Internships**: *"Where has he interned?"*\n- **Projects**: *"Explain his EV charging prediction project"*\n- **Education**: *"What is his CGPA and college?"*\n- **Certifications**: *"What credentials does he hold?"*\n- **Hiring & Availability**: *"Is he available for hire?"*`

    // ── WHO IS HE / IDENTITY ──────────────────────────────
    if (score(['who is', 'who are', 'about him', 'introduce', 'tell me about', 'who is anurag', 'overview', 'summary', 'profile']) >= 1)
      return `### 🧑‍💻 Anurag Swain — Full-Stack Developer & AI/ML Engineer\n\n#### 👤 Core Identity\n- **Full Name**: Anurag Swain\n- **Age / Birthday**: 19 years old (Born 16 January 2006)\n- **Location**: Bhubaneswar, Odisha, India\n- **Current Status**: 3rd-Year B.Tech in CSE @ GCE Kalahandi (BPUT)\n- **Academic CGPA**: **8.10 / 10.00** (Graduating in 2027)\n\n#### 💼 Professional Experience\n- **5 Internships Completed**: Across National Informatics Centre (Govt of India), Infosys, EISystems, Edunet/IBM, and MicroGenesis\n- **AI & ML Engineering**: Built AI-powered clinical risk models at Infosys and computer vision CNNs at MicroGenesis\n- **Full-Stack Engineering**: React.js, Next.js 14, Node.js, Express, FastAPI, MongoDB, MySQL\n- **Open Source**: 14+ GitHub repositories with community recognition\n- **Certified**: National Informatics Centre, IBM SkillsBuild, AICTE, and Infosys Springboard`

    // ── CONTACT ───────────────────────────────────────────
    if (score(['contact', 'email', 'mail', 'reach', 'phone', 'call', 'get in touch', 'connect', 'message him']) >= 1)
      return `### 📬 Contact & Connect with Anurag Swain\n\n#### 📞 Direct Channels\n- **Primary Email**: [anurag.swain35@gmail.com](mailto:anurag.swain35@gmail.com)\n- **Alternate Email**: [anuragswain01@outlook.com](mailto:anuragswain01@outlook.com)\n- **Phone / WhatsApp**: +91-7008973337\n- **Location**: OldTown, Bhubaneswar, Odisha, India (PIN 751002)\n- **Response Time**: Under 24 hours guaranteed\n\n#### 🌐 Social & Developer Profiles\n- **LinkedIn**: [linkedin.com/in/anurag-swain-dev](https://www.linkedin.com/in/anurag-swain-dev/)\n- **GitHub**: [github.com/HUNTER-X0s](https://github.com/HUNTER-X0s)\n- **Twitter / X**: [@Anurag_hunter07](https://x.com/Anurag_hunter07)\n- **Instagram**: [@_vi_ll_a_in_](https://www.instagram.com/_vi_ll_a_in/)\n- **Threads**: [@_vi_ll_a_in_](https://www.threads.com/@_vi_ll_a_in_)`

    // ── INSTAGRAM ─────────────────────────────────────────
    if (score(['instagram', 'insta']) >= 1)
      return `### 📸 Social & Community Profiles\n\n- **Instagram**: [@_vi_ll_a_in_](https://www.instagram.com/_vi_ll_a_in/)\n- **Threads**: [@_vi_ll_a_in_](https://www.threads.com/@_vi_ll_a_in/)\n- **Twitter / X**: [@Anurag_hunter07](https://x.com/Anurag_hunter07)\n- **LinkedIn**: [anurag-swain-dev](https://www.linkedin.com/in/anurag-swain-dev/)\n- **GitHub**: [HUNTER-X0s](https://github.com/HUNTER-X0s)`

    // ── GITHUB ────────────────────────────────────────────
    if (score(['github', 'repository', 'repo', 'open source', 'code', 'hunter-x0s']) >= 1)
      return `### 🐙 GitHub Overview — [github.com/HUNTER-X0s](https://github.com/HUNTER-X0s)\n\n- **Public Repositories**: 14 open-source repositories\n- **Community Recognition**: 3 starred repositories\n- **Primary Languages**: Python, JavaScript, Jupyter Notebook, C++, Java\n\n#### 📦 Featured Repositories:\n- **AI_CHAT_BOT**: NLP conversational chatbot (Python, ⭐1) → [View](https://github.com/HUNTER-X0s/AI_CHAT_BOT)\n- **EV-VEHICLE-CHARGING-DEMAND-PREDICTION**: ML regression pipeline ($R^2=0.86$, ⭐1) → [View](https://github.com/HUNTER-X0s/EV-VEHICLE-CHARGING-DEMAND-PREDICTION)\n- **RESEARCH_AGENT**: Autonomous multi-source research synthesis agent (IBM SkillsBuild) → [View](https://github.com/HUNTER-X0s/RESEARCH_AGENT)\n- **Currency_Converter**: Real-time 150+ currency converter web app (⭐1) → [View](https://hunter-x0s.github.io/Currency_Converter/)\n- **SHADOW-FOX_DATASCIENCE_INTERNSHIP**: Complete data science & predictive modeling notebooks → [View](https://github.com/HUNTER-X0s/SHADOW-FOX_DATASCIENCE_INTERNSHIP)\n- **CERTIFICATIONS**: Centralized repository of all official certificates → [View](https://github.com/HUNTER-X0s/CERTIFICATIONS)`

    // ── LINKEDIN ──────────────────────────────────────────
    if (score(['linkedin']) >= 1)
      return `### 💼 LinkedIn Profile Overview\n\n- **Profile URL**: [linkedin.com/in/anurag-swain-dev](https://www.linkedin.com/in/anurag-swain-dev/)\n- **Skill Endorsements**: 12+ verified technical endorsements from MicroGenesis TechSoft Bangalore\n- **Certifications**: All official internship credentials listed (National Informatics Centre, Infosys, EISystems, Edunet/IBM, MicroGenesis, Shadow Fox)\n- **Networking**: Open for technical networking, internship inquiries, and engineering opportunities`

    // ── LOCATION ──────────────────────────────────────────
    if (score(['location', 'where', 'city', 'bhubaneswar', 'odisha', 'india', 'based', 'live']) >= 1)
      return `### 📍 Location & Relocation Information\n\n- **Current Residence**: Bhubaneswar, Odisha, India (PIN: 751002)\n- **College Campus**: Government College of Engineering, Kalahandi, Odisha\n- **Past On-Site Work**: Sachivalaya Marg, Bhubaneswar (National Informatics Centre) & Bangalore (MicroGenesis TechSoft)\n- **Relocation Availability**: Fully open to relocate for full-time and on-site internship roles (Bangalore, Hyderabad, Pune, NCR, Remote)`

    // ── AGE / DOB ─────────────────────────────────────────
    if (score(['age', 'born', 'birthday', 'dob', 'date of birth', 'old is he', 'how old']) >= 1)
      return `### 🎂 Personal Details\n\n- **Date of Birth**: 16 January 2006\n- **Current Age**: 19 years old\n- **Hometown**: Bhubaneswar, Odisha, India\n- **Academic Year**: 3rd Year B.Tech Computer Science (2023–2027)`

    // ── CGPA / ACADEMICS ─────────────────────────────────
    if (score(['cgpa', 'gpa', 'grade', 'marks', 'academic', 'percentage', 'score', 'rank']) >= 1)
      return `### 🎓 Academic Standing & Performance\n\n- **Cumulative GPA (CGPA)**: **8.10 / 10.00**\n- **Degree**: Bachelor of Technology (B.Tech) in Computer Science and Engineering\n- **College**: Government College of Engineering, Kalahandi (GCEK)\n- **University**: Biju Patnaik University of Technology (BPUT), Odisha\n- **Graduation Year**: 2027\n\n#### 📚 Core CS Coursework:\n- **Data Structures & Algorithms (DSA)**\n- **Object-Oriented Programming (OOP in C++ & Java)**\n- **Database Management Systems (DBMS & SQL)**\n- **Operating Systems & Linux Systems**\n- **Computer Networks (CN)**\n- **Artificial Intelligence & Machine Learning**`

    // ── EDUCATION ─────────────────────────────────────────
    if (score(['education', 'college', 'university', 'school', 'degree', 'study', 'gcek', 'bput', 'kendriya vidyalaya', 'class 10', 'class 12', 'cbse']) >= 1)
      return `### 🎓 Educational Background\n\n#### 1. 🏫 Undergraduate Degree (2023 – 2027)\n- **Degree**: Bachelor of Technology - BTech, Computer Science and Engineering\n- **Institution**: Government College of Engineering, Kalahandi (GCE Kalahandi) under BPUT\n- **Curriculum & Core**: C, C++, Python, Java, JavaScript, SQL, DSA, Web Dev, DBMS, Cloud Computing, OS\n- **Activities**: Member of Kilobots Robotics Club, participant in athletics & sports, tech-fests and cultural events volunteer & participant\n\n#### 2. 🏫 Senior Secondary / Class XII (2021 – 2023)\n- **School**: Kendriya Vidyalaya\n- **Curriculum**: 12th Grade (Senior Secondary), Science (PCMB) under CBSE\n- **Activities**: Ashoka House Sports Captain, Competitive Chess, Badminton, Pro Competitive Gaming\n\n#### 3. 🏫 Secondary / Class X (2020 – 2021)\n- **School**: Kendriya Vidyalaya (KV)\n- **Curriculum**: 10th Grade (Secondary School), General Education under CBSE\n- **Activities**: Cricket (Club Level Player), Football Player, Tech Enthusiast (Microsoft Office Suite, HTML5, Linux, Teams), Event Volunteer`

    // ── SKILLS / TECH STACK ───────────────────────────────
    if (score(['skill', 'tech', 'stack', 'language', 'strongest', 'good at', 'expertise', 'proficient', 'technology', 'know', 'what can he do']) >= 1)
      return `### 💡 Technical Skills & Core Competencies\n\n#### 🐍 Programming Languages\n- **Python (92%)**: Primary language for AI/ML, NLP, data analysis, and backend APIs\n- **JavaScript (88%)**: Core web development, dynamic DOM, asynchronous workflows\n- **TypeScript (86%)**: Full-stack MERN with strict type safety\n- **C / C++ (80% / 82%)**: Algorithms, Data Structures, and systems programming\n- **Core Java (78%)**: Object-oriented software design and enterprise fundamentals\n- **SQL (88%)**: Relational schema design, complex joins, and query optimization\n- **PHP (75%) & Shell Scripting (82%)**: Server-side scripting & automation\n\n#### 🤖 AI / Machine Learning / Deep Learning\n- **CatBoost, XGBoost & LightGBM (86-88%)**: High-accuracy gradient boosting models (NIC Forecasting Platform)\n- **Scikit-Learn (88%)**: Supervised regression, classification, Random Forest\n- **TensorFlow & Keras (84%)**: Deep neural network architecture design and training\n- **PyTorch (84%)**: Custom CNN architectures (VGG, ResNet) and lane detection\n- **Computer Vision (86%)**: OpenCV video frame processing and real-time lane tracking\n- **NLP & LangChain**: Conversational AI, multi-turn dialogue, vector embeddings\n\n#### 🌐 Full-Stack Web Development\n- **React.js (88%) & React Vite (86%)**: High-performance UI and stateful dashboards\n- **Next.js (86%)**: Server-Side Rendering (SSR), App Router, dynamic routes\n- **Three.js (86%)**: 3D WebGL spatial visualization and interactive cosmos\n- **Node.js (84%) & Express.js (82%)**: Scalable REST APIs and backend services\n- **FastAPI (88%)**: High-speed asynchronous AI microservices and decision support\n- **Databases**: SQLite (86%), MySQL (86%), MongoDB (84%)\n- **Styling**: Tailwind CSS (88%), Bootstrap (80%), Recharts (85%), Lucide React\n\n#### 📊 Data Science & Analytics\n- **Tableau (86%) & Microsoft Power BI (86%)**: Interactive business intelligence dashboards\n- **Pandas & NumPy (90% / 88%)**: High-throughput data ingestion, manipulation, and numerical computing\n- **Matplotlib & Seaborn (86%)**: Statistical data visualization and EDA\n\n#### 🛠️ Tools & DevOps\n- **Postman API (88%)**: API testing, collection automation, and integration verification\n- **Docker & AWS (86%)**: Amazon EC2, Amazon S3, containerized microservices\n- **Nginx (85%)**: Reverse proxy, load balancing, and production web servers\n- **Git & GitHub (90%)**: Version control, branch management, collaborative workflows\n- **Operating Systems**: Linux / Ubuntu (88%) and Windows (88%)`

    // ── PROJECTS ──────────────────────────────────────────
    if (score(['project', 'built', 'made', 'created', 'developed', 'work', 'portfolio', 'github project', 'demo']) >= 1)
      return `### 🚀 Key Featured Projects\n\n#### 1. 🏛️ AI-Powered Liquor Production Forecasting Platform\n- **Tech Stack**: FastAPI, CatBoost, XGBoost, LightGBM, React Vite, Three.js, Recharts, SQLite, Nginx\n- **Role**: Developed for National Informatics Centre (NIC) & Odisha State Excise Department\n- **Highlights**: Predictive bottling quota planning, 3D facility mapping, and automated monthly analytics\n\n#### 2. 🫀 AI-Powered Heart Disease Prediction & Medical OCR\n- **Tech Stack**: Python, Random Forest, SVM, Neural Networks, OCR, REST APIs, FastAPI\n- **Role**: Developed during Infosys AI Internship\n- **Highlights**: Automated biometric data extraction from medical reports via OCR and real-time cardiovascular risk probability scoring\n\n#### 3. 🛒 Scalable Full-Stack MERN E-Commerce Platform\n- **Tech Stack**: React.js, Next.js, Node.js, Express.js, TypeScript, Tailwind CSS, Bootstrap, MongoDB, Postman API\n- **Role**: Developed during EISystems Technologies Internship (~30% faster response times)\n\n#### 4. 🚗 EV Vehicle Charging Demand Prediction\n- **Tech Stack**: Python, Scikit-Learn, Random Forest, Tableau, Microsoft Power BI\n- **Role**: AICTE Internship Cycle-2 at Edunet Foundation ($R^2=0.86$, ⭐1)\n- **GitHub**: [HUNTER-X0s/EV-VEHICLE-CHARGING-DEMAND-PREDICTION](https://github.com/HUNTER-X0s/EV-VEHICLE-CHARGING-DEMAND-PREDICTION)\n\n#### 5. 🛣️ Autonomous Driving Road Lane Detection System\n- **Tech Stack**: OpenCV, PyTorch, TensorFlow, Keras, Python\n- **Role**: MicroGenesis TechSoft Bangalore (Real-time polynomial lane tracking)\n\n#### 6. 🤖 Autonomous Research Agent\n- **Tech Stack**: Python, Amazon Web Services (EC2, S3), Docker, IBM Watson\n- **Role**: AI & Cloud Technologies Internship Capstone (Edunet Foundation & IBM)`

    // ── EV PROJECT ────────────────────────────────────────
    if (score(['ev', 'electric vehicle', 'charging demand', 'demand prediction']) >= 1)
      return `### 🚗 EV Vehicle Charging Demand Prediction Project\n\n- **Objective**: Forecast electric vehicle charging station loads to optimize smart grid power distribution\n- **Program**: AICTE Internship Cycle-2 at Edunet Foundation\n- **Model Architecture**: Random Forest Regressor & Ridge Regression with temporal feature engineering\n- **Performance Metric**: Achieved an **$R^2$ Score of 0.86** (86% variance explained) with an 18% RMSE reduction\n- **Tech Stack**: Python, Scikit-Learn, Pandas, NumPy, Matplotlib, Seaborn, Tableau, Microsoft Power BI\n- **Repository**: [github.com/HUNTER-X0s/EV-VEHICLE-CHARGING-DEMAND-PREDICTION](https://github.com/HUNTER-X0s/EV-VEHICLE-CHARGING-DEMAND-PREDICTION) (⭐1)`

    // ── INFOSYS HEART DISEASE PREDICTION PROJECT ───────────
    if (score(['heart disease', 'ocr', 'medical ocr', 'infosys project']) >= 1)
      return `### 🫀 AI-Powered Heart Disease Prediction System & Medical OCR (Infosys AI Internship)\n\n- **Objective**: Develop an AI-powered clinical decision support system combining document OCR extraction and predictive ML classifiers\n- **Program**: Infosys Springboard Virtual Internship 2.0 (August – October 2025)\n- **Key Features**:\n  - Automated OCR extraction of clinical biomarkers directly from medical test reports, eliminating manual data entry latency by ~85%\n  - Machine learning risk classification combining Random Forest, SVM, and Neural Networks\n  - Full-stack authenticated clinical web application with secure REST APIs and real-time risk dashboards\n  - Evaluated with precision, recall, and F1-score metrics\n- **Tech Stack**: Python, Random Forest, SVM, Neural Networks, OCR, REST APIs, FastAPI, Scikit-Learn, HuggingFace, LangChain\n- **Deliverable**: Core Infosys internship deliverable with top-tier evaluation`

    // ── INTERNSHIP / EXPERIENCE ───────────────────────────
    if (score(['intern', 'experience', 'company', 'work', 'job', 'employer', 'worked at', 'past role', 'professional']) >= 1)
      return `### 💼 Professional Experience (5 Verified Internships)\n\n#### 1. 🏛️ National Informatics Centre (NIC), Govt of India — Intern\n- **Duration**: June 2026 – August 2026 (3 months · On-site Bhubaneswar)\n- **Project**: AI-Powered Liquor Production Demand Forecasting Platform for Odisha State Excise Department\n- **Tech**: CatBoost, XGBoost, LightGBM, FastAPI, SQLite, Nginx, React Vite, Three.js, Recharts\n- **Credential**: National Informatics Centre (Govt of India) Internship Certificate\n\n#### 2. 🏢 Infosys — AI Intern\n- **Duration**: August 2025 – October 2025 (3 months · Remote)\n- **Project**: AI-Powered Heart Disease Prediction System with OCR Medical Data Extraction\n- **Tech**: Python, Random Forest, SVM, Neural Networks, OCR, HuggingFace, LangChain, REST APIs\n- **Credential**: Infosys Springboard Virtual Internship 2.0 Completion Certificate\n\n#### 3. 💻 EISystems Technologies — Web Development Intern\n- **Duration**: July 2025 – September 2025 (3 months · Remote)\n- **Project**: Scalable full-stack MERN e-commerce platform (~30% faster response times)\n- **Tech**: React.js, Next.js, TypeScript, Node.js, Express.js, MongoDB, Tailwind CSS, Bootstrap, Postman API\n- **Credential**: Official Web Development Internship Certificate\n\n#### 4. ☁️ Edunet Foundation & IBM — AI & Analytics Intern\n- **Duration**: July 2025 – August 2025 (2 months · Remote)\n- **Project 1**: AICTE-certified EV Charging Demand Prediction ML pipeline with Tableau & Power BI\n- **Project 2**: Autonomous Research Agent deployed with Docker on AWS (EC2, S3) and IBM Watson\n- **Credential**: Dual certifications from Edunet Foundation & AICTE\n\n#### 5. 🧠 MicroGenesis TechSoft, Bangalore — Deep Learning Intern\n- **Duration**: June 2025 – July 2025 (2 months · Hybrid In-Person)\n- **Project**: Autonomous Driving Road Lane Detection System with OpenCV & Deep CNNs\n- **Tech**: PyTorch, TensorFlow, Keras, OpenCV, Python\n- **Recognition**: 12+ technical skill endorsements on LinkedIn & Internship Certificate\n\n#### ⏱️ Aggregate Industry Experience\n- **Total Duration**: ~13+ months of hands-on engineering across Government and Industry`

    // ── INFOSYS ───────────────────────────────────────────
    if (score(['infosys']) >= 1)
      return `### 🏢 Infosys AI Internship Summary\n\n- **Role**: Artificial Intelligence Intern\n- **Duration**: August – October 2025 (3 months · Remote)\n- **Program**: Infosys Springboard Virtual Internship 2.0\n- **Key Deliverable**: Developed the AI-Powered Heart Disease Prediction System & Medical OCR platform\n- **Technologies**: Python, Machine Learning (Random Forest, SVM, Neural Networks), OCR, REST APIs, HuggingFace, LangChain\n- **Certificate**: Infosys Virtual Internship 2.0 Completion Certificate`

    // ── MICROGENESIS / DEEP LEARNING ──────────────────────
    if (score(['microgenesis', 'deep learning', 'bangalore', 'computer vision', 'cnn', 'tensorflow', 'pytorch', 'opencv']) >= 1)
      return `### 🧠 MicroGenesis TechSoft — Deep Learning Internship\n\n- **Role**: Deep Learning Intern\n- **Location**: Bangalore (Golden Enclave, Old Airport Road) — Hybrid Setup\n- **Duration**: June – July 2025 (2 months)\n- **Work Focus**: Computer Vision, Transfer Learning, and Neural Network Architectures\n- **Models Trained**: VGG16, ResNet50, and custom convolutional architectures\n- **Computer Vision**: Image preprocessing, feature extraction, and augmentation using OpenCV\n- **Tech Stack**: PyTorch, TensorFlow, Keras, OpenCV, Python\n- **Recognition**: 12+ technical skill endorsements from MicroGenesis team`

    // ── HIRE / AVAILABILITY ───────────────────────────────
    if (score(['hire', 'available', 'opportunity', 'looking', 'open to', 'job', 'recruit', 'position', 'role', 'offer', 'candidate']) >= 1)
      return `### ✅ Candidate Availability & Value Proposition\n\n#### 🟢 Current Status\n- **Availability**: Actively open for Internships, Part-Time, and Full-Time positions\n- **Target Roles**: Software Development Engineer (SDE), AI/ML Engineer, Full-Stack Developer, Data Scientist\n- **Work Modes**: Remote, Hybrid, or Relocation across India\n\n#### ⭐ Top 5 Reasons to Hire Anurag:\n- **1. Rare Experience**: Completed 5 competitive internships in 2025 across AI, Deep Learning, Full-Stack, and Data Science\n- **2. Strong Academics**: 8.10 / 10.00 CGPA in B.Tech CSE at Government College of Engineering, Kalahandi\n- **3. Full-Stack + AI Depth**: Can build both the machine learning model / RAG pipeline and the production web app\n- **4. Verified Credentials**: Certified by IBM, AICTE, Infosys, and MicroGenesis TechSoft\n- **5. Prolific Builder**: 14+ public GitHub repositories with community recognition\n\n#### 📬 Get in Touch:\n- **Email**: [anurag.swain35@gmail.com](mailto:anurag.swain35@gmail.com)\n- **Phone**: +91-7008973337\n- **Response Window**: Within 24 hours`

    // ── CERTIFICATIONS ────────────────────────────────────
    if (score(['certif', 'badge', 'course', 'credential', 'award', 'achievement', 'credential', 'ibm', 'aicte', 'hackerrank']) >= 1)
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
      return `### ⭐ Why Anurag Swain Stands Out\n\n- **1. Exceptional Experience for a 3rd-Year Student**: 5 professional internships completed across National Informatics Centre (Govt of India), Infosys, EISystems, Edunet/IBM, and MicroGenesis\n- **2. Production AI Capability**: Real-world experience building clinical risk models at Infosys, computer vision at MicroGenesis, and regression models for AICTE\n- **3. Full-Stack Mastery**: Able to architect end-to-end web apps from React/Next.js frontends down to Node/FastAPI backends and databases\n- **4. Strong CS Core**: 8.10 CGPA demonstrating solid foundations in algorithms, OOP, database design, and systems\n- **5. Execution Speed**: 14 public GitHub repositories delivering production-ready, well-documented code`

    // ── CLUBS / ACTIVITIES ────────────────────────────────
    if (score(['club', 'robot', 'kilobot', 'extra', 'activity', 'volunteer', 'fest', 'competition', 'sports captain']) >= 1)
      return `### 🏅 Clubs & Leadership Activities\n\n- **Kilobots Robotics Club (GCE Kalahandi)**: Active technical member contributing to autonomous robotics, automation and embedded systems\n- **Sports Leadership**: Served as **Ashoka House Sports Captain** at Kendriya Vidyalaya\n- **Hackathons & Fests**: Active participant and volunteer at collegiate engineering fests, cultural events, and tech hackathons`

    // ── SOCIAL PROFILES ───────────────────────────────────
    if (score(['social', 'twitter', 'x.com', 'threads', 'profile', 'follow', 'handle', 'username']) >= 1)
      return `### 🌐 Official Online Profiles\n\n- **LinkedIn**: [linkedin.com/in/anurag-swain-dev](https://www.linkedin.com/in/anurag-swain-dev/)\n- **GitHub**: [github.com/HUNTER-X0s](https://github.com/HUNTER-X0s)\n- **Twitter / X**: [@Anurag_hunter07](https://x.com/Anurag_hunter07)\n- **Instagram**: [@_vi_ll_a_in_](https://www.instagram.com/_vi_ll_a_in/)\n- **Threads**: [@_vi_ll_a_in_](https://www.threads.com/@_vi_ll_a_in_)\n- **Portfolio Website**: [anuragswain.vercel.app](https://anuragswain.vercel.app)`

    // ── RESUME ────────────────────────────────────────────
    if (score(['resume', 'cv', 'curriculum vitae', 'download', 'pdf']) >= 1)
      return `### 📄 Anurag Swain's Resume\n\n- **Direct Download**: Click **"Download Resume"** in the **Hero Section** or the **Footer Resources** section\n- **Email Request**: [anurag.swain35@gmail.com](mailto:anurag.swain35@gmail.com)\n\n#### 📋 Resume Highlights:\n- **Academics**: 3rd-Year B.Tech CSE @ GCE Kalahandi (CGPA 8.10)\n- **Experience**: 5 Internships (NIC, Infosys, EISystems, Edunet/IBM, MicroGenesis)\n- **Skills**: Python, React, Next.js, TensorFlow, PyTorch, Scikit-Learn, MongoDB\n- **Credentials**: 7+ Verified Certifications\n- **Code**: 14 Open-Source GitHub Repositories`

    // ── PYTHON SKILLS ─────────────────────────────────────
    if (score(['python']) >= 1)
      return `### 🐍 Python Proficiency & Stack\n\n- **Proficiency Level**: **88%** (Primary and most utilized language)\n\n#### 🤖 AI & Machine Learning Stack:\n- **Scikit-Learn**: Supervised regression, classification, Random Forest\n- **TensorFlow & PyTorch**: Deep neural networks and CNN architectures\n- **NLTK & NLP Tools**: Text tokenization, intent classification, entity recognition\n- **Vector Databases**: ChromaDB and semantic embedding pipelines\n\n#### 📊 Data Science & Analytics Stack:\n- **Pandas & NumPy**: Data cleaning, wrangling, and multi-dimensional arrays\n- **Matplotlib & Seaborn**: Statistical visualizations and distribution plots\n- **Jupyter Notebook**: Data exploration and reproducible research\n\n#### 🌐 Backend Engineering:\n- **FastAPI**: Asynchronous Python API powering the RAG chatbot server\n\n#### 📦 Featured Python Repositories:\n- [AI_CHAT_BOT](https://github.com/HUNTER-X0s/AI_CHAT_BOT)\n- [EV-VEHICLE-CHARGING-DEMAND-PREDICTION](https://github.com/HUNTER-X0s/EV-VEHICLE-CHARGING-DEMAND-PREDICTION)\n- [RESEARCH_AGENT](https://github.com/HUNTER-X0s/RESEARCH_AGENT)\n- [SHADOW-FOX_DATASCIENCE_INTERNSHIP](https://github.com/HUNTER-X0s/SHADOW-FOX_DATASCIENCE_INTERNSHIP)`

    // ── AI / ML SKILLS ────────────────────────────────────
    if (score(['ai', 'machine learning', 'ml', 'deep learning', 'neural network', 'model', 'llm', 'nlp', 'generative', 'artificial intelligence']) >= 1)
      return `### 🤖 AI, Machine Learning & Deep Learning Expertise\n\n#### 🧠 Machine Learning (82%)\n- **Algorithms**: Random Forest, Ridge/Lasso Regression, Gradient Boosting, SVM, K-Means\n- **Techniques**: Feature engineering, hyperparameter tuning, cross-validation, and metrics evaluation\n\n#### 🔬 Deep Learning & Computer Vision (80% / 78%)\n- **Architectures**: Convolutional Neural Networks (CNNs), VGG16, ResNet50\n- **Frameworks**: PyTorch, TensorFlow, Keras\n- **Computer Vision**: OpenCV (75%) for image filtering, preprocessing, and feature maps\n\n#### 💬 Natural Language Processing & Generative AI (75%)\n- **Dialogue Systems**: Multi-turn conversation tracking, intent classification, entity parsing\n- **RAG Architectures**: Vector similarity search (ChromaDB), prompt orchestration, and LLM inference\n\n#### 🚀 Practical Projects:\n- **Heart Disease Prediction & Medical OCR** (Infosys)\n- **EV Demand Predictor** (AICTE) → [View](https://github.com/HUNTER-X0s/EV-VEHICLE-CHARGING-DEMAND-PREDICTION)\n- **Research Agent** (IBM) → [View](https://github.com/HUNTER-X0s/RESEARCH_AGENT)`

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
    return `### 👋 Nexus AI — Anurag Swain Portfolio Assistant\n\n#### 🎓 Candidate Profile at a Glance:\n- **Student**: Anurag Swain — 3rd-Year B.Tech CSE @ GCE Kalahandi (CGPA: **8.10 / 10.00**)\n- **Experience**: 5 Internships across AI, Web Dev, Deep Learning, and Data Science in 2025\n- **Core Skills**: Python (88%), React/Next.js, TensorFlow, PyTorch, Scikit-Learn, MongoDB\n- **Location**: Bhubaneswar, Odisha, India\n- **Status**: Actively open for Internships and SDE / AI opportunities\n\n#### 💡 Suggested Pointed Queries:\n- *"What are his strongest technical skills?"*\n- *"Summarize his 5 internships"*\n- *"Tell me about the EV charging prediction project"*\n- *"Why should we hire Anurag?"*\n- *"How can I contact him?"*\n\n- **Direct Email**: [anurag.swain35@gmail.com](mailto:anurag.swain35@gmail.com)`
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) }
  }

  // ── Render ────────────────────────────────────────────────
  return (
    <>
      {/* FAB Button — Nexus Chatbot with Shuttle Multicolor Charging Animation */}
      <motion.div
        animate={isChatOpen ? { y: 0 } : { y: [0, -8, 0] }}
        transition={{
          repeat: isChatOpen ? 0 : Infinity,
          duration: 3.2,
          ease: 'easeInOut',
        }}
        className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 md:bottom-6 md:right-6 z-[70]"
      >
        <motion.button
          onClick={() => { setChatOpen(!isChatOpen); playClick() }}
          onMouseEnter={() => setIsBtnHovered(true)}
          onMouseLeave={() => setIsBtnHovered(false)}
          whileHover={{ scale: 1.14 }}
          whileTap={{ scale: 0.9 }}
          className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all cursor-pointer group bg-transparent border-0 outline-none p-0 focus:outline-none"
          title="Nexus AI Chat — Shuttle Mode"
        >
          {/* Shuttle Multicolor Plasma Corona Ring */}
          <ShuttleIconUI isHovered={isBtnHovered} isActive={isChatOpen} />

          <AnimatePresence mode="wait">
            {isChatOpen ? (
              <motion.div
                key="x"
                initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 90, scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="z-10 flex items-center justify-center"
              >
                <X size={20} className="text-white sm:w-5 sm:h-5 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
              </motion.div>
            ) : (
              <motion.div
                key="s"
                initial={{ rotate: 90, scale: 0.6, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: -90, scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="z-10 flex items-center justify-center"
              >
                <Sparkles
                  size={20}
                  className="text-white sm:w-5 sm:h-5 filter drop-shadow-[0_0_10px_rgba(0,229,255,0.95)] drop-shadow-[0_0_16px_rgba(192,38,211,0.8)] group-hover:scale-115 transition-transform duration-200"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>

      {/* Chat Window — Dynamically scaled for all screen dimensions */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ duration: 0.25, ease: [0.19, 1, 0.22, 1] }}
            className="fixed inset-x-1.5 xs:inset-x-2 bottom-[60px] top-[52px] sm:inset-auto sm:bottom-20 md:bottom-24 sm:right-3 md:right-6 lg:right-8 z-[70] w-auto sm:w-[clamp(320px,30vw,480px)] lg:w-[clamp(380px,26vw,520px)] xl:w-[clamp(400px,24vw,560px)] h-auto sm:h-[clamp(480px,70vh,740px)] sm:max-h-[85vh] flex flex-col rounded-xl sm:rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(8, 8, 20, 0.97)',
              border: '1px solid rgba(0,229,255,0.22)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.85), 0 0 50px rgba(0,229,255,0.1)',
              backdropFilter: 'blur(24px)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3.5 border-b border-white/[0.06] flex-shrink-0">
              <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
                <div className="relative flex-shrink-0">
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-gradient-to-br from-cyan/25 to-violet/25 border border-cyan/25 flex items-center justify-center">
                    <Bot size={13} className="text-cyan sm:w-4 sm:h-4" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-neon-green border-2 border-surface-1 animate-pulse" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <p className="text-[11px] sm:text-sm font-semibold text-text-primary truncate">Portfolio AI</p>
                    <div className="flex items-center gap-1 text-[7px] sm:text-[9px] font-mono px-1 sm:px-1.5 py-0.5 rounded bg-cyan/8 border border-cyan/15 text-cyan flex-shrink-0">
                      <Zap size={6} className="sm:w-[7px] sm:h-[7px]" /> RAG
                    </div>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 mt-0.5">
                    <p className="text-[8px] sm:text-[10px] text-text-secondary truncate">ANURAG PORTFOLIO AI</p>
                    <ConnectionBadge connected={connected} mode={aiMode} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                {chatMessages.length > 1 && (
                  <button
                    onClick={() => { clearChat(); setSessionId(null); playClick() }}
                    className="p-1 sm:p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.05] transition-all"
                    title="Clear history"
                  >
                    <RotateCcw size={11} className="sm:w-3 sm:h-3" />
                  </button>
                )}
                <button
                  onClick={() => { setChatOpen(false); playClick() }}
                  className="p-1 sm:p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.05] transition-all"
                  title="Close chat"
                >
                  <X size={12} className="sm:w-[13px] sm:h-[13px]" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={messagesRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto no-scrollbar px-2.5 sm:px-4 py-2.5 sm:py-4 space-y-2 sm:space-y-3"
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
              <div className="px-2.5 sm:px-3.5 pb-1.5 sm:pb-2 flex-shrink-0">
                <p className="text-[7px] sm:text-[9px] font-mono text-text-tertiary uppercase tracking-wider mb-1 sm:mb-1.5">
                  Ask me anything:
                </p>
                <div className="flex flex-wrap gap-1 max-h-[80px] sm:max-h-[110px] overflow-y-auto no-scrollbar">
                  {SUGGESTED_PROMPTS.slice(0, 6).map((q) => (
                    <button
                      key={q.text}
                      onClick={() => sendMessage(q.text)}
                      className="flex items-center gap-1 text-[8px] sm:text-[10px] px-1.5 sm:px-2.5 py-0.5 sm:py-1.5 rounded-md sm:rounded-lg text-text-secondary border border-white/[0.07] bg-white/[0.02] hover:border-cyan/20 hover:text-cyan transition-all"
                    >
                      <span className="text-[10px] sm:text-xs">{q.icon}</span>
                      <span className="line-clamp-1">{q.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div className="px-2.5 sm:px-3.5 pb-2.5 sm:pb-3 pt-1.5 sm:pt-2 border-t border-white/[0.05] flex-shrink-0">
              <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl bg-white/[0.03] border border-white/[0.08] focus-within:border-cyan/25 transition-all">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about skills, projects…"
                  maxLength={500}
                  className="flex-1 bg-transparent text-[11px] sm:text-sm text-text-primary placeholder-text-tertiary outline-none font-body min-w-0"
                  disabled={isTyping}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isTyping}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg flex items-center justify-center transition-all disabled:opacity-30 flex-shrink-0"
                  style={{
                    background: input.trim() && !isTyping ? 'rgba(0,229,255,0.15)' : 'transparent',
                    color: input.trim() && !isTyping ? '#00E5FF' : '#4B4B6A',
                  }}
                >
                  {isTyping
                    ? <Loader2 size={12} className="animate-spin text-text-tertiary" />
                    : <Send size={12} />
                  }
                </button>
              </div>
              <p className="text-[7px] sm:text-[9px] font-mono text-text-tertiary text-center mt-1 sm:mt-1.5">
                Powered by Ollama + ChromaDB · Local RAG
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
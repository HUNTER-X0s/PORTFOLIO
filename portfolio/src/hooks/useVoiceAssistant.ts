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
const RATE      = process.env.NEXT_PUBLIC_TTS_RATE   ? parseFloat(process.env.NEXT_PUBLIC_TTS_RATE)  : 1.0
const PITCH     = process.env.NEXT_PUBLIC_TTS_PITCH  ? parseFloat(process.env.NEXT_PUBLIC_TTS_PITCH) : 1.0
const LANG      = 'en-IN'

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

// ── Strip markdown for clean TTS ──────────────────────────────
function stripMarkdown(text: string): string {
  return text
    .replace(/[-=_*#~]{3,}/g, '')         // Remove horizontal rules and repeated punctuation like === or ---
    .replace(/^#{1,6}\s*/gm, '')          // Strip markdown headings #, ##, ###
    .replace(/#{1,6}/g, '')               // Stray hashes
    .replace(/\*\*([^*]+)\*\*/g, '$1')   // **bold**
    .replace(/\*([^*]+)\*/g, '$1')        // *italic*
    .replace(/`([^`]+)`/g, '$1')          // inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links → label
    .replace(/^[-•·*+]\s?/gm, '')         // bullets
    .replace(/[⭐⚡→✓✔︎]/g, '')           // symbols
    .replace(/\n{2,}/g, '. ')            // paragraph breaks
    .replace(/\n/g, '. ')                 // line breaks
    .trim()
}

// ── Pick the best available voice ────────────────────────────
function pickVoice(): SpeechSynthesisVoice | null {
  if (!window.speechSynthesis) return null
  const voices = window.speechSynthesis.getVoices()

  // Priority list — best quality voices
  const preferred = [
    'Google UK English Male',
    'Microsoft Ryan Online (Natural) - English (United Kingdom)',
    'Microsoft Guy Online (Natural) - English (United States)',
    'Google US English',
    'Microsoft David - English (United States)',
  ]

  for (const name of preferred) {
    const v = voices.find((v) => v.name === name)
    if (v) return v
  }

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
    const greetingText = "Hello, I am Jarvis. How can I help you?"
    setMessages((prev) => {
      if (prev.length > 0) return prev
      return [{
        id: crypto.randomUUID(),
        role: 'assistant',
        text: greetingText,
        timestamp: new Date(),
        actionTaken: 'Jarvis greeting',
      }]
    })
    speak(greetingText)
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

  // ── Local fallback responses ─────────────────────────────────
  function getLocalFallback(query: string): string {
    const q = query.toLowerCase()
    if (q.includes('skill') || q.includes('tech'))
      return "- **Python**: 88% proficiency across AI, ML, and Data Science\n- **Machine Learning & DL**: PyTorch, TensorFlow, Scikit-Learn\n- **Web & Backend**: React, Next.js 14, Node.js, FastAPI\n- **Databases & Cloud**: PostgreSQL, MongoDB, Docker, Git"
    if (q.includes('project'))
      return "- **AI Chat Bot**: Conversational NLP chatbot with multi-turn dialogue from Infosys\n- **EV Demand Prediction**: ML pipeline with Ridge Regression predicting charging loads\n- **Research Agent**: IBM SkillsBuild capstone using IBM Watson\n- **3D Portfolio**: Built with Next.js 14, Three.js, and RAG AI"
    if (q.includes('internship') || q.includes('experience') || q.includes('work'))
      return "- **Infosys**: AI Intern (3 months, NLP Chatbot)\n- **EISystems Technologies**: Web Developer Intern (3 months, React & Node.js)\n- **Edunet Foundation & IBM**: AI & Cloud Intern (2 months, EV Prediction)\n- **MicroGenesis TechSoft**: Deep Learning Intern (2 months, Bangalore)"
    if (q.includes('hire') || q.includes('available') || q.includes('job'))
      return "- **Availability**: Actively available for AI Engineer, ML Engineer, and SDE roles\n- **Contact**: anurag.swain35@gmail.com with under 24-hour response time"
    if (q.includes('education') || q.includes('college') || q.includes('cgpa') || q.includes('gpa') || q.includes('degree'))
      return "- **Degree**: B.Tech in Computer Science & Engineering\n- **College**: Government College of Engineering, Kalahandi\n- **CGPA**: 8.10 out of 10.00 (Class of 2027)"
    return "- Anurag is a Full Stack AI Engineer. Ask me about his skills, projects, or internships."
  }

  // ── Speech Recognition ───────────────────────────────────────
  const initRecognition = useCallback(() => {
    if (!isSupported) return null
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const rec = new SR()
    rec.lang           = LANG
    rec.interimResults = true
    rec.continuous     = false
    rec.maxAlternatives = 3

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
      }
    }

    rec.onerror = (e: any) => {
      const msg = e.error === 'not-allowed'
        ? 'Microphone permission denied. Please allow microphone access.'
        : e.error === 'no-speech'
        ? 'No speech detected. Please try again.'
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

    // Stop any ongoing speech
    stopSpeaking()

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
      const rec = initRecognition()
      if (!rec) return
      recognitionRef.current = rec
      transcriptRef.current = ''
      finalTranscriptRef.current = ''
      rec.start()
      await startAnalyser()
    } catch (e: any) {
      setError('Could not start microphone. Please try again.')
      setStatus('error')
    }
  }, [isSupported, initRecognition, stopSpeaking, startAnalyser])

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
      return false
    }
  }, [])

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

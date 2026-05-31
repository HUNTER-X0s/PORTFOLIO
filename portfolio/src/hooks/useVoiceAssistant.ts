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
    .replace(/\*\*([^*]+)\*\*/g, '$1')   // **bold**
    .replace(/\*([^*]+)\*/g, '$1')        // *italic*
    .replace(/#{1,6}\s+/g, '')            // headings
    .replace(/`([^`]+)`/g, '$1')          // inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links → label
    .replace(/^[-•·]\s+/gm, '')           // bullets
    .replace(/\n{2,}/g, '. ')            // paragraph breaks
    .replace(/\n/g, ' ')                  // line breaks
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
    window.speechSynthesis.cancel()

    const clean = stripMarkdown(text)
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

      utter.onstart = () => { setIsSpeaking(true); setStatus('speaking') }
      utter.onend   = () => { setIsSpeaking(false); setStatus('idle'); onEnd?.() }
      utter.onerror = () => { setIsSpeaking(false); setStatus('idle') }

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
    setIsSpeaking(false)
    setStatus('idle')
  }, [])

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
        responseText = "You can ask me about Anurag's skills, projects, and experience. Try saying: Show projects, Go to contact, View as AI engineer, Download resume, or ask any question about him."
        actionDesc = 'Help displayed'
        break

      case 'navigate':
        scrollToSection(action.section)
        responseText = `Navigating to the ${action.section} section.`
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
        responseText = `Switched to ${roleLabels[action.roleId] || action.roleId} view. The portfolio is now showing content tailored for that role.`
        actionDesc = `Role → ${action.roleId}`
        break

      case 'openChat':
        setChatOpen(true)
        responseText = "Opening the text chat interface for you."
        actionDesc = 'Chat opened'
        break

      case 'openProject':
        scrollToSection('projects')
        if (action.projectId) setActiveProjectId(action.projectId)
        responseText = "Showing the projects section now."
        actionDesc = `Project opened: ${action.projectId || 'projects'}`
        break

      case 'downloadResume':
        window.open('/resume.pdf', '_blank')
        responseText = "Opening the resume for download."
        actionDesc = 'Resume download triggered'
        break

      case 'openLink':
        window.open(action.url, '_blank')
        responseText = `Opening ${action.url} in a new tab.`
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
              role_context: '',
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

                        // Speak completed sentences
                        if (/[.!?]\s/.test(sentenceBuffer) || (data.done && sentenceBuffer.trim())) {
                          const sentences = sentenceBuffer.split(/(?<=[.!?])\s+/)
                          // If not done, keep the last incomplete chunk in the buffer
                          if (!data.done && sentences.length > 1) {
                            sentenceBuffer = sentences.pop() || ''
                          } else {
                            sentenceBuffer = ''
                          }
                          
                          // Speak all complete sentences
                          for (const sentence of sentences) {
                            if (sentence.trim()) {
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
      return "Anurag's strongest skills are Python at 88%, Scikit-Learn and Machine Learning at 82%, React and Next.js at 78%, and PyTorch and TensorFlow for deep learning. He's worked across AI, full-stack, and data science."
    if (q.includes('project'))
      return "Anurag's key projects include an EV Charging Demand Prediction system built with Scikit-Learn for AICTE, a Research Agent using IBM Watson as an IBM Skills Build capstone, and an AI Chatbot built during his Infosys AI internship — all with GitHub stars."
    if (q.includes('internship') || q.includes('experience') || q.includes('work'))
      return "Anurag has completed 4 internships in 2025: AI Engineer at Infosys for 3 months, Web Developer at EISystems Technologies for 3 months, AI and Cloud at Edunet Foundation with IBM for 2 months, and Deep Learning at MicroGenesis TechSoft in Bangalore for 2 months."
    if (q.includes('hire') || q.includes('available') || q.includes('job'))
      return "Yes, Anurag is actively available for opportunities. He's open to SDE, AI Engineer, and ML Engineer roles. You can reach him at anurag.swain35@gmail.com. He responds within 24 hours."
    if (q.includes('education') || q.includes('college'))
      return "Anurag is pursuing a B.Tech in Computer Science at Government College of Engineering Kalahandi, with a CGPA of 8.10 out of 10, graduating in 2027."
    return "I couldn't connect to the AI system right now. You can contact Anurag directly at anurag.swain35@gmail.com or explore the portfolio sections using the navigation."
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
      setStatus('idle')
      stopAnalyser()
    }

    rec.onend = async () => {
      stopAnalyser()
      // Use refs to always get the latest values (avoids stale closure)
      const spoken = finalTranscriptRef.current || transcriptRef.current
      if (!spoken.trim()) {
        setStatus('idle')
        setTranscript('')
        return
      }

      // Add user message
      const userMsg: VoiceMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        text: spoken,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMsg])
      setTranscript('')
      setFinalTranscript('')
      transcriptRef.current = ''
      finalTranscriptRef.current = ''

      // Parse and execute
      const action = parseVoiceCommand(spoken)
      await executeAction(action, spoken)
    }

    return rec
  }, [isSupported, executeAction, stopAnalyser])

  // ── Start listening ───────────────────────────────────────────
  const startListening = useCallback(async () => {
    if (status === 'listening') return

    // Stop any ongoing speech
    stopSpeaking()

    // Check permission
    if (navigator.permissions) {
      try {
        const perm = await navigator.permissions.query({ name: 'microphone' as PermissionName })
        if (perm.state === 'denied') {
          setError('Microphone permission denied. Please allow it in browser settings.')
          return
        }
      } catch {}
    }

    await startAnalyser()

    const rec = initRecognition()
    if (!rec) {
      setError('Voice recognition is not supported in this browser. Please use Chrome or Edge.')
      return
    }
    recognitionRef.current = rec
    try {
      rec.start()
      setHasPermission(true)
    } catch (e) {
      setError('Could not start voice recognition. Please try again.')
      setStatus('idle')
    }
  }, [status, stopSpeaking, startAnalyser, initRecognition])

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
    clearHistory, speak, requestPermission, executeAction,
  }
}

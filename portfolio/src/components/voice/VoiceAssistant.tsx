'use client'

// ============================================================
// components/voice/VoiceAssistant.tsx
// Full Jarvis Mode UI — floating button + expanded panel
// ============================================================

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic, MicOff, X, Volume2, VolumeX, RotateCcw,
  Sparkles, ChevronUp, AlertCircle, Info
} from 'lucide-react'
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant'
import { VoiceWaveform, VoiceOrb } from './VoiceWaveform'
import { VOICE_SUGGESTIONS } from '@/lib/voiceCommands'
import { cn } from '@/lib/utils'
import { useSound } from '@/hooks'

// ── Status label ──────────────────────────────────────────────
const STATUS_LABEL: Record<string, string> = {
  idle:       '',
  listening:  'Listening…',
  processing: 'Thinking…',
  speaking:   'Speaking…',
  error:      'Error occurred',
}

const STATUS_COLOR: Record<string, string> = {
  idle:       'text-white/60',
  listening:  'text-cyan-400',
  processing: 'text-yellow-400',
  speaking:   'text-violet-400',
  error:      'text-red-400',
}

// ── Message bubble ────────────────────────────────────────────
function VoiceMessageBubble({ msg }: { msg: { role: string; text: string; timestamp: Date; actionTaken?: string } }) {
  const isUser = msg.role === 'user'
  
  // Render **bold**, headings, points, and subpoints formatting cleanly
  const formatContent = (text: string) => {
    const rawLines = text.split('\n').filter((l) => l.trim().length > 0)
    return rawLines.map((rawLine, lineIdx) => {
      const trimmed = rawLine.trim()
      const isH3 = trimmed.startsWith('### ')
      const isH4 = trimmed.startsWith('#### ')
      const isSubBullet = /^\s{2,}[-•*]/.test(rawLine) || /^(\s{2,}|\t)[-•*]/.test(rawLine)
      const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')
      
      let cleanLine = trimmed
      if (isH3) cleanLine = trimmed.replace(/^###\s*/, '')
      else if (isH4) cleanLine = trimmed.replace(/^####\s*/, '')
      else if (isBullet) cleanLine = trimmed.replace(/^[-•*]\s*/, '')

      // Parse markdown links [text](url) -> clickable <a> tag
      const renderFormattedText = (lineText: string) => {
        // Split by markdown link pattern [label](url)
        const linkTokens = lineText.split(/(\[[^\]]+\]\([^)]+\))/g)
        return linkTokens.map((token, tokIdx) => {
          const match = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
          if (match) {
            const label = match[1]
            let url = match[2].trim()
            if (!url.startsWith('http') && !url.startsWith('mailto:') && !url.startsWith('tel:')) {
              url = `https://${url}`
            }
            return (
              <a
                key={tokIdx}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-cyan hover:text-cyan-300 underline font-mono text-xs inline-flex items-center gap-0.5"
              >
                {label}
              </a>
            )
          }

          // Format bold **text**
          const parts = token.split(/(\*\*[^*]+\*\*)/g)
          return parts.map((part, i) =>
            part.startsWith('**') && part.endsWith('**')
              ? <strong key={i} className="text-cyan font-semibold">{part.slice(2, -2)}</strong>
              : <span key={i}>{part}</span>
          )
        })
      }

      const formatted = renderFormattedText(cleanLine)

      if (isH3) {
        return (
          <div key={lineIdx} className="text-[11px] sm:text-xs font-semibold text-cyan-300 mt-2 first:mt-0 mb-1 border-b border-white/[0.08] pb-0.5 flex items-center gap-1">
            {formatted}
          </div>
        )
      }

      if (isH4) {
        return (
          <div key={lineIdx} className="text-[10px] sm:text-[11px] font-semibold text-cyan-400/90 mt-1.5 mb-0.5 font-mono flex items-center gap-1">
            <span className="text-cyan-500/70 text-[9px]">›</span>
            {formatted}
          </div>
        )
      }

      return (
        <span
          key={lineIdx}
          className={cn(
            "block mb-1.5 last:mb-0 min-w-0",
            isBullet && "flex items-start gap-1.5",
            isSubBullet && "pl-4 text-[11px] opacity-90"
          )}
        >
          {isBullet && !isSubBullet && (
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan flex-shrink-0 mt-1 shadow-[0_0_6px_#00e5ff]" />
          )}
          {isSubBullet && (
            <span className="inline-block w-1 h-1 rounded-full bg-cyan/70 flex-shrink-0 mt-1.5 border border-cyan/40" />
          )}
          <span className="flex-1 min-w-0 break-words [overflow-wrap:anywhere] leading-relaxed text-text-secondary">
            {formatted}
          </span>
        </span>
      )
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-2`}
    >
      {!isUser && (
        <div className="w-5 h-5 rounded-md bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center flex-shrink-0 mt-1">
          <Sparkles size={9} className="text-cyan-400" />
        </div>
      )}
      <div className="max-w-[92%] sm:max-w-[88%] min-w-0 space-y-1 overflow-hidden">
        <div
          className="px-3 py-2 rounded-xl text-xs leading-relaxed whitespace-pre-wrap break-words [overflow-wrap:anywhere] [word-break:break-word]"
          style={isUser ? {
            background: 'linear-gradient(135deg, rgba(0,229,255,0.12), rgba(124,58,237,0.12))',
            border: '1px solid rgba(0,229,255,0.18)',
            color: '#E0E0FF',
            borderBottomRightRadius: '4px',
          } : {
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            color: '#8B8BA7',
            borderBottomLeftRadius: '4px',
          }}
        >
          {isUser ? msg.text : formatContent(msg.text)}
        </div>
        {msg.actionTaken && (
          <p className="text-[9px] text-cyan-400/70 font-mono px-1">
            ⚡ {msg.actionTaken}
          </p>
        )}
      </div>
    </motion.div>
  )
}

// ── Permission request screen ─────────────────────────────────
function PermissionScreen({ onRequest }: { onRequest: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
        <Mic size={24} className="text-cyan-400" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-white mb-1">Microphone Access Required</h3>
        <p className="text-xs text-white/80 leading-relaxed max-w-[220px]">
          Jarvis Mode needs microphone permission to hear your voice commands.
        </p>
      </div>
      <motion.button
        onClick={onRequest}
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
        className="px-5 py-2.5 rounded-xl text-xs font-semibold"
        style={{ background: 'rgba(0,229,255,0.12)', border: '1px solid rgba(0,229,255,0.3)', color: '#00E5FF' }}
      >
        Allow Microphone
      </motion.button>
      <p className="text-[9px] text-white/50 font-mono">Your voice is never stored or sent to third parties.</p>
    </div>
  )
}

// ── Not supported screen ──────────────────────────────────────
function NotSupportedScreen() {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center gap-3">
      <AlertCircle size={28} className="text-yellow-400" />
      <div>
        <h3 className="text-sm font-semibold text-white mb-1">Browser Not Supported</h3>
        <p className="text-xs text-white/80 leading-relaxed max-w-[220px] mb-2">
          Jarvis Voice Mode requires a browser that supports the Web Speech API.
        </p>
        <p className="text-[10px] text-white/60 leading-relaxed max-w-[220px]">
          <strong className="text-cyan-400">Mobile:</strong> Use Chrome for Android or Safari on iOS 14.5+
        </p>
        <p className="text-[10px] text-white/60 leading-relaxed max-w-[220px]">
          <strong className="text-cyan-400">Desktop:</strong> Use Chrome, Edge, or Safari.
        </p>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════
export default function VoiceAssistant() {
  const [isOpen,    setIsOpen]    = useState(false)
  const [muteVoice, setMuteVoice] = useState(false)
  const [showTips,  setShowTips]  = useState(false)

  const { playClick, playJarvisChime } = useSound()

  const va = useVoiceAssistant()

  const isListening  = va.status === 'listening'
  const isProcessing = va.status === 'processing'
  const isSpeakingUI = va.status === 'speaking'
  const isActive     = isListening || isProcessing || isSpeakingUI

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    if (va.messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [va.messages])

  // Greet user immediately when Jarvis is opened
  useEffect(() => {
    if (isOpen) {
      va.greet()
    }
  }, [isOpen, va.greet])

  // Mute: stop TTS but keep status
  useEffect(() => {
    if (muteVoice && isSpeakingUI) va.stopSpeaking()
  }, [muteVoice, isSpeakingUI, va])

  const handleMicClick = () => {
    if (isListening) va.stopListening()
    else va.startListening()
  }

  const handleSuggestion = (text: string) => {
    va.speak(`Processing: ${text}`)
    // Simulate as if user said it
    const { parseVoiceCommand } = require('@/lib/voiceCommands')
    const action = parseVoiceCommand(text)
    // @ts-ignore — internal method
    va.executeAction?.(action, text) || va.speak("Let me look that up for you.")
  }

  return (
    <>
      {/* ── FAB ─────────────────────────────────────────────── */}
      <motion.button
        onClick={() => {
          const next = !isOpen
          setIsOpen(next)
          if (next) {
            playJarvisChime()
          } else {
            playClick()
          }
        }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.93 }}
        title="Jarvis Voice Mode"
        className="fixed bottom-3 left-3 sm:bottom-5 sm:left-5 md:bottom-6 md:left-6 z-[70] w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-transform"
        style={{
          background: 'linear-gradient(135deg, rgba(0,229,255,0.18), rgba(124,58,237,0.18))',
          border: '1px solid rgba(0,229,255,0.38)',
          backdropFilter: 'blur(16px)',
          boxShadow: isOpen
            ? '0 8px 32px rgba(0,229,255,0.25)'
            : '0 8px 32px rgba(0,229,255,0.15)',
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen
            ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <X size={18} className="text-cyan-400 sm:w-5 sm:h-5" />
              </motion.div>
            : <motion.div key="m" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }}>
                <Mic size={18} className={cn('sm:w-5 sm:h-5', isActive ? 'text-violet-400' : 'text-cyan-400')} />
              </motion.div>
          }
        </AnimatePresence>

        {/* Pulse indicator matching ChatBot */}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-cyan-400 border-2 border-[#0A0A18] animate-pulse" />
        )}
        
        {/* Label */}
        {!isOpen && (
          <div className="absolute -top-4 sm:-top-5 left-1/2 -translate-x-1/2 text-[7px] sm:text-[8px] font-mono text-white/60 whitespace-nowrap tracking-wider">
            JARVIS
          </div>
        )}
      </motion.button>

      {/* ── Expanded Panel ───────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -15, scale: 0.94 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -15, scale: 0.94 }}
            transition={{ duration: 0.25, ease: [0.19, 1, 0.22, 1] }}
            className="fixed inset-x-1.5 xs:inset-x-2 bottom-[60px] top-[52px] sm:inset-auto sm:bottom-20 md:bottom-24 sm:left-3 md:left-6 lg:left-8 z-[70] w-auto sm:w-[clamp(320px,28vw,440px)] lg:w-[clamp(360px,25vw,480px)] xl:w-[clamp(380px,22vw,500px)] h-auto sm:h-auto sm:max-h-[clamp(480px,74vh,700px)] flex flex-col rounded-xl sm:rounded-2xl overflow-hidden"
            style={{
              background: '#080814',
              border: '1.5px solid rgba(0,229,255,0.25)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.95), 0 0 50px rgba(0,229,255,0.1), inset 0 1px 0 rgba(255,255,255,0.04)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3.5 border-b border-white/[0.06] flex-shrink-0">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="relative flex-shrink-0">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/25 flex items-center justify-center">
                    <Sparkles size={13} className="text-cyan-400 sm:w-3.5 sm:h-3.5" />
                  </div>
                  {isActive && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-cyan-400 border-2 border-[#070712] animate-pulse" />
                  )}
                </div>
                <div>
                  <p className="text-[11px] sm:text-xs font-bold text-white tracking-wide font-mono">JARVIS MODE</p>
                  {STATUS_LABEL[va.status] && (
                    <p className={cn('text-[8px] sm:text-[9px] font-mono transition-colors', STATUS_COLOR[va.status])}>
                      {STATUS_LABEL[va.status]}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setShowTips(!showTips)}
                  className="p-1.5 rounded-lg text-white/60 hover:text-white transition-colors"
                  title="Voice tips">
                  <Info size={13} />
                </button>
                <button onClick={() => setMuteVoice(!muteVoice)} title={muteVoice ? 'Unmute voice' : 'Mute voice'}
                  className="p-1.5 rounded-lg text-white/60 hover:text-white transition-colors">
                  {muteVoice ? <VolumeX size={13} /> : <Volume2 size={13} />}
                </button>
                <button onClick={va.clearHistory} title="Clear history"
                  className="p-1.5 rounded-lg text-white/60 hover:text-white transition-colors">
                  <RotateCcw size={13} />
                </button>
                <button
                  onClick={() => { setIsOpen(false); playClick() }}
                  title="Close Jarvis"
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center ml-1 cursor-pointer"
                >
                  <X size={15} className="text-cyan-400 hover:text-cyan-300" />
                </button>
              </div>
            </div>

            {/* Tips panel */}
            <AnimatePresence>
              {showTips && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="border-b border-white/[0.06]"
                  style={{ background: 'rgba(0,229,255,0.04)' }}
                >
                  <div className="px-4 py-3 max-h-[100px] overflow-y-auto no-scrollbar">
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        '"Show projects"', '"Go to contact"',
                        '"View as AI engineer"', '"What are his skills?"',
                        '"Download resume"', '"Open GitHub"',
                      ].map((tip) => (
                        <p key={tip} className="text-[9px] font-mono text-white/80">
                          <span className="text-cyan-500/60">›</span> {tip}
                        </p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Body */}
            {!va.isSupported ? <NotSupportedScreen /> :
              va.hasPermission === false ? <PermissionScreen onRequest={va.requestPermission} /> : (
              <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                {/* ── Top Interactive Voice Control Area (Always Visible & Prominent) ── */}
                <div className="flex flex-col items-center gap-2 sm:gap-2.5 pt-3 pb-2 px-3 sm:px-4 flex-shrink-0 border-b border-white/[0.06] bg-surface-1/30">
                  {/* Full Iconic Voice Orb */}
                  <VoiceOrb
                    status={va.status}
                    audioLevel={va.audioLevel}
                    size={56}
                    onClick={handleMicClick}
                  />

                  {/* Live transcript / Status */}
                  <div className="min-h-[22px] sm:min-h-[24px] w-full text-center">
                    {va.transcript ? (
                      <motion.p
                        key={va.transcript}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[11px] sm:text-xs text-cyan-400 font-mono px-2 line-clamp-2"
                      >
                        &ldquo;{va.transcript}&rdquo;
                      </motion.p>
                    ) : (
                      <p className="text-[9px] sm:text-[10px] text-white/60 font-mono">
                        {isListening ? 'Listening… Speak now' : isSpeakingUI ? 'Speaking response…' : 'Tap orb to activate'}
                      </p>
                    )}
                  </div>

                  {/* Full Waveform Visualizer */}
                  <div className="w-full h-7 sm:h-8 flex items-center">
                    <VoiceWaveform
                      audioLevel={va.audioLevel}
                      isActive={isListening || isSpeakingUI}
                      isSpeaking={isSpeakingUI}
                      color={isSpeakingUI ? '#7C3AED' : '#00E5FF'}
                      barCount={32}
                      height={28}
                    />
                  </div>

                  {/* Error Notification */}
                  {va.error && (
                    <div className="w-full px-2.5 py-1 rounded-lg bg-red-500/[0.08] border border-red-500/20">
                      <p className="text-[9px] text-red-400 text-center">{va.error}</p>
                    </div>
                  )}

                  {/* Primary Listen / Mute Button */}
                  <div className="flex items-center justify-center pt-0.5 pb-1">
                    <motion.button
                      onClick={handleMicClick}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold transition-all shadow-md cursor-pointer"
                      style={isListening ? {
                        background: 'rgba(239,68,68,0.15)',
                        border: '1px solid rgba(239,68,68,0.35)',
                        color: '#f87171',
                      } : isSpeakingUI ? {
                        background: 'rgba(124,58,237,0.15)',
                        border: '1px solid rgba(124,58,237,0.35)',
                        color: '#a78bfa',
                      } : {
                        background: 'rgba(0,229,255,0.14)',
                        border: '1px solid rgba(0,229,255,0.35)',
                        color: '#00E5FF',
                      }}
                    >
                      {isListening ? <><MicOff size={13} /> Stop Listening</>
                        : isSpeakingUI ? <><VolumeX size={13} onClick={va.stopSpeaking} /> Stop Speaking</>
                        : <><Mic size={13} /> Start Listening</>}
                    </motion.button>
                  </div>
                </div>

                {/* ── Dynamic Full-Height Content Area (Takes All Space Down to Footer) ── */}
                {va.messages.length > 0 ? (
                  /* Elongated Message List */
                  <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-3 sm:px-4 py-3 space-y-2.5">
                    {va.messages.map((msg) => (
                      <VoiceMessageBubble key={msg.id} msg={msg} />
                    ))}
                    <div ref={messagesEndRef} className="h-1" />
                  </div>
                ) : (
                  /* Suggestions Grid when no messages */
                  <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-3 sm:px-4 py-3">
                    <p className="text-[8px] sm:text-[9px] font-mono text-white/60 uppercase tracking-wider mb-2">Try saying:</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {VOICE_SUGGESTIONS.slice(0, 6).map((s) => (
                        <button
                          key={s.text}
                          onClick={() => { handleSuggestion(s.text) }}
                          className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-left transition-all hover:bg-white/[0.06] hover:border-cyan-500/30"
                          style={{ border: '1px solid rgba(255,255,255,0.06)' }}
                        >
                          <span className="text-sm">{s.icon}</span>
                          <span className="text-[10px] text-white/90 leading-tight line-clamp-2">{s.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="px-3 sm:px-4 py-1 sm:py-2 border-t border-white/[0.06] flex-shrink-0" style={{ background: 'rgba(8,8,20,1)' }}>
              <p className="text-[6px] sm:text-[8px] font-mono text-white/50 text-center">
                Voice · RAG AI · Web Speech API · No data stored
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

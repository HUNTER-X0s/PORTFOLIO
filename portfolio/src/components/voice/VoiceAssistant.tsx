'use client'

// ============================================================
// components/voice/VoiceAssistant.tsx
// Full Jarvis Mode UI — floating button + expanded panel
// ============================================================

import { useState, useEffect } from 'react'
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
  idle:       'Say something or tap the mic',
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
      <div className="max-w-[88%] space-y-1">
        <div
          className="px-3 py-2 rounded-xl text-xs leading-relaxed"
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
          {msg.text}
        </div>
        {!isUser && msg.actionTaken && msg.actionTaken !== 'RAG query' && (
          <p className="text-[9px] font-mono px-1" style={{ color: 'rgba(0,229,255,0.5)' }}>
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
        <p className="text-xs text-white/80 leading-relaxed max-w-[220px]">
          Voice recognition requires Chrome, Edge, or Safari. Please switch browsers to use Jarvis Mode.
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

  const { playClick } = useSound()

  const va = useVoiceAssistant()

  const isListening  = va.status === 'listening'
  const isProcessing = va.status === 'processing'
  const isSpeakingUI = va.status === 'speaking'
  const isActive     = isListening || isProcessing || isSpeakingUI

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
        onClick={() => { setIsOpen(!isOpen); playClick() }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.93 }}
        title="Jarvis Voice Mode"
        className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-[70] w-14 h-14 rounded-2xl flex items-center justify-center"
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
                <X size={20} className="text-cyan-400" />
              </motion.div>
            : <motion.div key="m" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }}>
                <Mic size={20} className={isActive ? 'text-violet-400' : 'text-cyan-400'} />
              </motion.div>
          }
        </AnimatePresence>

        {/* Pulse indicator matching ChatBot */}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-[#0A0A18] animate-pulse" />
        )}
        
        {/* Label */}
        {!isOpen && (
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] font-mono text-white/60 whitespace-nowrap tracking-wider">
            JARVIS
          </div>
        )}
      </motion.button>

      {/* ── Expanded Panel ───────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.94 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.94 }}
            transition={{ duration: 0.28, ease: [0.19, 1, 0.22, 1] }}
            className="fixed bottom-20 left-4 right-4 md:left-6 md:bottom-24 md:right-auto z-[70] md:w-[320px] h-[calc(100vh-120px)] md:h-auto max-h-[calc(100vh-100px)] md:max-h-[560px] flex flex-col rounded-2xl overflow-hidden"
            style={{
              background: '#080814',
              border: '1.5px solid rgba(0,229,255,0.25)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.95), 0 0 50px rgba(0,229,255,0.1), inset 0 1px 0 rgba(255,255,255,0.04)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/25 flex items-center justify-center">
                    <Sparkles size={14} className="text-cyan-400" />
                  </div>
                  {isActive && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-cyan-400 border-2 border-[#070712] animate-pulse" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-white tracking-wide font-mono">JARVIS MODE</p>
                  <p className={cn('text-[9px] font-mono transition-colors', STATUS_COLOR[va.status])}>
                    {STATUS_LABEL[va.status]}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setShowTips(!showTips)}
                  className="p-1.5 rounded-lg text-white/60 hover:text-white transition-colors">
                  <Info size={12} />
                </button>
                <button onClick={() => setMuteVoice(!muteVoice)} title={muteVoice ? 'Unmute voice' : 'Mute voice'}
                  className="p-1.5 rounded-lg text-white/60 hover:text-white transition-colors">
                  {muteVoice ? <VolumeX size={13} /> : <Volume2 size={13} />}
                </button>
                <button onClick={va.clearHistory} title="Clear history"
                  className="p-1.5 rounded-lg text-white/60 hover:text-white transition-colors">
                  <RotateCcw size={12} />
                </button>
                <button onClick={() => setIsOpen(false)} title="Close Jarvis"
                  className="md:hidden p-1.5 rounded-lg text-white/60 hover:text-white transition-colors">
                  <X size={13} />
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
              <>
                {/* Orb + waveform */}
                <div className="flex flex-col items-center gap-3 pt-5 pb-3 px-4">
                  <VoiceOrb
                    status={va.status}
                    audioLevel={va.audioLevel}
                    size={72}
                    onClick={handleMicClick}
                  />

                  {/* Live transcript */}
                  <div className="min-h-[28px] w-full text-center">
                    {va.transcript ? (
                      <motion.p
                        key={va.transcript}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-cyan-400/80 font-mono px-2 line-clamp-2"
                      >
                        &ldquo;{va.transcript}&rdquo;
                      </motion.p>
                    ) : (
                      <p className="text-[10px] text-white/60 font-mono">
                        {isListening ? 'Speak now…' : 'Tap orb to activate'}
                      </p>
                    )}
                  </div>

                  {/* Waveform */}
                  <div className="w-full h-10 flex items-center">
                    <VoiceWaveform
                      audioLevel={va.audioLevel}
                      isActive={isListening || isSpeakingUI}
                      isSpeaking={isSpeakingUI}
                      color={isSpeakingUI ? '#7C3AED' : '#00E5FF'}
                      barCount={36}
                      height={40}
                    />
                  </div>

                  {/* Error */}
                  {va.error && (
                    <div className="w-full px-3 py-2 rounded-lg bg-red-500/[0.08] border border-red-500/20">
                      <p className="text-[10px] text-red-400 text-center">{va.error}</p>
                    </div>
                  )}
                </div>

                {/* Mic button */}
                <div className="flex items-center justify-center pb-3 px-4">
                  <motion.button
                    onClick={handleMicClick}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold transition-all"
                    style={isListening ? {
                      background: 'rgba(239,68,68,0.12)',
                      border: '1px solid rgba(239,68,68,0.3)',
                      color: '#f87171',
                    } : isSpeakingUI ? {
                      background: 'rgba(124,58,237,0.12)',
                      border: '1px solid rgba(124,58,237,0.3)',
                      color: '#a78bfa',
                    } : {
                      background: 'rgba(0,229,255,0.12)',
                      border: '1px solid rgba(0,229,255,0.3)',
                      color: '#00E5FF',
                    }}
                  >
                    {isListening ? <><MicOff size={13} /> Stop Listening</>
                      : isSpeakingUI ? <><VolumeX size={13} onClick={va.stopSpeaking} /> Stop Speaking</>
                      : <><Mic size={13} /> Start Listening</>}
                  </motion.button>
                </div>

                {/* Messages */}
                {va.messages.length > 0 && (
                  <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-3 space-y-2 max-h-[200px] border-t border-white/[0.06] pt-3" style={{ background: 'rgba(8,8,20,1)' }}>
                    {va.messages.slice(-8).map((msg) => (
                      <VoiceMessageBubble key={msg.id} msg={msg} />
                    ))}
                  </div>
                )}

                {/* Suggestions (show when no messages) */}
                {va.messages.length === 0 && (
                  <div className="px-4 pb-4 border-t border-white/[0.04] pt-3">
                    <p className="text-[9px] font-mono text-white/60 uppercase tracking-wider mb-2">Try saying:</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {VOICE_SUGGESTIONS.slice(0, 6).map((s) => (
                        <button
                          key={s.text}
                          onClick={() => { handleSuggestion(s.text) }}
                          className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-left transition-all hover:bg-white/[0.04]"
                          style={{ border: '1px solid rgba(255,255,255,0.05)' }}
                        >
                          <span className="text-sm">{s.icon}</span>
                          <span className="text-[10px] text-white/90 leading-tight line-clamp-2">{s.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Footer */}
            <div className="px-4 py-2 border-t border-white/[0.06]" style={{ background: 'rgba(8,8,20,1)' }}>
              <p className="text-[8px] font-mono text-white/50 text-center">
                Voice · RAG AI · Web Speech API · No data stored
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

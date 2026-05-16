'use client'

// ============================================================
// components/voice/VoiceWaveform.tsx
// Real-time animated waveform visualization
// ============================================================

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface VoiceWaveformProps {
  audioLevel: number      // 0–1
  isActive: boolean       // listening or speaking
  isSpeaking: boolean
  color?: string
  barCount?: number
  height?: number
  className?: string
}

export function VoiceWaveform({
  audioLevel,
  isActive,
  isSpeaking,
  color = '#00E5FF',
  barCount = 32,
  height = 48,
  className = '',
}: VoiceWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phaseRef  = useRef(0)
  const rafRef    = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.width
    const H = canvas.height

    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      const barW   = W / barCount
      const gap    = barW * 0.35
      const bw     = barW - gap
      phaseRef.current += isActive ? 0.08 : 0.015

      for (let i = 0; i < barCount; i++) {
        const norm = i / barCount

        // Base sine wave + harmonics + audio level boost
        const wave1 = Math.sin(norm * Math.PI * 4 + phaseRef.current) * 0.5
        const wave2 = Math.sin(norm * Math.PI * 8 - phaseRef.current * 1.4) * 0.25
        const wave3 = Math.sin(norm * Math.PI * 2 + phaseRef.current * 0.6) * 0.25
        const combined = wave1 + wave2 + wave3

        const boost = isActive ? (0.35 + audioLevel * 0.65) : 0.08
        const barH  = Math.max(3, (combined * 0.5 + 0.5) * H * boost)

        const x = i * barW + gap / 2
        const y = (H - barH) / 2

        // Gradient per bar
        const grad = ctx.createLinearGradient(x, y, x, y + barH)
        if (isSpeaking) {
          grad.addColorStop(0, '#7C3AED')
          grad.addColorStop(0.5, color)
          grad.addColorStop(1, '#7C3AED')
        } else if (isActive) {
          grad.addColorStop(0, color + '40')
          grad.addColorStop(0.5, color)
          grad.addColorStop(1, color + '40')
        } else {
          grad.addColorStop(0, 'rgba(255,255,255,0.05)')
          grad.addColorStop(0.5, 'rgba(255,255,255,0.12)')
          grad.addColorStop(1, 'rgba(255,255,255,0.05)')
        }

        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.roundRect(x, y, bw, barH, bw / 2)
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(rafRef.current)
  }, [isActive, isSpeaking, audioLevel, barCount, color])

  return (
    <canvas
      ref={canvasRef}
      width={280}
      height={height}
      className={className}
      style={{ width: '100%', height: `${height}px` }}
    />
  )
}

// ── Circular pulse orb ─────────────────────────────────────────
export function VoiceOrb({
  status,
  audioLevel,
  size = 80,
  onClick,
}: {
  status: string
  audioLevel: number
  size?: number
  onClick?: () => void
}) {
  const isListening  = status === 'listening'
  const isProcessing = status === 'processing'
  const isSpeaking   = status === 'speaking'
  const isActive     = isListening || isSpeaking

  const pulseScale = isListening  ? 1 + audioLevel * 0.35
    : isSpeaking   ? 1.12
    : isProcessing ? 1.05
    : 1

  const color = isListening  ? '#00E5FF'
    : isSpeaking   ? '#7C3AED'
    : isProcessing ? '#FFE500'
    : 'rgba(255,255,255,0.2)'

  const glowColor = isListening  ? 'rgba(0,229,255,0.5)'
    : isSpeaking   ? 'rgba(124,58,237,0.5)'
    : isProcessing ? 'rgba(255,229,0,0.4)'
    : 'transparent'

  return (
    <motion.button
      onClick={onClick}
      animate={{ scale: pulseScale }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative flex items-center justify-center rounded-full select-none focus:outline-none"
      style={{
        width: size, height: size,
        background: isActive
          ? `radial-gradient(circle at 35% 35%, ${color}30, ${color}10)`
          : 'rgba(255,255,255,0.04)',
        border: `2px solid ${isActive ? color : 'rgba(255,255,255,0.1)'}`,
        boxShadow: isActive ? `0 0 ${30 + audioLevel * 30}px ${glowColor}` : 'none',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {/* Ripple rings */}
      {isActive && [0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border"
          style={{ borderColor: `${color}40` }}
          animate={{ scale: [1, 1.8 + i * 0.4], opacity: [0.6, 0] }}
          transition={{ duration: 1.5, delay: i * 0.4, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}

      {/* Processing spinner */}
      {isProcessing && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-t-transparent"
          style={{ borderColor: '#FFE500', borderTopColor: 'transparent' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {/* Core dot */}
      <div
        className="rounded-full z-10"
        style={{
          width: size * 0.35,
          height: size * 0.35,
          background: isActive ? color : 'rgba(255,255,255,0.15)',
          boxShadow: isActive ? `0 0 12px ${color}` : 'none',
          transition: 'background 0.3s, box-shadow 0.3s',
        }}
      />
    </motion.button>
  )
}

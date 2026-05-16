'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Music, Volume2, VolumeX, X } from 'lucide-react'
import { usePortfolioStore } from '@/store/usePortfolioStore'

export default function MusicModal() {
  const { musicAsked, setMusicAsked, musicEnabled, setMusicEnabled } = usePortfolioStore()
  const [visible, setVisible] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Show after 2 seconds
    const timer = setTimeout(() => setVisible(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  const handleEnable = () => {
    setMusicEnabled(true)
    setMusicAsked(true)
    setVisible(false)
    // Create ambient sound with Web Audio API
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      const ctx = new AudioContext()

      const createDrone = (freq: number, gain: number) => {
        const osc = ctx.createOscillator()
        const gainNode = ctx.createGain()
        const filter = ctx.createBiquadFilter()
        filter.type = 'lowpass'
        filter.frequency.value = 800
        osc.type = 'sine'
        osc.frequency.value = freq
        gainNode.gain.value = gain
        osc.connect(filter)
        filter.connect(gainNode)
        gainNode.connect(ctx.destination)
        osc.start()
        return { osc, gainNode }
      }

      const drone1 = createDrone(55, 0.04)
      const drone2 = createDrone(82.5, 0.03)
      const drone3 = createDrone(110, 0.02)

      // Slow LFO modulation
      const lfo = ctx.createOscillator()
      const lfoGain = ctx.createGain()
      lfo.frequency.value = 0.08
      lfoGain.gain.value = 0.015
      lfo.connect(lfoGain)
      lfoGain.connect(drone1.gainNode.gain)
      lfo.start()

      // Store cleanup reference
      ;(window as any).__musicCleanup = () => {
        try { drone1.osc.stop(); drone2.osc.stop(); drone3.osc.stop(); lfo.stop() } catch {}
      }
    } catch {}
  }

  const handleDecline = () => {
    setMusicEnabled(false)
    setMusicAsked(true)
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
          className="fixed bottom-24 left-6 z-[80] max-w-xs"
        >
          <div className="glass-strong rounded-2xl border border-cyan/20 p-5 shadow-glass-lg">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center">
                  <Music size={16} className="text-cyan" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">Ambient Mode</p>
                  <p className="text-xs text-text-secondary">Enhance your experience</p>
                </div>
              </div>
              <button
                onClick={handleDecline}
                className="text-text-secondary hover:text-text-primary transition-colors p-1"
              >
                <X size={14} />
              </button>
            </div>

            <p className="text-xs text-text-secondary mb-4 leading-relaxed">
              Enable subtle ambient sound for a more immersive browsing experience. You can toggle it anytime.
            </p>

            <div className="flex items-center gap-2">
              <motion.button
                onClick={handleEnable}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan/15 border border-cyan/25 text-cyan text-sm font-medium hover:bg-cyan/20 transition-all"
              >
                <Volume2 size={14} />
                Enable
              </motion.button>
              <motion.button
                onClick={handleDecline}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.07] text-text-secondary text-sm font-medium hover:bg-white/[0.07] transition-all"
              >
                <VolumeX size={14} />
                Skip
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

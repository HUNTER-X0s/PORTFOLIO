'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Music, Volume2, VolumeX, X, Sparkles, Disc3 } from 'lucide-react'
import { usePortfolioStore } from '@/store/usePortfolioStore'
import { musicPlaylist } from '@/data/music'
import { useSound } from '@/hooks'
import { cn } from '@/lib/utils'

export default function MusicModal() {
  const {
    musicAsked,
    setMusicAsked,
    setMusicEnabled,
    currentTrackIndex,
    setCurrentTrackIndex,
  } = usePortfolioStore()

  const { playClick } = useSound()
  const [visible, setVisible] = useState(false)
  const [selectedIdx, setSelectedIdx] = useState<number>(0)

  useEffect(() => {
    // Show promptly on page mount (300ms)
    const timer = setTimeout(() => {
      setVisible(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  const handleEnableMusic = (trackIdx?: number) => {
    playClick()
    const targetIdx = typeof trackIdx === 'number' ? trackIdx : selectedIdx
    setCurrentTrackIndex(targetIdx)

    // Trigger immediate playback inside direct user click gesture
    if (
      typeof window !== 'undefined' &&
      typeof (window as any).__startBackgroundMusic === 'function'
    ) {
      try {
        ;(window as any).__startBackgroundMusic(targetIdx)
      } catch {}
    }

    setMusicEnabled(true)
    setMusicAsked(true)
    setVisible(false)
  }

  const handleDeclineMusic = () => {
    playClick()
    setMusicEnabled(false)
    setMusicAsked(true)
    setVisible(false)
  }

  const handleClose = () => {
    setMusicAsked(true)
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.92 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 left-4 right-4 sm:right-auto sm:left-6 sm:bottom-6 z-[110] w-auto sm:w-[400px] max-w-md"
        >
          <div className="relative glass-dropdown rounded-2xl p-5 overflow-hidden">
            {/* Ambient Background Glows */}
            <div
              className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-cyan/20 blur-2xl pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-16 -left-16 w-36 h-36 rounded-full bg-purple/20 blur-2xl pointer-events-none"
              aria-hidden="true"
            />

            {/* Header */}
            <div className="flex items-start justify-between mb-3 relative z-10">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-xl bg-cyan/15 border border-cyan/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.3)]">
                  <Music size={18} className="text-cyan animate-pulse" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan animate-ping" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-semibold text-text-primary">Background Music</h3>
                    <Sparkles size={13} className="text-cyan" />
                  </div>
                  <p className="text-xs text-text-secondary">Choose your soothing vibe</p>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="text-text-secondary/70 hover:text-text-primary transition-colors p-1.5 rounded-lg hover:bg-white/[0.06]"
                title="Dismiss"
              >
                <X size={15} />
              </button>
            </div>

            {/* Body */}
            <p className="text-xs text-text-secondary mb-3 leading-relaxed relative z-10">
              Would you like soothing ambient music while exploring Anurag&apos;s portfolio?
            </p>

            {/* Song Option Chips */}
            <div className="mb-4 relative z-10">
              <p className="text-[10px] font-mono text-text-secondary uppercase tracking-wider mb-2">
                Featured Vibes:
              </p>
              <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto custom-scrollbar pr-1">
                {musicPlaylist.slice(0, 6).map((track, idx) => (
                  <button
                    key={track.id}
                    onClick={() => {
                      setSelectedIdx(idx)
                      playClick()
                    }}
                    className={cn(
                      'flex items-center gap-2 p-2 rounded-xl text-left text-xs transition-all border',
                      selectedIdx === idx
                        ? 'bg-cyan/20 border-cyan/45 text-text-primary shadow-[0_0_10px_rgba(0,229,255,0.2)]'
                        : 'bg-white/[0.03] border-white/[0.06] text-text-secondary hover:text-text-primary hover:bg-white/[0.06]'
                    )}
                  >
                    <span className="text-sm">{track.icon}</span>
                    <span className="truncate font-medium">{track.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 relative z-10">
              <motion.button
                onClick={() => handleEnableMusic(selectedIdx)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan/25 to-cyan/15 hover:from-cyan/35 hover:to-cyan/25 border border-cyan/45 text-cyan text-xs font-semibold shadow-[0_0_15px_rgba(0,229,255,0.25)] transition-all"
              >
                <Volume2 size={15} />
                <span>Play & Explore</span>
              </motion.button>

              <motion.button
                onClick={handleDeclineMusic}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-text-secondary hover:text-text-primary hover:bg-white/[0.08] text-xs font-medium transition-all"
              >
                <VolumeX size={15} />
                <span>No Thanks</span>
              </motion.button>
            </div>

            {/* Sub-hint */}
            <p className="text-[10px] text-text-secondary/60 text-center mt-3 relative z-10">
              You can change tracks, adjust volume, or mute anytime from the top bar
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
